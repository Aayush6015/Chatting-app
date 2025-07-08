import { Router } from "express";
import multer from "multer";
import {
    createOrGetConversation,
    getAllConversationsForUser,
    deleteConversation,
    getConversationById,

} from "../controllers/conversation.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()
const formParser = multer().none()

router.route("/get-create-conversation/:targetUserId").post(verifyJwt,formParser,createOrGetConversation)
router.route("/all-conversations").get(verifyJwt,getAllConversationsForUser)
router.route("/delete-conversation").delete(verifyJwt,formParser,deleteConversation)
router.route('/get-conversation/:conversationId').get(verifyJwt,getConversationById)
// router.rotue("/update-preview/:conversationId").patch( verifyJwt, updateConversationPreview);



export default router;