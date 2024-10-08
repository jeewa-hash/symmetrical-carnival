import React from 'react';
import { Link } from "react-router-dom";
import ui from '../image/1.png'; // Import the image

function Interface() {
  return (
    <div className="flex flex-col h-screen font-poppins bg-gradient-to-br from-purple-100 via-white to-pink-50">
     
      
      <div className="flex-1 flex justify-center items-center bg-pink-100 rounded-3xl shadow-xl mx-16 my-8 border border-gray-200">
        
        {/* Content Section */}
        <div className="max-w-lg text-left space-y-6 p-10">
          <h1 className="text-5xl font-extrabold text-purple-600 mb-4 whitespace-nowrap">
            Inventory Management
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            The Inventory Management Interface offers a streamlined solution for tracking stock levels, managing materials, and optimizing inventory workflows.
            Easily monitor and control your inventory, ensuring efficient material use and accurate records in one integrated system.
          </p>
          
          {/* Navigation Buttons */}
          <div className="space-y-6"> {/* Updated spacing between buttons */}
            <Link to="/inventory">
              <button className="w-full py-1 px-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-300 to-purple-300 rounded-full hover:from-pink-200 hover:to-purple-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Raw Materials
              </button>
            </Link>
            <Link to="/finishgoods">
              <button className="w-full py-1 px-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-300 to-purple-300 rounded-full hover:from-pink-200 hover:to-purple-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Finishing Goods
              </button>
            </Link>
            <Link to="/rawmaterialrequest">
              <button className="w-full py-1 px-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-300 to-purple-300 rounded-full hover:from-pink-200 hover:to-purple-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Request Forms
              </button>
            </Link>
            <Link to="/monthlyevaluation">
              <button className="w-full py-1 px-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-300 to-purple-300 rounded-full hover:from-pink-200 hover:to-purple-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Valuation Report
              </button>
            </Link>
            <Link to="/productionrequest">
              <button className="w-full py-1 px-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-300 to-purple-300 rounded-full hover:from-pink-200 hover:to-purple-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Production Request
              </button>
            </Link>
            
          </div>
        </div>

        {/* Illustration Section */}
        <div className="hidden lg:block w-1/3 max-w-xl">
          <img
            src={ui}
            alt="Inventory Management Illustration"
            className="w-full h-auto rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
            style={{ maxHeight: '300px' }}
          />
        </div>
      </div>
      
      
    </div>
  );
}

export default Interface;
