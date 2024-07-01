import superAdmin from "../models/SuperAdminSchema.js";
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
        // Check if  superAdmin already exists
        const existinguser = await  superAdmin.findOne({ email });
        if (existinguser) {
            return next(new ResponseHandler(" superAdmin already exists!", 400,false));
        }
        const otp = generateOTP(); // Implement generateOTP function to generate OTP

        
       
        // Create a new  superAdmin (without saving to database yet)
        const newUser = new  superAdmin({
            name,
            email,
            password,
            otp,
            isverified:false// Mark  superAdmin as not verified initially
        });
       const response= await newUser.save(); 
      if(response){
        sendtoken( newUser,200,res," superAdmin registered Successfully !!!!!");
        await sendOTPEmail(email, otp,"OTP FOR VERIFICATION");
       
        return next(new ResponseHandler("OTP sent for verification", 209,true));
      }
    else{
        return next(new ResponseHandler("there is some error in the input", 400,false));
    }
       

    } catch (error) {
        next(error);
    }
};

// Function to verify OTP and save  superAdmin if verified successfully
export const VerifyOTPAndSaveUser = async (req, res, next) => {
    const { otp } = req.body;
    const {  email } = req.body;
     
    try {
        // Verify OTP
        const response= await  superAdmin.findOne({email}); 
        if (otp !=response.otp ) {
            return next(new ResponseHandler("Invalid OTP", 400,false));
        }

      else{
        response.isverified=true; 
       const result= await response.save(); 
        // Respond with success message and status
        return next(new ResponseHandler("superAdmin registered and verified successfully", 200,true,result));
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
        const  User =  await  superAdmin.findOne({email}); 
        
    if(!  User )
        return next(new ResponseHandler(" superAdmin Does nort Existt ", 400,false));
    if(User.isverified==false)
    return next(new ResponseHandler("Please verify your Email", 400,false));
    const decode=await comparepassword( User,password);  
    if (!decode)
        return next(new ResponseHandler("Incorrect Password !!! ", 400));

    sendtoken( User,200,res," superAdmin LOgged Inn Successfully !!!!!");
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
            message:" superAdmin Logged Out Successfully"
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
                    const response=await  superAdmin.findOne({email}); 
                    if(!response)
                    return next(new ResponseHandler(" superAdmin Does nort Existt ", 400));
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
            // Find  superAdmin by email and OTP
            const User =await  superAdmin.findOne({ email });
    
            // If  superAdmin not found
            if (! User) {
                return next(new ResponseHandler(" superAdmin Does nort Existt ", 400,false));
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
            const User = await  superAdmin.findOne({ email });
    
            // If  superAdmin not found
            if (! User) {
                return res.status(402).json({ message: " superAdmin not found" });
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
        export const RegisterAdmin = async (req, res, next) => {
            const sauser=req.user;
            const { name, email, password } = req.body;
          
            try {
                // Check if  superAdmin already exists
                const existingsuperAdminn = await  superAdmin.findOne({ email:sauser.email });
                if (!existingsuperAdminn) {
                    return next(new ResponseHandler("You are not allowed to do this", 400));
                }
        
              const  isverified=true;
                // Create a new  superAdmin (without saving to database yet)
                const newAdmin = new  admin({
                    name,
                    email,
                    password,
                    otp:0,
                    isverified// Mark  superAdmin as not verified initially
                });
                const result=  await newAdmin.save(); 
                if(result)
                sendOTPEmail(email,password,"chnage Your PASSWORD"); 
                existingsuperAdminn.adminCreated.push(result._id); 
                await existingsuperAdminn.save(); 
                // Respond with success message and status
                res.status(200).json({ message: "Admin Registerd",email:email});
        
            } catch (error) {
                next(error);
            }
        };

export const getAllAdmins = async (req, res,next) => {
     const {email}=req.user;
     try {
      const superAdmins = await  superAdmin.findOne({email}); // Find all  Admins
    if(!superAdmins)
    return next(new ResponseHandler("You are not allowed to do this", 400));
       const admins=await admin.find({}); 
       res.json({"list of all admins": admins}); 
     //  return next(new ResponseHandler("List of all admins", 200,admins))
    } catch (error) {
        return next(new ResponseHandler("Failed to fetch admins", 400,error));
    }
  };
  export const getAllStudent= async (req, res) => {
    const {email}=req.user;
      const stu=await student.find({email}); 
      if(stu)
    return next(new ResponseHandler("tou are not allowed to do thiss...", 400,false));
    try {
      const  Students= await  student.find({}); // Find all  students
  
      return res.json({ success: true,  Students});
    } catch (error) {
      
        return next(new ResponseHandler("Failed to fetch students", 400,error));
    }
  };