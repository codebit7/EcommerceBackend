const User  = require("../models/userModel")
 function  verifyRole(roles){
    return async (req,res,next)=>{
        
        const user =await User.findById(req.user.id)
        if(!user) return res.status(404).send({message:"User not found"})
        if(!roles.includes(user.role)){
           return res.status(400).json({message:`Your  is not Autherizod to ${roles}`})
        }
        next();
    }
}

module.exports = verifyRole;