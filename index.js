const express=require("express")
const cors=require("cors")
const{connection}=require("./config/db")
const{userRouter}=require('./routes/user.route')
require("dotenv").config()

let app=express()

app.use(express.json())
app.use(cors())
app.use("/users",userRouter)

app.get("/",(req,res)=>{
    res.send("HOME PAGE")
})

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log(error)
    }
    console.log(`Server is running on port ${process.env.port}`)
})