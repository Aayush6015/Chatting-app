import {User} from "../../models/user.model.js";
import {asyncHandler} from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import sendResetTokenEmail  from "../../utils/sendResetTokenEmail.js";
import crypto from "crypto";

export const requestPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User with this email doesn't exist");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(token, 10);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    await sendResetTokenEmail(user.email, token); // define this separately

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Reset email sent successfully"));
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    const users = await User.find({ resetPasswordExpiry: { $gt: Date.now() } });
    let validUser = null;
    
    for (const u of users) {
      if (await bcrypt.compare(token, u.resetPasswordToken)) {
        validUser = u;
        break;
      }
    }
    
    if (!validUser) {
      throw new ApiError(400, "Invalid or expired token");
    }
    
    validUser.password = newPassword;
    validUser.resetPasswordToken = undefined;
    validUser.resetPasswordExpiry = undefined;
    await validUser.save();

    return res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});
