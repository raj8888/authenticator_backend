let jwt=require("jsonwebtoken")
require("dotenv").config()

const authenticate=(req,res,next)=>{
    let token=req.headers.authorization?.split(" ")[1]
    if(!token){
        res.status(401).send({"Message":"Please login again"})
    }else{
        var decoded = jwt.verify(token, process.env.seckey);
        if(decoded){
            let userID=decoded.userID
            req.body.userID=userID
            req.body.pass=decoded.userPass
            next()
        }else if(!decoded){
            res.status(401).send({"Message":"Please login again"})
        }else{
            res.status(401).send({"Message":"Please login again"})
        }
    }

}

module.exports={
    authenticate
}