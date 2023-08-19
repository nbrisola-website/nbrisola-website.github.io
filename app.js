const CLIENT_ID = 'YOUR_CLIENT_ID';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

const expenseForm = document.getElementById('expenseForm');
const expenseNameInput = document.getElementById('expenseName');
const expenseAmountInput = document.getElementById('expenseAmount');
const expenseList = document.getElementById('expenseList');

let sheetId = ''; // Your Google Sheet ID

// Load the Google Sheets API
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

// Initialize the Google Sheets API
function initClient() {
  gapi.client.init({
    clientId: CLIENT_ID,
    scope: SCOPES,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
  }).then(() => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      listExpenses();
    });
  });
}

// Add an expense
function addExpense(name, amount) {
  const values = [[name, amount]];
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1', // Update with your sheet name
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: values
    }
  }).then(() => {
    listExpenses();
  });
}

// List all expenses
function listExpenses() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1' // Update with your sheet name
  }).then(response => {
    const values = response.result.values;
    expenseList.innerHTML = '';
    if (values && values.length > 0) {
      values.forEach(row => {
        const expenseName = row[0];
        const expenseAmount = row[1];
        const listItem = document.createElement('li');
        listItem.textContent = `${expenseName}: $${expenseAmount}`;
        expenseList.appendChild(listItem);
      });
    }
  });
}

// Submit form and add expense
expenseForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = expenseNameInput.value;
  const amount = expenseAmountInput.value;
  addExpense(name, amount);
  expenseNameInput.value = '';
  expenseAmountInput.value = '';
});

// Load Google API
gapi.load('client:auth2', handleClientLoad);
