import React, { useState, useEffect } from "react";
import axios from "axios";
import backgr from '../image/BR.png'; 
const TransactionForm = () => {
  const [transactionType, setTransactionType] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [timeFrame, setTimeFrame] = useState("daily");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Salary states
  const [salaryDetails, setSalaryDetails] = useState([]);
  const [totalNetSalaryCurrentMonth, setTotalNetSalaryCurrentMonth] = useState(0);
  //order bill
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalOrderAmount, setTotalOrderAmount] = useState(0);
  //Supplier
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  //inventory
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    fetchinData();
  }, []);

  const fetchinData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/monthlyEvaluation/');
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchsupOrders(); // Call fetchsupOrders
  }, []);

  const fetchsupOrders = async () => { // Function to fetch orders
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data.reverse());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      setLoading(false);
    }
  };

  // Helper function to format date as MM/DD
  const formatDate = (date) => {
    const options = { month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Filter for completed orders and group by day with total calculation
  const groupedOrders = orders
    .filter(order => order.status === 'completed') // Only completed orders
    .reduce((acc, order) => {
      const dateKey = formatDate(order.orderDate);
      if (!acc[dateKey]) acc[dateKey] = { dailyTotal: 0 };
      acc[dateKey].dailyTotal += order.paymentValue || 0;
      return acc;
    }, {});


  const descriptionOptions = {
    income: [
      "Retail Sales",
      "Wholesale Orders",
      "Online Sales",
      "Gift Wrapping Services",
      "Custom Orders",
    ],
    expenses: [
      "Materials and Fabrics",
      "Shipping and Delivery",
      "Employee Salaries",
      "Advertising and Marketing",
      "Utilities and Rent",
      "Packaging",
    ],
    assets: [
      "Cash on Hand",
      "Inventory",
      "Machinery and Equipment",
      "Office Supplies",
      "Company Vehicle",
    ],
    liabilities: [
      "Accounts Payable",
      "Bank Loan",
      "Taxes Payable",
      "Employee Benefits Payable",
      "Credit Card Debt",
    ],
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const totalAmount = filteredOrders
      .filter(order => new Date(order.orderDate).toLocaleDateString() === today)
      .reduce((sum, order) => sum + order.totalAmount, 0);
    setTotalOrderAmount(totalAmount);
  }, [filteredOrders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/billorder');
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage('Error fetching orders. Please try again.');
    }
  };
  // Fetch salary details
  useEffect(() => {
    const fetchSalaryDetails = async () => {
      try {
        const response = await axios.get('/api/salarycalculates');
        setSalaryDetails(response.data);
        
        // Calculate total net salary for the current month
        const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        const currentMonthSalaries = response.data.filter(salary => 
          new Date(salary.payrollMonth).toLocaleString('default', { month: 'long', year: 'numeric' }) === currentMonth
        );
        const totalNetSalary = currentMonthSalaries.reduce((total, salary) => total + salary.netSalary, 0);
        setTotalNetSalaryCurrentMonth(totalNetSalary);
      } catch (error) {
        console.error("Error fetching salary details:", error);
      }
    };

    fetchSalaryDetails();
  }, []);

  const handleTypeChange = (e) => {
    setTransactionType(e.target.value);
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    const transactionData = {
      date: today,
      transactionType,
      description,
      amount: parseFloat(amount),
    };

    try {
      const response = await fetch("/api/finance-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      setMessage(`Transaction added successfully`);
      fetchTransactions(); // Refresh transactions after adding a new one
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }

    // Reset form fields after submission
    setTransactionType("");
    setDescription("");
    setAmount("");
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/finance-manager");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`/api/finance-manager/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete transaction: ${errorMessage}`);
      }

      fetchTransactions(); // Refresh the transactions after deleting
      setMessage("Transaction deleted successfully");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Fetch transactions when the component mounts
  useEffect(() => {
    fetchTransactions();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // Function to calculate profit based on the selected time frame
  const calculateProfit = () => {
    const today = new Date();
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      if (timeFrame === "daily") {
        return transactionDate.toDateString() === today.toDateString();
      } else if (timeFrame === "monthly") {
        return (
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear()
        );
      } else if (timeFrame === "yearly") {
        return transactionDate.getFullYear() === today.getFullYear();
      }
      return false;
    });

    const totalIncome = filteredTransactions
      .filter((transaction) => transaction.transactionType === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const totalExpenses = filteredTransactions
      .filter(
        (transaction) =>
          transaction.transactionType === "expenses" ||
          transaction.transactionType === "liabilities"
      )
      .reduce((total, transaction) => total + transaction.amount, 0);

    return totalIncome - totalExpenses;
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const currentMonthSalaries = salaryDetails.filter(salary => 
    new Date(salary.payrollMonth).toLocaleString('default', { month: 'long', year: 'numeric' }) === currentMonth
  );

  return (
    <div>
      <div className="bg-cover bg-center min-h-screen" style={{ backgroundImage: `url(${backgr})` }}>
      <form
        onSubmit={handleSubmit}
        className="bg-pink-100 shadow-lg rounded-lg p-6 max-w-7xl mx-auto my-10 text-gray-800"
      >
        <h2 className="text-3xl font-bold mb-5 text-center text-pink-600">
          Transaction Entry
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-pink-700 font-semibold">Date</label>
          <input
            type="text"
            value={today}
            readOnly
            className="w-full p-3 border border-pink-200 rounded-lg bg-pink-50 text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-pink-700 font-semibold">Type</label>
          <select
            value={transactionType}
            onChange={handleTypeChange}
            className="w-full p-3 border border-pink-200 rounded-lg bg-pink-50 text-gray-700 placeholder-pink-400"
            required
          >
            <option value="">Select Transaction Type</option>
            <option value="income">Income</option>
            <option value="expenses">Expenses</option>
            <option value="assets">Assets</option>
            <option value="liabilities">Liabilities</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 text-pink-700 font-semibold">
              Description
            </label>
            <select
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-pink-200 rounded-lg bg-pink-50 text-gray-700 placeholder-pink-400"
              required
            >
              <option value="">Select Description</option>
              {transactionType &&
                descriptionOptions[transactionType].map((desc, index) => (
                  <option key={index} value={desc}>
                    {desc}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-pink-700 font-semibold">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-pink-200 rounded-lg bg-pink-50 text-gray-700 placeholder-pink-400"
              placeholder="Enter Amount"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 text-white p-3 rounded-lg font-semibold hover:bg-pink-600"
        >
          Add Transaction
        </button>

        {message && <p className="mt-4 text-center text-pink-600">{message}</p>}
      </form>

      {/* Time frame selection */}
      <div className="flex justify-center mb-4">
        <button onClick={() => setTimeFrame("daily")} className={`px-4 py-2 ${timeFrame === "daily" ? 'bg-pink-600 text-white' : 'bg-pink-200 text-gray-700'} rounded-lg`}>
          Daily
        </button>
        <button onClick={() => setTimeFrame("monthly")} className={`px-4 py-2 ${timeFrame === "monthly" ? 'bg-pink-600 text-white' : 'bg-pink-200 text-gray-700'} rounded-lg`}>
          Monthly
        </button>
        <button onClick={() => setTimeFrame("yearly")} className={`px-4 py-2 ${timeFrame === "yearly" ? 'bg-pink-600 text-white' : 'bg-pink-200 text-gray-700'} rounded-lg`}>
          Yearly
        </button>
      </div>

      {/* Profit display */}
      <div className="bg-pink-200 p-4 rounded-lg text-center">
        <h3 className="text-xl font-bold text-pink-700">Profit: ${calculateProfit()}</h3>
      </div>

    {/* Sidebar */}
    <button
  onClick={toggleSidebar}
  className="mt-4 w-full bg-pink-500 text-white p-3 rounded-lg font-semibold hover:bg-pink-600"
>
  {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
</button>

{isSidebarOpen && (
  <div className="fixed right-0 top-0 h-full bg-gradient-to-b from-pink-200 to-rose-400 text-rose-900 p-5 shadow-lg rounded-l-lg">
    <h2 className="text-2xl font-bold mb-5 border-b-2 border-rose-300 pb-2">🧸 All Transaction</h2>

    {/* Salary Details */}
    <div className="bg-white bg-opacity-60 p-4 rounded-lg opacity-60">
    <div className="mb-5">
      
      <h3 className="text-xl font-semibold mb-1">Total Net Salary for {currentMonth}</h3>
      <div className="flex items-center">
        <input type="checkbox" className="mr-2" />
        <p className="text-xl font-semibold text-pink-700">Rs{totalNetSalaryCurrentMonth.toFixed(2)}</p>
      </div>
    </div>
    </div>
    <br></br>
    {/* Order Bill Details */}
    <div className="bg-white bg-opacity-60 p-4 rounded-lg opacity-60">
    <div className="mb-5">
      <h3 className="text-xl font-semibold mb-2">Order Bill Details</h3>
      <h2 className="text-xl font-semibold mb-1">Total Amount for Today:</h2>
      <div className="flex items-center">
        <input type="checkbox" className="mr-2" />
        <h2 className="text-xl font-semibold">Rs.{totalOrderAmount.toFixed(2)}</h2>
      </div>
    </div>
    </div>
    <br></br>
    {/* Supplier Bill Details */}
    <div className="bg-white bg-opacity-60 p-4 rounded-lg opacity-60">
    <div className="mb-5">
      <h3 className="text-xl font-semibold mb-2">Supplier Bill Details</h3>
      <h2 className="text-xl font-semibold mb-1">Total Amount per Day:</h2>
      {Object.entries(groupedOrders).map(([date, { dailyTotal }]) => (
        <div key={date} className="flex items-center mb-2">
          <input type="checkbox" className="mr-2" />
          <h2 className="text-lg">{date}: Rs.{dailyTotal.toFixed(2)}</h2>
        </div>
      ))}
    </div>
    </div>
    <br></br>
    {/* Inventory Details */}
    <div className="bg-white bg-opacity-60 p-4 rounded-lg opacity-60">
    <div>
      <h3 className="text-xl font-semibold mb-2">Inventory Details</h3>
      <h2 className="text-xl font-semibold mb-1">Total Inventory per Month:</h2>
      {formData.map((record) => (
        <div key={record._id} className="flex items-center mb-2">
          <input type="checkbox" className="mr-2" />
          <h2 className="text-lg">{record.month}: {record.totalInventory.toFixed(2)} units</h2>
        </div>
      ))}
    </div>
    </div>
  </div>
)}

     
     <h3 className="text-2xl font-bold text-pink-600 text-center mb-5">Transactions Overview</h3>

      
<table className="min-w-full mb-5 border-collapse border border-pink-300">
  <thead>
    <tr>
      <th className="border border-pink-300 p-2 w-24">Date</th>
      <th className="border border-pink-300 p-2">Description</th>
      <th className="border border-pink-300 p-2">Credit</th>
      <th className="border border-pink-300 p-2">Debit</th>
      <th className="border border-pink-300 p-2">Action</th>
    </tr>
  </thead>
  <tbody>
    {transactions
      .filter(transaction => transaction.transactionType !== 'assets') // Filter out assets transactions
      .reduce((acc, transaction) => {
        const lastTransaction = acc.length > 0 ? acc[acc.length - 1] : null;

        // If the date is different from the last one, add a new date row
        if (!lastTransaction || transaction.date !== lastTransaction.date) {
          acc.push({ date: transaction.date, transactions: [transaction] });
        } else {
          // If the date is the same, push the transaction into the existing array
          lastTransaction.transactions.push(transaction);
        }
        return acc;
      }, [])
      .map((row, index) => {
        // Format the date
        const dateObj = new Date(row.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).replace(',', ''); // Remove the comma after the month

        return (
          <React.Fragment key={index}>
            <tr>
              <td className="border border-pink-300 p-2 font-bold" rowSpan={row.transactions.length}>
                {formattedDate} {/* Displaying the formatted date */}
              </td>
              <td className="border border-pink-300 p-2">{row.transactions[0].description}</td>
              <td className="border border-pink-300 p-2">{row.transactions[0].transactionType === 'income' ? row.transactions[0].amount : '-'}</td>
              <td className="border border-pink-300 p-2">{(row.transactions[0].transactionType === 'expenses' || row.transactions[0].transactionType === 'liabilities') ? row.transactions[0].amount : '-'}</td>
              <td className="border border-pink-300 p-2">
                <button onClick={() => deleteTransaction(row.transactions[0]._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
            {row.transactions.slice(1).map((transaction, transactionIndex) => (
              <tr key={transactionIndex}>
                <td className="border border-pink-300 p-2">{transaction.description}</td>
                <td className="border border-pink-300 p-2">{transaction.transactionType === 'income' ? transaction.amount : '-'}</td>
                <td className="border border-pink-300 p-2">{(transaction.transactionType === 'expenses' || transaction.transactionType === 'liabilities') ? transaction.amount : '-'}</td>
                <td className="border border-pink-300 p-2">
                  <button onClick={() => deleteTransaction(transaction._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </React.Fragment>
        );
      })}
  </tbody>
  <tfoot>
    <tr>
      <td colSpan={2} className="border border-pink-300 p-2 font-bold">Total:</td>
      <td className="border border-pink-300 p-2">
        {transactions
          .filter(transaction => transaction.transactionType === 'income')
          .reduce((total, transaction) => total + transaction.amount, 0)}
      </td>
      <td className="border border-pink-300 p-2">
        {transactions
          .filter(transaction => transaction.transactionType === 'expenses' || transaction.transactionType === 'liabilities')
          .reduce((total, transaction) => total + transaction.amount, 0)}
      </td>
      <td></td>
    </tr>
  </tfoot>
</table>
   
   {/* Income Table */}
<h4 className="text-xl font-semibold text-pink-500">Income</h4>
<table className="min-w-full mb-5 border-collapse border border-pink-300">
  <thead>
    <tr>
      <th className="border border-pink-300 p-2 w-24">Date</th> {/* Minimized width */}
      <th className="border border-pink-300 p-2">Description</th>
      <th className="border border-pink-300 p-2">Amount</th>
      <th className="border border-pink-300 p-2">Action</th>
    </tr>
  </thead>
  <tbody>
    {transactions
      .filter(transaction => transaction.transactionType === 'income')
      .reduce((acc, transaction) => {
        const lastTransaction = acc.length > 0 ? acc[acc.length - 1] : null;

        // If the date is different from the last one, add a new date row
        if (!lastTransaction || transaction.date !== lastTransaction.date) {
          acc.push({ date: transaction.date, transactions: [transaction] });
        } else {
          // If the date is the same, push the transaction into the existing array
          lastTransaction.transactions.push(transaction);
        }
        return acc;
      }, [])
      .map((row, index) => {
        // Format the date
        const dateObj = new Date(row.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).replace(',', ''); // Remove the comma after the month

        return (
          <React.Fragment key={index}>
            <tr>
              <td className="border border-pink-300 p-2 font-bold w-24" rowSpan={row.transactions.length}>
                {formattedDate} {/* Displaying the formatted date */}
              </td>
              <td className="border border-pink-300 p-2">{row.transactions[0].description}</td>
              <td className="border border-pink-300 p-2">{row.transactions[0].amount}</td>
              <td className="border border-pink-300 p-2">
                <button onClick={() => deleteTransaction(row.transactions[0]._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
            {row.transactions.slice(1).map((transaction, transactionIndex) => (
              <tr key={transactionIndex}>
                <td className="border border-pink-300 p-2">{transaction.description}</td>
                <td className="border border-pink-300 p-2">{transaction.amount}</td>
                <td className="border border-pink-300 p-2">
                  <button onClick={() => deleteTransaction(transaction._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </React.Fragment>
        );
      })}
  </tbody>
  <tfoot>
    <tr>
      <td colSpan={2} className="border border-pink-300 p-2 font-bold">Total Income:</td>
      <td className="border border-pink-300 p-2">
        {transactions
          .filter(transaction => transaction.transactionType === 'income')
          .reduce((total, transaction) => total + transaction.amount, 0)}
      </td>
      <td></td>
    </tr>
  </tfoot>
</table>

{/* Expenses Table */}
<h4 className="text-xl font-semibold text-pink-500">Expenses</h4>
<table className="min-w-full mb-5 border-collapse border border-pink-300">
  <thead>
    <tr>
      <th className="border border-pink-300 p-2 w-24">Date</th> {/* Minimized width */}
      <th className="border border-pink-300 p-2">Description</th>
      <th className="border border-pink-300 p-2">Amount</th>
      <th className="border border-pink-300 p-2">Action</th>
    </tr>
  </thead>
  <tbody>
    {transactions
      .filter(transaction => transaction.transactionType === 'expenses')
      .reduce((acc, transaction) => {
        const lastTransaction = acc.length > 0 ? acc[acc.length - 1] : null;

        // If the date is different from the last one, add a new date row
        if (!lastTransaction || transaction.date !== lastTransaction.date) {
          acc.push({ date: transaction.date, transactions: [transaction] });
        } else {
          // If the date is the same, push the transaction into the existing array
          lastTransaction.transactions.push(transaction);
        }
        return acc;
      }, [])
      .map((row, index) => {
        // Format the date
        const dateObj = new Date(row.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).replace(',', ''); // Remove the comma after the month

        return (
          <React.Fragment key={index}>
            <tr>
              <td className="border border-pink-300 p-2 font-bold w-24" rowSpan={row.transactions.length}>
                {formattedDate} {/* Displaying the formatted date */}
              </td>
              <td className="border border-pink-300 p-2">{row.transactions[0].description}</td>
              <td className="border border-pink-300 p-2">{row.transactions[0].amount}</td>
              <td className="border border-pink-300 p-2">
                <button onClick={() => deleteTransaction(row.transactions[0]._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
            {row.transactions.slice(1).map((transaction, transactionIndex) => (
              <tr key={transactionIndex}>
                <td className="border border-pink-300 p-2">{transaction.description}</td>
                <td className="border border-pink-300 p-2">{transaction.amount}</td>
                <td className="border border-pink-300 p-2">
                  <button onClick={() => deleteTransaction(transaction._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </React.Fragment>
        );
      })}
  </tbody>
  <tfoot>
    <tr>
      <td colSpan={2} className="border border-pink-300 p-2 font-bold">Total Expenses:</td>
      <td className="border border-pink-300 p-2">
        {transactions
          .filter(transaction => transaction.transactionType === 'expenses')
          .reduce((total, transaction) => total + transaction.amount, 0)}
      </td>
      <td></td>
    </tr>
  </tfoot>
</table>

{/* Assets Table */}
<h4 className="text-xl font-semibold text-pink-500">Assets</h4>
<table className="min-w-full mb-5 border-collapse border border-pink-300">
  <thead>
    <tr>
      <th className="border border-pink-300 p-2 w-24">Date</th> {/* Minimized width */}
      <th className="border border-pink-300 p-2">Description</th>
      <th className="border border-pink-300 p-2">Amount</th>
      <th className="border border-pink-300 p-2">Action</th>
    </tr>
  </thead>
  <tbody>
    {transactions
      .filter(transaction => transaction.transactionType === 'assets')
      .reduce((acc, transaction) => {
        const lastTransaction = acc.length > 0 ? acc[acc.length - 1] : null;

        // If the date is different from the last one, add a new date row
        if (!lastTransaction || transaction.date !== lastTransaction.date) {
          acc.push({ date: transaction.date, transactions: [transaction] });
        } else {
          // If the date is the same, push the transaction into the existing array
          lastTransaction.transactions.push(transaction);
        }
        return acc;
      }, [])
      .map((row, index) => {
        // Format the date
        const dateObj = new Date(row.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).replace(',', ''); // Remove the comma after the month

        return (
          <React.Fragment key={index}>
            <tr>
              <td className="border border-pink-300 p-2 font-bold w-24" rowSpan={row.transactions.length}>
                {formattedDate} {/* Displaying the formatted date */}
              </td>
              <td className="border border-pink-300 p-2">{row.transactions[0].description}</td>
              <td className="border border-pink-300 p-2">{row.transactions[0].amount}</td>
              <td className="border border-pink-300 p-2">
                <button onClick={() => deleteTransaction(row.transactions[0]._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
            {row.transactions.slice(1).map((transaction, transactionIndex) => (
              <tr key={transactionIndex}>
                <td className="border border-pink-300 p-2">{transaction.description}</td>
                <td className="border border-pink-300 p-2">{transaction.amount}</td>
                <td className="border border-pink-300 p-2">
                  <button onClick={() => deleteTransaction(transaction._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </React.Fragment>
        );
      })}
  </tbody>
  <tfoot>
    <tr>
      <td colSpan={2} className="border border-pink-300 p-2 font-bold">Total Assets:</td>
      <td className="border border-pink-300 p-2">
        {transactions
          .filter(transaction => transaction.transactionType === 'assets')
          .reduce((total, transaction) => total + transaction.amount, 0)}
      </td>
      <td></td>
    </tr>
  </tfoot>
</table>


{/* Liabilities Table */}
<h4 className="text-xl font-semibold text-pink-500">Liabilities</h4>
<table className="min-w-full mb-5 border-collapse border border-pink-300">
  <thead>
    <tr>
      <th className="border border-pink-300 p-2 w-24">Date</th> {/* Minimized width */}
      <th className="border border-pink-300 p-2">Description</th>
      <th className="border border-pink-300 p-2">Amount</th>
      <th className="border border-pink-300 p-2">Action</th>
    </tr>
  </thead>
  <tbody>
    {transactions
      .filter(transaction => transaction.transactionType === 'liabilities')
      .reduce((acc, transaction) => {
        const lastTransaction = acc.length > 0 ? acc[acc.length - 1] : null;

        // If the date is different from the last one, add a new date row
        if (!lastTransaction || transaction.date !== lastTransaction.date) {
          acc.push({ date: transaction.date, transactions: [transaction] });
        } else {
          // If the date is the same, push the transaction into the existing array
          lastTransaction.transactions.push(transaction);
        }
        return acc;
      }, [])
      .map((row, index) => {
        // Format the date
        const dateObj = new Date(row.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
        }).replace(',', ''); // Remove the comma after the month

        // Calculate total amount for this date's transactions
        const totalAmount = row.transactions.reduce((total, transaction) => total + transaction.amount, 0);

        return (
          <React.Fragment key={index}>
            <tr>
              <td className="border border-pink-300 p-2 font-bold w-24" rowSpan={row.transactions.length}>
                {formattedDate} {/* Displaying the formatted date */}
              </td>
              <td className="border border-pink-300 p-2">{row.transactions[0].description}</td>
              <td className="border border-pink-300 p-2">{row.transactions[0].amount}</td>
              <td className="border border-pink-300 p-2">
                <button onClick={() => deleteTransaction(row.transactions[0]._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
            {row.transactions.slice(1).map((transaction, transactionIndex) => (
              <tr key={transactionIndex}>
                <td className="border border-pink-300 p-2">{transaction.description}</td>
                <td className="border border-pink-300 p-2">{transaction.amount}</td>
                <td className="border border-pink-300 p-2">
                  <button onClick={() => deleteTransaction(transaction._id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
            {/* Display total amount row for this date */}
            <tr>
              <td className="border border-pink-300 p-2 font-bold" colSpan="2">Total:</td>
              <td className="border border-pink-300 p-2 font-bold">{totalAmount}</td>
              <td className="border border-pink-300 p-2"></td>
            </tr>
          </React.Fragment>
        );
      })}
  </tbody>
</table>


</div>
    </div>
  );
};

export default TransactionForm;
