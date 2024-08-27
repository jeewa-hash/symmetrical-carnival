import React, { useState } from 'react'; // Import useState from React
import { FaTachometerAlt } from 'react-icons/fa'; // Import an icon for dashboard
import './Dashboard.css'; // Import CSS for Dashboard styling

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDashboardClick = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      <button className="dashboard-button" onClick={handleDashboardClick}>
        <FaTachometerAlt />
      </button>
      {isSidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Dashboard</h2>
            <button onClick={handleCloseSidebar} className="close-button">X</button>
          </div>
          <ul className="sidebar-menu">
            <li className="sidebar-item">Dashboard Home</li>
            <li className="sidebar-item">Profile</li>
            <li className="sidebar-item">Settings</li>
            <li className="sidebar-item">Logout</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
