import nodemailer from "nodemailer";
import config from "../config/index.js";
import logger from "./logger.js";

const email = config.mailing_service;
const password = config.mailing_password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: email,
    pass: password,
  },
});
export const sendMail = async (to, subject, text, html, attachments) => {
  try {
    const info = await transporter.sendMail({
      from: `"Docklin" <${email}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
      attachments: attachments,
      messageId: "id",
    });
    logger.info(`Message sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};
