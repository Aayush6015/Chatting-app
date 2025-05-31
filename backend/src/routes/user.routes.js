import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { changeCurrentPassword,
     getCurrentProfile,
     getUserProfile,
     searchUsers,
     updateAccountDetails,
     updateProfilePic,
     userLogin, 
     userLogout, 
     userRegistration
     } from "../controllers/user.controller.js";
import multer from "multer";
import { verifyJwt } from "../middlewares/auth.middleware.js";
// import { verify } from "jsonwebtoken";

const router = Router()
const formParser = multer().none()

router.route('/register').post(
    upload.single('profilePicture'), 
    userRegistration)

router.route("/login").post(formParser,userLogin)
router.route("/logout").post(verifyJwt,userLogout)
router.route("/change-password").post(verifyJwt,changeCurrentPassword)
router.route("/update-details").post(verifyJwt,updateAccountDetails)
router.route("/update-profile-picture").post(verifyJwt,updateProfilePic)
router.route("/get-user-profile").post(verifyJwt,getUserProfile)
router.route("/user-profile").post(verifyJwt,getCurrentProfile)
router.route("search-profiles").post(verifyJwt,searchUsers)

// router.post("/register",upload.single("profilePicture"),userRegistration)
// router.route('/test').post(testRoute)

export default router;
  