import express from "express";
import { engine } from "express-handlebars";
import port from "./config/index.js";
import logger from "./middlewares/addlogger.middleware.js";

//config
export const app = express();
const server = app.listen(port, () => {
  logger.info(`Server listening on port: ${port} 🥳`);
});

// Handlebars
app.engine(
  "hbs",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    extname: "hbs",
    helpers: {
      eq: function (a, b, options) {
        if (a === b) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      },
    },
  })
);
