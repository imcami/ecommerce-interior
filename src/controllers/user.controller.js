import config from "../config/index.js";
import {
  findUserById,
  findUserByEmail,
  mockUsers,
  findUserToUpdate,
} from "../services/users.service.js";
import jwt from "jsonwebtoken";
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
      await findUserToUpdate({ _id: uid }, { role: "Premium" }, { new: true });
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
export const validateToken = async (req, res) => {
  try {
    const token = req.params.tokenPass;
    const payload = jwt.verify(token, config.session_secret);
    const user = await findUserByEmail(payload.email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.render("restorePass", { user: user });
  } catch (error) {
    res.status(500).json({ error: error, message: "Error en validateToken" });
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

export const getMockUsers = async (req, res) => {
  try {
    const users = await mockUsers(100);
    res.status(200).json({ status: "success", payload: users });
  } catch (error) {
    req.logger.error("Error en getMockUsers");
    res.status(500).json({ status: "error", payload: error });
  }
};
