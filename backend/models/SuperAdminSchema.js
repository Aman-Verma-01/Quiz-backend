import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"; 
const superAdminSchema= new mongoose.Schema({
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
    profileID:{
        type:mongoose.Schema.ObjectId,
        ref:'profile'
    }
    ,

    password:{
        type:String,
        required:[true , "please provide your  password !!! "]
       
    },
    adminCreated:[{
        type:mongoose.Schema.ObjectId,
        ref:"admin"
    }]
},{ timestamps:true});
superAdminSchema.pre("save",async function(next){  
    if(this.isModified('password'|| this.isNew)){
        this.password=await bcrypt.hash(this.password,10);  
      
    }
 
next()
}); 


const superAdmin=mongoose.model('superAdmin',superAdminSchema); 
export default superAdmin; 