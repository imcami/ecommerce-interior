import config from "../config/index.js";
import {
  findUserByEmail,
  generateToken,
  updateUser,
  updateLastConnection,
  createUser,
} from "../services/users.service.js";
import { hashData, compareData } from "../utils/bcrypt.js";

// Ruta para login de usuario (POST)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render("errorView", {
        message: "Se requieren correo electrónico y contraseña",
      });
    }

    const user = await findUserByEmail(email);

    // Validar si el usuario existe
    const isValidPassword = await compareData(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .render("errorView.hbs", { message: "Contraseña incorrecta" });
    }
    // Actualizar la última conexión y guardar el usuario
    user.last_connection = Date.now();
    await user.save();

    // Establecer la sesión y enviar respuesta
    req.session.user = user;
    if (config.node_env === "testing") {
      return res.send({ payload: user._id });
    } else {
      req.flash("success-msg", `¡Bienvenido/a ${user.first_name} a Doclin!`);
      return res.redirect("/api/products");
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({ error: error.message });
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
export const renderSignup = async (req, res) => {
  try {
    return res.render("signup");
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Error en renderSignup" });
  }
};

// Ruta para registro de usuario (GET)
// export const signupUser = async (req, res) => {
//   try {
//     const { email, password, first_name, last_name, age } = req.body;

//     // Validar datos de entrada
//     if (!email || !password || !first_name || !last_name || !age) {
//       return res.status(400).render({
//         message: "Todos los campos son requeridos",
//       });
//     }

//     // Verificar si el correo electrónico ya está en uso
//     const existingUser = await findUserByEmail(email);
//     if (existingUser) {
//       return res.status(400).render({
//         message: "El correo electrónico ya está en uso",
//       });
//     }

//     // Hashear la contraseña y crear el usuario
//     const hash = await hashData(password);
//     const payload = {
//       email,
//       password: hash,
//       first_name,
//       last_name,
//       age,
//     };

//     // Asumiendo que tienes una función createUser
//     const newUser = await createUser(payload);
//     req.session.user = newUser;

//     if (config.node_env === "testing") {
//       return res.send({ payload: newUser._id });
//     } else {
//       req.flash(
//         "success-msg",
//         `¡Bienvenido/a ${newUser.first_name} a Docklin!`
//       );
//       return res.redirect("/api/products");
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ error: error, message: "Error en signupUser" });
//   }
// };
export const signupUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, age } = req.body;

    // Validar datos de entrada
    if (!email || !password || !first_name || !last_name || !age) {
      return res.status(400).json({
        // Cambiado de render a json
        message: "Todos los campos son requeridos",
      });
    }

    // Validar tipo de dato de age
    if (typeof age !== "number" || age <= 0) {
      return res.status(400).json({
        message: "La edad debe ser un número positivo",
      });
    }

    // Verificar si el correo electrónico ya está en uso
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        // Cambiado de render a json
        message: "El correo electrónico ya está en uso",
      });
    }

    // Hashear la contraseña y crear el usuario
    const hash = await hashData(password);
    const payload = {
      email,
      password: hash,
      first_name,
      last_name,
      age,
    };

    // Asumiendo que tienes una función createUser
    const newUser = await createUser(payload);
    req.session.user = newUser;

    if (config.node_env === "testing") {
      return res.send({ payload: newUser._id });
    } else {
      req.flash(
        "success-msg",
        `¡Bienvenido/a ${newUser.first_name} a Docklin!`
      );
      return res.redirect("/api/products");
    }
  } catch (error) {
    console.error("Error in signupUser:", error); // Log detallado del error
    return res.status(500).json({
      error: error.message, // Cambiado de error a error.message
      message: "Error en signupUser",
    });
  }
};

//Ruta para cerrar sesión de usuario (GET)
export const logout = async (req, res) => {
  try {
    // Verificar si el usuario está logueado
    if (!req.session || !req.session.user || !req.session.user._id) {
      return res.status(400).json({ message: "No hay usuario logueado" });
    }

    // Actualizar la última conexión del usuario
    await updateLastConnection(req.session.user._id);

    // Destruir la sesión actual
    req.session.destroy((err) => {
      if (err) {
        // Manejar el error al intentar destruir la sesión
        return res
          .status(500)
          .json({ error: err.message, message: "Error en logout" });
      }

      // Redireccionar al usuario
      return res.redirect("/api/v1/products");
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Error en logout" });
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
      await updateUser(user._id, { password: hash });
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

// Validar token para restablecer contraseña (GET)
export const validateToken = async (req, res) => {
  try {
    const { tokenPass } = req.params;
    const user = await findUserByToken(tokenPass);
    if (user) {
      req.user = user;
      return res.render("restore");
    }
    return res.render("errorView", { message: "Token inválido" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Error en validateToken" });
  }
};
