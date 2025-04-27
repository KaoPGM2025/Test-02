// script.js

document.getElementById("expense-form").addEventListener("submit", function(event) {
    event.preventDefault(); // ป้องกันไม่ให้ฟอร์มรีเฟรชหน้า

    // รับข้อมูลจากฟอร์ม
    const category = document.getElementById("category").value;
    const amount = parseFloat(document.getElementById("amount").value); // ใช้ค่าจำนวนเงินเป็นตัวเลข
    const date = document.getElementById("date").value;
    const type = document.getElementById("type").value;

    // สร้างแถวใหม่สำหรับตาราง
    const row = document.createElement("tr");

    // สร้างคอลัมน์สำหรับแถว
    const categoryCell = document.createElement("td");
    categoryCell.textContent = category;
    row.appendChild(categoryCell);

    const amountCell = document.createElement("td");
    amountCell.textContent = amount;
    row.appendChild(amountCell);

    const dateCell = document.createElement("td");
    dateCell.textContent = date;
    row.appendChild(dateCell);

    const typeCell = document.createElement("td");
    typeCell.textContent = type === "income" ? "รายรับ" : "รายจ่าย";
    row.appendChild(typeCell);

    // สร้างปุ่มแก้ไขและลบ
    const actionsCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.textContent = "แก้ไข";
    editButton.classList.add("edit-btn");
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "ลบ";
    deleteButton.classList.add("delete-btn");
    actionsCell.appendChild(deleteButton);

    row.appendChild(actionsCell);

    // เพิ่มแถวเข้าไปในตาราง
    document.querySelector("#record-table tbody").appendChild(row);

    // อัปเดตยอดรวม
    updateTotal(type, amount);

    // บันทึกข้อมูลลงใน Local Storage
    saveToLocalStorage();

    // รีเซ็ตฟอร์มหลังจากบันทึก
    document.getElementById("expense-form").reset();
});

// ฟังก์ชันอัปเดตยอดรวม
let totalIncome = 0;
let totalExpense = 0;

function updateTotal(type, amount) {
    if (type === "income") {
        totalIncome += amount;
    } else if (type === "expense") {
        totalExpense += amount;
    }

    document.getElementById("total-income").textContent = `รายรับรวม: ฿${totalIncome.toFixed(2)}`;
    document.getElementById("total-expense").textContent = `รายจ่ายรวม: ฿${totalExpense.toFixed(2)}`;
    document.getElementById("balance").textContent = `ยอดคงเหลือ: ฿${(totalIncome - totalExpense).toFixed(2)}`;
}

// ฟังก์ชันบันทึกข้อมูลลงใน Local Storage
function saveToLocalStorage() {
    const records = [];
    const rows = document.querySelectorAll("#record-table tbody tr");

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        records.push({
            category: cells[0].textContent,
            amount: parseFloat(cells[1].textContent),
            date: cells[2].textContent,
            type: cells[3].textContent === "รายรับ" ? "income" : "expense"
        });
    });

    localStorage.setItem("records", JSON.stringify(records));
}

// ฟังก์ชันโหลดข้อมูลจาก Local Storage เมื่อหน้าเว็บโหลดใหม่
function loadFromLocalStorage() {
    const records = JSON.parse(localStorage.getItem("records"));
    if (records) {
        records.forEach(record => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.category}</td>
                <td>${record.amount}</td>
                <td>${record.date}</td>
                <td>${record.type === "income" ? "รายรับ" : "รายจ่าย"}</td>
                <td>
                    <button class="edit-btn">แก้ไข</button>
                    <button class="delete-btn">ลบ</button>
                </td>
            `;
            document.querySelector("#record-table tbody").appendChild(row);
        });

        // อัปเดตยอดรวมเมื่อโหลดข้อมูลจาก Local Storage
        records.forEach(record => {
            updateTotal(record.type, record.amount);
        });
    }
}

// เรียกใช้ฟังก์ชันเมื่อโหลดหน้า
window.onload = loadFromLocalStorage;

// เพิ่ม Event Listener สำหรับปุ่มแก้ไขและลบ
document.querySelector("#record-table").addEventListener("click", function(event) {
    if (event.target.classList.contains("edit-btn")) {
        const row = event.target.closest("tr");
        const cells = row.getElementsByTagName("td");
        
        // นำข้อมูลในแถวมาใส่ในฟอร์ม
        document.getElementById("category").value = cells[0].textContent;
        document.getElementById("amount").value = cells[1].textContent;
        document.getElementById("date").value = cells[2].textContent;
        document.getElementById("type").value = cells[3].textContent === "รายรับ" ? "income" : "expense";

        // ลบแถวจากตารางก่อนที่จะทำการแก้ไข
        row.remove();
        
        // อัปเดตยอดรวม
        updateTotal(cells[3].textContent === "รายรับ" ? "income" : "expense", -parseFloat(cells[1].textContent));
    }

    if (event.target.classList.contains("delete-btn")) {
        const row = event.target.closest("tr");
        const cells = row.getElementsByTagName("td");

        // อัปเดตยอดรวมก่อนลบ
        updateTotal(cells[3].textContent === "รายรับ" ? "income" : "expense", -parseFloat(cells[1].textContent));

        // ลบแถว
        row.remove();

        // บันทึกข้อมูลใหม่ลงใน Local Storage หลังจากลบรายการ
        saveToLocalStorage();
    }
});
