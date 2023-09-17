import mongoose from "mongoose";
import config from "./index.js";
import logger from "../middlewares/addlogger.middleware";

mongoose.connect(config.mongo_url);
