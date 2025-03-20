const {addCartItem,updateCartItem, deleteCartItem,clearCart,getCartItems} = require('../controllers/CartController.js')
const verifyToken = require('../middlewares/verifyToken.js')
const express = require('express')
const router = express.Router()




router.post('/add', verifyToken, addCartItem)
router.put('/update/:productId', verifyToken, updateCartItem)
router.post('/delete/:productId', verifyToken, deleteCartItem)
router.post('/clear', verifyToken, clearCart)
router.get('/', verifyToken, getCartItems)



module.exports = router








