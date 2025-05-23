const express = require('express')
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken.js')
const { getCategory,
    getProductById,
    getProducts, 
    createProduct,
     updateProduct, 
     deleteProduct,
     getRecommededProducts,
     productDeals,
     createProducts
    } = require('../controllers/productControllers.js');


const verifyRole = require('../middlewares/verifyRole.js');
const uplaod = require('../middlewares/multer.js');




// Admin routes

// Create Products
router.route('/create').post(verifyRole(['admin']),uplaod.array('images',10),createProduct)
// router.route('/addAll').post(verifyToken,verifyRole(["admin"]),uplaod.array('images',10),createProducts)
// Update Products
router.route('/update/:id').put(verifyToken,verifyRole(['admin']),uplaod.array('images',10),updateProduct)
// Delete Products
router.route('/delete/:id').delete(uplaod.array('images',10), deleteProduct);





// customer routes
router.route('/products').get(getProducts);
router.route('/product/:id',).get( getProductById)

router.route('/recommendedProducts').get(verifyToken,getRecommededProducts);

router.route('/productDeals').get(productDeals);


module.exports = router
