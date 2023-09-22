import express from "express";
import {
  createCart,
  findCartById,
  updateOne,
  deleteProductOnCart,
  updateProductQuantityOnCart,
  purchaseCart,
  checkoutSession,
  checkout,
} from "../controllers/carts.controller.js";

const router = express.Router();

// Definición de rutas
router.post("/", createCart); // Crear un nuevo carrito
router.get("/:cid", findCartById); // Encontrar un carrito por su Id
router.put("/:cid", updateOne); // Actualizar un carrito
router.delete("/:cid/product/:pid", deleteProductOnCart); // Eliminar un producto del carrito
router.put("/:cid/product/:pid", updateProductQuantityOnCart); // Actualizar cantidad de un producto en el carrito
router.post("/:cid/purchase", purchaseCart); // Comprar productos del carrito
router.get("/checkout-session", checkoutSession); // Redirigir a la sesión de pago
router.get("/checkout", checkout); // Renderizar página de checkout

export default router;
