import profile from "../models/profileSchema.js";
import superAdmin from "../models/SuperAdminSchema.js";
import admin from "../models/AdminSchema.js";
import student from "../models/StudentSchema.js";
// Arrow function to add a new  profile profile
const addProfile = async (req, res) => {
    const {email}=req.user;
    const { dob, gender, contactNumber } = req.body;
    try {
        const  profile = new  profile({
            dob: dob,
            gender: gender,
            contactNumber: contactNumber
        });
        const newprofile = await  profile.save();
       const User=( await superAdmin.findOne({email}))||(await admin.findOne({email}))||(await student.findOne({email}));
       User.profileID=newprofile._id; 
       await User.save()
       console.log('New  profile profile added:', new profile);
        res.status(201).json(new profile);
    } catch (err) {
        console.error('Error adding  profile profile:', err.message);
        res.status(500).json({ error: 'Failed to add  profile profile' });
    }
};

// Arrow function to update an existing  profile profile by ID
const update profileProfile = async (req, res) => {
    const { id } = req.params;
    const newFields = req.body;
    try {
        const updated profile = await  profile.findByIdAndUpdate(id, newFields, { new: true });
        if (!updated profile) {
            throw new Error(' profile profile not found');
        }
        console.log(' profile profile updated:', updated profile);
        res.json(updated profile);
    } catch (err) {
        console.error('Error updating  profile profile:', err.message);
        res.status(404).json({ error: err.message });
    }
};

// Arrow function to delete a  profile profile by ID
const delete profileProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted profile = await  profile.findByIdAndDelete(id);
        if (!deleted profile) {
            throw new Error(' profile profile not found');
        }
        console.log(' profile profile deleted:', deleted profile);
        res.json(deleted profile);
    } catch (err) {
        console.error('Error deleting  profile profile:', err.message);
        res.status(404).json({ error: err.message });
    }
};

// Arrow function to get a  profile profile by ID
const get profileProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const  profile = await  profile.findById(id);
        if (! profile) {
            throw new Error(' profile profile not found');
        }
        console.log(' profile profile found:',  profile);
        res.json( profile);
    } catch (err) {
        console.error('Error getting  profile profile:', err.message);
        res.status(404).json({ error: err.message });
    }
};

module.exports = {
    add profileProfile,
    update profileProfile,
    delete profileProfile,
    get profileProfile
};
