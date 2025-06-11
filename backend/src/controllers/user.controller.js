import "dotenv/config";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloud} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { userHelpers } from "../models/index.js";
import crypto from "crypto"
import { sendEmail } from "../utils/sendEmail.js" // You create this function
import bcrypt from "bcryptjs"




const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        if(!user)
        {
            throw new ApiError(404,"User not found, can't generate tokens")
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const userRegistration = asyncHandler(async (req,res)=>{

    const {email, username, password} = req.body;

    if (
        [email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,"All fields are required")
    } // checking whether all the fields are filled or not.

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser)
    {
        throw new ApiError(400,"User with username or email already exists!!")
    }


    // const profilePicLocapPath = req.files?.profilePicture[0]?.path; // error
    if(req.file)
    {
    const profilePicLocalPath = req.file?.path;

    if(!profilePicLocalPath)
    {
        throw new ApiError(400,"Profile picture not uploaded"); // it is compulsory to have profile picture
    }

    const profilePic = await uploadOnCloud(profilePicLocalPath);

    if(!profilePic)
    {
        throw new ApiError(400,"Failed to upload on cloudinary");
    }
  }

    const user = await User.create({
        email,
        username,
        password,
        profilePicture:req.file?profilePic.url:null
    })

    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken");

    if(!createdUser)
    {
        throw new ApiError(500,"Something went wrong while registering the user.")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefereshTokens(user?._id)
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false});

    return res.status(201).json(new ApiResponse(200,createdUser,"User registered successfully"))


    // console.log(`${email}`);
})

const userLogin = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;
  
    if (!identifier || !password) {
      throw new ApiError(400, "Identifier and password are required");
    }
  
    const query = identifier.includes("@")
      ? { email: identifier.toLowerCase() }
      : { username: identifier };
  
    const user = await User.findOne(query);
  
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }
  
    const isPasswordValid = await userHelpers.comparePassword(password, user.password);
  
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials, please try again");
    }
  
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
  
    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "Token generation failed");
    }
  
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  
    const options = {
      httpOnly: true,
      secure: true, // only over HTTPS
      sameSite: "strict",
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully")
      );
  });
  
const userLogout = asyncHandler(async(req,res)=>{

    console.log(req);

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly:true,
        secure:true
    }
    
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json( new ApiResponse(200,{},"User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        ) // we are decoding the refresh token to get the user data from it to generate new refresh token

        const user = User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used, please login again");

        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newrefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newrefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newrefreshToken },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
  
    if (!oldPassword || !newPassword) {
      throw new ApiError(400, "Both old and new passwords are required");
    }
  
    const user = await User.findById(req.user?._id);
  
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    const isPasswordCorrect = await userHelpers.comparePassword(oldPassword, user.password);
  
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old password, please try again");
    }
  
    user.password = newPassword;
  
    await user.save({ validateBeforeSave: false }); // Make sure to await
  
    // Optional: remove refresh token so user needs to re-login
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  
    return res.status(200).json(
      new ApiResponse(200, {}, "Password changed successfully")
    );
  });
  
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { newUsername, newEmail } = req.body;
  
    if (!newUsername || !newEmail) {
      throw new ApiError(400, "Both username and email are required");
    }
  
    // Check if new username or email already exists (for other users)
    const existingUser = await User.findOne({
      $or: [{ username: newUsername }, { email: newEmail }],
      _id: { $ne: req.user._id } // exclude self
    });
  
    if (existingUser) {
      throw new ApiError(400, "Username or email already in use by another user");
    }
  
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          username: newUsername,
          email: newEmail
        }
      },
      { new: true }
    ).select("-password");
  
    if (!updatedUser) {
      throw new ApiError(500, "Failed to update user");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Account details updated successfully"));
  });

const updateProfilePic = asyncHandler(async(req,res)=>{

    const profileLocalPath = req.file?.path;
    
    if(!profileLocalPath)
    {
        throw new ApiError(400,"Profile picture is missing");
    }

    const profilePic = await uploadOnCloud(profileLocalPath);

    if(!profilePic.url)
    {
        throw new ApiError(400,"Error while uploading profile picture on cloudinary")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                profilePicture:profilePic.url
            }
        },
        {
            new:true
        }
    ).select("-password")

    return res
    .status(200)
    .json(200,user,"Profile picture updated")

  })

const getUserProfile = asyncHandler(async(req,res)=>{

    const {username} = req.params;
    if(!username?.trim())
    {
        throw new ApiError(400,"Username is missing");
    }

    const profile = await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $project:{
                username:1,
                email:1,
                profilePicture:1
            }
        }

    ]);

    if(!profile || profile.length === 0)
    {
        throw new ApiError(400,"User not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,profile[0],"User profile fetched successfully"));

})

const getCurrentProfile = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.user?._id)
    .select("username email profilePicture isOnline")
    
    if(!user)
    {
        throw new ApiError(400,"User not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Current User data fetched"));

})

// const searchUsers = asyncHandler(async (req, res) => {
//   const query = req.query.q;
//   const currentUserId = req.user._id;

//   if (!query) {
//     return res.status(400).json({ message: "Query is required" });
//   }

//   const users = await userHelpers.searchUsers(query, currentUserId); // use the helper
//   res.json(users);
// });
  
const searchUsers = asyncHandler(async (req, res) => {
  const username = req.query.username;

  if (!username) {
    console.log("username is absent")
    return res.status(400).json({ message: "Username query is required." });
  }

  const users = await User.find({
    _id: { $ne: req.user._id },
    username: { $regex: username, $options: "i" }
  }).select("username profilePicture isOnline");

  console.log(users); // this is working
  return res.status(200).json({ users });
});


const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      console.log(email, "received");
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
      await user.save({ validateBeforeSave: false });
      console.log(process.env.FRONTEND_URL);
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
      const html = `
        <p>You requested to reset your password.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link will expire in 30 minutes.</p>
      `;
  
      try {
        await sendEmail(user.email, "Reset Your Password", html);
      } catch (error) {
        console.log('Error sending email:',error.message);
        return res.status(500).json({message:"failed to send email"})
        
      }
  
      res.status(200).json({ message: "Reset password link sent to email" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

const resetPassword = async (req, res) => {
    try {
      const { resetToken } = req.params;
      const { password } = req.body;
      if(!resetToken)
      {
        console.log(`reset token is missing`)
        throw new ApiError(400,"reset token is missing")
      }
  
      if (!password || password.trim() === "") {
        return res.status(400).json({ message: "Password is required" });
      }
  
      // Hash the token to match the stored one
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
      // Find user with valid token and not expired
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      // Set new password (bcrypt hash is already handled in model's pre-save hook)
      user.password = password;
  
      // Clear reset fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      return res.status(200).json({ message: "Password reset successful" });
  
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  


export {
    userRegistration,
    userLogin,
    userLogout,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateProfilePic,
    getUserProfile,
    getCurrentProfile,
    searchUsers,
    forgotPassword,
    resetPassword,
  

}



























// import { User } from "../models/user.model.js";
// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// const userRegistration = asyncHandler(async (req, res) => {
//     // Add debugging logs
//     console.log('=== DEBUG INFO ===');
//     console.log('req.body:', req.body);
//     console.log('req.headers:', req.headers);
//     console.log('Content-Type:', req.get('Content-Type'));
//     console.log('==================');

//     // Check if req.body exists
//     if (!req.body || Object.keys(req.body).length === 0) {
//         throw new ApiError(400, "Request body is empty or missing");
//     }

//     const { email, username, password } = req.body;

//     console.log('Extracted values:', { email, username, password });

//     if ([email, username, password].some((field) => field?.trim() === "")) {
//         throw new ApiError(400, "All fields are required");
//     }

//     const existedUser = await User.findOne({
//         $or: [{ username }, { email }]
//     });

//     if (existedUser) {
//         throw new ApiError(400, "User with username or email already exists!!");
//     }

//     console.log(`Registration attempt for email: ${email}`);
    
//     // Add a temporary response for testing
//     res.status(200).json({
//         message: "Registration data received successfully",
//         data: { email, username }
//     });
// });

// // Simple test route
// const testRoute = asyncHandler(async (req, res) => {
//     console.log('=== TEST ROUTE ===');
//     console.log('req.body:', req.body);
//     console.log('req.method:', req.method);
//     console.log('req.headers:', req.headers);
    
//     res.status(200).json({
//         message: "Test route working",
//         body: req.body,
//         method: req.method
//     });
// });

// export {
//     userRegistration,
//     testRoute,
// };