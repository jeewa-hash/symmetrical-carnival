import React from "react";
import { Link } from "react-router-dom";
import "./financeuserinterface.css"; // Import the CSS file
import supp from "../../assets/supp.jpeg"; // Import the image

function FinanceUserInterface() {
  return (
    <div className="financeInterfacePage">
      <div className="financeInterface">
        {/* Scrollable Body */}
        <div className="scrollableBody">
          <div className="content">
            <h1 className="title">Supplier Management</h1>
            <p className="description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget
              libero feugiat, faucibus libero id, scelerisque quam.
            </p>
            <Link to="/dashbord">
              <button className="ctaButton">Supplier Details</button>
              <br></br>
              <br></br>
            </Link>
            <Link to="order-list">
              <button className="ctaButton">Bill Generation</button>
              <br></br>
              <br></br>
            </Link>
            <Link to="make-order">
              <button className="ctaButton">Order Creation</button>
              <br></br>
              <br></br>
            </Link>
          </div>
          <div className="illustration">
            <img
              src={supp}
              alt="Finance Illustration"
              className="illustrationImage"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinanceUserInterface;
