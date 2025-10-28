const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc    Create a new order (Public - Customer)
// @route   POST /api/order
const createOrder = asyncHandler(async (req, res) => {
	const { customerName, customerAddress, items } = req.body;

	if (!customerName || !customerAddress || !items || !Array.isArray(items) || items.length === 0) {
		return res.status(400).json({ message: 'Invalid order data' });
	}

	// Calculate total server-side for security
	const totalAmount = items.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0);

	const order = new Order({
		customerName,
		customerAddress,
		items,
		totalAmount,
	});

	const created = await order.save();
	res.status(201).json(created);
});

// @desc    Get all orders (Owner only)
// @route   GET /api/order
const getOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({}).sort({ orderDate: -1 });
	res.json(orders);
});

// @desc    Get order by ID (Owner only)
// @route   GET /api/order/:id
const getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		res.json(order);
	} else {
		res.status(404).json({ message: 'Order not found' });
	}
});

// @desc    Update order status (Owner only)
// @route   PUT /api/order/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
	const { status } = req.body;
	const order = await Order.findById(req.params.id);

	if (!order) return res.status(404).json({ message: 'Order not found' });

	if (status && ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'].includes(status)) {
		order.status = status;
		const updated = await order.save();
		res.json(updated);
	} else {
		res.status(400).json({ message: 'Invalid status' });
	}
});

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
