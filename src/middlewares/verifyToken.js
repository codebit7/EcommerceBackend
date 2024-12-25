const jwt = require('jsonwebtoken')

const verifyToken = (req,res, next)=>{

    const token = req.header('Authorization')?.replace('Bearer ','')

    if(!token) return res.status(400).json({message:"Token is not provided"})
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'wamiq')
        
        
        req.user = decoded
        next()
        
    } catch (error) {
        res.status(400).json({error:"Invalid Token"})
    }
}

module.exports = verifyToken