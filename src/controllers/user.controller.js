import User from "../dao/users.dao.js";

import {
  findUserByEmail,
  findUserById,
  findUserByToken,
  findUserToUpdate,
  updateUser,
} from "../services/users.service.js";
import crypto from "crypto";
import { sendMail } from "../utils/nodemailer.js";
import { hashData } from "../utils/bcrypt.js";
import config from "../config/index.js";

export const findUsers = async (req, res, next) => {
  try {
    const payload = User.getUserTokenFrom(req.user);

    if (config.node_env === "test") {
      if (payload) {
        res.status(200).send({ payload });
      } else if (!payload) {
        res
          .status(404)
          .send({ status: "error", error: "El usuario no existe" });
      }
    } else {
      if (payload) {
        res.render("profile", {
          payload,

          script: "profile.js",
        });
      } else {
        res.redirect("/api/v1/users/login");
      }
    }
  } catch (error) {
    res.status(500).send({ status: "error" });
    req.logger.error("error al encontrar los usuarios");
  }
};

export const destroySession = async (req, res) => {
  try {
    const user = req.user;
    user.last_connection = Date.now();
    user.save();
    if (req.session.destroy) {
      req.session.destroy(() => {
        res.redirect("/api/v1/users/login");
      });
    }
  } catch (error) {
    req.logger.error("Error al destruir la sesion");
    res.status(500).json({ error: error });
  }
};

export const signupUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    req.session.user = user;
    if (config.node_env === "test") {
      res.send({ payload: user._id });
    } else {
      req.flash("success-msg", `Bienvenido/a ${user.first_name}!`);
      res.redirect("/api/v1/products");
    }
  } catch (error) {
    req.logger.error("Error in signupUser");

    res.status(500).json({ error: error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    req.session.user = user;
    user.last_connection = Date.now();
    user.save();
    if (config.node_env === "test") {
      res.send({ payload: user._id });
    } else {
      req.flash("success-msg", `Bienvenido/a ${user.first_name}!`);
      res.redirect("/api/v1/products");
    }
  } catch (error) {
    req.logger.error("Error al iniciar sesion");
    res.status(500).json({ error: error });
  }
};

export const restorePass = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await findUserByEmail(email);

    // agregar validación si no encuentra al usuario

    // si el usuario si existe, genero token de acceso
    user.tokenPass = crypto.randomBytes(20).toString("hex");

    user.timeToExpiredPass = Date.now() + 3600000; // 1 hora de expiración

    await user.save(); // guardo en DB

    const resetUrl = `http://${req.headers.host}/api/v1/users/restorePass/${user.tokenPass}`;

    // crear mailing para acceso al token
    await sendMail.sendMail({
      to: email,
      subject: "Restablece tu contraseña",
      html: `<h2>¡Hola, ${email}!</h2> <p>Para reestablecer su contraseña, haga click <a href=${resetUrl}>aqui</a></p>`,
    });
    console.log(resetUrl);
    req.logger.info("Todo ok! revisa la casilla de correo");
    req.flash("success-msg", "Revisa tu casilla de correo");
    res.redirect("/api/v1/users/login");
  } catch (error) {
    req.logger.error("Error in restorePass");
    res.status(500).json({ error: error });
  }
};

export const validateToken = async (req, res) => {
  const tokenPass = req.params.tokenPass;
  try {
    const user = await findUserByToken(tokenPass);
    console.log(user);
    // agregar validacion si el user no existe

    res.render("restorePass", { tokenPass });
  } catch (error) {
    req.logger.error("Error in validateToken");
    res.status(500).json({ error: error });
  }
};

export const updatePass = async (req, res) => {
  try {
    const user = await findUserToUpdate({
      // valido según la fecha de expiración
      tokenPass: req.params.tokenPass,
      timeToExpiredPass: { $gt: Date.now() },
    });

    if (!user) {
      res.redirect("/api/v1/users/restore");
    }
    //restableciendo contraseña
    user.tokenPass = null;
    user.timeToExpiredPass = null;

    const { password } = req.body;

    // hasheamos la nueva contraseña
    const hashNewPass = await hashData(password);

    user.password = hashNewPass;
    await user.save();
    req.logger.info("todo increíblemente ok");
    res.redirect("/api/v1/users/login");
  } catch (error) {
    req.logger.error("Error in updatePass");
    res.status(500).json({ error: error });
  }
};

export const changeRol = async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await findUserById(uid);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // si mi usuario subió los 3 documentos requeridos
    if (user.documents.length === 3) {
      // Cambio a user premium
      await updateUser({ _id: uid }, { role: "Premium" }, { new: true });
    } else {
      return res
        .status(404)
        .json({ message: "No has llenado todos los campos" });
    }

    res
      .status(200)
      .json({ message: "Rol del usuario actualizado exitosamente" });
  } catch (error) {
    req.logger.error("Error in changeRol");
    res.status(500).json({ error: error });
  }
};

export const uploads = async (req, res) => {
  try {
    const uid = req.params.uid;
    const payload = await findUserById(uid);

    for (const uploadedFile of req.files) {
      const { originalname, path } = uploadedFile;
      const index =
        path.indexOf("/upload") !== -1
          ? path.indexOf("/upload")
          : path.indexOf("\\upload");
      const newPath = path.substring(index);

      const saveDocs = { name: originalname, reference: newPath };
      payload.documents.push(saveDocs);
      await payload.save();
    }

    res.redirect("/api/v1/sessions/current");
  } catch (error) {
    req.logger.error("Error in uploads");
    res.status(500).json({ error: error });
  }
};

export const uploadProfile = async (req, res) => {
  try {
    const uid = req.params.uid;
    const payload = await findUserById(uid);

    const { path } = req.file;

    const index =
      path.indexOf("/upload") !== -1
        ? path.indexOf("/upload")
        : path.indexOf("\\upload");
    const newPath = path.substring(index);
    payload.imageProfile = newPath;
    console.log(payload);
    await payload.save();

    res.redirect("/api/v1/sessions/current");
  } catch (error) {
    req.logger.error("Error in uploads");
    res.status(500).json({ error: error });
  }
};
