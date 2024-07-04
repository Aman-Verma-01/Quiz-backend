import express  from "express";
const router = express.Router();
import {getMyProfile,createProfile,deleteProfileById,updateProfileById} from "../controllers/profile.controllers.js"
router.get('/get', getMyProfile);
router.put('/update', updateProfileById);
router.delete('/delete',deleteProfileById);
export default router;
