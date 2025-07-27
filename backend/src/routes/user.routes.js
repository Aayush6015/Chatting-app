

import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    changeCurrentPassword,
    getCurrentProfile,
    getUserProfile,
    searchUsers,
    updateAccountDetails,
    updateProfilePic,
    userLogin,
    userLogout,
    userRegistration,
    forgotPassword,
    resetPassword,
    verifyPassword
} from "../controllers/user.controller.js";
import multer from "multer";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import googleAuth from "../controllers/googleAuth.controller.js";
import { verifyFirebaseToken } from "../middlewares/firebaseAuth.js";
import resetRoutes from "./auth/reset.routes.js"; // ✅ imported

const router = Router()
const formParser = multer().none()

// Google Auth Registration
router.route('/register/google').post(
    // verifyFirebaseToken,
    formParser,
    // upload.single('profilePicture'),
    
    userRegistration
);


// Login/Logout
router.route("/login").post(formParser, userLogin);
router.route("/logout").post(verifyJwt, userLogout);
// router.route("/logout").post( userLogout);

// Account Updates
router.route("/update-password").post(verifyJwt, changeCurrentPassword);
router.route("/update-username").post(verifyJwt, updateAccountDetails);
router.route("/update-profile-picture").post(verifyJwt,upload.single("profilePicture") ,updateProfilePic);

// Profile Fetch
router.route("/get-user-profile").post(verifyJwt, getUserProfile);
router.route("/user-profile").post(verifyJwt, getCurrentProfile);

// Search
router.route("/search").get(verifyJwt, searchUsers);

// ✅ Reset Password Routes
router.use("/auth", resetRoutes); // Adds /auth/request-reset and /auth/reset-password
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:resetToken').post(resetPassword)
//verify password
router.route("/verify-password").post(verifyJwt,verifyPassword);


export default router;
