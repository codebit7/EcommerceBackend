
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel.js')


const registerUser =  async(req, res)=>{

       try{
         const {name, email, password ,phone ,role } = req.body
         console.log(req.headers);
         
         if([name,email,password, phone].some((item) => item ==="")){
              return res.status(400).json({message: "Please fill in all fields"})
         }

         const existingUser = await User.findOne({ email });
         if (existingUser) {
             return res.status(401).json({ message: 'User already exists' });
           }
         const hashedPassword = await bcrypt.hash(password, 10)

         const user = await User.create({
              name:name.toLowerCase(),
              email,
              password: hashedPassword,
              phone,
              role
         })

         
            res.status(200).json({
              msg:"user register successfully",
              user:user
         })
       }
       catch(error){
          console.log(error);
          res.status(500).json({msg: error})
       }
       
        
       
    
}
async function loginUser(req, res) {
   try {
       const { email, password } = req.body;
       console.log(req.body);
       
       
       if (!email || !password) {
           return res.status(400).json({ message: "Please fill in all fields" });
       }

       
       const user = await User.findOne({ email });
       if (!user) {
        return res.status(400).json({ message: "User not found" });
       }
        

       
       const isMatched = await bcrypt.compare(password, user.password);
       if (!isMatched) return res.status(401).json({ message: "Invalid credentials" });

       // Get user without password field
    //    const userWithoutPassword = await User.findById(user._id).select('-password');

       // Create JWT token
       const token = jwt.sign(
           { id: user._id, email: user.email ,role:user.role },
           process.env.SECRET_KEY || "wamiq",
           { expiresIn: "1d" }
       );

      
       res.status(200).json({
           message: "Login successful",
           user:{
            id: user._id,
            name: user.name,
            email: user.email ,
            role:user.role,
           },
           token: token,
       });

   } catch (error) {
       console.log("something went wrong");
       
       res.status(500).json({ error: error.message });
   }
}




async function getUsers(req,res){
       try {
        const users = await User.find();
          if(!users) return res.status(404).json({message:"Users not found"})
          res.status(200).json({users})
       } catch (error) {
          res.status(400).json({msg:error})
       }
       
}


module.exports ={
    loginUser,
    getUsers,
    registerUser
}
