const Order = require('../models/Order'); // Assuming you have an Order model defined

// Controller for handling Order operations
const orderController = {
  // Create a new order
  createOrder: async (req, res) => {
    try {
      const { orderItems, status, shopName, orderDate, totalAmount } = req.body;
      
      // Create a new order
      const newOrder = new Order({
        orderItems,
        status,
        shopName,
        orderDate,
        totalAmount
      });

      // Save the order to the database
      const savedOrder = await newOrder.save();

      res.status(201).json(savedOrder);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create order', error });
    }
  },

  // Get all orders
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch orders', error });
    }
  },

  // Get order by ID
  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch order', error });
    }
  },

  // Update an existing order
  updateOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedOrderData = req.body;

      // Find the order by ID and update it
      const updatedOrder = await Order.findByIdAndUpdate(id, updatedOrderData, { new: true });

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update order', error });
    }
  },

  // Delete an order
  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;

      // Find the order by ID and delete it
      const deletedOrder = await Order.findByIdAndDelete(id);

      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete order', error });
    }
  },
};

