import {
  findUserByEmail,
  generateToken,
  createUser,
  updateUser,
  updateLastConnection,
} from "../services/users.service.js";
import { hashData, compareData } from "../utils/bcrypt.js";
// Ruta para login de usuario (POST)
export const loginUser = async (req, res) => {
  try {
    // Si no hay usuario logueado, redirecciona a la página de productos
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "error", message: "Usuario no creado" });
    }
    // Si hay usuario logueado, redirecciona a la página de productos
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (user) {
      const isMatch = await compareData(password, user.password);
      if (isMatch) {
        const token = await generateToken(user);
        res.cookie("token", token, { httpOnly: true });
        return res.redirect("/api/v1/products");
      }
    }

    res.render("errorView", { message: "Usuario no encontrado" });
  } catch (error) {
    req.logger.error("Error in loginUser");
    res.status(500).json({ error: error });
  }
};
export const renderLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    req.logger.error("Error in renderLogin");
    res.status(500).json({ error: error });
  }
};
// Ruta para registro de usuario (GET)
export const signupUser = async (req, res) => {
  try {
    req.body.password = await hashData(req.body.password);
    const user = await createUser(req.body);
    if (user) {
      return res.redirect("/products");
    }
  } catch (error) {
    req.logger.error("Error in signupUser");
    res.status(500).json({ error: error });
  }
};
export const renderSignup = async (req, res) => {
  try {
    req.render("signup");
  } catch (error) {}
  req.addLogger;
};
//Ruta para cerrar sesión de usuario (GET)
export const logout = async (req, res) => {
  try {
    // Si no hay usuario logueado, redirecciona a la página de productos
    if (!req.user) {
      return res.redirect("/api/v1/products");
    }
    const response = updateLastConnection(req.session.user._id); // Actualiza la última conexión del usuario
    if (response) {
      req.logger.info("Última conexión actualizada");
    }
    // Destruir la sesion actual
    req.session.destroy();
    res.redirect("/api/v1/products");
  } catch (error) {
    req.logger.error("Error in logout");
    res.status(500).json({ error: error });
  }
};
export const renderLogout = async (req, res) => {
  try {
    res.render("logout");
  } catch (error) {
    req.logger.error("Error in renderLogout");
    res.status(500).json({ error: error });
  }
};

//Inicio de sesion con passport google
export const googleSignup = async (req, res) => {
  try {
    const { user } = req;
    if (user) {
      const token = await generateToken(user);
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/api/v1/products");
    }
  } catch (error) {
    req.logger.error("Error in googleSignup");
    res.status(500).json({ error: error });
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
    req.logger.error("Error in restorePass");
    res.status(500).json({ error: error });
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
    req.logger.error("Error in restorePassPost");
    res.status(500).json({ error: error });
  }
};
