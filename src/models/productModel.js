const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String },
    condition:{type: String , default: "Any"},
    stock: { type: Number, required: true },
    images: [{
      url:String,
       imageId:String
      }], 
    ratings: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true },
      comment: { type: String }
    }],
    averageRating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  }, { timestamps: true });
  
  module.exports = Product = mongoose.model('Product', productSchema);
  