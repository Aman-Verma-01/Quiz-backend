import express from 'express';
import {Register,login, logout, forgotpassword, verifyOtpandResetPassword, changePasswrd, RegisterAdmin,getAllStudent,getAllAdmins} from "../controllers/SuperAdmin.controllers.js"
import authuser from '../middlewares/auth.middleware.js';
import { sendotp } from '../controllers/Otp.controllers.js';
const router =express.Router(); 
router.post("/register",Register);
router.post("/sendotp", sendotp)
router.post("/login", login); 
router.post("/forgotPassword",forgotpassword); 
router.post("/changePassword",authuser, changePasswrd); 
router.post("/registerAdmin",authuser, RegisterAdmin); 
router.post("/verifyOtpChangePassword", verifyOtpandResetPassword); 
router.get("/logout",authuser,logout)
router.get("/getAllStudents",authuser, getAllStudent); 
router.get("/getAllAdmins",authuser, getAllAdmins);
export default router; 