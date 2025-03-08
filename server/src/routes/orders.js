const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Get a specific order by ID
router.get('/:id', orderController.getOrderById);

// Update an order by ID
router.put('/:id', orderController.updateOrder);

// Delete an order by ID
router.delete('/:id', orderController.deleteOrder);

// Get daily sales summary
router.get('/daily-summary', authMiddleware, orderController.getDailySummary);

// Get cashier orders by id
router.get('/cashier/:id', authMiddleware, orderController.getCashierOrders);

// Close register
router.post('/close-register', authMiddleware, orderController.closeCashRegister);

// Get customers by user
router.get('/customers-by-user', authMiddleware, orderController.getCustomersByUser);

module.exports = router;