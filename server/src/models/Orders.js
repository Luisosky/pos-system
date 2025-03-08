const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Reference of the cashier
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Reference to the customer
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  // Default customer name if not registered
  customerName: {
    type: String,
    default: 'Anónimo'
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'transferencia'],
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'canceled'],
    default: 'completed'
  }
});

module.exports = mongoose.model('Order', orderSchema);