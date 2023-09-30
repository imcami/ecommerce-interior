import CartManager from "../dao/cart.dao.js";

const cartManager = new CartManager();

export const createOne = async (cart) => {
  try {
    const newCart = await cartManager.createOne(cart);
    return newCart;
  } catch (error) {
    throw error;
  }
};

export const findById = async (id) => {
  try {
    const cart = await cartManager.findById(id);
    return cart;
  } catch (error) {
    throw error;
  }
};

export const findByIdAndPopulate = async (id, populate) => {
  try {
    const cart = await cartManager.findByIdAndPopulate(id, populate);
    return cart;
  } catch (error) {
    throw error;
  }
};

export const findOneAndUpdate = async (filter, update, options) => {
  try {
    const updatedCart = await cartManager.findOneAndUpdate(
      filter,
      update,
      options
    );
    return updatedCart;
  } catch (error) {
    throw error;
  }
};

export const deleteOne = async (id) => {
  try {
    const deletedCart = await cartManager.deleteOne(id);
    return deletedCart;
  } catch (error) {
    throw error;
  }
};

export const deleteProductOnCart = async (cid, pid) => {
  try {
    const filter = { _id: cid };
    const update = { $pull: { products: { id_prod: pid } } };
    const options = { new: true };
    const updatedCart = await cartManager.findOneAndUpdate(
      filter,
      update,
      options
    );
    return updatedCart;
  } catch (error) {
    throw error;
  }
};

export const deleteCart = async (cid) => {
  try {
    const emptyCart = await cartManager.deleteCart(cid);
    return emptyCart;
  } catch (error) {
    throw error;
  }
};
