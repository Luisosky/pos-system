const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    sparse: true // Optional
  },
  phone: {
    type: String,
    sparse: true
  },
  isFrequent: {
    type: Boolean,
    default: false
  },
  // Always update the last purchase date
  lastPurchase: {
    type: Date
  },
  // All purchases made by the customer
  purchaseCount: {
    type: Number,
    default: 0
  },
  // Sum of all purchases made by the customer (in cop)
  totalSpent: {
    type: Number,
    default: 0
  },
  // User/Cashier who registered the customer
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to update customer purchase stats
customerSchema.methods.updatePurchaseStats = function(orderAmount) {
  this.purchaseCount += 1;
  this.totalSpent += orderAmount;
  this.lastPurchase = new Date();
  
  // Update to frequent customer if purchase count is
  // greater than or equal to 3
  if (this.purchaseCount >= 3) {
    this.isFrequent = true;
  }
  
  return this.save();
};

module.exports = mongoose.model('Customer', customerSchema);