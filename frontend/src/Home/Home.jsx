import React from 'react';
import Header from '../Shared/Header';
import Footer from '../Shared/Footer';
import './Home.css'; // Import the CSS file

const features = [
  { title: 'Dashboard', description: 'Overview of key metrics, alerts, and notifications.', icon: '📊' },
  { title: 'Inventory Management', description: 'Real-time stock tracking, restocking alerts, and adjustments.', icon: '📦' },
  { title: 'Order Management', description: 'Processing orders, tracking status, and order history.', icon: '🛒' },
  { title: 'Supplier Management', description: 'Manage supplier information and purchase orders.', icon: '🔗' },
  { title: 'Product Management', description: 'Catalog management, product updates, and pricing.', icon: '🧸' },
  { title: 'Sales Tracking', description: 'Reports on sales performance, trends, and revenue.', icon: '💵' },
  { title: 'Employee Management', description: 'User roles, permissions, and activity logs.', icon: '👥' },
  { title: 'Reporting and Analytics', description: 'Custom reports and data visualization.', icon: '📈' },
  { title: 'Search and Filter', description: 'Advanced search and filtering options.', icon: '🔍' },
  { title: 'Security and Backup', description: 'Data security and regular backups.', icon: '🔐' },
  { title: 'Help and Support', description: 'Documentation and support channels.', icon: '🆘' },
];

const HomePage = () => {
  return (
    <div className="homepage-container">
      <Header />
      <div className="main-content-container">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-4">Bear Works Lanka</h1>
          <p className="text-xl text-gray-700 mb-4">Welcome to the ultimate soft toy paradise!</p>
          <p className="text-lg text-gray-600">Manage and cherish all your soft toys effortlessly in one place.</p>
        </div>

        <div className="flex justify-center mb-8">
          <button className="get-started-button text-white font-bold py-2 px-6 rounded-full shadow-lg">
            Get Started
          </button>
        </div>

        
          </div>
          {/* Feature Cards Section */}
        <div className="features-section">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card bg-white rounded-lg shadow-xl p-6 flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
