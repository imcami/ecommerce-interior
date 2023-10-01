import {
  createOne,
  findByIdAndPopulate,
  findOneAndUpdate,
} from "../services/cart.services.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import productService from "../services/products.service.js";
import ticketService from "../services/ticket.service.js";

export const createCart = async (req, res) => {
  try {
    const newCart = await createOne({ products: [] });
    req.session.cart = newCart._id;
    return res.status(200).json(newCart);
  } catch (error) {
    console.error("Error en createCart: ", error);
    return res
      .status(500)
      .json({ message: "Hubo un error al crear el carrito." });
  }
};

export const findCartById = async (req, res) => {
  const cid = req.params.cid;
  try {
    if (!req.session.user) {
      return res.redirect("/");
    }
    const cart = await findByIdAndPopulate(cid, "products.id_prod");
    return res
      .status(200)
      .render("carts", { cart: cart, user: req.session.user });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Hubo un error al buscar el carrito.", error: error });
  }
};

export const updateOne = async (req, res) => {
  const cid = req.params.cid;
  const { pid, quantity } = req.body;
  try {
    const cart = await findByIdAndPopulate(cid, "products.id_prod");
    const productIndex = cart.products.findIndex(
      (product) => product.id_prod == pid
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado en el carrito." });
    }
    const updatedQuantity = cart.products[productIndex].quantity + quantity;
    const filter = { _id: cid, "products.id_prod": pid };
    const update = { $set: { "products.$.quantity": updatedQuantity } };
    const options = { new: true };
    const updatedCart = await findOneAndUpdate(filter, update, options);
    res.status(200).send(updatedCart);
  } catch (error) {
    res.status(500).send({
      message: "Hubo un error al actualizar el carrito.",
      error: error,
    });
  }
};

export const deleteProductOnCart = async (req, res) => {
  try {
    if (!req.params.cid || !req.params.pid) {
      return res.status(400).json({ message: "Faltan parámetros." });
    }
    const cartId = req.params.cid;
    const productId = req.params.pid;
    if (!isAuthenticated(req.user, cartId)) {
      return res.status(403).json({ message: "No autorizado." });
    }
    const filter = { _id: cartId };
    const update = { $pull: { products: { id_prod: productId } } };
    const options = { new: true };
    const updatedCart = await findOneAndUpdate(filter, update, options);
    if (!updatedCart) {
      return res.status(404).json({ message: "Carrito no encontrado." });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res
      .status(500)
      .json({ error: error, message: "Error al procesar la solicitud." });
  }
};

export const updateProductQuantityOnCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const { quantity } = req.body;
  try {
    const filter = { _id: cid, "products.id_prod": pid };
    const update = { $set: { "products.$.quantity": quantity } };
    const options = { new: true };
    const updatedCart = await findOneAndUpdate(filter, update, options);
    res.status(200).send(updatedCart);
  } catch (error) {
    res
      .status(500)
      .send({ error: error, message: "Error al procesar la solicitud." });
  }
};

export const purchaseCart = async (req, res, next) => {
  const cid = req.params.cid;
  try {
    const cart = await findByIdAndPopulate(cid, "products.id_prod");
    req.session.beforePurchaseCart = cart;
    const productsWithStock = [];
    const productsWithoutStock = [];
    let purchaseTotal = 0;
    await asyncForEach(cart.products, async (cartProduct) => {
      const pid = cartProduct.id_prod._id;
      const product = await productService.findById(pid);
      if (product.stock >= cartProduct.quantity) {
        productsWithStock.push(cartProduct);
        purchaseTotal += product.price * cartProduct.quantity;
        const filterCart = { _id: cid };
        const updateCart = {
          $pull: { products: { id_prod: cartProduct.id_prod._id } },
        };
        await findOneAndUpdate(filterCart, updateCart, {
          new: true,
        });
        const filterProduct = { _id: cartProduct.id_prod._id };
        const updateProduct = { $inc: { stock: -cartProduct.quantity } };
        await prodcuctService.updateOneProd(filterProduct, updateProduct, {
          new: true,
        });
      } else {
        productsWithoutStock.push({
          id: cartProduct.id_prod._id,
          stock: product.stock,
          purchaseAttemtQuantity: cartProduct.quantity,
        });
      }
    });
    if (productsWithStock.length > 0) {
      const newTicket = await ticketService.create({
        code: await getNextSequence("Incrementacion del ticket"),
        purchaser: req.user.email,
        products: productsWithStock,
        amount: purchaseTotal,
      });
      req.session.purchase =
        productsWithoutStock.length > 0
          ? {
              message:
                "Algunos productos no tienen stock suficiente para realizar la compra",
              ticket: newTicket,
              productsWithoutStock: productsWithoutStock,
            }
          : { message: "", ticket: newTicket };
      next();
    } else {
      res.status(200).json(
        productsWithoutStock.length > 0
          ? {
              message: "No hay suficiente stock para realizar la compra",
              productsWithoutStock: productsWithoutStock,
            }
          : { message: "No hay productos en el carrito" }
      );
    }
  } catch (error) {
    res.status(500).send({ error: error, message: "Error en purchaseCart" });
  }
};

//Redirige a la página de checkout
export const checkoutSession = async (req, res) => {
  try {
    res.redirect(303, `/api/payments/checkout-session`);
  } catch (error) {
    res.status(500).send({ error: error, message: "Error en checkoutSession" });
  }
};

//Renderiza la página de checkout
export const checkout = async (req, res) => {
  try {
    const { purchase } = req.session;
    if (!purchase) {
      return res.redirect("/api/v1/products");
    }
    req.session.purchase = null;
    return res.render("checkout", {
      message: purchase.message,
      ticket: purchase.ticket,
      productsWithoutStock: purchase.productsWithoutStock,
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).send({ error: error, message: "Error en checkout" });
  }
};

//Renderiza la página de checkout exitoso

export const checkoutSuccess = async (req, res) => {
  try {
    const { purchase } = req.session;
    if (!purchase) {
      return res.redirect("/api/v1/products");
    }
    req.session.purchase = null;
    return res.render("checkoutSuccess", {
      message: purchase.message,
      ticket: purchase.ticket,
      productsWithoutStock: purchase.productsWithoutStock,
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).send({ error: error, message: "Error en checkout" });
  }
};
