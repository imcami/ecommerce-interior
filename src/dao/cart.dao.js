import cartModel from "./models/cart.model.js";

export default class CartDao {
  async createOne(obj) {
    try {
      const cart = await cartModel.create(obj);
      return cart;
    } catch (error) {
      return error;
    }
  }

  async findOneById(cid) {
    try {
      const cartId = await cartModel.findOne(cid).populate("products.id_prod");
      return cartId;
    } catch (error) {
      return error;
    }
  }
  async findOneAndUpdate(filter, update, options) {
    try {
      const cart = await cartModel.findOneAndUpdate(filter, update, options);
      return cart;
    } catch (error) {
      return error;
    }
  }

  async deleteOne(pid) {
    try {
      const cart = await cartModel.findByIdAndDelete(pid);
      return cart;
    } catch (error) {
      return error;
    }
  }

  async deleteCart(cid) {
    try {
      const emptyCart = await cartModel.findOne(cid);
      emptyCart.products = [];
      await emptyCart.save();
      return emptyCart;
    } catch (error) {
      return error;
    }
  }

  async updateOne(cid, pid, quantity) {
    try {
      const cart = await this.findOneById(cid);
      const arrayProducts = cart.products;
      const findProd = arrayProducts.findIndex((prod) => prod.id_prod == pid);
      arrayProducts[findProd].quantity =
        arrayProducts[findProd].quantity + quantity;
      const updateCart = await cartModel.updateOne(
        { _id: cid },
        { products: arrayProducts }
      );
      return updateCart;
    } catch (error) {
      return error;
    }
  }
}
