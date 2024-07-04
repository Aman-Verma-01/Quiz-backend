import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
const studentSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true , "please provide your name !!!"],
        minlength:[ 3 ,"name nust contain 3 letters"],
        maxlength:[30 ,"name should not exceed than 30 characters "]
    },
   email:{
        type:String,
        required:[true , "please provide your email !!! "],
        unique:true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email address!'
        }
    },

    password:{
        type:String,
        required:[true , "please provide your  password !!! "]
       
    },
    profileID:{
        type:mongoose.Schema.ObjectId,
        ref:'profile'
    },
    quizAttempt:[{
        type:mongoose.Schema.ObjectId,
        ref:'quiz'}
    ]
},{ timestamps:true});
studentSchema.pre("save",async function(next){  
    if(this.isModified('password'|| this.isNew)){
        this.password=await bcrypt.hash(this.password,10);  
      
    }
 
next()
}); 
export const comparepassword= function (user,enteredPassword){
    return  bcrypt.compare(enteredPassword,user.password); 
}
 export const generateJwtToken = function(user) {
    return jwt.sign(
        { id: user._id },
        process.env.JwtSecretKey,
        { expiresIn: process.env.jwtExpire }
    );
};


const student=mongoose.model('student',studentSchema); 
export default student; 