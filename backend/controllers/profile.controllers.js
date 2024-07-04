import ResponseHandler from "../middlewares/error.middleware.js";
import student from "../models/StudentSchema.js";
import Profile from "../models/profileSchema.js"
// Function to get all profiles
export const getMyProfile = async (req, res, next) => {
    const {profileID}=req.user;
  try {
    const profile = await Profile.findById({_id:profileID});
    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
    res.json(profile);
  } catch (err) {
    next(err);
  }
};



// Function to create a new profile
export const createProfile = async (req, res, next) => {
  const { dob, contactNumber, gender } = req.body;
  const User=req.user; 
 
  try {
    const profile = new Profile({ dob, contactNumber, gender });
    const StudentUser=await student.findById(User._id); 
  
    if(!StudentUser)
    return next(new ResponseHandler("user does not exist",404,false))
    profile.student=User._id;
    const newProfile = await profile.save();
    StudentUser.profileID=newProfile._id; ;
    await StudentUser.save(); 
    res.status(201).json(newProfile);
  } catch (err) {
    next(err);
  }
};

// Function to update a profile by ID
export const updateProfileById = async (req, res, next) => {
    const {profileID}=req.user;
  const { dob, contactNumber, gender } = req.body;

  try {
    const profile = await Profile.findById(profileID);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (dob !== undefined) {
      profile.dob = dob;
    }
    if (contactNumber !== undefined) {
      profile.contactNumber = contactNumber;
    }
    if (gender !== undefined) {
      profile.gender = gender;
    }

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (err) {
    next(err);
  }
};

// Function to delete a profile by ID
export const deleteProfileById = async (req, res, next) => {
    const {profileID}=req.user;
  try {
    
    const profile = await Profile.findById(profileID);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' ,"id":profile});
    }

    //await profiled.delete();
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    next(err);
  }
};

