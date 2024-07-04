import mongoose from "mongoose";
import { sendOTPEmail } from "../utils/basicfxn.js";
const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");
	// Only send an email when a new document is created
	if (this.isNew) {
  

		await sendOTPEmail(this.email,this.otp,"verification mail");
        //console.log(this); 
	}
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;