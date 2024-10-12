import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import logo from '../image/logo.png';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // State to track login status
  const [userEmail, setUserEmail] = useState('jkumarasekara@gmail.com'); // Assume user email is set here
  const navigate = useNavigate(); // Create a navigate function
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // State for dropdown

  const handleUserClick = (event) => {
    event.preventDefault(); // Prevent the default link behavior
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen); // Toggle the dropdown
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

  const handleNavigateHome = () => {
    navigate('/'); // Navigate to home page
  };
  
  const handleNavigateAboutus = () => {
    navigate('/aboutus'); // Navigate to about us page
  };

  const handleNavigateSection = (section) => {
    if (userEmail === 'jkumarasekara@gmail.com') {
      navigate('/financeui'); // Navigate to Finance UI
    } else if (userEmail === 'naveeshabjayah@gmail.com') {
      navigate('/inventoryui'); // Navigate to Inventory UI
    } else if (userEmail === 'anotheruser@example.com') {
      navigate('/hrui'); // Navigate to HR UI
    } else if (userEmail === 'yetanotheruser@example.com') {
      navigate('/salesui'); // Navigate to Sales UI
    } else {
      alert('You do not have permission to access this section.'); // Alert for unauthorized access
    }
  };

  const handleFinanceDropdownToggle = () => {
    setIsFinanceDropdownOpen(!isFinanceDropdownOpen);
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
                <button
                  onClick={handleNavigateHome}
                  className="relative text-2xl font-semibold text-gray-800 transition duration-500 ease-in-out hover:text-white hover:bg-[#ff6f61] p-4 rounded-lg shadow-lg transform hover:scale-105 flex items-center space-x-2"
                >
                  <span className="transition-transform transform group-hover:rotate-[360deg] duration-500">Home</span>
                  <span className="ml-2 group-hover:ml-4 transition-all duration-500 ease-in-out text-[#ff6f61] text-2xl group-hover:text-white">
                    🏡
                  </span>
                </button>
                <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#ff6f61] transition-all duration-300 scale-x-0 group-hover:scale-x-100" />
              </li>

              <li className="relative group">
                <button
                  onClick={handleUserDropdownToggle} // Toggle dropdown on click
                  className="relative text-2xl font-semibold text-gray-800 transition duration-500 ease-in-out hover:text-white hover:bg-[#ff6f61] p-4 rounded-lg shadow-lg transform hover:scale-105 flex items-center space-x-2"
                >
                  <span className="transition-transform transform group-hover:rotate-[360deg] duration-500">Users</span>
                  <span className="ml-2 group-hover:ml-4 transition-all duration-500 ease-in-out text-[#ff6f61] text-2xl group-hover:text-white">
                    👤
                  </span>
                </button>
                <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#ff6f61] transition-all duration-300 scale-x-0 group-hover:scale-x-100" />
                
                {/* Conditionally render the dropdown */}
                {isUserDropdownOpen && (
                  <ul className="absolute bg-white shadow-lg rounded-lg mt-2 w-48 py-2 z-10 transition-opacity duration-300 ease-in-out opacity-100">
                    {/* Finance Manager Dropdown */}
                    <li className="px-4 py-2 hover:bg-[#ff6f61] hover:text-white transition-colors duration-300 ease-in-out cursor-pointer" onClick={() => handleNavigateSection('financeui')}>
                      <button onClick={handleFinanceDropdownToggle} className="w-full text-left">
                        Finance Manager
                      </button>
                    </li>
                    <li className="px-4 py-2 hover:bg-[#ff6f61] hover:text-white transition-colors duration-300 ease-in-out cursor-pointer" onClick={() => handleNavigateSection('hrui')}>
                      HR Manager
                    </li>
                    <li className="px-4 py-2 hover:bg-[#ff6f61] hover:text-white transition-colors duration-300 ease-in-out cursor-pointer" onClick={() => handleNavigateSection('orderandproductionui')}>
                      Order and Production Manager
                    </li>
                    <li className="px-4 py-2 hover:bg-[#ff6f61] hover:text-white transition-colors duration-300 ease-in-out cursor-pointer" onClick={() => handleNavigateSection('inventoryui')}>
                    <button onClick={handleFinanceDropdownToggle} className="w-full text-left">
                    Inventory Manager
                      </button>
                    </li>
                    <li className="px-4 py-2 hover:bg-[#ff6f61] hover:text-white transition-colors duration-300 ease-in-out cursor-pointer" onClick={() => handleNavigateSection('supplierui')}>
                      Supplier Manager
                    </li>
                    <li className="px-4 py-2 hover:bg-[#ff6f61] hover:text-white transition-colors duration-300 ease-in-out cursor-pointer" onClick={() => handleNavigateSection('deliveryui')}>
                      Delivery Manager
                    </li>
                    <li className="px-4 py-2 hover:bg-[#ff6f61] hover:text-white transition-colors duration-300 ease-in-out cursor-pointer" onClick={() => handleNavigateSection('salesui')}>
                      Sales Representative
                    </li>
                    <li className="px-4 py-2 hover:bg-[#ff6f61] hover:text-white transition-colors duration-300 ease-in-out cursor-pointer" onClick={() => handleNavigateSection('financeui')}>
                      Other Workers
                    </li>
                    
                    
                    
                   
                  </ul>
                )}
              </li>

              <li className="relative group">
                <button
                  onClick={handleNavigateAboutus}
                  className="relative text-2xl font-semibold text-gray-800 transition duration-500 ease-in-out hover:text-white hover:bg-[#ff6f61] p-4 rounded-lg shadow-lg transform hover:scale-105 flex items-center space-x-2"
                >
                  <span className="transition-transform transform group-hover:rotate-[360deg] duration-500">About Us</span>
                  <span className="ml-2 group-hover:ml-4 transition-all duration-500 ease-in-out text-[#ff6f61] text-2xl group-hover:text-white">
                    ℹ️
                  </span>
                </button>
                <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#ff6f61] transition-all duration-300 scale-x-0 group-hover:scale-x-100" />
              </li>

              <li className="relative group">
                <button
                  onClick={() => navigate('#contact')}
                  className="relative text-2xl font-semibold text-gray-800 transition duration-500 ease-in-out hover:text-white hover:bg-[#ff6f61] p-4 rounded-lg shadow-lg transform hover:scale-105 flex items-center space-x-2"
                >
                  <span className="transition-transform transform group-hover:rotate-[360deg] duration-500">Contact Us</span>
                  <span className="ml-2 group-hover:ml-4 transition-all duration-500 ease-in-out text-[#ff6f61] text-2xl group-hover:text-white">
                    📞
                  </span>
                </button>
                <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#ff6f61] transition-all duration-300 scale-x-0 group-hover:scale-x-100" />
              </li>

              <li className="relative group">
                <button
                  onClick={() => navigate('#notice')}
                  className="relative text-2xl font-semibold text-gray-800 transition duration-500 ease-in-out hover:text-white hover:bg-[#ff6f61] p-4 rounded-lg shadow-lg transform hover:scale-105 flex items-center space-x-2"
                >
                  <span className="transition-transform transform group-hover:rotate-[360deg] duration-500">Notice</span>
                  <span className="ml-2 group-hover:ml-4 transition-all duration-500 ease-in-out text-[#ff6f61] text-2xl group-hover:text-white">
                    📢
                  </span>
                </button>
                <span className="absolute left-0 right-0 bottom-0 h-1 bg-[#ff6f61] transition-all duration-300 scale-x-0 group-hover:scale-x-100" />
              </li>
            </ul>
          </nav>

          <div className="login-container ml-8">
            <button
              onClick={handleLoginToggle}
              className="login-button flex items-center justify-center bg-[#ff6f61] text-white font-semibold rounded-[18px] px-[80px] py-[7px] transition duration-300 ease-in-out transform hover:bg-[#e45b4c] cursor-pointer whitespace-nowrap"
            >
              {isLoggedIn ? 'Log In' : 'Log Out'}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
