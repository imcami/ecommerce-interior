import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  products: [
    {
      id_prod: {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],

  amount: {
    type: Number,
    required: true,
  },

  purchaser: {
    type: String,
    required: true,
  },
});

export const ticketModel = model("ticker", ticketSchema);
