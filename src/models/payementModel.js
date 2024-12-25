const mongoose = require('mongoose')



const paymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    paymentMethod: { 
      type: String, 
      enum: ['credit_card', 'paypal', 'stripe'], 
      required: true },
    paymentStatus: {
       type: String, enum:
        ['pending', 'completed', 'failed'],
         default: 'pending' 
        },
    transactionId: { type: String },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
  }, { timestamps: true });
  
module.exports = Payment = mongoose.model('Payment', paymentSchema);
  