const Order = require('../../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get daily sales summary
exports.getDailySummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const orders = await Order.find({ 
      createdAt: { $gte: today }
    }).populate('customer', 'name isFrequent'); // Asumiendo que referencias a un modelo Customer
    
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;
    
    // Calculate frequent customer percentage - with cases where customer is anonymous
    let frequentCustomerPercentage = 0;
    
    if (orderCount > 0) {
      // Count orders from frequent customers
      const frequentCustomerOrders = orders.filter(order => 
        order.customer && order.customer.isFrequent
      ).length;
      
      // Calculate percentage
      frequentCustomerPercentage = (frequentCustomerOrders / orderCount) * 100;
    }
    
    // Get unique customers and count frequency
    const uniqueCustomers = new Set();
    const customerFrequency = {};
    
    orders.forEach(order => {
      const customerId = order.customer?._id || order.customerName || 'anonymous';
      uniqueCustomers.add(customerId);
      
      // Contar frecuencia de compra por cliente
      customerFrequency[customerId] = (customerFrequency[customerId] || 0) + 1;
    });
    
    // Clientes que compraron más de una vez hoy
    const repeatCustomers = Object.values(customerFrequency).filter(count => count > 1).length;
    
    res.status(200).json({
      totalSales,
      orderCount,
      uniqueCustomerCount: uniqueCustomers.size,
      repeatCustomers,
      frequentCustomerPercentage: Math.round(frequentCustomerPercentage)
    });
  } catch (error) {
    console.error('Error getting daily summary:', error);
    res.status(500).json({ message: 'Error getting daily summary', error: error.message });
  }
};

// Get customer statistics by cashier
exports.getCustomersByUser = async (req, res) => {
  try {
    // Get start and end date from query parameters
    const startDate = req.query.startDate 
      ? new Date(req.query.startDate) 
      : new Date();
    
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = req.query.endDate 
      ? new Date(req.query.endDate) 
      : new Date();
    
    if (!req.query.endDate) {
      endDate.setHours(23, 59, 59, 999);
    }
    
    // Get the orders within the date range
    const orders = await Order.find({
      createdAt: { 
        $gte: startDate,
        $lte: endDate
      }
    }).populate('user', 'username');
    
    // Inicialize stats object
    const userCustomerStats = {};
    
    // Process each order
    orders.forEach(order => {
      const userId = order.user?._id.toString();
      const username = order.user?.username || 'Unknown';
      
      // Create a stat for the user if it doesn't exist
      if (!userCustomerStats[userId]) {
        userCustomerStats[userId] = {
          userId,
          username,
          totalCustomers: 0,
          uniqueCustomers: new Set(),
          totalSales: 0,
          orderCount: 0
        };
      }
      
      
      userCustomerStats[userId].totalCustomers++;
      
      // Add customer to unique customers set
      const customerId = order.customer?._id?.toString() || 
                         order.customerName || 
                         'anonymous';
      userCustomerStats[userId].uniqueCustomers.add(customerId);
      
      // Sum total sales
      userCustomerStats[userId].totalSales += order.totalAmount || 0;
      
      // Count orders
      userCustomerStats[userId].orderCount++;
    });
    
    // Convert stats object to an array of results
    const result = Object.values(userCustomerStats).map(stat => ({
      userId: stat.userId,
      username: stat.username,
      totalCustomers: stat.totalCustomers,
      uniqueCustomers: stat.uniqueCustomers.size,
      averageTicket: stat.orderCount > 0 
        ? (stat.totalSales / stat.orderCount).toFixed(2) 
        : 0,
      totalSales: stat.totalSales,
      orderCount: stat.orderCount
    }));
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Error getting customer statistics by user:', error);
    res.status(500).json({ 
      message: 'Error getting customer statistics', 
      error: error.message 
    });
  }
};