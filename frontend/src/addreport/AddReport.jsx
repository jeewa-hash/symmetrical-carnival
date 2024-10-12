import React, { useState, useEffect } from 'react';
import './AddReport.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import BR1 from '../image/design.png';

const AddReport = () => {
    const Report = {
        driver_Name: "",
        vehicel_No: "",
        delivery_Route: "",
        delivery_Date: new Date().toISOString().substr(0, 10), // Set current date as default
        delivery_StartTime: "", // Set this later when the component mounts
        delivery_EndTime: "",
        delivery_Status: "Pending", // Default to "Pending"
    };

    const [report, setReport] = useState(Report);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Function to get the current time in "HH:MM" format
    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5); // "HH:MM" format
    };

    // Set the start time to the current time on component mount
    useEffect(() => {
        setReport((prevReport) => ({
            ...prevReport,
            delivery_StartTime: getCurrentTime(),
        }));
    }, []);

    const inputHandler = (event) => {
        const { name, value } = event.target;
    
        // Only allow letters and spaces for driver_Name and delivery_Route
        if (name === "driver_Name" || name === "delivery_Route") {
            const validValue = value.replace(/[^A-Za-z\s]/g, ''); // Remove any non-letter or space
            setReport({ ...report, [name]: validValue });
        } else {
            setReport({ ...report, [name]: value });
        }
    };
    
    

    const validateForm = () => {
        const newErrors = {};

        // Required field validations
        if (!report.driver_Name) newErrors.driver_Name = "Driver Name is required";
        if (!report.vehicel_No) newErrors.vehicel_No = "Vehicle No is required";
        if (!report.delivery_Route) newErrors.delivery_Route = "Delivery Route is required";
        if (!report.delivery_Status) newErrors.delivery_Status = "Delivery Status is required";

        // Validation for driver name (only letters and spaces allowed)
        const namePattern = /^[A-Za-z\s]+$/;
        if (!namePattern.test(report.driver_Name)) {
            newErrors.driver_Name = "Driver Name can only contain letters and spaces";
        }

        // Check for invalid characters in vehicle number and delivery route
        const invalidCharsPattern = /[@#$%_!]/; // Define the invalid characters
        if (invalidCharsPattern.test(report.vehicel_No)) {
            newErrors.vehicel_No = "Vehicle No cannot contain special characters (@#$%_!)";
        }
        if (invalidCharsPattern.test(report.delivery_Route)) {
            newErrors.delivery_Route = "Delivery Route cannot contain special characters (@#$%_!)";
        }

        // Validate End Time
        if (report.delivery_EndTime) {
            if (report.delivery_EndTime <= report.delivery_StartTime) {
                newErrors.delivery_EndTime = "End time must be later than the start time";
            } else {
                // Check if End Time is within 0 to 12 hours
                const [endHours, endMinutes] = report.delivery_EndTime.split(':').map(Number);
                if (endHours < 0 || endHours > 12 || endMinutes < 0 || endMinutes >= 60) {
                    newErrors.delivery_EndTime = "End time must be between 00:00 and 12:59";
                }
            }
        } else {
            newErrors.delivery_EndTime = "Delivery End Time is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitForm = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.post("/api/Report/add", report);
                toast.success(response.data.message || "Report added successfully", { position: "top-right" });
                navigate("/");
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to add the report", { position: "top-right" });
            }
        } else {
            toast.error("Please fill all the required fields correctly", { position: "top-right" });
        }
    };

    return (
        <div className='bg-cover min-h-screen bg-no-repeat' style={{ backgroundImage: `url(${BR1})` }}>
           
            <div className="addReport">
                
                <h3>Add Report</h3>
                <form className="addReportForm" onSubmit={submitForm}>
                    <div className="inputGroup">
                        <label htmlFor='driver_Name'>Driver Name</label>
                        <input
                            type="text"
                            name="driver_Name"
                            id="driver_Name"
                            value={report.driver_Name}
                            onChange={inputHandler}
                            autoComplete='off'
                            placeholder="Driver Name"
                            required
                        />
                        {errors.driver_Name && <p className="error">{errors.driver_Name}</p>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor='vehicel_No'>Vehicle No</label>
                        <input
                            type="text"
                            name="vehicel_No"
                            id="vehicel_No"
                            value={report.vehicel_No}
                            onChange={inputHandler}
                            autoComplete='off'
                            placeholder="Vehicle No"
                            maxLength={12}
                            required
                        />
                        {errors.vehicel_No && <p className="error">{errors.vehicel_No}</p>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="delivery_Route">Delivery Route</label>
                        <input
                            type="text"
                            name="delivery_Route"
                            id="delivery_Route"
                            value={report.delivery_Route}
                            onChange={inputHandler}
                            autoComplete='off'
                            placeholder="Delivery Route"
                            required
                        />
                        {errors.delivery_Route && <p className="error">{errors.delivery_Route}</p>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor='delivery_Date'>Delivery Date</label>
                        <input
                            type="date"
                            name="delivery_Date"
                            id="delivery_Date"
                            value={report.delivery_Date}
                            readOnly
                        />
                    </div>

                    <div className="inputGroup">
                        <label htmlFor='delivery_StartTime'>Start Time</label>
                        <input
                            type="time"
                            name="delivery_StartTime"
                            id="delivery_StartTime"
                            value={report.delivery_StartTime}
                            readOnly // Make the field read-only
                        />
                    </div>

                    <div className="inputGroup">
                        <label htmlFor='delivery_EndTime'>End Time</label>
                        <input
                            type="time"
                            name="delivery_EndTime"
                            value={report.delivery_EndTime}
                            id="delivery_EndTime"
                            onChange={inputHandler}
                            autoComplete='off'
                            placeholder="Delivery End Time"
                            required
                        />
                        {errors.delivery_EndTime && <p className="error">{errors.delivery_EndTime}</p>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="delivery_Status">Delivery Status</label>
                        <select
                            name="delivery_Status"
                            value={report.delivery_Status}
                            onChange={inputHandler}
                            id="delivery_Status"
                            autoComplete="off"
                            required
                        >
                            <option value="Pending">Pending</option>
                            <option value="Inprogress">Inprogress</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Failed">Failed</option>
                            <option value="Completed">Completed</option>
                        </select>
                        {errors.delivery_Status && <p className="error">{errors.delivery_Status}</p>}
                    </div>

                    <div className="inputGroup">
                        <center>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </center>
                    </div>
                </form>
            </div>
           
        </div>
    );
}

export default AddReport;
