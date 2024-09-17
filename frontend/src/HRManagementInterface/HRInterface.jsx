
import React from 'react'
import Header from "../Shared/Header";
import Footer from "../Shared/Footer";
import { Link } from "react-router-dom";
import "./HRinterface.css";
import Hr from '../image/hr.png';

function HRinterface() {
  return (
    <div className="financeInterface">
       <Link to="/hr-report"></Link>
      <Header />
      <div>
      {/* Scrollable Body */}
        <div className="scrollableBody">
    
          <div className="content">
            <h1 className="title">HR Management</h1>
            <p className="description">
            The HR Management System streamlines salary management, attendance tracking, and leave requests by automating payroll, real-time attendance tracking, and online leave submissions. It enhances HR efficiency and ensures accurate management of essential functions.
            </p>
               
              <Link to="leaveform">
              <button className="ctaButton">Leave Request Form</button>
              <br></br>
              <br></br></Link>
             
               
              <Link to="salarymang">
              <button className="ctaButton">Salary details Form</button>
              <br></br>
              <br></br></Link>
              
              

             <Link to="attendancetrack">
              <button className="ctaButton">Attendence Form</button>
              <br></br>
              <br></br></Link>



              <Link to="hr-report">
              <button className="ctaButton">Report</button>
              <br></br>
              <br></br></Link>
               
              <Link to="addemp">
              <button className="ctaButton">Add emp</button>
              <br></br>
              <br></br></Link>
           
          </div>
          <div className="illustration">
            <img
              src={Hr}
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

export default HRinterface