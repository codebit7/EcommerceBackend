const express = require('express')
const router = express.Router()
const verifyToken  =require('../middlewares/verifyToken.js')
const verifyRole = require('../middlewares/verifyRole.js')
const isOrderOwnerOrAdmin = require('../middlewares/isOrderOwnerOrAdmin.js')


const{
      createOrder, // Customer
      getAllOrders,   // Admin
      updateAOrder,   //Admin
      getAOrder,      // Customer,Admin
      getAllOrdersOfUser,  // CustomerForOwn , Admin for any user
      updateStatus,   //Admin
      deleteAOrder,    //Admin
      CancelOrder,     //Customer
    } =require('../controllers/orderControllers.js')


router.route('/').post(verifyToken,createOrder)
.get(verifyToken,verifyRole(['admin']),getAllOrders)



router.get('/:orderId', verifyToken,isOrderOwnerOrAdmin,getAOrder)
router.get('/user/:userId',verifyToken,getAllOrdersOfUser)
router.put('/:orderId',verifyToken,verifyRole(['admin']),updateAOrder)
router.patch('/:orderId/status',verifyToken,verifyRole(['admin']),updateStatus)
router.delete('/:orderId',verifyToken,verifyRole(['admin']),deleteAOrder)
router.post('/:orderId/cancel',verifyToken,isOrderOwnerOrAdmin,CancelOrder)


module.exports = router
