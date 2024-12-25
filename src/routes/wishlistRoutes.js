const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/verifyToken.js')
const {addToWishlist,removeToWishlist, clearWishlist, getWishlist} = require('../controllers/wishlistController.js')



router.route('/')
.post(verifyToken,addToWishlist)
.get(verifyToken,getWishlist)
router.delete('/remove',verifyToken,removeToWishlist)
router.post('/clear',verifyToken,clearWishlist)



module.exports = router