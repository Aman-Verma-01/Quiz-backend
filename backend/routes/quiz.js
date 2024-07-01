import express from 'express';
import authuser from '../middlewares/auth.middleware.js';
import { createQuiz } from '../controllers/quizCreator.js';
const router =express.Router(); 
router.post("/create",authuser,createQuiz);
// router.put("/otp-verification",  VerifyOTPAndSaveUser); 
// router.post("/login",login); 

export default router; 