const Order = require('../models/orderModel.js')
const verifyRole = require('./verifyRole')


const isOrderOwnerOrAdmin = async(req,res,next)=>{
        try {
            const { id, role } = req.user; 
            const order = await Order.findById(req.params.orderId)

            if(!order){
                return res.status(404).json({message:"Order not found"})
            }


            if(id  && (order.user.equals(id)  || role ==='admin'))
            {
                next()
            }
            else{
                return res.status(403).json({message:"You are not authorized to access this order"})
            }
        } catch (error) {
            res.status(500).json({message: error.message})
        }
}

module.exports = isOrderOwnerOrAdmin
