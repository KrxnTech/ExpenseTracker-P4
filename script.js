// -------------------- FORM VALIDATION --------------------

let form = document.getElementById("FORM");
let title = document.getElementById("title");
let amount = document.getElementById("amount");
let category = document.getElementById("category");
let date = document.getElementById("date");
let addExpenseButton = document.getElementById("ADD_EXPENSE_BUTTON");

// ERROR MSG
let titleError = document.getElementById("titleError");
let amountError = document.getElementById("amountError");
let categoryError = document.getElementById("categoryError");
let dateError = document.getElementById("dateError");
let success = document.getElementById("success");


let currentEditId = null; // THIS IS GOING TO STORE THE ID OF THE EXPENSE THAT WE WANT TO EDIT


// CELEBRATION BUTTON EXPENSE EDITED
// let EDIT_DONE = document.createElement("DIV")
// EDIT_DONE.classList.add("EDIT_DONE")
// EDIT_DONE.innerText = "Expense Edit Successfully"
// let EDIT_FORM = Document.getElementById('EDIT_FORM')
// EDIT_FORM.appendChild(EDIT_DONE)

// function Edit_Celebration() {
//     EDIT_DONE.style.display = "block"
// }


// CLEANING ERROR 
function clearError() {
    titleError.style.display = "none";
    amountError.style.display = "none";
    categoryError.style.display = "none";
    dateError.style.display = "none";
    success.style.display = "none";

    title.style.border = "2px solid black";
    amount.style.border = "2px solid black";
    category.style.border = "2px solid black";
    date.style.border = "2px solid black";

    ADD.style.display = "none";
}

// CELEBRATION BUTTON EXPENSE ADDED 
let ADD = document.createElement("DIV");
ADD.classList.add("ADD");
ADD.innerText = "Expense Added Successfully ✅";
form.appendChild(ADD);

function celebration() {
    ADD.style.display = "block";
}


// -------------------- TOTAL EXPENSE COUNTER --------------------
function SHOW_TOTAL_NUMBER_OF_CATEGORIES() {
    // REMOVE ODD COUNTER BEFORE ADDING NEW ONE
    let oldCount = document.querySelector(".SHOW_TOTAL_CATEGORIES");
    if (oldCount) oldCount.remove();

    let TotalExpenses = expense.length; // THE NUMBER OF OBJECT IN THE ARRAY IS THE EXPENSE 

    let SHOW_TOTAL_CATEGORIES = document.createElement("P"); // CREATE P TO SHOW THE NUMBER OF EXPENSES
    SHOW_TOTAL_CATEGORIES.classList.add("SHOW_TOTAL_CATEGORIES"); // ADDED CLASS FOR CSS 
    SHOW_TOTAL_CATEGORIES.innerText = `Total Expenses 🫰: ${TotalExpenses}`;

    let MAIN_3 = document.getElementById("MAIN_3"); // APPEND INSIDE THE MAIN_3
    MAIN_3.appendChild(SHOW_TOTAL_CATEGORIES); // APPEND INSIDE THE MAIN DIV OF HEADER

    // UPDATE LOCAL STORAGE 
    localStorage.setItem("Total_Expense", JSON.stringify(TotalExpenses)); // STORE THE TOTAL EXPENSE IN THE ARRAY
}

// -------------------- ADD EXPENSE --------------------
addExpenseButton.addEventListener("click", () => {
    const titleValue = title.value.trim(); // TAKEN VALUE FROM TITLE INPUT 
    const regex = /^[A-Za-z\s]+$/; // REGEX 🤷
    clearError();

    if (title.value == "") {
        titleError.style.display = "block"; // ERROS SHOWEND 
        title.style.border = "2px solid red"; // ALERT UI 
    }
    else if (!regex.test(titleValue)) {
        titleError.style.display = "block";
        titleError.textContent = "Title must contain only letters";
    }
    else if (amount.value == "") {
        amountError.style.display = "block";
        amount.style.border = "2px solid red";
    }
    else if (amount.value <= 0) {
        amountError.style.display = "block";
        amountError.textContent = "Amount must be greater than 0";
    }
    else if (category.value == "") {
        categoryError.style.display = "block";
        category.style.border = "2px solid red";
    }
    else if (date.value == "") {
        dateError.style.display = "block";
        date.style.border = "2px solid red";
    }
    else {
        storeExpense(); // CALL THE EXPENSE FUNCTION 
        celebration(); // SHOW THAT EXPENSE ADDED SUCCESFULLY 
        clearForm(); // CLEAR THE FORM 
    }
});

// IT CLEAR THE FORM AND INPUT VALUES 
function clearForm() {

    // INITIALISE THE VALUE TO EMPTY PART : ) 
    title.value = "";
    amount.value = "";
    category.value = "";
    date.value = "";
}

// -------------------- LOCAL STORAGE + DISPLAY --------------------

// MAKE AN ARRAY WITH LOCAL STORAGE 
let expense = JSON.parse(localStorage.getItem("expenses")) || [];

function storeExpense() {


    // WHY ID ? SO YOU CAN RELIABLY DELETE OR REFRENSE A SPECIFIC EXPENSE EVEN IF MULTIPLE ITEMS HAVE THE SAME TITLE AMOUNT DATE 
    const id = (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);


    // CREATING AN OBJECT TO STORE SINGLE EXPENSE 
    let expenseObject = {
        id: id,
        title: title.value,
        amount: amount.value,
        category: category.value,
        date: date.value
    };

    expense.push(expenseObject); // PUSH THE OBJECT TO ARRAY 
    localStorage.setItem("expenses", JSON.stringify(expense)); // STORE THE ARRAY LOCALLY 
    displayExpense(); // CALL THE FUCNTION TO SHOW THE EXPENSES 
    SHOW_TOTAL_NUMBER_OF_CATEGORIES(); // CALL THE FUNCTION WHICH SHOW THE TOTAL NUMBER OF EXPENSES 
    updateChart(); // CALL THE FUNCTION TO UPDATE THE CHART 
}

// -------------------- DISPLAY EXPENSES --------------------
let showExpense = document.querySelector(".SHOW_EXPENSE"); // ACCESS THE MAIN TABLE INSIDE WHICH WE ARE GOING TO DISPLAY THE EXPENSES WITH THERE TYPE 


// THIS FUNCTION ID GOING TO DISPLAY ALL THE EXPENSES
function displayExpense(expenseArray = expense) {
    showExpense.innerHTML = ""; // IT CLEAR ALL OLD EXPENSE DATA FROM THE SCREEN ( TABLE ) BEFORE SHOWING THE UPDATED LIST

    expenseArray.forEach((exp) => {
        // YOU ARE SELECTING ONE OBJECT AS EXP FROM THE ARRAY TO SHOW THE DATA ON SCREEN THROUGH DOM 
        let P = document.createElement("P"); // CREATE P TAG 
        P.classList.add("SHOW_DATA"); // ADDING CSS 


        // DELETE BUTTON 

        let deleteButton = document.createElement("button"); // DELETE BUTTON IN THE RIGHT SIDE 
        deleteButton.classList.add("DELETE_BUTTON"); // ADDING CSS CLASS TO DELETE BUTTON 
        deleteButton.innerText = "DELETE"; // GIVING TEXT 
        deleteButton.setAttribute("data-id", exp.id); // WE HAVE CREATE A ATTRIBUTE AND STORING THE ID IN IT 

        deleteButton.addEventListener("click", (e) => {
            // E - IN BUILD OBJECT APPEAR WITH SOME IMPORTANT FUNCTION AND METHODS 
            const idToDelete = e.currentTarget.getAttribute("data-id"); // WHEN WE CLICK ON ANY EXPENSE IT WILL SHOW THE ID OF THAT EXPENSE
            expense = expense.filter((item) => item.id !== idToDelete); // REMOVE THE MATCHED ID EXPENSE FROM THE ARRAY 
            localStorage.setItem("expenses", JSON.stringify(expense)); // STORE THE ARRAY LOCALLY 
            displayExpense(); // IT SHOW THE UPDATED EXPENSE AND IT DELETE FROM THE ARRAY AND SHOW THEM ON THE SCREEN 
            SHOW_TOTAL_NUMBER_OF_CATEGORIES();
            updateChart();
        });

        // EDIT BUTTON 
        let EditButton = document.createElement("button") // CREATE ELEMENT 
        EditButton.classList.add("EDIT_BUTTON") // ADDING CLASS CSS DONE
        EditButton.innerText = "EDIT" // ADDING INNER TEXT 
        EditButton.setAttribute("data-id", exp.id); // SETTING ATTRIBUTE 

        let EDIT_FORM = document.getElementById("EDIT_FORM")
        let EDIT_EXPENSE_BUTTON = document.getElementById("EDIT_EXPENSE_BUTTON")

        EditButton.addEventListener("click", function (e) {
            EDIT_FORM.style.display = "block";
            clearForm()

            // FINDING THE SPECIFIC ONE
            const idToEdit = e.currentTarget.getAttribute("data-id");
            currentEditId = idToEdit; // STORING THE ID IN THE CURRENTEDITID 
            const expenseToEdit = expense.find(item => item.id === idToEdit); // WHEN WE CLICK ON ANY EXPENSE IT WILL SHOW THE INFORMATION OF THAT EXPENSE

            // ACESS ALL BY THERE ID 
            let edit_title = document.getElementById("edit_title")
            let edit_amount = document.getElementById("edit_amount")
            let edit_category = document.getElementById("edit_category")
            let edit_date = document.getElementById("edit_date")

            // WHEN YOU CLICK ON THE ANY EXPENSE IT WILL SHOW THE INFORMATION OF THAT EXPENSE IN THE EDIT FORM
            edit_title.value = expenseToEdit.title
            edit_amount.value = expenseToEdit.amount
            edit_category.value = expenseToEdit.category
            edit_date.value = expenseToEdit.date

            // OPTIONAL WORK UI BETTER
            form.style.opacity = "0.5";
            form.style.pointerEvents = "none";

        })

        // TO HIDE THE EDIT FORM WHEN WE CLICK ON THIS BUTTON IT WILL HIDE THE FORM 
        EDIT_EXPENSE_BUTTON.addEventListener("click", function () {
            EDIT_FORM.style.display = "none"

            // TAKE THE VALUE OF INPUT FROM THE EDIT FORM 
            let updatedTitle = document.getElementById('edit_title').value.trim() // IT WILL REMOVE THE SPACE ALSO FROM THE TRAILING AND FROM THE LEADING 
            let updatedAmount = document.getElementById('edit_amount').value.trim()
            let updatedCategory = document.getElementById('edit_category').value
            let updatedDate = document.getElementById('edit_date').value


            // FIND AND UPDATE THE EXPENSE IN THE ARRAY USING THE FINDINDEX FUNCTION 
            let index = expense.findIndex(item => item.id === currentEditId)
            if (index !== -1) {
                expense[index].title = updatedTitle
                expense[index].amount = updatedAmount
                expense[index].category = updatedCategory
                expense[index].date = updatedDate
            }

            // SAVE TO LOCAL STORAGE 
            localStorage.setItem('expenses', JSON.stringify(expense))

            // RE - DISPLAY EVERYTHING 
            displayExpense()
            SHOW_TOTAL_NUMBER_OF_CATEGORIES()
            updateChart();

            currentEditId = null

            // OPTIONAL WORK UI BETTER 
            form.style.opacity = "1";
            form.style.pointerEvents = "auto";

            // CALL THE FUNCTION 
            // Edit_Celebration()


        })

        P.innerHTML = `
            <span>${exp.title}</span>
            <span>${exp.amount}</span>
            <span>${exp.category}</span>
            <span>${exp.date}</span>
        `;

        P.appendChild(deleteButton);
        P.appendChild(EditButton)
        showExpense.appendChild(P);
    });
}

// -------------------- CLEAR ALL --------------------
document.getElementById("clearAll").addEventListener("click", () => {
    // 
    localStorage.removeItem("expenses"); // REMOVE FROM LOCAL STORAGE 
    localStorage.removeItem("Total_Expense"); // REMOVE FROM LOCAL STORAGE 
    expense = []; // INITIALISE THE ARRAY TO [] EMPTY ARRAY

    displayExpense(); // CALL THE DISPLAY FUNCTION SO WHEN ALL THE EXPENSE DELETE IT WILL SHOW THE EXPENSE HOW MUCH LEFT 
    SHOW_TOTAL_NUMBER_OF_CATEGORIES(); // CALL THIS FUNCTION WHEN YOU CLEAR SO IT WILL ALSO UPDATE 
});

// -------------------- INITIAL LOAD --------------------

// WHEN WE OPEN THE PAGE IT WILL SHOW THE EXPENSES AND TOTAL EXPENSES BECAUSE THE FUNCTION RUNS 
displayExpense();
SHOW_TOTAL_NUMBER_OF_CATEGORIES();


//                              FILTER FEATURE ✌️

let filterCategory = document.getElementById("filterCategory") // CATEGORY SELECT FOR FILTER 
let applyFilter = document.getElementById("applyFilter") // APPLY FILTER BUTTON 


applyFilter.addEventListener("click", function () {
    let selectedCategory = filterCategory.value

    // CREATE A VARIABLE
    let FilterExpense

    if (selectedCategory == "All" || selectedCategory == "Others") {
        displayExpense() // TO SHOW ALL EXPENSE 
    }
    else {
        FilterExpense = expense.filter(exp => exp.category === selectedCategory)
        if (FilterExpense.length == 0) {
            console.log("NO CATEGORY FOUND")
            showExpense.innerHTML = `<p>NO CATEGORY FOUND REGARDING ✌️🥲</p>`
        } else {
            displayExpense(FilterExpense)
        }
    }
})



// -------------------- CHART --------------------
const ctx = document.getElementById('expenseChart').getContext('2d');

function getCategoryTotals() {
    const totals = {};
    expense.forEach(item => {
        if (!totals[item.category]) totals[item.category] = 0;
        totals[item.category] += Number(item.amount);
    });
    return totals;
}

const totals = getCategoryTotals();

const chart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: Object.keys(totals),
        datasets: [{
            label: 'Expense Breakdown',
            data: Object.values(totals),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8B5CF6', '#22C55E'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            title: {
                display: true,
                text: 'Your Expense Chart'
            }
        }
    }
});

function updateChart() {
    const totals = getCategoryTotals();
    chart.data.labels = Object.keys(totals);
    chart.data.datasets[0].data = Object.values(totals);
    chart.update();
}


