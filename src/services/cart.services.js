import Cart from "../dao/cart.dao.js";

class CartService {
  async createOne(obj) {
    return await Cart.createOne(obj);
  }

  async findOneById(cid) {
    return await Cart.findOneById(cid);
  }
  async findOneAndUpdate(filter, update, options) {
    try {
      return await Cart.findOneAndUpdate(filter, update, options);
    } catch (error) {
      return error;
    }
  }

  async deleteOne(pid) {
    return await Cart.deleteOne(pid);
  }

  async deleteCart(cid) {
    const emptyCart = await Cart.findOneById(cid);
    emptyCart.products = [];
    await emptyCart.save();
    return emptyCart;
  }

  async updateCart(cid, pid, quantity) {
    const cart = await Cart.findOneById(cid);
    cart.products = { products: [{ id_prod: pid, quantity: quantity }] };
    await cart.updateOne();
    return cart;
  }
}

const cartService = new CartService();
export default cartService;
