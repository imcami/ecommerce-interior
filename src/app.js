import express from "express";
import { engine } from "express-handlebars";
import port from "./config/index.js";
// import logger from "./middlewares/addlogger.middleware.js";
import { router } from "./routes/index.js";
import session from "express-session";
import { __dirname } from "./utils/path.js";
import { initializePassport } from "./utils/passport.js";
import compression from "express-compression";
import { addLogger } from "./utils/logger.js";
import MongoStore from "connect-mongo"; //sessions con mongodb
import * as path from "path";
import config from "./config/index.js";
import passport from "passport";

//config
export const app = express();

const server = app.listen(port, () => {
  console.log(`Server listening on port: ${port ?? 8080} 🥳`);
  // logger.info(`Server listening on port: ${port} 🥳`);
});

//middleware
app.use(
  session({
    //sessions en mongo atlas
    store: MongoStore.create({
      mongoUrl: config.mongo_url,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 300, // 5 minutos
    }),
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false, //Evita guardar sesiones vacias
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(compression({ brotli: { enabled: true, zlib: {} } })); //Comprimir response con Brotli
app.use(addLogger); //Agrego logger a request

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

// Handlebars como motor de plantillas por defecto
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views")); // ruta de mis vistas
// Rutas
app.use("/api/v1", router);
