import mongoose from "mongoose";

const Schema = mongoose.Schema;



// Define Profile schema with references to other schemas
const profileSchema = new Schema({
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        
    },
    contactNumber: {
        type: String,
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'student'
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'admin'
    },
    superAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'superAdmin'
    }
});

// Create Profile model
const Profile = mongoose.model('Profile', profileSchema);
export default  Profile ;
