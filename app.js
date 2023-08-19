const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');

expenseForm.addEventListener('submit', addExpense);

let expenses = [];

function addExpense(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (description && amount) {
        const expense = {
            description,
            amount
        };

        expenses.push(expense);
        updateExpenseList();
        clearForm();
    }
}

function updateExpenseList() {
    expenseList.innerHTML = '';

    expenses.forEach((expense, index) => {
        const expenseItem = document.createElement('div');
        expenseItem.classList.add('expense-item');
        expenseItem.innerHTML = `
            <div class="expense-description">${expense.description}</div>
            <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
            <button class="delete-button" onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseList.appendChild(expenseItem);
    });
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateExpenseList();
}

function clearForm() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

updateExpenseList();

