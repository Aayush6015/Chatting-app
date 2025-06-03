import admin from "firebase-admin";
import {serviceAccount} from "./chatting-app-25805-firebase-adminsdk-fbsvc-9aba1f9006.js"; // Path to downloaded key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
