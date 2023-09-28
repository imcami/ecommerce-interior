import Router from "express";
import passport from "passport";
import {
  googleSignup,
  loginUser,
  logout,
  renderLogin,
  renderLogout,
  renderSignup,
  restorePass,
  signupUser,
} from "../controllers/session.controller.js";
import { validateToken } from "../controllers/user.controller.js";

const router = Router();

//                                      ---- Sin passport ----

//Ruta para iniciar sesión de usuario (GET)
router.get("/login", renderLogin, loginUser);
// Ruta para registro de usuario (GET)
router.post(
  "/signup",
  (req, res) => {
    res.render("signup");
  },
  signupUser
);
//Ruta para cerrar sesión de usuario (GET)
router.get("/logout", (req, res) => {
  res.render("logout"), logout;
});
// RESTABLECER CONTRASEÑA DE USUARIO (GET)
router.get("/restore", (req, res) => {
  res.render("restore");
});
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
