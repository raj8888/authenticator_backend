const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    profilePic:{type:String,default:"NA"},
    name:{type:String,default:"NA"},
    bio:{type:String,default:"NA"},
    phone:{type:Number,default:0000000000},
    email:String,
    password:String
})

const userModel=mongoose.model("users",userSchema)
module.exports={
    userModel
}