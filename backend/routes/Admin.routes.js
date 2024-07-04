import express from 'express';
import {login, logout,forgotpassword, verifyOtpandResetPassword, changePasswrd} from "../controllers/Admin.controllers.js"
import { sendotp } from '../controllers/Otp.controllers.js';
import authuser from '../middlewares/auth.middleware.js';
import { getAllStudent } from '../controllers/SuperAdmin.controllers.js';
const router =express.Router();
router.post("/login", login); 
router.post("/forgotPassword",  forgotpassword); 
router.post("/changePassword",authuser, changePasswrd); 
router.post("/verifyOtpChangePassword", verifyOtpandResetPassword); 
router.get("/logout",authuser,logout)
router.get("/getAllStudents",authuser, getAllStudent); 
export default router; 