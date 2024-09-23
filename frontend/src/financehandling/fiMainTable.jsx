import React, { useState } from "react";

const initialTransactions = [
  {
    id: 1,
    date: "2023-01-01",
    description: "Initial deposit",
    type: "credit",
    amount: 1000,
  },
  {
    id: 2,
    date: "2023-01-05",
    description: "Rent payment",
    type: "debit",
    amount: 500,
  },
  {
    id: 3,
    date: "2023-01-10",
    description: "Salary",
    type: "credit",
    amount: 2000,
  },
];

const FinanceManager = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    description: "",
    type: "credit",
    amount: 0,
  });

  const handleAddTransaction = () => {
    const newId = transactions.length + 1;
    const newTransactionToAdd = {
      id: newId,
      date: newTransaction.date || "",
      description: newTransaction.description || "",
      type: newTransaction.type,
      amount: newTransaction.amount || 0,
    };

    setTransactions([...transactions, newTransactionToAdd]);

    // Reset the form fields
    setNewTransaction({
      date: "",
      description: "",
      type: "credit",
      amount: 0,
    });
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900">Finance Manager</h1>
      <div className="flex flex-col mt-8">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th colSpan={3} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit
                    </th>
                    <th colSpan={3} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Debit
                    </th>
                  </tr>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      {transaction.type === "credit" ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.amount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.amount}</td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Transaction Form */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900">Add New Transaction</h2>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="date"
                id="date"
                value={newTransaction.date || ""}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="description"
                id="description"
                value={newTransaction.description || ""}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <div className="mt-1">
              <select
                id="type"
                name="type"
                value={newTransaction.type || "credit"}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="amount"
                id="amount"
                value={newTransaction.amount || 0}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseInt(e.target.value, 10) })}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="sm:col-span-6">
            <button
              onClick={handleAddTransaction}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceManager;
