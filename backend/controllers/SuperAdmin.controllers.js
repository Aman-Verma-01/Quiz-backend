import superAdmin from "../models/SuperAdminSchema.js";
import ResponseHandler from "../middlewares/error.middleware.js";
import student, { comparepassword } from  '../models/StudentSchema.js'
import { sendtoken } from "../utils/basicfxn.js";
import { sendOTPEmail } from '../utils/basicfxn.js'; 
import admin from "../models/AdminSchema.js";
import OTP from "../models/Otp.js";
import Profile from "../models/profileSchema.js";
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
}
 export const Register = async (req, res, next) => {
    const { name, email, password, confirmPassword,otp } = req.body;
    try {
        // Check if  superAdmin already exists
        
        if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}
        const existinguser = await  superAdmin.findOne({ email });
        if (existinguser) {
            return next(new ResponseHandler(" superAdmin already exists!", 400,false));
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
			});
		} 
        // Create a new  superAdmin (without saving to database yet)
        const newUser = new  superAdmin({
            name,
            email,
            password,
        });
       const result= await newUser.save(); 
      if(!result)
        return next(new ResponseHandler("there is some error in the input", 400,false));
      
        const profileDetails = await Profile.create({
			gender: null,
			dob: null,
            contactNumber: null,
            superAdmin:result._id
		});
        newUser.profileID=profileDetails._id; 
        await newUser.save(); 
        sendtoken( newUser,200,res," superAdmin registered Successfully !!!!!");
        return next(new ResponseHandler("superAdmin registered Successfully", 209,true));

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res,next) => {
    const email = req.body.email;
    const password = req.body.password;


    try {
        const  User =  await  superAdmin.findOne({email}); 
        
    if(!  User )
        return next(new ResponseHandler(" superAdmin Does nort Existt ", 400,false));
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
export const forgotpassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const response = await superAdmin.findOne({ email });

        if (!response) {
            return next(new ResponseHandler("superAdmin does not exist", 400));
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);

        if (otpBody) {
            return next(new ResponseHandler("OTP sent to your email for password reset.", 202, true));
        }

    } catch (error) {
        console.error("Error in forgot password:", error);
        // Use next() to pass the error to the error handling middleware
        return next(new ResponseHandler("Failed to process forgot password request.", 500));
    }
};
    export  const verifyOtpandResetPassword= async (req, res, next) => {
        const { email, otp, password } = req.body;
        try {
          
            // Find  superAdmin by email and OTP
            const User =await  superAdmin.findOne({ email });
    
            // If  superAdmin not found
            if (! User) {
                return next(new ResponseHandler(" superAdmin Does nort Existt ", 400,false));
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
            }
        catch (error) {
            
         res.status(500).json({ message: "Failed to verify OTP and reset password.",error });
        }
    }

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
            const { name, email, password ,confirmPassword} = req.body;
          
            try {
                // Check if  superAdmin already exists
                const existingsuperAdminn = await  superAdmin.findOne({ email:sauser.email });
                if (!existingsuperAdminn) {
                    return next(new ResponseHandler("You are not allowed to do this", 400));
                }
                if (password !== confirmPassword) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Password and Confirm Password do not match. Please try again.",
                    });
                }
             
                const newAdmin = new  admin({
                    name,
                    email,
                    password,
                });
                const result=  await newAdmin.save(); 
                if(!result){
                    res.status(200).json({ message: "Admin  not Registerd"});
                }

                const profileDetails = await Profile.create({
                    gender: null,
                    dob: null,
                    contactNumber: null,
                    admin:result._id
                });
                newAdmin.profileID=profileDetails._id; 
                await newAdmin.save(); 
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