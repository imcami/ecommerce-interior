import config from "../config/index.js";
import {
  findUserByEmail,
  generateToken,
  updateUser,
  updateLastConnection,
} from "../services/users.service.js";
import { hashData, compareData } from "../utils/bcrypt.js";

// Ruta para login de usuario (POST)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    //Validar si el usuario existe y si la contraseña es correcta. Si es correcta, generar un token y guardarlo en una cookie.
    if (user) {
      const isMatch = await compareData(password, user.password);
      if (isMatch) {
        const token = await generateToken(user);
        res.cookie("token", token, { httpOnly: true });
        return res.redirect("/api/v1/products");
      }
    }

    return res.render("errorView", { message: "Usuario no encontrado" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Error en loginUser" });
  }
};

export const renderLogin = async (req, res) => {
  try {
    return res.render("login");
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Error en renderLogin" });
  }
};

// Ruta para registro de usuario (GET)
export const signupUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    req.session.user = user;
    if (config.node_env === "test") {
      return res.send({ payload: user._id });
    } else {
      req.flash("success-msg", `Bienvenido/a ${user.first_name}!`);
      return res.redirect("/api/products");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Error en signupUser" });
  }
};

//Ruta para cerrar sesión de usuario (GET)
export const logout = async (req, res) => {
  try {
    const response = await updateLastConnection(req.session.user._id); // Actualiza la última conexión del usuario
    if (response) {
      console.log("Última conexión actualizada");
    }
    // Destruir la sesion actual
    req.session.destroy();
    return res.redirect("/api/v1/products");
  } catch (error) {
    return res.status(500).json({ error: error, message: "Error en logout" });
  }
};

//Inicio de sesion con passport google
export const googleSignup = async (req, res) => {
  try {
    const { user } = req;
    if (user) {
      const token = await generateToken(user);
      res.cookie("token", token, { httpOnly: true });
      return res.redirect("/api/v1/products");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Error en googleSignup" });
  }
};

// RESTABLECER CONTRASEÑA DE USUARIO (GET)
export const restorePass = async (req, res) => {
  try {
    const { user } = req;
    if (user) {
      return res.render("restore");
    }
    return res.status(401).json({ message: "No hay usuario logueado" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Error en restorePass" });
  }
};

// RESTABLECER CONTRASEÑA DE USUARIO (POST)
export const restorePassPost = async (req, res) => {
  try {
    const { user } = req;
    if (user) {
      const { password } = req.body;
      const hash = await hashData(password);
      const payload = { password: hash };
      await updateUser(user._id, payload);
      // Redirecciona después de actualizar la contraseña
      return res.redirect("/api/v1/products");
    }
    return res.render("errorView", { message: "No hay usuario logueado" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Error en restorePassPost" });
  }
};
