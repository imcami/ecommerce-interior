import { Router } from "express";
import {
  cancelPayment,
  createCheckoutSession,
  successPayment,
} from "../controllers/payment.controller.js";
const router = Router();

// generar una orden de compra llamando esta ruta
router.get("/checkout-session", createCheckoutSession);

router.get("/success", successPayment);

router.get("/cancel", cancelPayment);

export default router;
