const express=require('express')
const bcrypt=require("bcrypt")
var jwt = require('jsonwebtoken');
const{userModel}=require("../models/user.model")
const{authenticate}=require("../middleware/authenticate.middleware")

const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    try {
        let {email,password}=req.body
        let findEmail=await userModel.findOne({email})
        if(findEmail){
            res.status(401).send({"Message":"Already registered"})
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                if(err){
                    console.log(err)
                    res.status(401).send({"Message":"Server Error"})
                }else{
                    let user=new userModel({email,password:hash})
                    await user.save()
                    res.status(200).send({"Message":"User Registered"})
                }
            });
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

userRouter.post("/login",async(req,res)=>{
    try {
        let {email,password}=req.body
        let findEmail=await userModel.findOne({email})
        if(!findEmail){
            res.status(201).send({"Message":"Register First"})
        }else{
            let hashpass=findEmail.password
            bcrypt.compare(password, hashpass, function(err, result) {
                if(err){
                    console.log(err)
                    res.status(401).send({"Message":"Please login again"})
                }else if(result){
                    let token=jwt.sign({userID:findEmail._id,userPass:password},process.env.seckey)
                    res.status(200).send({"Message":"Login Successfull","token":token})
                }else{
                    res.status(401).send({"Message":"Please login again"})
                }
            });
        }
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})

userRouter.use(authenticate)

userRouter.get("/info",async(req,res)=>{
    let id=req.body.userID
    let user=await userModel.findById({_id:id})
    let pass=req.body.pass
    user.password=pass
    res.status(200).send({"Message":"User Data","data":user})
})

userRouter.patch("/update",async(req,res)=>{
    try {
      let id=req.body.userID
      let pass=req.body.pass
      let user=await userModel.findById({_id:id})
      let {email,password,phone,name,bio,profilePic}=req.body
      let payload=req.body
      let findEmail=await userModel.findOne({email})
      if(email && findEmail.email!==user.email && findEmail){
        res.status(401).send({"Message":"Please enter valid emailID"})
      }else{
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                console.log(err)
                res.status(401).send({"Message":"Server Error"})
            }else{
                payload.password=hash
                if(!user){
                    res.status(401).send({"Message":"Please Login Again"})
                  }else{
                    await userModel.findByIdAndUpdate({_id:id},payload)
                    let token=jwt.sign({userID:id,userPass:password},process.env.seckey)
                    res.status(200).send({"Message":"Data Updated","token":token})
                  }
            }
        });
          
      }
      
     
    } catch (error) {
        console.log(error.message)
        res.status(401).send({"Message":"Server Error"})
    }
})


module.exports={
    userRouter
}