
const Order = require('../models/orderModel.js')
const User = require('../models/userModel.js')

// Create a new order (Customer)

const createOrder = async(req,res)=>{
     try {
       const {id} =  req.user
       const {items,address, paymentStatus ='pending', totalAmount} = req.body

       if(!items || !address  || !totalAmount)
       {
        return res.status(400).json({message: 'Please fill all the fields'})
       }

       for (const item of items) {
         const product = await Product.findById(item.product); 
         if (!product) {
             return res.status(404).json({ message: `Product not found for ID: ${item.product}` });
         }
     }
      const order = await Order.create({
        user:id,
        items:items,
        shippingAddress:address,
        paymentStatus:paymentStatus,
        totalAmount:totalAmount
       })
       
    //    const user = await User.findById(id);
    //    user.orderHistory.push(order._id);


        await User.findByIdAndUpdate(id,
        { $push: { orderHistory: order._id } },
         {new: true})
       res.status(201).json(order)
       
     } catch (error) {
        res.status(500).json({message:error.message});
     }
}


//Get all orders (Admin)

const getAllOrders = async(req,res)=>{
    try {
      const orders = await Order.find().populate('items.product')
      if(!orders|| orders.length === 0){
        return res.status(404).json({message: 'No orders found'})
      }
      res.status(200).json(orders)
    } catch (error) {
       res.status(500).json({message:error.message});
    }
}

// Get details of a specific order by ID (Customer, Admin)
const getAOrder =async (req,res)=>{
    try {
    //    const {id} = req.user
       const orderId = req.params.id
       const order =await Order.findById(orderId).populate('items.product')
       if(!order){
        return res.status(404).json({message: 'Order not found'})
       }
       res.status(200).json(order)
    } catch (error) {
       res.status(500).json({message:error.message});
    }
}


// Get all orders of a specific user (Customer for their own orders, Admin for any user)
const getAllOrdersOfUser = async(req,res)=>{
    try {
       const {id, role} = req.user
       const userId = req.params.userId

       const order= await Order.find({user:userId}).populate('items.product')
       if(order.user.equals(id) || role ==='admin'){
        res.status(200).json(order)
       }
       else{
        return res.status(403).json({message: 'You are not authorized to view this order'})
       }
    } catch (error) {
       res.status(500).json({message:error.message});
    }
}

//Update a specific order (Admin)
const updateAOrder = async(req,res)=>{
    try {
       const orderId  = req.params.orderId
      
       const order = await Order.findByIdAndUpdate(orderId, req.body, {new: true})
       if(!order) return res.status(404).json({message:"Orders not found"});
       res.status(200).json(order);

    } catch (error) {
       res.status(500).json({message:error.message});
    }
}

//Update the status of an order (Admin)
const updateStatus =async (req,res)=>{
    try {
       const orderId  = req.params.orderId
       const {status} = req.body
       if(!status) return res.status(400).json({message:"please fill the fields"})
      const order = await Order.findByIdAndUpdate(orderId, {
        $set :{orderStatus: status}
       },
       {
        new:true
       }
    )
    if(!order) return res.status(404).json({message:"order not found"})
    res.status(200).json(order);


    } catch (error) {
       res.status(500).json({message:error.message});
    }
}


//Delete a specific order (Admin)

const deleteAOrder = async(req,res)=>{
    try {
      const order = await Order.findByIdAndDelete(req.params.orderId)
      if(!order) return res.status(404).json({message:"orders not found"})


    // orderId will be delete in orderHistory array in User
     const user =  await User.findById(order.user);
     user.orderHistory.pop(order._id)
     user.save();


      res.status(200).json({message:"order is successfully deleted"})
    } catch (error) {
       res.status(500).json({message:error.message});
    }
}




//Cancel an order (Customer)
const CancelOrder = async(req,res)=>{
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if(order.orderStatus ==='processing')
        {
            order.orderStatus = 'cancelled'
            const updatedOrder = await order.save()
            res.status(200).json(updatedOrder)
        }
        else{
            res.status(400).json({message:"Cannot cancel an order that has already been shipped or delivered"})
        }
    } catch (error) {
       res.status(500).json({message:error.message});
    }
}

module.exports ={
    createOrder,
    getAllOrders,
    getAOrder,
    getAllOrdersOfUser,
    updateAOrder,
    updateStatus,
    deleteAOrder,
    CancelOrder
}