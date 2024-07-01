import Admin from "../models/SuperAdminSchema.js";
import ResponseHandler from "../middlewares/error.middleware.js";
import student, { comparepassword } from  '../models/StudentSchema.js'
import { sendtoken } from "../utils/basicfxn.js";
import { sendOTPEmail } from '../utils/basicfxn.js'; 
import admin from "../models/AdminSchema.js";
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
}
 export const Register = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        // Check if   student already exists
        const existinguser = await   student.findOne({ email });
        if (existinguser) {
            return next(new ResponseHandler("  student already exists!", 400,false));
        }
        const otp = generateOTP(); // Implement generateOTP function to generate OTP

        
       
        // Create a new   student (without saving to database yet)
        const newUser = new   student({
            name,
            email,
            password,
            otp,
            isverified:false// Mark   student as not verified initially
        });
       const response= await  newUser.save(); 
      if(response){
        await sendOTPEmail(email, otp,"OTP FOR VERIFICATION");
        sendtoken( newUser,200,res," superAdmin LOgged Inn Successfully !!!!!");
        return next(new ResponseHandler("OTP sent for verification", 200,true));
      }
    else{
        return next(new ResponseHandler("there is some error in the input", 400,false));
    }
       

    } catch (error) {
        next(error);
    }
};

// Function to verify OTP and save   student if verified successfully
export const VerifyOTPAndSaveUser = async (req, res, next) => {
    const { otp } = req.body;
    const {  email } = req.body;
     
    try {
        // Verify OTP
        const response= await   student.findOne({email}); 
        if (otp !=response.otp ) {
            return next(new ResponseHandler("Invalid OTP", 400,false));
        }

      else{
        response.isverified=true; 
       const result= await response.save(); 
        // Respond with success message and status
        return next(new ResponseHandler(" student registered and verified successfully", 200,true,result));
      }      
    } catch (error) {
        next(error);
    }
};

// Example OTP generation function (synchronous for simplicity)





export const login = async (req, res,next) => {
    const email = req.body.email;
    const password = req.body.password;


    try {
        const  User =  await   student.findOne({email}); 
        
    if(!  User )
        return next(new ResponseHandler("  student Does nort Existt ", 400,false));
    if(User.isverified==false)
    return next(new ResponseHandler("Please verify your Email", 400,false));
    const decode=await comparepassword( User,password);  
    if (!decode)
        return next(new ResponseHandler("Incorrect Password !!! ", 400));

    sendtoken( User,200,res,"  student LOgged Inn Successfully !!!!!");
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
            message:"  student Logged Out Successfully"
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
                    const response=await   student.findOne({email}); 
                    if(!response)
                    return next(new ResponseHandler("  student Does nort Existt ", 400));
                      const otp=generateOTP(); 
                      response.otp=otp; 
                     const result= await response.save(); 
                     if(result)
                      sendOTPEmail(email,otp,"OTP FOR VERIFICATION"); 
                      return next(new ResponseHandler(" OTP sent to your email for password reset.", 202,true));

                    } catch (error) {
                        console.error("Error in forgot password:", error);
                        res.status(500).json({ message: "Failed to process forgot password request." });
                    }
  
         
      }

    export  const verifyOtpandResetPassword= async (req, res, next) => {
        const { email, otp, password } = req.body;
        try {
            // Find   student by email and OTP
            const User =await   student.findOne({ email });
    
            // If   student not found
            if (! User) {
                return next(new ResponseHandler("  student Does nort Existt ", 400,false));
            }
    
            // Verify OTP
            if (otp !==User.otp) {
                return next(new ResponseHandler("Invalid Otp ", 400,false));
            }
    
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
            const User = await   student.findOne({ email });
    
            // If   student not found
            if (! User) {
                return res.status(404).json({ message: "  student not found" });
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
      

