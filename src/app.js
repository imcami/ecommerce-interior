import express from "express";
import { engine } from "express-handlebars";
import port from "./config/index.js";
import { router } from "./routes/index.js";
import session from "express-session";
import { __dirname } from "./utils/path.js";
import { initializePassport } from "./utils/passport.js";
import compression from "express-compression";
import { addLogger, prodLogger } from "./utils/logger.js";
import MongoStore from "connect-mongo";
import * as path from "path";
import config from "./config/index.js";
import passport from "passport";
import cookieParser from "cookie-parser";

export const app = express();
const PORT = config.port || 8080;

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
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.signed_cookie));
app.use(express.static(path.join(__dirname, "../public")));
app.use(addLogger);
app.use(compression({ brotli: { enabled: true, zlib: {} } }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongo_url,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 300,
    }),
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/api/v1", router);

// Server
const server = app.listen(PORT, () => {
  prodLogger.info(`Server listening on port: ${PORT} 🥳`);
});
