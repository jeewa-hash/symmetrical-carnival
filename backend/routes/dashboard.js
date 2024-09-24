const express = require('express');
const router = express.Router();
const Order = require('../models/Order');


router.get('/dashboard-summary', async (req, res) => {
    try {
       
        const completedOrders = await Order.countDocuments({ status: 'Completed' });

        
        const pendingOrders = await Order.countDocuments({ status: { $ne: 'Completed' } });

        
        const totalPaymentsData = await Order.aggregate([
            { $match: { isPaymentDone: true } },
            { $group: { _id: null, totalPayments: { $sum: '$paymentValue' } } }
        ]);
        const totalPayments = totalPaymentsData.length > 0 ? totalPaymentsData[0].totalPayments : 0;

       
        const completedPayments = await Order.countDocuments({ isPaymentDone: true });

        // Count due payments (where payment is not done)
        const duePayments = await Order.countDocuments({ isPaymentDone: false });

        // Send the summary data as a JSON response
        res.status(200).json({
            completedOrders,
            pendingOrders,
            totalPayments,
            completedPayments,
            duePayments
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard summary', error });
    }
});

module.exports = router;
