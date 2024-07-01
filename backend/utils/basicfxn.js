import nodemailer from "nodemailer"; 
import { generateJwtToken } from "../models/StudentSchema.js";
export const sendtoken=async(user,statusCode,res,message)=>{
    const token=generateJwtToken(user);
      const options={
        expires:new Date(Date.now()+5*24*60*60*1000),
        httpOnly:true
      }
      res.status(200).cookie("token",token,options).json({
        success:true,
        user,
        message,
   token
      }); 
}




export const sendOTPEmail = async (email, otp,subject) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: 'smtp.gmail.com',
            port: 587, // or 465 for SSL
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL,
                pass: process.env.pass
            }
        });

        await transporter.sendMail({
            from: process.env.MAIL,
            to: email,
            subject: subject,
            text: `${subject}: ${otp}`
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email not sent!");
        console.error(error);
        throw error; // Re-throwing error to handle it at a higher level if needed
    }
};
