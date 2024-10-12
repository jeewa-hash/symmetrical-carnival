import React, { useEffect, useState } from 'react';
import './UpdateReport.css';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import DeliveryDetailsPopup from  "../deliveryDetailsPop/DeliveryDetailsPopup" // Import the popup component
import BR1 from '../image/design.png';

const UpdateReport = () => {
    const Report = {
        driver_Name: "",
        vehicel_No: "",
        delivery_Route: "",
        delivery_Date: new Date().toISOString().substr(0, 10),
        delivery_StartTime: "",
        delivery_EndTime: "",
        delivery_Status: "",
    };
    const [report, setReport] = useState(Report);
    const [errors, setErrors] = useState({});
    const [showPopup, setShowPopup] = useState(false); // State for controlling the popup visibility
    const navigate = useNavigate();
    const { id } = useParams();

    console.log("id: " , id )

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
    

    useEffect(() => {
        axios.get(`/api/Report/getreportbyid/${id}`)
            .then((response) => {
                setReport(response.data);
                console.log( "response data", response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5); // Returns "HH:MM"
    };

    const validateForm = () => {
        const newErrors = {};
        if (report.delivery_Date === new Date().toISOString().substr(0, 10) && report.delivery_StartTime < getCurrentTime()) {
            newErrors.delivery_StartTime = "Start time cannot be in the past";
        }
        if (report.delivery_StartTime && report.delivery_EndTime && report.delivery_EndTime <= report.delivery_StartTime) {
            newErrors.delivery_EndTime = "End time must be later than the start time";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const SubmitForm = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                const response = await axios.put(`/api/Report/update/${id}`, report);
                toast.success(response.data.message, { position: "top-right" });
                setShowPopup(true); // Show the pop-up on successful submission
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.error("Please fix the errors before submitting", { position: "top-right" });
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        navigate("/"); // Navigate to the home page after closing the popup
    };

    return (
        <div className='bg-cover min-h-screen bg-no-repeat' style={{backgroundImage: `url(${BR1})`}}>
            
        <div className="addReport">
            
            <h3>Update Report</h3>
            <form className="addReportForm" onSubmit={SubmitForm}>
                <div className="inputGroup">
                    <label htmlFor="driver_Name">Driver Name:</label>
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
                </div>

                <div className="inputGroup">
                    <label htmlFor="vehicel_No">Vehicle No:</label>
                    <input
                        type="text"
                        name="vehicel_No"
                        id="vehicel_No"
                        value={report.vehicel_No}
                        onChange={inputHandler}
                        autoComplete='off'
                        placeholder="Vehicle No"
                        required
                    />
                </div>

                <div className="inputGroup">
                    <label htmlFor="delivery_Route">Delivery Route:</label>
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
                </div>

                <div className="inputGroup">
                    <label htmlFor="delivery_Date">Delivery Date</label>
                    <input
                        type="date"
                        name="delivery_Date"
                        id="delivery_Date"
                        value={report.delivery_Date}
                        onChange={inputHandler}
                        autoComplete='off'
                        readOnly // Make the date field read-only
                    />
                </div>

                <div className="inputGroup">
                    <label htmlFor="delivery_StartTime">Start Time</label>
                    <input
                        type="time"
                        name="delivery_StartTime"
                        id="delivery_StartTime"
                        value={report.delivery_StartTime}
                        onChange={inputHandler}
                        autoComplete='off'
                        required
                    />
                    {errors.delivery_StartTime && <p className="error">{errors.delivery_StartTime}</p>}
                </div>

                <div className="inputGroup">
                    <label htmlFor="delivery_EndTime">End Time</label>
                    <input
                        type="time"
                        name="delivery_EndTime"
                        id="delivery_EndTime"
                        value={report.delivery_EndTime}
                        onChange={inputHandler}
                        autoComplete='off'
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
                        autoComplete='off'
                        id="delivery_Status"
                        required
                    >
                        <option value="Pending">Pending</option>
                        <option value="Inprogress">Inprogress</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Failed">Failed</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div className="inputGroup">
                    <center>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </center>
                </div>
            </form>

            {showPopup && <DeliveryDetailsPopup details={report} onClose={closePopup} />} {/* Show the popup */}
        </div>
       
    </div>
    );
};

export default UpdateReport;
