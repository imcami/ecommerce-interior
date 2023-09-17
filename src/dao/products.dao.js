import Product from "./models/product.model.js";

export class ProductDAO {
  async getProducts(queries) {
    let result;
    const prods = await Product.find({}); // obtener todos los productos de la base de datos

    // Filtramos los productos según el rango de precios, si es necesario
    queries.min || queries.max
      ? (result = prods.filter(({ price }) =>
          this.range(price, queries.min, queries.max)
        ))
      : (result = prods);

    if (!result) throw new Error("Productos no encontradoss");

    return result;
  }

  async addProduct(product) {
    const newProduct = new Product(product); // Creamos una nueva instancia del modelo Product con los datos del producto
    const result = await newProduct.save(); // Guardamos el nuevo producto en la base de datos
    return result;
  }

  range(value, min, max) {
    return (
      (typeof min === "undefined" || value >= min) &&
      (typeof max === "undefined" || value <= max)
    );
  }
}
