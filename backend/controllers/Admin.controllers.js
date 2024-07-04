import Admin from "../models/SuperAdminSchema.js";
import ResponseHandler from "../middlewares/error.middleware.js";
import student, { comparepassword } from  '../models/StudentSchema.js'
import { sendtoken } from "../utils/basicfxn.js";
import { sendOTPEmail } from '../utils/basicfxn.js'; 
import OTP from "../models/Otp.js";
import admin from "../models/AdminSchema.js";
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
}





export const login = async (req, res,next) => {
    const email = req.body.email;
    const password = req.body.password;


    try {
        const  User =  await   admin.findOne({email}); 
        
    if(!  User )
        return next(new ResponseHandler("  Admin Does nort Existt ", 400,false));
    const decode=await comparepassword( User,password);  
    if (!decode)
        return next(new ResponseHandler("Incorrect Password !!! ", 400));

    sendtoken( User,200,res,"Admin LOgged Inn Successfully !!!!!");
    } catch (error) {  
        return next(new ResponseHandler(error, 400,false));
    }
    

}
export const logout=async(req,res,next)=>{
    try {
        res
        .status(201).
        cookie("token","",{
            httpOnly:true,
            expires:new Date(Date.now()) })
        .json({
            message:"  Admin Logged Out Successfully"
        })
    } catch (error) {
        return next(new ResponseHandler(error, 400));
    }
  
}  
      export const getUser=async(req,res,next)=>{
        const  fetchUser=req.user; 
        res.status(200).send(User); 
      }
      export const forgotpassword=async(req,res,next)=>{ 
        const {  email } = req.body;
                try {
                    const response=await   admin.findOne({email}); 
                    if(!response)
                    return next(new ResponseHandler("  Admin Does nort Existt ", 400));
                    var otp = Math.floor(100000 + Math.random() * 900000); 
		            const otpPayload = { email, otp };
		            const otpBody = await OTP.create(otpPayload);
                     if(otpBody)
                      return next(new ResponseHandler(" OTP sent to your email for password reset.", 202,true));

                    } catch (error) {
                        console.error("Error in forgot password:", error);
                        return next(new ResponseHandler("Failed to process forgot password request.", 500));
                    }
  
         
      }


    export  const verifyOtpandResetPassword= async (req, res, next) => {
        const { email, otp, password } = req.body;
        try {
            // Find   Admin by email and OTP
            const User =await   admin.findOne({ email });
    
            // If   Admin not found
            if (! User) {
                return next(new ResponseHandler("  Admin Does nort Existt ", 400,false));
            }
    
          const response= await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
            if (response.length === 0) {
                // OTP not found for the email
                return res.status(400).json({
                    success: false,
                    message: "The OTP is not valid",
                });
            } else if (otp !== response[0].otp) {
                // Invalid OTP
                return res.status(400).json({
                    success: false,
                    message: "The OTP is not valid",
                });} 
            // Update password
           User.password = password; // Assuming newPassword is already hashed
            await User.save();
    
            res.status(200).json({ message: "Password reset successful." });
    
        } catch (error) {
            res.status(500).json({ message: "Failed to verify OTP and reset password." });
        }}


        export const changePasswrd=async(req,res,next)=>{
            const {email}=req.user; 
            const {password,newpassword}=req.body; 
        try {
            const User = await   admin.findOne({ email });
    
            // If   Admin not found
            if (! User) {
                return res.status(404).json({ message: "  Admin not found" });
            }
            const decode=await comparepassword( User , password);  
            if (!decode)
                return next(new ResponseHandler("Incorrect Password !!! ", 400));
            else{
               User.password=newpassword; 
                await User.save(); 
                return next(new ResponseHandler("password set successfully ", 200,true));
            }
        } catch (error) {
            return next(new ResponseHandler("There is Some Error in chnging passwrd",error)); 
        }
        }
       
