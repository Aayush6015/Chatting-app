import "dotenv/config";
import { OAuth2Client } from "google-auth-library";
import {User} from "../../models/user.model.js";
import {asyncHandler} from "../../utils/asyncHandler.js";
import {ApiResponse} from "../../utils/ApiResponse.js";
import {ApiError} from "../../utils/ApiError.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) throw new ApiError(400, "ID token is required");

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    // If user exists, skip to login
    if (user) {
        return res.status(200).json(new ApiResponse(200, user, "User exists, proceed to login"));
    }

    // Temporarily store Google user data for frontend registration continuation
    return res.status(200).json(
        new ApiResponse(200, { email, name, picture }, "Verified. Continue registration")
    );
});
