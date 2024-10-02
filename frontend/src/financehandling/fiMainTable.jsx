import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import './fiMainTable.css';
import { useNotification } from '../notification/notificatioonContext';

Chart.register(ArcElement, Tooltip, Legend);

const FinanceManager = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    description: "",
    type: "credit",
    amount: 0,
  });
  const [showCharts, setShowCharts] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showTaskView, setShowTaskView] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // For notifications
  const { notifications, addNotification } = useNotification(); // Context for notifications

  // Handle adding a new task and sending a notification for that task
  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask]);
      addNotification({ message: `Task added: ${newTask}` }); // Add notification
      setNewTask(""); // Clear the input field
    }
  };

  const handleTaskCheckboxChange = (task) => {
    setTasks(tasks.filter((t) => t !== task)); // Remove the task
  };

  const handleNotificationClick = (route) => {
    console.log(`Navigate to: ${route}`);
    setShowNotifications(false); // Close the notifications dropdown after clicking
  };

  // Handle adding a new transaction
  const handleAddTransaction = () => {
    if (!newTransaction.date || !newTransaction.description || newTransaction.amount <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const descriptionRegex = /^[a-zA-Z0-9\s]*$/;
    if (!descriptionRegex.test(newTransaction.description)) {
      alert("Description can only contain letters, numbers, and spaces.");
      return;
    }

    const newId = transactions.length + 1;
    const newTransactionToAdd = {
      id: newId,
      date: newTransaction.date,
      description: newTransaction.description,
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
    };

    setTransactions([...transactions, newTransactionToAdd]);
    setNewTransaction({
      date: new Date().toISOString().split("T")[0],
      description: "",
      type: "credit",
      amount: 0,
    });
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  // Calculate total credit and debit
  const calculateTotals = () => {
    let totalCredit = 0;
    let totalDebit = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "credit") {
        totalCredit += transaction.amount;
      } else {
        totalDebit += transaction.amount;
      }
    });

    return { totalCredit, totalDebit };
  };

  const { totalCredit, totalDebit } = calculateTotals();

  const chartData = {
    labels: ["Total Credit", "Total Debit"],
    datasets: [
      {
        label: "Amount",
        data: [totalCredit, totalDebit],
        backgroundColor: ["#36a2eb", "#ff6384"],
        hoverBackgroundColor: ["#36a2eb", "#ff6384"],
      },
    ],
  };

  return (
    <div className="finance-manager relative"> {/* Added relative for notification dropdown positioning */}
      <h1 className="finance-manager__title text-3xl font-bold mb-4">Finance Manager</h1>

      {/* Add New Transaction Form */}
      <div className="finance-manager__form bg-white shadow p-6 rounded-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Transaction</h2>
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="date" className="finance-manager__input-label">Date</label>
            <input
              type="date"
              id="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              className="finance-manager__input border p-2 rounded w-full"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="description" className="finance-manager__input-label">Description</label>
            <input
              type="text"
              id="description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              className="finance-manager__input border p-2 rounded w-full"
            />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="type" className="finance-manager__input-label">Type</label>
            <select
              id="type"
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
              className="finance-manager__input border p-2 rounded w-full"
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="amount" className="finance-manager__input-label">Amount</label>
            <input
              type="number"
              id="amount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
              className="finance-manager__input border p-2 rounded w-full"
              min="0"
              step="0.01"
            />
          </div>
          <div className="sm:col-span-6">
            <button
              onClick={handleAddTransaction}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded"
            >
              Add Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="finance-manager__table bg-white shadow p-6 rounded-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2" colSpan="2">Credit</th>
              <th className="border border-gray-300 p-2" colSpan="2">Debit</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
            <tr>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                {transaction.type === "credit" ? (
                  <>
                    <td className="border border-gray-300 p-2">{transaction.description}</td>
                    <td className="border border-gray-300 p-2">{transaction.amount.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2">-</td>
                    <td className="border border-gray-300 p-2">-</td>
                  </>
                ) : (
                  <>
                    <td className="border border-gray-300 p-2">-</td>
                    <td className="border border-gray-300 p-2">-</td>
                    <td className="border border-gray-300 p-2">{transaction.description}</td>
                    <td className="border border-gray-300 p-2">{transaction.amount.toFixed(2)}</td>
                  </>
                )}
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="bg-red-500 text-white font-semibold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="border border-gray-300 p-2 font-bold" colSpan="2">Total Credit - {totalCredit.toFixed(2)}</td>
              <td className="border border-gray-300 p-2 font-bold" colSpan="2">Total Debit - {totalDebit.toFixed(2)}</td>
              <td className="border border-gray-300 p-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Toggle Charts Button */}
      <button
        onClick={() => setShowCharts(!showCharts)}
        className="bg-green-500 text-white font-semibold py-2 px-4 rounded"
      >
        {showCharts ? "Hide Charts" : "Show Charts"}
      </button>

      {/* Pie Chart */}
      {showCharts && (
        <div className="finance-manager__charts my-8">
          <h2 className="text-2xl font-semibold mb-4">Credit vs Debit Chart</h2>
          <div className="w-1/2 mx-auto">
            <Pie data={chartData} />
          </div>
        </div>
      )}

      {/* Toggle Tasks Button */}
      <button
        onClick={() => setShowTaskView(!showTaskView)}
        className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded mt-4"
      >
        {showTaskView ? "Hide Task View" : "Show Task View"}
      </button>

      {/* Task View */}
      {showTaskView && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
            className="border p-2 rounded mb-4 w-full"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded"
          >
            Add Task
          </button>
          <ul className="mt-4">
            {tasks.map((task, index) => (
              <li key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => handleTaskCheckboxChange(task)}
                  className="mr-2"
                />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notifications */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="absolute right-0 top-0 bg-indigo-500 text-white font-semibold py-2 px-4 rounded mt-4"
      >
        Task List
      </button>
      {showNotifications && (
        <div className="bg-white border border-gray-300 shadow-lg rounded-md absolute top-16 right-0 z-10 w-80 p-4">
          <h2 className="text-lg font-semibold mb-2">Tasks</h2>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleNotificationClick(notification.route)}
                >
                  {notification.message}
                </li>
              ))}
            </ul>
          ) : (
            <p>No Tasks</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FinanceManager;
