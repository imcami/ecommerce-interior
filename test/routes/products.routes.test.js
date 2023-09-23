import chai from "chai";
import chaiHttp from "chai-http";
import { expect } from "chai";
import { request, activeCookie } from "../setup.test.js";

chai.use(chaiHttp);

describe("Test de rutas de productos", () => {
  it("Deberia obtener todos los productos", async () => {
    const response = await request.get("/api/v1/products");
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });
  it("Deberia obtener un producto", async () => {
    const response = await request.get(
      "/api/v1/products/60c9d2c3b6e1b21e3c9b0b2e"
    );
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
  });
  it("Deberia crear un producto en usuario premium", async () => {
    const response = await request
      .post("/api/v1/products")
      .set("Cookie", activeCookie)
      .send({
        name: "Producto de prueba",
        description: "Producto de prueba",
        price: 1000,
        stock: 10,
        images: [
          "https://plus.unsplash.com/premium_photo-1680127402190-4ec85e040290?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3271&q=80",
        ], //imagen de prueba, mueble de madera
        categories: ["60c9d2c3b6e1b21e3c9b0b2e"],
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
  });
  it("Deberia actualizar un producto", async () => {
    const response = await request
      .patch("/api/v1/products/60c9d2c3b6e1b21e3c9b0b2e")
      .set("Cookie", activeCookie)
      .send({
        name: "Producto de prueba",
        description: "Producto de prueba",
        price: 1000,
        stock: 10,
        images: ["https://picsum.photos/200/300"],
        categories: ["60c9d2c3b6e1b21e3c9b0b2e"],
      });
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
  });
  it("Deberia eliminar un producto", async () => {
    const response = await request
      .delete("/api/v1/products/60c9d2c3b6e1b21e3c9b0b2e")
      .set("Cookie", activeCookie);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
  });
});
