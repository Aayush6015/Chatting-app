import express from "express";
import { verifyGoogleToken } from "../../controllers/googleAuth.controller.js";

const router = express.Router();

// router.post("/verify-google-token", verifyGoogleToken);
router.route("/verify-google-token").post(verifyGoogleToken);

export default router;
