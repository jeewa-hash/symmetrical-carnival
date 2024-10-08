import React, { useState, useEffect } from 'react';
import backgroungv from '../image/bgg.mp4';
import { Link } from "react-router-dom";

const images = [
  '/image/1.jpg',
  '/path-to-your-image2.jpg',
  '/path-to-your-image3.jpg',
  '/path-to-your-image4.jpg',
];

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
  { title: 'Finance Handling', description: 'Track expenses, manage budgets, and view financial reports.', icon: '💰' },
];

const HomePage = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Change images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="soft-toy-container">
  {/* Transition Image View Container */}
  <div
    className="relative w-full h-[75vh] bg-cover bg-center transition-all duration-700 whimsical-background"
    style={{ backgroundImage: `url(${images[currentImage]})` }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-pink-300 to-pink-200 bg-opacity-70 flex flex-col justify-center items-center">
      <h1 className="text-6xl font-extrabold text-white mb-4 transition-transform duration-500 transform hover:scale-110 soft-header">
        Welcome to Bear Works Lanka
      </h1>
      <p className="text-3xl text-gray-100 mb-4 snuggly-subheading">The ultimate soft toy paradise!</p>
      <Link to="register">
      <button className="bg-purple-700 text-white font-semibold py-3 px-10 rounded-full shadow-lg cuddle-button hover:bg-purple-800 transition duration-300 transform hover:scale-105">
        Get Started
      </button>
      </Link>
      <Link to="financeui">
              <button className="w-full py-4 px-8 text-xl font-semibold text-white bg-gradient-to-r from-orange-300 to-pink-300 rounded-full hover:from-orange-200 hover:to-pink-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Finance Handling
              </button>
            </Link>
            <Link to="orderandproductionui">
              <button className="w-full py-4 px-8 text-xl font-semibold text-white bg-gradient-to-r from-orange-300 to-pink-300 rounded-full hover:from-orange-200 hover:to-pink-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Order and Production Handling
              </button>
            </Link>
            <Link to="inventoryui">
              <button className="w-full py-4 px-8 text-xl font-semibold text-white bg-gradient-to-r from-orange-300 to-pink-300 rounded-full hover:from-orange-200 hover:to-pink-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Inventory Management
              </button>
            </Link>
            <Link to="hrui">
              <button className="w-full py-4 px-8 text-xl font-semibold text-white bg-gradient-to-r from-orange-300 to-pink-300 rounded-full hover:from-orange-200 hover:to-pink-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                HR Management
              </button>
            </Link>
            <Link to="supplierui">
              <button className="w-full py-4 px-8 text-xl font-semibold text-white bg-gradient-to-r from-orange-300 to-pink-300 rounded-full hover:from-orange-200 hover:to-pink-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Supplier Management
              </button>
            </Link>
            <Link to="deliveryui">
              <button className="w-full py-4 px-8 text-xl font-semibold text-white bg-gradient-to-r from-orange-300 to-pink-300 rounded-full hover:from-orange-200 hover:to-pink-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Delivery Management
              </button>
            </Link>
            <Link to="salesui">
              <button className="w-full py-4 px-8 text-xl font-semibold text-white bg-gradient-to-r from-orange-300 to-pink-300 rounded-full hover:from-orange-200 hover:to-pink-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Sales Management
              </button>
            </Link>
    </div>
  </div>

  {/* Video and Content Section */}
  <div className="relative w-full h-60 overflow-hidden rounded-lg shadow-lg border border-gray-300 cozy-video-section">
    {/* Background Video */}
    <video
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
      src={backgroungv} 
      autoPlay
      loop
      muted
    />

    {/* Overlay for Content */}
    <div className="relative z-10 flex flex-col justify-center items-center h-full dreamy-overlay p-4 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-2 soft-header">Bear Works Lanka</h2>
      <p className="text-lg text-gray-300 mb-2 text-center playful-text">Welcome to the ultimate soft toy paradise!</p>
      <p className="text-md text-gray-200 text-center">Manage and cherish all your soft toys effortlessly in one place.</p>
    </div>
  </div>

  {/* Feature Cards Section */}
  <div className="features-section grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 py-12">
    {features.map((feature, index) => (
      <div
        key={index}
        className="toy-feature-card bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <div className="text-5xl mb-6 playful-icon">{feature.icon}</div>
        <h3 className="text-2xl font-bold text-purple-700 mb-4">{feature.title}</h3>
        <p className="text-gray-700 toy-description">{feature.description}</p>
      </div>
    ))}
  </div>
</div>
  );
};

export default HomePage;
