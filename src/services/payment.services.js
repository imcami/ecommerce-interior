import Stripe from "stripe";
import { options } from "../utils/commander.js";
import productService from "./products.service.js";
import config from "../config/index.js";

const enviroment = options.mode;
const domain =
  enviroment === "production"
    ? process.env.PRODUCTION_DOMAIN
    : `http://localhost:${config.port}`;

export default class PaymentService {
  constructor() {
    this.stripe = Stripe(config.stripe_secret);
  }
  createPaymentIntent = async (data) => {
    const paymentIntent = await this.stripe.paymentIntents.create(data);
    return paymentIntent;
  };
  createCheckoutSession = async (ticket) => {
    const items = await Promise.all(
      ticket.products.map(async (prod) => {
        const product = await productService.findById(prod.id_prod);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              images: [product.thumbnails[0]],
            },
            unit_amount: product.price * 100,
          },
          quantity: prod.quantity,
        };
      })
    );

    const session = await this.stripe.checkout.sessions.create({
      line_items: items,
      mode: "payment",
      success_url: `${domain}/api/v1/payments/success`,
      cancel_url: `${domain}/api/v1/payments/cancel`,
    });
    return session;
  };
  createCustomer = async (ticket) => {
    const customer = await this.stripe.customers.create({
      email: ticket.purchaser.email,
      id: ticket.code,
    });
    return customer;
  };
}
