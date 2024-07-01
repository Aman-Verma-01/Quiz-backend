import express from 'express';
import {Register,login, logout,getuser, VerifyOTPAndSaveUser, forgotpassword, verifyOtpandResetPassword, changePasswrd, RegisterAdmin} from "../controllers/userRegister.js"
import authuser from '../middlewares/auth.js';
const router =express.Router(); 
router.post("/register",Register);
router.put("/otp-verification",  VerifyOTPAndSaveUser); 
router.post("/login",login); 
router.post("/forgotPassword", forgotpassword); 
router.post("/changePassword",authuser, changePasswrd); 
router.post("/registerAdmin",authuser, RegisterAdmin); 
router.post("/verifyOtpChangePassword", verifyOtpandResetPassword); 
router.get("/logout",authuser,logout)
router.get("/getuser",getuser); 
export default router; 