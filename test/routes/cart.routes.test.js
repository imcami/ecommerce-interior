import { describe, it } from "node:test";
import { activeCookie } from "../setup.test.js";
import chaiHttp from "chai-http";
import { expect } from "chai";

chai.use(chaiHttp);

describe("Test de rutas del carrito", () => {
  it("Deberia obtener el carrito del usuario", async () => {
    const response = await request.get("/api/cart").set("Cookie", activeCookie);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });

  it("Deberia agregar un producto al carrito", async function () {
    const response = await request
      .post("/api/v1/cart")
      .set("Cookie", activeCookie)
      .send({ productId: "60c9d2c3b6e1b21e3c9b0b2e" });
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });
  it("Deberia actualizar la cantidad de un producto del carrito", async () => {
    const response = await request
      .put("/api/cart/60c9d2c3b6e1b21e3c9b0b2e")
      .set("Cookie", activeCookie)
      .send({ quantity: 2 });
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });

  it("Deberia eliminar un producto del carrito", async () => {
    const response = await request
      .delete("/api/v1/cart/60c9d2c3b6e1b21e3c9b0b2e")
      .set("Cookie", activeCookie);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });
  it("Deberia vaciar el carrito", async () => {
    const response = await request
      .delete("/api/v1/cart")
      .set("Cookie", activeCookie);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });
  it("Deberia comprar el carrito", async () => {
    const response = await request
      .post("/api/v1/cart/purchase")
      .set("Cookie", activeCookie);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });
  it("Deberia obtener la sesion de pago", async () => {
    const response = await request
      .get("/api/cart/v1/checkout-session")
      .set("Cookie", activeCookie);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
  });
  it("Deberia obtener la pagina de checkout", async () => {
    const response = await request
      .get("/api/v1/cart/checkout")
      .set("Cookie", activeCookie);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
  });
});
