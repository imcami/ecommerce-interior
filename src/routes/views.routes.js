import { Router } from "express";
import {
  authAdminOrUserPremium,
  isAuthenticated,
} from "../middlewares/auth.middlewares.js";
import {
  messageChat,
  realtimeUpload,
  realtimeproducts,
} from "../controllers/socketio.controller.js";
import uploader from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/chat", isAuthenticated, messageChat);
router.get("/realtimeproducts", authAdminOrUserPremium, realtimeproducts);
router.post(
  "/realtimeproducts/upload",
  authAdminOrUserPremium,
  uploader.single("products"),
  realtimeUpload
);

export default router;
