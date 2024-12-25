const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      priceAtTimeOfOrder: { type: Number, required: true },
    }],


    shippingAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },

    
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
  }, { timestamps: true });
  
  module.exports =  Order = mongoose.model('Order', orderSchema);
  