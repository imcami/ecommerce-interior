import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import {
  validateToken,
  changeRol,
  uploadProfile,
  uploads,
} from "../controllers/user.controller.js";
import uploader from "../middlewares/upload.middleware.js";

const router = Router();

// RESTABLECER CONTRASEÑA DE USUARIO (GET)
router.get("/restore", (req, res) => {
  res.render("restore");
});
//Validar token para restablecer contraseña (GET)
router.get("/restorePass/:tokenPass", validateToken);

// ROLES DE USUARIO (PUT)
//Ruta para usuarios premium (PUT)
router.put("/premium/:uid", changeRol);

// SUBIDA DE ARCHIVOS (POST)
router.post("/:uid/documents", uploader.array("document", 3), uploads);
// SUBIDA DE FOTO DE PERFIL (POST)
router.post(
  "/:uid/current",
  isAuthenticated,
  uploader.single("profile"),
  uploadProfile
);

export default router;
