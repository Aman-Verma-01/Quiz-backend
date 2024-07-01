import express from 'express';
import {Register,login, logout, VerifyOTPAndSaveUser, forgotpassword, verifyOtpandResetPassword, changePasswrd, RegisterAdmin,getAllStudent,getAllAdmins} from "../controllers/SuperAdmin.controllers.js"
import authuser from '../middlewares/auth.middleware.js';
import { verified } from '../middlewares/verified.middleware.js';
const router =express.Router(); 
router.post("/register",Register);
router.put("/otp-verification", authuser,  VerifyOTPAndSaveUser); 
router.post("/login", login); 
router.post("/forgotPassword", authuser, verified,forgotpassword); 
router.post("/changePassword",authuser, verified, changePasswrd); 
router.post("/registerAdmin",authuser,verified, RegisterAdmin); 
router.post("/verifyOtpChangePassword", authuser,verified, verifyOtpandResetPassword); 
router.get("/logout",authuser,logout)

router.get("/getAllStudents",authuser,verified, getAllStudent); 
router.get("/getAllAdmins",authuser,verified, getAllAdmins);
export default router; 