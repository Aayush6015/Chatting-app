import admin from "../config/firebase.js";
import {User} from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const googleAuth = async (req, res) => {
  const { idToken,username,password } = req.body;

  if (!idToken || !username || !password) {
    throw new ApiError(400, "ID Token, username and password are required");
  }

  const decoded = await admin.auth().verifyIdToken(idToken);
  const { email, name, picture:googlePicture} = decoded;

  // Check if user exists
  let user = await User.findOne({ email });

  if(user)
  {
    throw new ApiError(400,"User with this email already exists");
  }
 let profilePicture = googlePicture;
 if(req.file)
 {
  const uploadResult = await uploa
 }
  if (!user) {
    // Temporarily create a user with just email, let frontend ask for username/password
    user = new User({
      email,
      username,
      password,
      profilePicture: picture,
      isGoogleUser: true, // Add this field to schema if needed
    });
    await user.save();
    return res.status(201).json(new ApiResponse(201, { user, newUser: true }, "Google user registered"));
  }

  // User exists, login
  return res.status(200).json(new ApiResponse(200, { user, newUser: false }, "Google user logged in"));
};

export default googleAuth;
