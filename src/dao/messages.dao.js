import messageModel from "../dao/models/messageModel.js";

export default class MessageManager {
  async findById() {
    try {
      const messages = await messageModel.findById();
      return messages;
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    try {
      const messages = await messageModel.find();
      return messages;
    } catch (error) {
      return error;
    }
  }

  async create(obj) {
    try {
      const newMessage = await messageModel.create(obj);
      return newMessage;
    } catch (error) {
      return error;
    }
  }
}
