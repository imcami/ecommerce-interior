import mongoose from "mongoose";
// import { createId } from "../../utils/create_id";

const collection = "Products";

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  id: {
    type: Number,
    // default: createId,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

const productModel = mongoose.model(collection, schema);

export default productModel;
