import userModel from "./models/user.model.js";
import { hashData } from "../utils/bcrypt.js";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
export default class UserDao {
  async findAll() {
    try {
      const users = await userModel.findAll();
      return users;
    } catch (error) {
      return res
        .status(500)
        .json({ message: "error al encontrar todos los usuarios" });
    }
  }
  async findUserByEmail(email) {
    try {
      const user = await userModel.findOne({ email: email });
      return user;
    } catch (error) {
      return res
        .status(500)
        .json({ message: "error al encontrar el email del usuario" });
    }
  }
  async findUserById(id) {
    try {
      const user = await userModel.findById(id);

      return user;
    } catch (error) {
      return res
        .status(500)
        .json({ message: "error al encontrar el id del usuario " });
    }
  }
  async findByIdAndPopulate(id, populateStr) {
    try {
      const user = await userModel.findById(id).populate(populateStr);
      return user;
    } catch (error) {
      return res
        .status(500)
        .json({ message: "error al encontrar el usuario by populate" });
    }
  }
  async findOneandUpdate(filter, update, options) {
    try {
      const user = await userModel.findOneAndUpdate(filter, update, options);
      return user;
    } catch (error) {
      return res
        .status(500)
        .json({ message: "error al encontrar al actualizar el usuario" });
    }
  }
  async create(user) {
    try {
      const newUser = await userModel.create(user);
      return newUser;
    } catch (error) {
      return res.status(500).json({ message: "error al crear el usuario" });
    }
  }
  async delete(id) {
    try {
      const user = await userModel.findByIdAndDelete(id);
      return user;
    } catch (error) {
      return res.status(500).json({ message: "error al eliminar el usuario" });
    }
  }

  // MockUsers es un metodo que genera usuarios falsos
  async mockUsers(quantity) {
    try {
      const users = [];
      for (let i = 0; i < quantity; i++) {
        const user = generateUser();
        users.push(user);
      }
      return users;
    } catch (error) {
      return error;
    }
  }
  async getUserTokenFrom(user) {
    try {
      const { _id, email, role } = user;
      return { _id, email, role };
    } catch (error) {
      return error;
    }
  }
  async resetPassword(email, newPassword) {
    try {
      const hashPassword = hashData(newPassword);
      const filter = { email: email };
      const update = { password: hashPassword };
      const options = { new: true };
      const user = await this.findOneandUpdate(filter, update, options);
      return user;
    } catch (error) {
      return error;
    }
  }
  async changePassword(id, newPassword) {
    try {
      const hashPassword = hashData(newPassword);
      const filter = { _id: id };
      const update = { password: hashPassword };
      const options = { new: true };
      const user = await this.findOneandUpdate(filter, update, options);
      return user;
    } catch (error) {
      return error;
    }
  }
  async changePremiumRole(id) {
    try {
      const filter = { _id: id };
      const update = { role: "premium" };
      const options = { new: true };
      const user = await this.findOneandUpdate(filter, update, options);
      return user;
    } catch (error) {
      return error;
    }
  }
  async updateLastConnection(id) {
    try {
      const filter = { _id: id };
      const update = { last_connection: new Date() };
      const options = { new: true };
      const user = await this.findOneandUpdate(filter, update, options);
      return user;
    } catch (error) {
      return error;
    }
  }
  async generateToken(user) {
    try {
      const token = jwt.sign(user, config.jwt.secret, {
        expiresIn: config.jwt.expiration,
      });
      return token;
    } catch (error) {
      return error;
    }
  }
  async uploadDocument(id, file, docName) {
    try {
      const filepath = file.path.split("public")[1];
      const filter = { _id: id };
      const update = { [docName]: filepath };
      const options = { new: true };
      const user = await this.findOneandUpdate(filter, update, options);
      return user;
    } catch (error) {
      return error;
    }
  }
}

async function generateUser() {
  const user = {
    name: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: faker.random.arrayElement(["admin", "user", "premium"]),
    avatar: faker.image.avatar(),
    documents: {
      dni: faker.image.imageUrl(),
      driver_license: faker.image.imageUrl(),
      passport: faker.image.imageUrl(),
    },
  };
  return user;
}
