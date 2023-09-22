import mongoose from "mongoose";

const collection = "Messages";

const schema = new mongoose.Schema({
  messages: {
    type: String,
    required: true,
  },
});

const messageModel = mongoose.model(collection, schema);

export default messageModel;
