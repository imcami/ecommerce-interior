
import Cart from './models/cart.model.js';

export class CartDAO {
  async getCartByuserModelId(userId) {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) throw new Error('Cart not found');
    return cart;
  }

  async addItemToCart(userId, { productId, quantity }) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');
    
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());

    if (existingItemIndex > -1) {
      // Actualizar cantidad si el producto ya existe en el carrito
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Añadir nuevo producto al carrito
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    return cart;
  }

  async removeItemFromCart(userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');
    
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());

    if (existingItemIndex > -1) {
      cart.items.splice(existingItemIndex, 1);
      await cart.save();
    } else {
      throw new Error('Product not found in cart');
    }

    return cart;
  }
}
