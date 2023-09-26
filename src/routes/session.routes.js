import Router from "express";
import passport from "passport";
import {
  loginUser,
  logout,
  restorePass,
  signupUser,
} from "../controllers/session.controller.js";
import { validateToken } from "../controllers/user.controller.js";

const router = Router();

//                                      ---- Sin passport ----

//Ruta para iniciar sesión de usuario (GET)
router.get("/login", loginUser);
// Ruta para registro de usuario (GET)
router.get("/signup", signupUser);
//Ruta para cerrar sesión de usuario (GET)
router.get("/logout", logout);
// RESTABLECER CONTRASEÑA DE USUARIO (GET)
router.get("/restore", (req, res) => {
  res.render("restore");
});
//Validar token para restablecer contraseña (GET)
router.get("/restorePass/:tokenPass", validateToken, restorePass);

//                                      ---- Con passport ----

// Ruta para iniciar sesión de usuario (POST)
router.post("/login", passport.authenticate("local"), loginUser);

export default router;
