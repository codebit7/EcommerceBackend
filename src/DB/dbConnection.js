const mongoose = require('mongoose')


const connectDb = async()=>{
    try {
        const con = await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`)
        console.log("\n MongoDb Connected !!! DB HOST:",con.connection.host);
        
    } catch (error) {
        console.log("MongoDB  connection error", error);
        process.exit(1)
        
    }
}


module.exports =  connectDb