const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmountElement = document.getElementById("total-amount");

let expenses = [];

function renderExpenses() {
  expenseList.innerHTML = "";
  let totalAmount = 0;

  for (let i = 0; i < expenses.length; i++) {
    const expense = expenses[i];
    const expenseRow = document.createElement("tr");
    expenseRow.innerHTML = `
      <td>${expense.name}</td>
      <td>₹${expense.amount}</td>
      <td class="delete-btn" data-id="${expense._id}">Delete</td>
    `;
    expenseList.appendChild(expenseRow);
    totalAmount += expense.amount;
  }

  totalAmountElement.textContent = `₹${totalAmount.toFixed(2)}`;
}

function addExpense(event) {
  event.preventDefault();
  const expenseNameInput = document.getElementById("expense-name");
  const expenseAmountInput = document.getElementById("expense-amount");
  const expenseName = expenseNameInput.value;
  const expenseAmount = parseFloat(expenseAmountInput.value);

  expenseNameInput.value = "";
  expenseAmountInput.value = "";

  if (expenseName === "" || isNaN(expenseAmount)) {
    alert("Please enter valid expense details.");
    return;
  }

  const expense = {
    name: expenseName,
    amount: expenseAmount,
  };

  fetch("/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  })
    .then((response) => response.json())
    .then((data) => {
      expenses.push(data);
      renderExpenses();
    })
    .catch((error) => console.error("Error:", error));
}

function deleteExpense(event) {
  if (event.target.classList.contains("delete-btn")) {
    const expenseId = event.target.getAttribute("data-id");

    fetch(`/expenses/${expenseId}`, {
      method: "DELETE",
    })
      .then(() => {
        expenses = expenses.filter((expense) => expense._id !== expenseId);
        renderExpenses();
      })
      .catch((error) => console.error("Error:", error));
  }
}

expenseForm.addEventListener("submit", addExpense);
expenseList.addEventListener("click", deleteExpense);

fetch("/expenses")
  .then((response) => response.json())
  .then((data) => {
    expenses = data;
    renderExpenses();
  })
  .catch((error) => console.error("Error:", error));
