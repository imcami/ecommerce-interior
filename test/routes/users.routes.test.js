import chai from "chai";
import chaiHttp from "chai-http";
import { expect } from "chai";
import { request, activeCookie } from "../setup.test.js";

chai.use(chaiHttp);
const app = require("../../src/app.js");

describe("Ruta de usuarios", () => {
  it("Deberia iniciar sesión", async () => {
    const res = await request(app).get("/login");
    expect(res.statusCode).toEqual(200);
  });

  it("Deberia realizar el registro", async () => {
    const res = await request(app).get("/signup");
    expect(res.statusCode).toEqual(200);
  });

  it("Deberia enviar token para reestablecer la contraseña", async () => {
    const res = await request(app).get("/restore");
    expect(res.statusCode).toEqual(200);
  });

  it("Ruta para reestablecer contraseña ", async () => {
    const res = await request(app).get("/restorePass/token123");
    expect(res.statusCode).toEqual(200);
  });

  it("Ruta para usuarios premium por id  ", async () => {
    const res = await request(app).put("/premium/user123");
    expect(res.statusCode).toEqual(200);
  });

  it("Deberia subir archivos", async () => {
    const res = await request(app).post("/user123/documents");
    expect(res.statusCode).toEqual(200);
  });

  it("Deberia subir foto de Perfil", async () => {
    const res = await request(app).post("/user123/current");
    expect(res.statusCode).toEqual(200);
  });
});
