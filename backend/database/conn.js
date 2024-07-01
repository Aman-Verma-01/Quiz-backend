import mongoose from "mongoose";
const connection = async () => {
    try {
        const res = await mongoose.connect("mongodb://127.0.0.1:27017/Quiz-App ");
        console.log("sucessfully connected" );
    }
    catch (err) {
        console.log(err);
    }
}
connection();
export default connection; 