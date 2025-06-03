// import { Router } from "express";
// import { upload } from "../middlewares/multer.middleware.js";
// import {
//     changeCurrentPassword,
//     getCurrentProfile,
//     getUserProfile,
//     searchUsers,
//     updateAccountDetails,
//     updateProfilePic,
//     userLogin,
//     userLogout,
//     userRegistration
// } from "../controllers/user.controller.js";
// import multer from "multer";
// import { verifyJwt } from "../middlewares/auth.middleware.js";
// // import { verify } from "jsonwebtoken";
// // import express from "express";
// import googleAuth from "../controllers/googleAuth.controller.js";
// import { verifyFirebaseToken } from "../middlewares/firebaseAuth.js";
// import resetRoutes from "./reset.routes.js";


// const router = Router()
// const formParser = multer().none()

// router.route('/register/google').post(verifyFirebaseToken,
//     upload.single('profilePicture'),
//     userRegistration)
// // google auth route
// router.route("/google-auth").post(formParser, upload.single('profilePicture'),googleAuth)
// router.route("/login").post(formParser, userLogin)
// router.route("/logout").post(verifyJwt, userLogout)
// router.route("/change-password").post(verifyJwt, changeCurrentPassword)
// router.route("/update-details").post(verifyJwt, updateAccountDetails)
// router.route("/update-profile-picture").post(verifyJwt, updateProfilePic)
// router.route("/get-user-profile").post(verifyJwt, getUserProfile)
// router.route("/user-profile").post(verifyJwt, getCurrentProfile)
// router.route("/search-profiles").post(verifyJwt, searchUsers)

// // router.post("/register",upload.single("profilePicture"),userRegistration)
// // router.route('/test').post(testRoute)

// export default router;


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
    resetPassword
} from "../controllers/user.controller.js";
import multer from "multer";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import googleAuth from "../controllers/googleAuth.controller.js";
import { verifyFirebaseToken } from "../middlewares/firebaseAuth.js";
import resetRoutes from "./reset.routes.js"; // ✅ imported

const router = Router()
const formParser = multer().none()

// Google Auth Registration
router.route('/register/google').post(
    verifyFirebaseToken,
    upload.single('profilePicture'),
    userRegistration
);

// Google Auth Button
router.route("/google-auth").post(
    formParser,
    upload.single('profilePicture'),
    googleAuth
);

// Login/Logout
router.route("/login").post(formParser, userLogin);
router.route("/logout").post(verifyJwt, userLogout);

// Account Updates
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/update-details").post(verifyJwt, updateAccountDetails);
router.route("/update-profile-picture").post(verifyJwt, updateProfilePic);

// Profile Fetch
router.route("/get-user-profile").post(verifyJwt, getUserProfile);
router.route("/user-profile").post(verifyJwt, getCurrentProfile);

// Search
router.route("/search-profiles").post(verifyJwt, searchUsers);

// ✅ Reset Password Routes
router.use("/auth", resetRoutes); // Adds /auth/request-reset and /auth/reset-password
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:resetToken').post(resetPassword)


export default router;
