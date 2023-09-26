import winston from "winston";
import { options } from "./commander.js";

const levelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "cyan",
  },
};

winston.addColors(levelOptions.colors); // Inicializa los colores para Winston

const createLogger = (level) =>
  winston.createLogger({
    levels: levelOptions.levels,
    transports: [
      new winston.transports.Console({
        level,
        format: winston.format.combine(
          winston.format.colorize({ colors: levelOptions.colors }),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: "./errors.log",
        level: "error",
        format: winston.format.simple(),
      }),
    ],
  });

export const devLogger = createLogger("debug"); // Logger para desarrollo
export const prodLogger = createLogger("info"); // Logger para producción

export const addLogger = (req, res, next) => {
  req.logger = options.mode === "development" ? devLogger : prodLogger;
  next();
};
