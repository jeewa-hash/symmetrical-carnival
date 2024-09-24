import React from "react";
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import Dashboard from "../Dashboard/Dashboard";
import { Link } from "react-router-dom";
import "./financeuserinterface.css"; // Import the CSS file

function FinanceUserInterface() {
  return (
    <div className="financeInterface">
      <Header />
      <div>
      {/* Scrollable Body */}
        <div className="scrollableBody">
        <Dashboard />
          <div className="content">
            <h1 className="title">Finance Management</h1>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
              libero feugiat, faucibus libero id, scelerisque quam.
            </p>
            <Link to="salarycalculateinterface">
              <button className="ctaButton">Calculate Salary</button>
              <br></br>
              <br></br>
            </Link>
            <Link to="orderbillinterface">
              <button className="ctaButton">Order Bill Calculate</button>
              <br></br>
              <br></br>
            </Link>
            <Link to="financereport">
              <button className="ctaButton">Finance Report</button>
              <br></br>
              <br></br>
            </Link>
            <Link to="salaryret">
              <button className="ctaButton">Salary Report</button>
              <br></br>
              <br></br>
            </Link>
          </div>
          <div className="illustration">
            <img
              src="path_to_your_image.jpg"
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

export default FinanceUserInterface;
