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

router.post("/", createCart); // Crear un nuevo carrito (POST)
router.get("/:cid", findCartById); // Encontrar un carrito por su Id (GET)
router.patch("/:cid", updateOne); // Actualizar un carrito (PATCH)
router.delete("/:cid/product/:pid", deleteProductOnCart); // Eliminar un producto del carrito (DELETE)
router.patch("/:cid/product/:pid", updateProductQuantityOnCart); // Actualizar la cantidad de un producto del carrito (PATCH)
router.post("/:cid/purchase", purchaseCart); // Comprar productos del carrito (POST)
router.get("/checkout", checkout); // Renderizar página de checkout exitoso (GET)

export default router;
