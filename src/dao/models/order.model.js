import mongoose from "mongoose";

const collection = "orders";

const schema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_datatime: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const orderModel = mongoose.model(collection, schema);

export default orderModel;
