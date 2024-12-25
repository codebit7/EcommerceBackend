const Payment = require('../models/payementModel.js')


const createPayment = async (req,res)=>{
    try {
        const { order, paymentMethod, amount } = req.body;
        if(!order ||!paymentMethod || !amount)
        {
            return res.status(400).json({ message: "Please fill all fields" });
        }
           


        const existingOrder = await Order.findById(order).populate('items.product');
    
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        
        const payment = await Payment.create({
            user:req.user.id,
            order:existingOrder._id,
            paymentMethod,
            amount:existingOrder.totalAmount,
            paymentStatus:'pending'

        })
       
        
        res.status(200).json(payment);

        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


const getAllPayments = async (req,res)=>{
    try {

       const payment = await Payment.find().populate('user order')
       if(!payment.length === 0){
        return res.status(404).json({ message: "No payment found" });
       }
       res.status(200).json(payment);

        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const getPaymentsById = async (req,res)=>{
    try {
        const  {id} = req.params
        const {userId , role} = req.user
        const payment = await Payment.findById(id).populate('user order')
        if(!payment)
        {
            return res.status(404).json({ message: "No payment found" });
        }
        if(role ==='admin' || payment.user.equals(userId))
        {
            return res.status(200).json(payment)
        }
        res.status(403).json({message:"You are not authorized"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const updatePaymentStatus = async (req,res)=>{
    try {
        const {id} = req.params
        const {status} = req.body
        if(!status) return res.status(400).json({message:"please fill the status"})
        const payment = await Payment.findByIdAndUpdate(id, 
                {
                   paymentStatus: status,
                }, 
                {new:true})
        if(!payment){
            return res.status(404).json({ message: "No payment found" });
        }
        res.status(200).json(payment)
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const deletePayment = async (req,res)=>{
    try {
        
        const {id} = req.params
        const payment = await Payment.findByIdAndDelete(id)
        if(!payment){
            return res.status(404).json({ message: "No payment found" });
        }
        res.status(200).json(payment)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}



module.exports = {
    createPayment,
    getAllPayments,
    getPaymentsById,
    updatePaymentStatus,
    deletePayment
}