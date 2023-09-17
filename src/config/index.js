import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program
  .option("-m, --mode <mode>", "development environment", "dev")
  .option("-m, --mode <mode>", "testing environment", "test")
  .option("-m, --mode <mode>", "production environment", "prod")
  .option("-f, --file <file>", "the file to read")
  .option("-t --timeout <timeout>", "the timeout to read");

program.parse();

const env = program.opts.mode;

let envFilePath = "";

if (env === "dev") {
  envFilePath = "./.env.development";
} else if (env === "test") {
  envFilePath = "./.env.testing";
} else {
  envFilePath = "./.env.production";
}

dotenv.config({ path: envFilePath });

const pss = process.env;

export default {
  port: +pss.PORT | 8081,
  mongo_url: pss.MONGO_URI,
  signed_cookie: pss.SIGNED_COOKIE,
  session_secret: pss.SESSION_SECRET,
  github_client_id: pss.GITHUB_CLIENT_ID,
  github_client_secret: pss.GITHUB_CLIENT_SECRET,
  google_client_id: pss.GOOGLE_CLIENT_ID,
  google_client_secret: pss.GOOGLE_CLIENT_SECRET,
  mailing_user: pss.MAILING_USER,
  mailing_service: pss.MAILING_SERVICE,
  mailing_password: pss.MAILING_PASSWORD,
  node_env: pss.NODE_ENV,
};
