import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import logo from '../image/logo.png';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate(); // Create a navigate function

  const handleUserClick = (event) => {
    event.preventDefault(); // Prevent the default link behavior
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Function to handle login and logout
  const handleLoginToggle = () => {
    if (!isLoggedIn) {
      // If the user is not logged in, navigate to the login page
      navigate('/login');
    } else {
      // If the user is logged in, log them out
      setIsLoggedIn(false);
    }
  };

  // Simulate login success when navigating back from login page
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="bg-[#fef3f2]">
      <header className="bg-[#ffe6e9] shadow-xl py-6 px-8 md:px-12 border-b-2 border-[#f47e5f] rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Bear Works Lanka Logo"
              className="w-20 h-20 mr-4 rounded-full border-4 border-[#ff6f61] shadow-lg"
            />
            <h1 className="text-4xl font-extrabold text-[#ff6f61]">
              Bear Works Lanka
            </h1>
          </div>
          <nav className="hidden md:flex items-center justify-center space-x-20 p-6 shadow-md rounded-lg">
            <ul className="flex list-none p-0 m-0">
              <li className="relative group">
                <a
                  href="#home"
                  className="text-2xl font-semibold text-gray-800 transition duration-300 hover:text-[#ff6f61] p-4 rounded-md flex items-center"
                >
                  Home
                  <span className="ml-2 hidden group-hover:block text-[#ff6f61] text-sm">
                    🏡
                  </span>
                </a>
                <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#ff6f61] transition-all duration-300 scale-x-0 group-hover:scale-x-100" />
              </li>
              <li className="relative group">
                <a
                  href="#users"
                  onClick={handleUserClick}
                  className="text-2xl font-semibold text-gray-800 transition duration-300 hover:text-[#ff6f61] p-4 rounded-md flex items-center"
                >
                  Users
                  <span className="ml-2 hidden group-hover:block text-[#ff6f61] text-sm">
                    👤
                  </span>
                </a>
                <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#ff6f61] transition-all duration-300 scale-x-0 group-hover:scale-x-100" />
              </li>
              <li className="relative group">
                <a
                  href="#about"
                  className="text-2xl font-semibold text-gray-800 transition duration-300 hover:text-[#ff6f61] p-4 rounded-md flex items-center"
                >
                  About Us
                  <span className="ml-2 hidden group-hover:block text-[#ff6f61] text-sm">
                    ℹ️
                  </span>
                </a>
                <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#ff6f61] transition-all duration-300 scale-x-0 group-hover:scale-x-100" />
              </li>
              <li className="relative group">
                <a
                  href="#contact"
                  className="text-2xl font-semibold text-gray-800 transition duration-300 hover:text-[#ff6f61] p-4 rounded-md flex items-center"
                >
                  Contact Us
                  <span className="ml-2 hidden group-hover:block text-[#ff6f61] text-sm">
                    📞
                  </span>
                </a>
                <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#ff6f61] transition-all duration-300 scale-x-0 group-hover:scale-x-100" />
              </li>
              <li className="relative group">
                <a
                  href="#notice"
                  className="text-2xl font-semibold text-gray-800 transition duration-300 hover:text-[#ff6f61] p-4 rounded-md flex items-center"
                >
                  Notice
                  <span className="ml-2 hidden group-hover:block text-[#ff6f61] text-sm">
                    📢
                  </span>
                </a>
                <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#ff6f61] transition-all duration-300 scale-x-0 group-hover:scale-x-100" />
              </li>
            </ul>
          </nav>

          <div className="login-container ml-8">
            <button
              onClick={handleLoginToggle}
              className="login-button flex items-center justify-center bg-[#ff6f61] text-white font-semibold rounded-[18px] px-[80px] py-[7px] transition duration-300 ease-in-out transform hover:bg-[#e45b4c] cursor-pointer whitespace-nowrap"
            >
              {isLoggedIn ? 'Log Out' : 'Log In'}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
