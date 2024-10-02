// NotificationDropdown.js
import React, { useState } from 'react';
import { useNotification } from './notificatioonContext'; // Fix the import path
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const NotificationDropdown = () => {
  const { notifications } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNotificationClick = (route) => {
    navigate(route); // Navigate to the specified route
    setShowNotifications(false); // Close the dropdown after clicking
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        className="p-3 bg-blue-500 text-white rounded-full shadow-lg"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        Notifications ({notifications.length})
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute top-12 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Notifications</h3>
          <ul className="space-y-2">
            {notifications.length === 0 ? (
              <li className="text-gray-500">No notifications</li>
            ) : (
              notifications.map((notification, index) => (
                <li
                  key={index}
                  className="text-gray-700 p-2 bg-gray-100 rounded-lg shadow-sm cursor-pointer"
                  onClick={() => handleNotificationClick('/financeui/ftable')} // Handle click to navigate
                >
                  {notification.message}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;  