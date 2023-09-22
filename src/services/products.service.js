import ProductManager from "../dao/products.dao.js";

class ProductService {
  // Buscar todos los productos
  async findAll(filter, obj) {
    try {
      const products = await ProductManager.findAll(filter, obj);
      return products;
    } catch (error) {
      return error;
    }
  }
  //Buscar producto por id
  async findById(id) {
    try {
      const product = await ProductManager.findOneById(id);
      return product;
    } catch (error) {
      return error;
    }
  }
  //Crear un producto con createOne()
  async createOne(obj) {
    try {
      const products = await ProductManager.createOne(obj);
      return products;
    } catch (error) {
      return error;
    }
  }
  // Actualizar un producto con updateOne()
  async updateOne(id, obj) {
    try {
      const updateProduct = await ProductManager.updateOne(id, obj);
      return updateProduct;
    } catch (error) {
      return error;
    }
  }

  // Eliminar producto con daleteOne

  async deleteOne(id) {
    try {
      const deleteProduct = await ProductManager.deleteOne(id);
      return deleteProduct;
    } catch (error) {
      return error;
    }
  }
}

const productService = new ProductService();
export default productService;
