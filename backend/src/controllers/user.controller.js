import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloud} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { userHelpers } from "../models/index.js";



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

    const user = await User.create({
        email,
        username,
        password,
        profilePicture:profilePic.url
    })

    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")

    if(!createdUser)
    {
        throw new ApiError(500,"Something went wrong while registering the user.")
    }

    return res.status(201).json(new ApiResponse(200,createdUser,"User registered successfully"))


    // console.log(`${email}`);
})

const userLogin = asyncHandler(async(req,res)=>{

    const {email,username,password} = req.body
    // console.log(`${email}`);

    if(!username && !email)
    {
        throw new ApiError(400,"Either Username or Email is required")
    }
    const user = await User.findOne({
        $or:[{username},{email}] // finiding either by username or email
    })

    if(!user)
    {
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid = await userHelpers.comparePassword(password,user.password)

    if(!isPasswordValid)
    {
        throw new ApiError(401,"Invalid user credentials, please try again")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefereshTokens(user?._id)

    if(!accessToken)
    {
        throw new ApiError(500,"Not able to generate access token")
    }
    if(!refreshToken)
    {
        throw new ApiError(500,"Not able to generate refresh token")
    }

    // console.log(`${email}  ${refreshToken}`);
    const loggedInUser = await User.findById(user?._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User logged in successfully"
        )
    )

})

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

const searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (!query?.trim()) throw new ApiError(400, "Search query not available");
  
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    }).select("username email profilePicture");
  
    res.status(200).json(new ApiResponse(200, users, "Search results"));
  });
  

  



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
    searchUsers

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