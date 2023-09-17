import { config } from "dotenv";
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
  color: {
    fatal: "red",
    error: "orange",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

let logger;

if (config.node_env === "development") {
  logger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({ colors: levelOptions.color }),
          winston.format.simple()
        ),
      }),
      new winston.transports.Console({
        level: "http",
        format: winston.format.combine(
          winston.format.colorize({ colors: levelOptions.color }),
          winston.format.simple()
        ),
      }),
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ colors: levelOptions.color }),
          winston.format.simple()
        ),
      }),
      new winston.transports.Console({
        level: "warning",
        format: winston.format.combine(
          winston.format.colorize({ colors: levelOptions.color }),
          winston.format.simple()
        ),
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
      new winston.transports.File({
        filename: "./error.log",
        level: "error",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.prettyPrint()
        ),
      }),
      new winston.transports.File({
        filename: "./fatal.log",
        level: "fatal",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.prettyPrint()
        ),
      }),
    ],
  });
}

export const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};
export default logger;
