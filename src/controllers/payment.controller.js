import { findOneAndUpdate } from "../services/cart.services.js";
import PaymentService from "../services/payment.services.js";
import { sendMail } from "../utils/nodemailer.js";
export const createCheckoutSession = async (req, res) => {
  try {
    if (!req.session || !req.session.purchase || !req.session.purchase.ticket) {
      throw new Error("Sesion de compra o ticket no encontrados ");
    }
    const cartId = req.session.user.cart.id_cart;
    const paymentService = new PaymentService();
    const { ticket } = req.session.purchase;

    const checkoutSession = await paymentService.createCheckoutSession(ticket);
    res.redirect(303, checkoutSession.url);
  } catch (error) {
    res
      .status(400)
      .json({ error: error, message: "Error en createCheckoutSession" });
  }
};
export const successPayment = async (req, res) => {
  try {
    if (!req.session || !req.session.purchase || !req.session.purchase.ticket) {
      throw new Error("Session de compra o ticket no encontrados");
    }

    const { ticket } = req.session.purchase;

    if (!req.user || !req.user.email) {
      throw new Error("El usuario o el email no fueron encontrados");
    }

    if (!ticket.products || !Array.isArray(ticket.products)) {
      throw new Error("Productos comprados no encontrados  ");
    }

    sendMail(
      req.user.email,
      `Confirmacion de compra #${ticket.code}`,
      "Compra efectuada exitosamente",
      `<h1>Hemos confirmado tu compra</h1>
          <h3>El total de tu compra es de $${ticket.amount}</h3>
          <h3>Los productos que compraste son:</h3>
          <ul>
              ${ticket.products.map(
                (product) =>
                  `<li>${product.id_prod} - ${product.quantity} unidades</li>`
              )}
          </ul>
          <h3>Gracias por tu compra</h3>`,
      null
    );
    res.render("successcheckout", { user: req.session.user });
  } catch (error) {
    res.status(500).json({ error: error, message: "Error en successPayment" });
  }
};

export const cancelPayment = async (req, res) => {
  try {
    if (
      !req.session ||
      !req.session.beforePurchaseCart ||
      !req.session.user ||
      !req.session.user.cart
    ) {
      throw new Error(
        "Sesion, beforePurchaseCart, usuario o carrito no encontrados"
      );
    }

    const beforePurchaseCart = req.session.beforePurchaseCart;
    const cartId = req.session.user.cart.id_cart;

    if (!beforePurchaseCart.products) {
      throw new Error("beforePurchaseCart.products no encontrados");
    }

    const filter = { _id: cartId };
    const update = { products: beforePurchaseCart.products };
    const options = { new: true };
    const newCart = await findOneAndUpdate(filter, update, options);

    if (!newCart) {
      throw new Error("Carrito no encontrado o no actualizado");
    }

    res.redirect(`/api/v1/cart/${cartId}`);
  } catch (error) {
    res.status(500).json({ error: error, message: "Error en cancelPayment" });
  }
};
