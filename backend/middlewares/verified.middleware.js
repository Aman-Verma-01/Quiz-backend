import ResponseHandler from "./error.middleware.js";

 export const verified=async(req,res,next)=>{
    const User=req.user; 
    if(User.isverified==false)
    return next(new ResponseHandler("verify your mail first",404,false)); 
next(); 
 }