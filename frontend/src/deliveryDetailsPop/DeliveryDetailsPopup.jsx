import React from 'react'
import './DeliveryDetailsPopup.css'
const DeliveryDetailsPopup = ( {details, onClose}) => {
  return (
    <div className="popup">
            <div className="popup-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h4>Delivery Details</h4>
                <p><strong>Driver Name:</strong> {details.driver_Name}</p>
                <p><strong>Vehicle No:</strong> {details.vehicel_No}</p>
                <p><strong>Delivery Route:</strong> {details.delivery_Route}</p>
                <p><strong>Delivery Date:</strong> {details.delivery_Date}</p>
                <p><strong>Start Time:</strong> {details.delivery_StartTime}</p>
                <p><strong>End Time:</strong> {details.delivery_EndTime}</p>
                <p><strong>Status:</strong> {details.delivery_Status}</p>
            </div>
        </div>
  )
}

export default DeliveryDetailsPopup
