import {
  findUserByEmail,
  generateToken,
  createUser,
} from "../services/users.service.js";
import { hashData, compareData } from "../utils/bcrypt.js";

// Ruta para login de usuario (POST)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (user) {
      const isMatch = await comparePassword(password, user.password);
      if (isMatch) {
        const token = await generateToken(user);
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/api/v1/products");

        return res.status(200).json({ message: "Has ingresado correctamente" });
      }
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
  } catch (error) {
    req.logger.error("Error in loginUser");
    res.status(500).json({ error: error });
  }
};

// Ruta para registro de usuario (GET)
export const signupUser = async (req, res) => {
  try {
    req.body.password = await hashData(req.body.password);
    const user = await createUser(req.body);
    if (user) {
      return res.status(201).json({ message: "Usuario creado correctamente" });
    }
  } catch (error) {
    req.logger.error("Error in signupUser");
    res.status(500).json({ error: error });
  }
};

//Ruta para cerrar sesión de usuario (GET)
export const logout = async (req, res) => {
  try {
    const { user } = req;
    if (user) {
      req.logout();
      res.clearCookie("token");
      return res.status(200).json({ message: "Has cerrado sesión" });
    }
    return res.status(401).json({ message: "No hay usuario logueado" });
  } catch (error) {
    req.logger.error("Error in logout");
    res.status(500).json({ error: error });
  }
};
// RESTABLECER CONTRASEÑA DE USUARIO (GET)
export const restorePass = async (req, res) => {
  try {
    const { user } = req;
    if (user) {
      return res.render("restorePass");
    }
    return res.status(401).json({ message: "No hay usuario logueado" });
  } catch (error) {
    req.logger.error("Error in restorePass");
    res.status(500).json({ error: error });
  }
  try {
  } catch (error) {
    req.logger.error("Error in restorePass");
    res.status(500).json({ error: error });
  }
};
