import { Router } from "express";
import {
  authAdminOrUserPremium,
  isAuthenticated,
} from "../middlewares/auth/auth.middleware.js";
import {
  messageChat,
  realtimeUpload,
  realtimeproducts,
} from "../controllers/sockets.controllers.js";
import uploader from "../middlewares/upload/uploader.middleware.js";

const viewRouter = Router();

viewRouter.get("/chat", isAuthenticated, messageChat);
viewRouter.get("/realtimeproducts", authAdminOrUserPremium, realtimeproducts);
viewRouter.post(
  "/realtimeproducts/upload",
  authAdminOrUserPremium,
  uploader.single("products"),
  realtimeUpload
);

export default viewRouter;
