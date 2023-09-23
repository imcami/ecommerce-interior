import mongoose from "mongoose";
import config from "../src/config/index.js";
import { options } from "../src/utils/commander.js";
import { app } from "../src/app.js";

const enviorment = options.mode;
//  const domain = enviorment === "production" ? config.domain : `http://localhost:${config.port}`;
export const request = supertest(app);
//export const request = supertest('/');

export let activeCookie = null;

before(async () => {
  await mongoose.connect(config.mongo_url);
  const mockUser = {
    email: "adminemail@email.com",
    password: "adminpassword",
  };
  const res = await request.post("/api/session/login").send(mockUser);
  const cookieHeader = res.headers["set-cookie"][0];
  //console.log(response.headers);
  AdminCookie = {
    name: cookieHeader.split("=")[0],
    value: cookieHeader.split("=")[1],
  };
});
// beforeEach(async()=>{
//     this.timeout(5000);
// })
after(async () => {
  await mongoose.connection.close();
});
