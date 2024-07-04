import admin from "../models/AdminSchema.js";
import student from "../models/StudentSchema.js";
import superAdmin from "../models/SuperAdminSchema.js";
import OTP from "../models/Otp.js";

export const sendotp = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = (await student.findOne({ email }))||(await superAdmin.findOne({ email }))||(await admin.findOne({ email }));
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}

		var otp = Math.floor(100000 + Math.random() * 900000); 
      
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message , heh:"ncnn"});
	}
};
