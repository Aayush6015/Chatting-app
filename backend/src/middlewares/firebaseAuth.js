import admin from '../config/firebase.js'; // or wherever your Firebase admin is initialized
import { ApiError } from '../utils/ApiError.js';

export const verifyFirebaseToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "No token provided");
    }

    const idToken = authHeader.split(" ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = { email: decodedToken.email };
        next();
    } catch (error) {
        console.error("Firebase token verification failed:", error);
        throw new ApiError(401, "Invalid or expired token");
    }
};
