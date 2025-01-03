const express = require('express')
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.js')
const { getCategory,getProductById,getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productControllers.js');
const verifyRole = require('../middlewares/verifyRole.js');
const uplaod = require('../middlewares/multer.js');




// Admin routes

// Create Products
router.route('/create').post(verifyToken,verifyRole(["admin"]),uplaod.array('images',10),createProduct)
// Update Products
router.route('/update/:id').put(verifyToken,verifyRole(['admin']),uplaod.array('images',10),updateProduct)
// Delete Products
router.route('/delete/:id').delete(verifyToken, verifyRole(['admin']),uplaod.array('images',10), deleteProduct);





// customer routes
router.route('/product').get(verifyToken, getProducts);
router.route('/product/:id',).get(verifyToken, getProductById)


module.exports = router
