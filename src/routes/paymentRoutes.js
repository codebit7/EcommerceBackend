const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/verifyToken.js')
const verifyRole = require('../middlewares/verifyRole.js')


const {createPayment,
     getAllPayments,
     getPaymentsById,
     updatePaymentStatus,
     deletePayment,
    } = require('../controllers/paymentController.js')



router.route('/').post(verifyToken,createPayment)
.get(verifyToken,verifyRole(['admin']),getAllPayments)


router.get('/:id',verifyToken,getPaymentsById)
router.patch('/:id/status',verifyToken,verifyRole(['admin']),updatePaymentStatus)
router.delete('/:id',verifyToken,verifyRole(['admin']),deletePayment)





module.exports = router