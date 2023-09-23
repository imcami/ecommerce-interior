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

// Ruta para el chat (GET)
router.get("/chat", isAuthenticated, messageChat);
// Productos en tiempo real (GET)
router.get("/realtimeproducts", authAdminOrUserPremium, realtimeproducts);
// Subida de productos en tiempo real (POST)
router.post(
  "/realtimeproducts/upload",
  authAdminOrUserPremium,
  uploader.single("products"),
  realtimeUpload
);

export default router;
