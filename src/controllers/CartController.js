const Cart = require('../models/cartModel.js')
const Product = require('../models/productModel.js')



function calculateTotal(items){
    let total = 0;
    items.forEach(item => {
        if (item.product && item.product.price) {
            total += Number(item.product.price) * item.quantity;
        }
    })
    return total
}


const addCartItem = async(req,res)=>{
    try {

        const {id} = req.user
        const {productId,quantity} = req.body

        let cart = await Cart.findOne({user:id}).populate('items.product')

        const product = await Product.findById(productId)
        if(!product) return res.status(404).json({message:"Product not found"});

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }
        if(!cart){
           cart = new Cart({
            user:id,
            items:[{product:productId, quantity:quantity}],
            total: Number(product.price)*quantity
           });
         
 

           //update the cart in User model if  cart not create
        await  User.findByIdAndUpdate(id,
            {$set:{cart:cart._id}},
            {new: true}
        );
        
         
        }
        else{
            const  itemIndex =  cart.items.findIndex((item) => item.product.toString == productId)
            if(itemIndex > -1)
            {
               cart.items[itemIndex].quantity = quantity
            }
            else{
               cart.items.push({product:productId, quantity:quantity})
            }


           cart.total = calculateTotal(cart.items);
        }



        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


const deleteCartItem = async(req,res)=>{
    try {
        const {id} = req.user
        const {productId} = req.params


        const cart = await Cart.findOne({user:id}).populate('items.product')
        
        
        if(!cart){
           return res.status(404).json({message:"Cart not found"});
        }
        
        await User.findByIdAndUpdate(id, 
            { $unset: { cart: "" } }, 
            { new: true }
        );
        
        const itemIndex =  cart.items.findIndex((item) =>item.product._id.toString() === productId)
        
        if(itemIndex > -1)
        {
            cart.items.splice(itemIndex,1)
            cart.total = calculateTotal(cart.items);
        }
        else{
            return res.status(404).json({message:"Item not found in cart"})
        }

       
        const updated =await cart.save();
        res.status(200).json(updated);
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    
}
const updateCartItem = async (req, res) => {
    try {
      const { id } = req.user; 
      const  {productId} =req.params
      const {quantity } = req.body; 
    

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
  
      
      const updatedCart = await Cart.findOneAndUpdate(
        { user: id, "items.product": productId}, 
        { 
          $set: { "items.$.quantity": quantity } 
        },
        { new: true, runValidators: true } 
      ).populate('items.product');
  
      
      if (!updatedCart) {
        return res.status(404).json({ message: "Cart or item not found" });
      }
  
      
      updatedCart.total = calculateTotal(updatedCart.items);
  
      
      await updatedCart.save();
  
      
      res.status(200).json(updatedCart);
  
    } catch (error) {
      
      res.status(500).json({ message: error.message });
    }
  };
  
const clearCart = async(req,res)=>{
    try {
        const {id} = req.user
        const cart = await Cart.findOne({user:id})
        if(!cart){
            return res.status(404).json({message:"Cart not found"});
        }
        
        cart.items = []
        cart.total = 0;
        const updated = await cart.save();
        res.status(200).json(updated);

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const getCartItems = async(req,res)=>{
    try {
        const {id} = req.user
        const cart = await Cart.findOne({user:id}).populate('items.product')

        if(!cart)
        {
            return res.status(404).json({message:"Cart not found"});
        }
        res.status(200).json(cart);
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}





module.exports={
          addCartItem,
          deleteCartItem,
          updateCartItem,
          clearCart,
          getCartItems
}