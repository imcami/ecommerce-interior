import ProductManager from "../dao/products.dao.js";

const productManager = new ProductManager();

class ProductService {
  // Buscar todos los productos
  async findAll(filter, obj) {
    try {
      const products = await productManager.findAll(filter, obj);
      return products;
    } catch (error) {
      return error;
    }
  }
  //Buscar producto por id
  async findById(id) {
    try {
      const product = await productManager.findById(id);
      return product;
    } catch (error) {
      return error;
    }
  }
  //Crear un producto con createOne()
  async createOne(obj) {
    try {
      const newProduct = await productManager.createOne(obj);
      return newProduct;
    } catch (error) {
      return error;
    }
  }
  // Actualizar un producto con updateOne()
  async updateOne(id, obj) {
    try {
      const updateProduct = await productManager.updateOne(id, obj);
      return updateProduct;
    } catch (error) {
      return error;
    }
  }

  // Eliminar producto con daleteOne

  async deleteOne(id) {
    try {
      const deleteProduct = await productManager.deleteOne(id);
      return deleteProduct;
    } catch (error) {
      return error;
    }
  }
}

const productService = new ProductService();
export default productService;
