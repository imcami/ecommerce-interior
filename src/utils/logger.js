import winston from "winston";

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
    format: winston.format.simple(),
    transports: [
      new winston.transports.Console({
        level,
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: "./errors.log",
        level: "error",
      }),
    ],
  });

const logger = createLogger("debug"); // Logger para desarrollo
const prodLogger = createLogger("info"); // Logger para producción

export const addLogger = (req, res, next) => {
  req.logger = process.env.NODE_ENV === "development" ? logger : prodLogger;
  next();
};

export default logger;
