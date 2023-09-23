import productModel from "./models/product.model.js";

export default class ProductManager {
  async findAll(filter, obj) {
    try {
      const products = await productModel.find(filter, obj);
      return products;
    } catch (error) {
      return error;
    }
  }
  async findById(id) {
    try {
      const product = await productModel.findById(id);
      return product;
    } catch (error) {
      return error;
    }
  }
  async createOne(obj) {
    try {
      const products = await productModel.create(obj);
      return products;
    } catch (error) {
      return error;
    }
  }
  async updateOne(id, obj) {
    try {
      const updateProduct = await productModel.findByIdAndUpdate(id, obj);
      return updateProduct;
    } catch (error) {
      return error;
    }
  }
  async deleteOne(id) {
    try {
      const deleteProduct = await productModel.findByIdAndDelete(id);
      return deleteProduct;
    } catch (error) {
      return error;
    }
  }
}
