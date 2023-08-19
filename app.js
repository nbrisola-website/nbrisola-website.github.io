const CLIENT_ID = 'YOUR_CLIENT_ID';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

const authButton = document.getElementById('authorizeButton');
const expenseForm = document.getElementById('expenseForm');
const expenseNameInput = document.getElementById('expenseName');
const expenseAmountInput = document.getElementById('expenseAmount');
const expenseList = document.getElementById('expenseList');
let gapi;

function handleClientLoad() {
  gapi = window.gapi;
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    clientId: CLIENT_ID,
    scope: SCOPES,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
  }).then(() => {
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      authButton.style.display = 'block';
      authButton.onclick = handleAuthClick;
    } else {
      loadExpenses();
      authButton.style.display = 'none';
    }
  });
}

function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn().then(() => {
    authButton.style.display = 'none';
    loadExpenses();
  });
}

function addExpense(name, amount) {
  const values = [[name, amount]];
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1', // Update with your sheet name
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: values
    }
  }).then(() => {
    loadExpenses();
  });
}

function loadExpenses() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
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

expenseForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = expenseNameInput.value;
  const amount = expenseAmountInput.value;
  addExpense(name, amount);
  expenseNameInput.value = '';
  expenseAmountInput.value = '';
});

gapi.load('client:auth2', handleClientLoad);
