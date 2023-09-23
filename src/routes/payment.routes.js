import { Router } from "express";
import {
  cancelPayment,
  createCheckoutSession,
  successPayment,
} from "../controllers/payment.controller.js";
const router = Router();

//Generar una orden de compra llamando esta ruta (GET), redirecciona al usuario a la pagina de pago.
router.get("/checkout-session", createCheckoutSession);
//Ruta para redireccionar al usuario en caso de que la compra sea exitosa (GET). Envia un mail de confirmacion.
router.get("/success", successPayment);
//Ruta para redireccionar al usuario en caso de que la compra sea cancelada (GET), redirecciona al usuario a su carrito.
router.get("/cancel", cancelPayment);

export default router;
