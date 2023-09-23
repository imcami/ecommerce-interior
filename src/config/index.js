import dotenv from "dotenv";
import { options } from "../utils/commander.js";

const env = options.mode;

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
  port: pss.PORT || 8081,
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
  stripe_secret: pss.STRIPE_SECRET,
  production_domain: pss.PRODUCTION_DOMAIN,
};
