import request from "supertest";
import app from "../../src/app.js";

describe("Ruta para generar los pagos", () => {
  it("Deberia generar una orden de compra", async () => {
    const response = await request(app).get("/checkout-session");
    expect(response.statusCode).toBe(200);
  });

  it("Deberia enviar al usuario al checkout si es exitoso", async () => {
    const response = await request(app).get("/success");
    expect(response.statusCode).toBe(200);
  });

  it("Deberia cancelar la compra y redireccionar al usuario a su carrito", async () => {
    const response = await request(app).get("/cancel");
    expect(response.statusCode).toBe(200);
  });
});
