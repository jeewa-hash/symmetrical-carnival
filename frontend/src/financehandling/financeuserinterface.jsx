import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import financee1 from "../image/finance1.png";

function FinanceUserInterface() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample notification for demonstration
  useEffect(() => {
    // Simulate receiving a new notification after 5 seconds
    const timer = setTimeout(() => {
      addNotification("New invoice created successfully!");
    }, 5000);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  const addNotification = (message) => {
    setNotifications((prev) => [...prev, message]);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="relative flex flex-col h-screen font-poppins bg-gradient-to-br from-pink-100 via-white to-yellow-50">
      {/* Notification Button */}
      <button
        className="absolute top-4 right-4 p-3 bg-gradient-to-r from-orange-300 to-pink-300 text-white rounded-full shadow-lg hover:from-orange-200 hover:to-pink-200 transform hover:scale-105 transition duration-300 ease-in-out"
        onClick={handleNotificationClick}
      >
        Notifications ({notifications.length})
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute top-16 right-4 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Notifications</h3>
          <ul className="space-y-2">
            {notifications.length === 0 ? (
              <li className="text-gray-500">No notifications</li>
            ) : (
              notifications.map((notification, index) => (
                <li key={index} className="text-gray-700 p-2 bg-gray-100 rounded-lg shadow-sm">
                  {notification}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-grow flex-col lg:flex-row items-center justify-between px-6 py-12">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h1 className="text-5xl font-extrabold text-rose-600 mb-6">Finance Management</h1>
          <p className="text-xl text-gray-600 leading-relaxed mb-6">
            Welcome to the Finance Management interface of our soft toy management system! Easily manage transactions, invoices, and budgets. This interface provides the tools for effective financial oversight and informed decision-making. Let's streamline your financial processes together!
          </p>

          {/* Navigation Buttons */}
          <div className="space-y-4">
            <Link to="orderbillinterface">
              <button className="w-full py-4 px-8 text-xl font-semibold text-white bg-gradient-to-r from-orange-300 to-pink-300 rounded-full hover:from-orange-200 hover:to-pink-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Order Bill Calculate
              </button>
            </Link>
            <Link to="salarycalculateinterface">
              <button className="w-full py-4 px-8 text-xl font-semibold text-white bg-gradient-to-r from-orange-300 to-pink-300 rounded-full hover:from-orange-200 hover:to-pink-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Calculate Salary
              </button>
            </Link>
            <Link to="ftable">
              <button className="w-full py-4 px-8 text-xl font-semibold text-white bg-gradient-to-r from-orange-300 to-pink-300 rounded-full hover:from-orange-200 hover:to-pink-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Finance Table
              </button>
            </Link>
          </div>
        </div>

        {/* Finance Illustration Image */}
        <div className="lg:w-1/2 max-w-xl">
          <img
            src={financee1}
            alt="Finance Illustration"
            className="w-full h-auto rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
}

export default FinanceUserInterface;
