import Router from "express";
import passport from "passport";
import {
  googleSignup,
  loginUser,
  logout,
  renderLogin,
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
router.get("/restore", restorePass);
//Validar token para restablecer contraseña (GET)
router.get("/restorePass/:tokenPass", validateToken, restorePass);

// RESTABLECER CONTRASEÑA DE USUARIO (POST)
router.post("/restorePass", restorePass);

//                                      ---- Con passport ----

// Ruta para iniciar sesión de usuario (GET)
router.get("/login", passport.authenticate("local"), loginUser);
// Ruta para registro de usuario (GET)
router.get("/googleSignup", googleSignup);

export default router;
