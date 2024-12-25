const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    // parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Nested categories
  }, { timestamps: true });
  
  module.exports = Category = mongoose.model('Category', categorySchema);
  