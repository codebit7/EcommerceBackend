const User = require('../models/userModel.js');
const Product = require('../models/productModel.js')

const addToWishlist = async(req,res)=>{
    try {
       const {item}  = req.body
       if(!item){
        return res.status(404).json({message:"item is required"});
       }
       
       const product = await Product.findById(item);
       if(!product){
        return res.status(404).json({message:"product not found"})
       }

       await User.findByIdAndUpdate(
        req.user.id,
        {$push:{wishlist:product._id}},
        {new:true}
       )
        
    
       res.status(200).json({wishlist: User.wishlist});
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }


}


const removeToWishlist = async(req,res)=>{
    try {
       const {item} = req.body;
       if(!item)
       {
        return res.status(404).json({message:"item is required"});
       }

       const product = await Product.findById(item);
       if(!product){
        return res.status(404).json({message:"product not found"})
       }

       await User.findByIdAndUpdate(
        req.user.id,
        {$pop:{wishlist:product._id}},
        {new:true}

       )

       res.status(200).json({message:"product is removed From wishlist"})
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }

}

const clearWishlist = async(req,res)=>{
    try {
         const {id} = req.user;
        const user =await User.findById(id)
    
        user.wishlist = [];
        await user.save();
        
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }

}

const getWishlist = async(req,res)=>{
    try {
        const {id} = req.user;
        const user =await User.findById(id)
        if(user.wishlist.length == 0)
        {
            return res.status(404).json({message:"Items not found in Wishlist"})
        }
        res.status(200).json(user.wishlist);
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }

}


module.exports = {
    addToWishlist,
    removeToWishlist,
    clearWishlist,
    getWishlist

}