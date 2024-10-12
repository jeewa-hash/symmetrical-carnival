import React from 'react';
import { Link } from "react-router-dom";
import ui from '../image/1.png'; // Import the image

function OrderAndProduction() {
  return (
    <div className="flex flex-col h-screen font-poppins bg-gradient-to-br from-purple-100 via-white to-pink-50">
     

      
      
      <div className="flex-1 flex justify-center items-center bg-pink-100 rounded-3xl shadow-xl mx-16 my-8 border border-gray-200"> {/* Updated background color */}
        
        {/* Content Section */}
        <div className="max-w-lg text-left space-y-6 p-10">
          <h1 className="text-5xl font-extrabold text-purple-600 mb-4 whitespace-nowrap">
            Order And Production
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            The Order and Production Interface allows you to efficiently manage orders and streamline production workflows.
            Track each order from start to finish while optimizing production schedules and inventory, all in one cohesive system.
          </p>
          
          {/* Navigation Buttons */}
          <div className="space-y-4">
            <Link to="production">
              <button className="w-full py-1 px-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-300 to-purple-300 rounded-full hover:from-pink-200 hover:to-purple-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Production Management
              </button>
            </Link>
            <br></br>
            <br></br>
            <Link to="order">
              <button className="w-full py-1 px-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-300 to-purple-300 rounded-full hover:from-pink-200 hover:to-purple-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Order Creation
              </button>
            </Link>
            <br></br>
            <br></br>
            <Link to="resources">
              <button className="w-full py-1 px-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-300 to-purple-300 rounded-full hover:from-pink-200 hover:to-purple-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Resource Planning
              </button>
            </Link>
            <br></br>
            <br></br>
            <Link to="cost">
              <button className="w-full py-1 px-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-300 to-purple-300 rounded-full hover:from-pink-200 hover:to-purple-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                Cost Management
              </button>
            </Link>
           
            <br></br>
            <br></br>
            <Link to="report">
              <button className="w-full py-1 px-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-300 to-purple-300 rounded-full hover:from-pink-200 hover:to-purple-200 transform hover:scale-105 transition duration-300 ease-in-out shadow-lg">
                report
              </button>
            </Link>
            
          </div>
        </div>

        {/* Illustration Section */}
        <div className="hidden lg:block w-1/3 max-w-xl">
          <img
            src={ui}
            alt="Soft Toys Production Illustration"
            className="w-full h-auto rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
            style={{ maxHeight: '300px' }} // Set a max height for the image
          />
        </div>
      </div>
    
      
    </div>
   
  );
}

export default OrderAndProduction;
