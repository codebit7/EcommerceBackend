const express = require('express')
// const mongoose = require('mongoose')
const MongoDb = require('./DB/dbConnection.js')
require('dotenv').config();
// const {addCategory} = require('./controllers/addCategory.js')

const app = express()

const cors = require('cors');
app.use(cors());

app.use(express.json())

// import route from router folder
const userRouter =  require('./routes/userRoutes.js')
const productRouter = require('./routes/productRoutes.js')
const cartRouter  = require('./routes/cartRoutes.js')
const wishlistRouter = require('./routes/wishlistRoutes.js')
const categoryRouter  = require('./routes/CategoryRoutes.js')
const orderRouter = require('./routes/orderRoutes.js')
const paymentRouter = require('./routes/paymentRoutes.js')



app.use("/api/v1/users",userRouter)
app.use("/api/v1/",productRouter)
app.use('/api/v1/cart',cartRouter)
app.use('/api/v1/wishlist',wishlistRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/orders',orderRouter)
app.use('/api/v1/payments',paymentRouter)




MongoDb()
.then(()=>{
    const PORT = process.env.PORT || 3000
    app.listen(3000, ()=>{
        console.log(`Server is running on port ${3000}`)
    })
})
.catch((error)=>{
    console.log("Conction failed : ",error);
    
})




// ( async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`)
//         app.on("error",(error)=>{
//             console.log("error", error);
            
//         })
//     } catch (error) {
//         console.log("Error",error);
        
//     }
// })()

