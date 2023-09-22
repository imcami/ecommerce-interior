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

//Ruta para iniciar sesión
router.get("/login", (req, res) => {
  res.render("login");
});
// Ruta para registro
router.get("/signup", (req, res) => {
  res.render("signup");
});

// RESTABLECER CONTRASEÑA
router.get("/restore", (req, res) => {
  res.render("restore");
});
//Validar token para restablecer contraseña
router.get("/restorePass/:tokenPass", validateToken);

// ROLES DE USUARIO
router.put("/premium/:uid", changeRol);

// SUBIDA DE ARCHIVOS
router.post("/:uid/documents", uploader.array("document", 3), uploads);
router.post(
  "/:uid/current",
  isAuthenticated,
  uploader.single("profile"),
  uploadProfile
);

export default router;
