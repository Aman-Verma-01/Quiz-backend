import express from 'express';
import {login, logout,forgotpassword, verifyOtpandResetPassword, changePasswrd} from "../controllers/Admin.controllers.js"
import authuser from '../middlewares/auth.middleware.js';
import { getAllStudent } from '../controllers/SuperAdmin.controllers.js';
import { verified } from '../middlewares/verified.middleware.js';
const router =express.Router(); 

router.post("/login", login); 
router.post("/forgotPassword",authuser, verified, forgotpassword); 
router.post("/changePassword",authuser,verified, changePasswrd); 
router.post("/verifyOtpChangePassword", authuser , verified,verifyOtpandResetPassword); 
router.get("/logout",authuser,logout)
router.get("/getAllStudents",authuser, verified, getAllStudent); 
export default router; 