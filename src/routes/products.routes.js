import { Router } from "express";
import {
  isAuthenticated,
  authAdminOrUserPremium,
} from "../middlewares/auth.middlewares.js";
import {
  createOneProduct,
  updateOneProduct,
  deleteOneProduct,
} from "../controllers/products.controller.js";

import {
  findAllProducts,
  findProduct,
} from "../controllers/products.controller.js";

const router = Router();
// Obtener todos los productos (GET)
router.get("/", isAuthenticated, findAllProducts);

// Obtener un producto por su id (GET)
router.get("/pid", isAuthenticated, findProduct);

// Usuario Premium
//Crear un producto (POST)
router.post("/", authAdminOrUserPremium, createOneProduct);
//Actualizar un producto (PATCH)
router.patch("/:pid", authAdminOrUserPremium, updateOneProduct);
//Eliminar un producto (DELETE)
router.delete("/:pid", authAdminOrUserPremium, deleteOneProduct);

export default router;
