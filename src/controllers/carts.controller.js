import { createOne, findByIdAndPopulate } from "../services/cart.services.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
import ticketService from "../services/ticket.service.js";
export const createCart = async (req, res) => {
  try {
    const newCart = await createOne({ products: [] });
    res.status(200).json(newCart);
    return (req.session.cart = newCart._id); // Guardo el id del carrito en la sesión
  } catch (error) {
    req.logger.error("Error en createCart: " + error);
    res.status(500).json({ message: "Hubo un error al crear el carrito." });
  }
};

export const findCartById = async (req, res) => {
  const cid = req.params.cid;
  try {
    if (!req.session.user) {
      res.redirect("/");
    }
    const cart = await findByIdAndPopulate(cid, "products.id_prod");
    res.status(200).render("carts", { cart: cart, user: req.session.user });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Hubo un error al buscar el carrito.", error: error });
  }
};
export const updateOne = async (req, res) => {
  const cid = req.params.cid;
  const { pid, quantity } = req.body;
  try {
    const cart = await cartService.findByIdAndPopulate(cid, "products.id_prod");
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
    const updatedCart = await cartService.findOneAndUpdate(
      filter,
      update,
      options
    );
    res.status(200).send(updatedCart);
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Hubo un error al actualizar el carrito.",
        error: error,
      });
  }
};

export const deleteProductOnCart = async (req, res) => {
  try {
    // Validación básica de los parámetros
    if (!req.params.cid || !req.params.pid) {
      return res.status(400).json({ message: "Faltan parámetros." });
    }

    const cartId = req.params.cid;
    const productId = req.params.pid;

    // Verificar que el usuario esté autorizado para hacer cambios en el carrito
    if (!isAuthenticated(req.user, cartId)) {
      return res.status(403).json({ message: "No autorizado." });
    }

    // Actualizar el carrito
    const filter = { _id: cartId };
    const update = { $pull: { products: { id_prod: productId } } };
    const options = { new: true };
    const updatedCart = await cartService.findOneAndUpdate(
      filter,
      update,
      options
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Carrito no encontrado." });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    // Enviar error al cliente
    res
      .status(500)
      .json({ error: error, message: "Error al procesar la solicitud." });
  }
};

export const updateProductQuantityOnCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const { quantity } = req.body; //Consulto el dato quantity enviado por postman
  try {
    //find cart and product and update quantity
    const filter = { _id: cid, "products.id_prod": pid };
    const update = { $set: { "products.$.quantity": quantity } };
    const options = { new: true };
    const updatedCart = await cartService.findOneAndUpdate(
      filter,
      update,
      options
    );
    res.status(200).send(updatedCart);
  } catch (error) {
    req.logger.error("Error en updateProductQuantityOnCart");
    res
      .status(500)
      .send("Error: Cart ID o Product ID o quantity Incorrectos \n\n" + error);
  }
};

export const purchaseCart = async (req, res, next) => {
  const cid = req.params.cid;
  try {
    const cart = await cartService.findByIdAndPopulate(cid, "products.id_prod");
    req.session.beforePurchaseCart = cart;
    //console.log(cart);
    const productsWithStock = [];
    const productsWithoutStock = [];
    let purchaseTotal = 0;

    //check if products have enough stock
    await asyncForEach(cart.products, async (cartProduct) => {
      const pid = cartProduct.id_prod._id;
      const product = await productService.findById(pid);

      if (product.stock >= cartProduct.quantity) {
        //Se agrega producto al array de productos con stock
        productsWithStock.push(cartProduct);

        //se suma el precio del producto al total de la compra
        purchaseTotal += product.price * cartProduct.quantity;

        //se elimina el producto del carrito
        const filterCart = { _id: cid };
        const updateCart = {
          $pull: { products: { id_prod: cartProduct.id_prod._id } },
        };
        const optionsCart = { new: true };
        await cartService.findOneAndUpdate(filterCart, updateCart, optionsCart);

        // Se reduce el stock del producto
        const filterProduct = { _id: cartProduct.id_prod._id };
        const updateProduct = { $inc: { stock: -cartProduct.quantity } };
        const optionsProduct = { new: true };
        await productService.findOneAndUpdate(
          filterProduct,
          updateProduct,
          optionsProduct
        );
      } else {
        productsWithoutStock.push({
          id: cartProduct.id_prod._id,
          stock: product.stock,
          purchaseAttemtQuantity: cartProduct.quantity,
        });
      }
    });

    //Crear el ticket
    if (productsWithStock.length > 0) {
      const newTicket = await ticketService.create({
        code: await getNextSequence("Incrementacion del ticket"),
        purchaser: req.user.email,
        products: productsWithStock,
        amount: purchaseTotal,
      });
      if (productsWithoutStock.length > 0) {
        req.session.purchase = {
          message:
            "Algunos productos no tienen stock suficiente para realizar la compra",
          ticket: newTicket,
          productsWithoutStock: productsWithoutStock,
        };
      } else {
        req.session.purchase = { message: "", ticket: newTicket };
      }
      next();
    } else {
      if (productsWithoutStock.length > 0) {
        res.status(200).json({
          message: "No hay suficiente stock para realizar la compra",
          productsWithoutStock: productsWithoutStock,
        });
      } else {
        res.status(200).json({ message: "No hay productos en el carrito" });
      }
    }
  } catch (error) {
    req.logger.error("Error en purchaseCart");
    res.status(500).send(error);
  }
};

export const checkoutSession = async (req, res) => {
  try {
    res.redirect(303, `/api/payments/checkout-session`);
  } catch (error) {
    req.logger.error("Error en checkoutSession");
    res.status(500).send("Error: \n\n" + error);
  }
};

export const checkout = async (req, res) => {
  try {
    res.render("checkout", { user: req.session.user });
  } catch (error) {
    req.logger.error("Error en checkout");
    res.status(500).send("Error: \n\n" + error);
  }
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
