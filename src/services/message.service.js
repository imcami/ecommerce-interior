import MessageManager from "../dao/messages.dao.js";

const messageManager = new MessageManager();

export const findById = async () => {
  try {
    const message = await messageManager.findById();
    return message;
  } catch (error) {
    return error;
  }
};

export const findAll = async () => {
  try {
    const message = await messageManager.findAll();
    return message;
  } catch (error) {
    return error;
  }
};

export const create = async (obj) => {
  try {
    const newMessage = await messageManager.create(obj);
    return newMessage;
  } catch (error) {
    return error;
  }
};
