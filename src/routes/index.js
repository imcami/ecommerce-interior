import { Router } from "express";
import viewRouter from "./views.routes.js";
import userRouter from "./users.routes.js";
import productRouter from "./products.routes.js";
import cartRouter from "./cart.routes.js";
import paymentRouter from "./payment.routes.js";
import sessionRouter from "./session.routes.js";

export const router = Router();

// Definición de rutas
router.use("/views", viewRouter);
router.use("/users", userRouter);
router.use("/session", sessionRouter);
router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use("/payment", paymentRouter);
