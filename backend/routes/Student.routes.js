import express from 'express';
import {Register,login, logout, forgotpassword, verifyOtpandResetPassword, changePasswrd} from "../controllers/Student.controllers.js"
import authuser from '../middlewares/auth.middleware.js';
import { sendotp } from '../controllers/Otp.controllers.js';
const router =express.Router(); 
router.post("/sendotp", sendotp)
router.post("/register",Register); 
router.post("/login",login); 
router.post("/forgotPassword", forgotpassword); 
router.post("/changePassword",authuser, changePasswrd); 
router.post("/verifyOtpResetPassword", verifyOtpandResetPassword); 
router.get("/logout",authuser,logout)

export default router; 