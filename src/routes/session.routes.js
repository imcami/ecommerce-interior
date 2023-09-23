import Router from "express";
import passport from "passport";
import { loginUser } from "../controllers/session.controller.js";

const router = Router();

//                                      ---- Sin passport ----

//Ruta para iniciar sesión de usuario (GET)
router.get("/login", (req, res) => {
  res.render("login");
});
// Ruta para registro de usuario (GET)
router.get("/signup", (req, res) => {
  res.render("signup");
});

//                                      ---- Con passport ----

// Ruta para iniciar sesión de usuario (POST)
router.post("/login", passport.authenticate("local"), loginUser);

export default router;
