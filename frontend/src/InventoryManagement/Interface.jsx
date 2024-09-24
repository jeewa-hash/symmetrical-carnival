import React from 'react'
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import { Link } from "react-router-dom";
import "./Interface.css"; // Import the CSS file
import ui from '../image/1.png'; // Import the image



function Interface() {
  return (
    <div className="Inventory">
      <Header />
      <div>
      {/* Scrollable Body */}
        <div className="scrollableBody">
    
          <div className="content">
            <h1 className="title">Inventory Management</h1>
            <p className="description">
            The Inventory Management Interface offers a streamlined solution for tracking stock levels, managing materials, and optimizing inventory workflows. 
            Easily monitor and control your inventory, ensuring efficient material use and accurate records in one integrated system.
            </p>
           <Link to="/inventory">
              <button className="ctaButton">Raw Materials</button>
              <br></br>
              <br></br>
              </Link>
              <Link to="/finishgoods">
              <button className="ctaButton">FinishingGoods</button>
              <br></br>
              <br></br>
              </Link>
              <Link to="/rawmaterialrequest">
              <button className="ctaButton">Request Forms</button>
              <br></br>
              <br></br>
            </Link>
            <Link to="/monthlyevaluation"> {/* Update this line */}
  <button className="ctaButton">Valuation Report</button>
  <br></br>
  <br></br>
</Link>
            <Link to="report">
              <button className="ctaButton">Report</button>
            </Link>
            
          </div>
          <div className="illustration">
            <img
            src={ui}
              alt="Finance Illustration"
              className="illustrationImage"
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Interface;