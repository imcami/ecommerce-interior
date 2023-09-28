import chai from "chai";
import chaiHttp from "chai-http";
import { expect } from "chai";
import { request, activeCookie } from "../setup.test.js";

chai.use(chaiHttp);
const app = require("../../src/app.js");

describe("Ruta de usuarios", () => {
  it("Deberia iniciar sesión", async () => {
    const res = await request(app).get("api/v1/session/login");
    expect(res.statusCode).toEqual(200);
  });

  it("Deberia realizar el registro", async () => {
    const res = await request(app).get("api/v1/session/signup");
    expect(res.statusCode).toEqual(200);
  });

  it("Deberia enviar token para reestablecer la contraseña", async () => {
    const res = await request(app).get("api/v1/session/restore");
    expect(res.statusCode).toEqual(200);
  });

  it("Ruta para reestablecer contraseña ", async () => {
    const res = await request(app).get("api/v1/session/restorePass/token123");
    expect(res.statusCode).toEqual(200);
  });

  it("Ruta para usuarios premium por id  ", async () => {
    const res = await request(app).put("api/v1/premium/user123");
    expect(res.statusCode).toEqual(200);
  });

  it("Deberia subir archivos", async () => {
    const res = await request(app).post("api/v1/user123/documents");
    expect(res.statusCode).toEqual(200);
  });

  it("Deberia subir foto de Perfil", async () => {
    const res = await request(app).post("api/v1/user123/profile");
    expect(res.statusCode).toEqual(200);
  });
});
