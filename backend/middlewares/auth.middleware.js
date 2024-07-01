import  jwt  from "jsonwebtoken";
import ResponseHandler from "./error.middleware.js";
import student from "../models/StudentSchema.js";
import admin from "../models/AdminSchema.js";
import superAdmin from "../models/SuperAdminSchema.js";
const authuser=async(req,res,next)=>{
   
   const {token}=req.cookies;
    if(!token)
        return next(new ResponseHandler("User Not Exist ", 400,false));

   const decoded=jwt.verify(token,process.env.JwtSecretKey); 
 const fetchUser= (await student.findById(decoded.id))||(await admin.findById(decoded.id))||(await superAdmin.findById(decoded.id)); 

 if(!fetchUser)
    return next(new ResponseHandler("User Not Exist ", 400,false));
 req.user=fetchUser; 
 //console.log(req.user); 
   next(); 
}
export default authuser; 