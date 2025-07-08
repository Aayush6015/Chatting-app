// import express from "express";
// import {
//   requestPasswordReset,
//   resetPassword,
// } from "../../controllers/auth/resetPassword.controller.js";

// const router = express.Router();

// router.post("/request-reset", requestPasswordReset);
// router.post("/reset-password", resetPassword);

// export default router;

import express from "express";
import {
  requestPasswordReset,
  resetPassword,
} from "../../controllers/auth/resetPassword.controller.js";

const router = express.Router();

// 📧 Request a password reset (email with token)
router.post("/request-reset", requestPasswordReset);

// 🔒 Reset password using token
router.post("/reset-password/:resetToken", resetPassword);

export default router;
