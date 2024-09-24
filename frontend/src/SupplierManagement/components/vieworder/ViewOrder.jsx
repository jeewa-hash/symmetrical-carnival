import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import './ViewOrder.css';

const ViewOrder = ({ orderId, onClose }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('pending'); // Default status to 'pending'
    const [paymentValue, setPaymentValue] = useState(''); 
    const [paymentSuccessMessage, setPaymentSuccessMessage] = useState(''); 
    const [statusUpdated, setStatusUpdated] = useState(false); 

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
            if (!response.ok) {
                throw new Error('Order not found');
            }
            const data = await response.json();
            setOrder(data);
            setStatus(data.status); // Set status from fetched order
            setPaymentValue(data.paymentValue || ''); 
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch order details:', error);
            setLoading(false);
        }
    };

    const updateOrderStatus = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            const updatedOrder = await response.json();
            setOrder(updatedOrder.order); 
            setStatusUpdated(true); 
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    const markPaymentAsDone = async () => {
        if (!paymentValue || isNaN(paymentValue)) {
            alert('Please enter a valid payment value.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isPaymentDone: true, paymentValue: Number(paymentValue) }),
            });
            if (!response.ok) {
                throw new Error('Failed to update payment status');
            }
            const updatedOrder = await response.json();
            setOrder(updatedOrder.order); 
            setPaymentValue(updatedOrder.order.paymentValue); 
            setPaymentSuccessMessage('Payment has been marked as done successfully!');
            
            setTimeout(() => setPaymentSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Failed to mark payment as done:', error);
        }
    };

    const deleteOrder = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to delete order: ${errorMessage}`);
            }
            alert('Order deleted successfully');
            onClose();
        } catch (error) {
            console.error('Failed to delete order:', error);
        }
    };
    

    const renderProgressBar = () => {
        return (
            <div className="progress-bar-container">
                <div className="progress-bar">
                    <div className="progress-bar-fill" data-status={status.toLowerCase()}></div>
                </div>
                <div className="progress-labels">
                    <span>Pending</span>
                    <span>In Progress</span>
                    <span>Completed</span>
                </div>
            </div>
        );
    };

    const generateBill = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Order Invoice', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Bear Works Lanka', 20, 30);
        doc.text('Bill', 20, 36);
        doc.line(20, 48, 190, 48); 
        doc.setFontSize(14);
        doc.text(`Order ID: ${order._id}`, 20, 60);
        doc.text(`Supplier: ${order.supplierName}`, 20, 68);
        doc.text(`Status: ${order.status}`, 20, 76);
        doc.line(20, 90, 190, 90); 
        doc.setFontSize(12);
        doc.text('Items:', 20, 100);
        doc.autoTable({
            startY: 105,
            head: [['Item Name', 'Quantity', 'Description']],
            body: order.items.map(item => [
                item.itemName, 
                item.quantity, 
                item.description || 'N/A'
            ]),
            theme: 'grid',
            headStyles: { fillColor: [0, 123, 255] }, 
            columnStyles: {
                0: { cellWidth: 40 }, 
                1: { cellWidth: 20 },
                2: { cellWidth: 60 }
            },
            margin: { left: 20, right: 20 }
        });
        doc.setFontSize(14);
        doc.text('Payment Summary', 20, doc.lastAutoTable.finalY + 20); 
        doc.setFontSize(12);
        doc.text(`Total Payment: LKR ${order.paymentValue ? order.paymentValue.toFixed(2) : '0.00'}`, 20, doc.lastAutoTable.finalY + 30);
        doc.text(`Payment Status: ${order.isPaymentDone ? 'Completed' : 'Pending'}`, 20, doc.lastAutoTable.finalY + 38);
        doc.setFontSize(10);
        doc.text('Thank you for your business!', 105, doc.lastAutoTable.finalY + 50, { align: 'center' });
        doc.save(`Order_${order._id}_Invoice.pdf`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <div className="view-order-advanced">
            <h2 className="order-title">Order Details</h2>
            <button className="close-button" onClick={onClose}>Back to Order List</button>

            <div className="order-card">
                <div className="order-header">
                    <span className="order-id">Order ID: {order._id}</span>
                    <span className={`order-status ${order.status}`}>{order.status}</span>
                </div>
                <div className="order-body">
                    <p><strong>Supplier:</strong> {order.supplierName}</p>
                    <p><strong>Items:</strong> {order.items.map(item => item.itemName).join(", ")}</p>
                    <p><strong>Payment Status:</strong> {order.isPaymentDone ? "Completed" : "Pending"}</p>
                    <p><strong>Payment Amount:</strong> LKR {order.paymentValue ? order.paymentValue.toFixed(2) : '0.00'}</p>
                </div>

                {/* Render the progress bar */}
                {renderProgressBar()}

                <div className="status-update">
                    <label htmlFor="status">Update Status:</label>
                    <select
                        id="status"
                        className="status-dropdown"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={statusUpdated} 
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button
                        className="action-btn complete-btn"
                        onClick={updateOrderStatus}
                        disabled={statusUpdated} 
                    >
                        {statusUpdated ? "Status Updated" : "Update Status"}
                    </button>
                </div>

                {/* Success message for payment */}
                {paymentSuccessMessage && (
                    <div className="toast-success">
                        {paymentSuccessMessage}
                    </div>
                )}

                <div className="order-actions">
                    {/* Show the delete button if status is not 'in-progress' or 'completed' */}
                    {status !== 'in-progress' && status !== 'completed' && (
                        <button className="action-btn delete-btn" onClick={deleteOrder}>Delete Order</button>
                    )}

                    {status === 'completed' && !order.isPaymentDone && (
                        <div>
                            <input
                                type="number"
                                placeholder="Enter payment value"
                                value={paymentValue}
                                onChange={(e) => setPaymentValue(e.target.value)}
                                className="payment-input"
                            />
                            <button className="action-btn payment-btn" onClick={markPaymentAsDone}>Mark Payment as Done</button>
                        </div>
                    )}
                </div>

                {/* Bill Generation Button */}
                <button className="action-btn bill-btn" onClick={generateBill}>
                    Generate Bill
                </button>
            </div>
        </div>
    );
};

export default ViewOrder;
