const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{type:String, required : true},
    email:{type:String, required : true, unique : true},
    password:{type:String, required : true},
    role:{type:String, enum:['admin','customer'], default : 'customer'},
    phone:{type:String},
    addresses:[
        {
            street:String,
            city:String,
            state:String,
            postalCode:String,
            country:String,
            isDefault:{type:Boolean,default:false}
        }
    ],

    orderHistory:[{type:mongoose.Schema.Types.ObjectId, ref:'Order'}],
    cart:{type:mongoose.Schema.Types.ObjectId, ref:'Cart'},
    wishlist:[{type:mongoose.Schema.Types.ObjectId, ref:'Product'}],
}, {timestamps:true})


module.exports = User = mongoose.model('User',userSchema)