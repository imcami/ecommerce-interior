import mongoose from "mongoose";
import config from "./index.js";
//Conexion a MongoDB Atlas
const URL = config.mongo_url;

export default mongoose
  .connect(URL)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((error) => console.log(error));
