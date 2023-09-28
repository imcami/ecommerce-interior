import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import {
  changeRol,
  uploadProfile,
  uploads,
} from "../controllers/user.controller.js";
import uploader from "../middlewares/upload.middleware.js";

const router = Router();

// ROLES DE USUARIO (PUT)
//Ruta para usuarios premium (PUT)
router.put("/premium/:uid", changeRol);

// SUBIDA DE ARCHIVOS (POST)
router.post("/:uid/documents", uploader.array("document", 3), uploads);
// SUBIDA DE FOTO DE PERFIL (POST)
router.post(
  "/:uid/profile",
  isAuthenticated,
  uploader.single("profile"),
  uploadProfile
);

export default router;
