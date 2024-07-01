import express from 'express';
import {Register,login, logout, VerifyOTPAndSaveUser, forgotpassword, verifyOtpandResetPassword, changePasswrd} from "../controllers/Student.controllers.js"
import authuser from '../middlewares/auth.middleware.js';
import { verified } from '../middlewares/verified.middleware.js';
const router =express.Router(); 
router.post("/register",Register);
router.put("/otp-verification", authuser, VerifyOTPAndSaveUser); 
router.post("/login",login); 
router.post("/forgotPassword", authuser, verified, forgotpassword); 
router.post("/changePassword",authuser,verified, changePasswrd); 
router.post("/verifyOtpResetPassword", authuser,verified, verifyOtpandResetPassword); 
router.get("/logout",authuser,logout)

export default router; 