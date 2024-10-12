import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import 'chart.js/auto';

// Utility function to format dates
const formatDate = (dateStr) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-US", options);
};

// Profit line chart component
const ProfitLineChart = ({ transactions, timeFrame }) => {
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const today = new Date();
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

  const labels = filteredTransactions.map(tx => formatDate(tx.date));
  const data = filteredTransactions.map(tx => tx.amount);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Profit`,
        data,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  return <Line data={chartData} height={100} />;
};

// Credit and Profit Bar Chart
const CreditProfitBarChart = ({ transactions }) => {
  const totalCredit = transactions
    .filter(tx => tx.transactionType === "income")
    .reduce((total, tx) => total + tx.amount, 0);

  const totalProfit = transactions
    .filter(tx => tx.transactionType === "income" || tx.transactionType === "expenses")
    .reduce((total, tx) => total + tx.amount, 0);

  const chartData = {
    labels: ["Total Credit", "Total Profit"],
    datasets: [
      {
        label: "Amount",
        data: [totalCredit, totalProfit],
        backgroundColor: ["#4caf50", "#ff9800"],
      },
    ],
  };

  return <Bar data={chartData} height={100} />;
};

// Detailed Assets and Liabilities Overview Chart
const FinancialOverviewChart = ({ transactions }) => {
  const income = transactions
    .filter(tx => tx.transactionType === "income")
    .reduce((total, tx) => total + tx.amount, 0);

  const expenses = transactions
    .filter(tx => tx.transactionType === "expenses")
    .reduce((total, tx) => total + tx.amount, 0);

  const assets = transactions
    .filter(tx => tx.category === "assets")
    .reduce((total, tx) => total + tx.amount, 0);

  const liabilities = transactions
    .filter(tx => tx.category === "liabilities")
    .reduce((total, tx) => total + tx.amount, 0);

  const chartData = {
    labels: ["Income", "Expenses", "Assets", "Liabilities"],
    datasets: [
      {
        label: "Financial Overview",
        data: [income, expenses, assets, liabilities],
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#f44336"],
      },
    ],
  };

  return <Doughnut data={chartData} height={100} />;
};

// Main TransactionForm Component
const TransactionForm = () => {
  const [transactions, setTransactions] = useState([]);
  const [timeFrame, setTimeFrame] = useState("daily");

  // Fetch transactions from the API
  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/finance-manager");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Transaction Form</h2>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-center">Profit Analysis</h3>
        <select
          onChange={(e) => setTimeFrame(e.target.value)}
          value={timeFrame}
          className="form-select mt-2 mx-auto block w-1/2"
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <div className="max-w-3xl mx-auto mt-4">
          <ProfitLineChart transactions={transactions} timeFrame={timeFrame} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-center">Credit vs. Profit Analysis</h3>
        <div className="max-w-3xl mx-auto mt-4">
          <CreditProfitBarChart transactions={transactions} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-center">Financial Overview</h3>
        <div className="max-w-3xl mx-auto mt-4">
          <FinancialOverviewChart transactions={transactions} />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-center">Assets & Liabilities</h3>
        <div className="max-w-3xl mx-auto mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-100 rounded shadow-md">
            <h4 className="text-lg font-semibold text-center">Assets</h4>
            <ul className="space-y-2 mt-2">
              {transactions
                .filter(tx => tx.category === "assets")
                .map(tx => (
                  <li key={tx.id} className="text-center">
                    {formatDate(tx.date)}: ${tx.amount.toFixed(2)}
                  </li>
                ))}
            </ul>
          </div>
          <div className="p-4 bg-red-100 rounded shadow-md">
            <h4 className="text-lg font-semibold text-center">Liabilities</h4>
            <ul className="space-y-2 mt-2">
              {transactions
                .filter(tx => tx.category === "liabilities")
                .map(tx => (
                  <li key={tx.id} className="text-center">
                    {formatDate(tx.date)}: ${tx.amount.toFixed(2)}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
