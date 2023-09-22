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

router.get("/", isAuthenticated, findAllProducts);

//detalle del producto
router.get("/pid", isAuthenticated, findProduct);

// usuario premium
router.post("/", authAdminOrUserPremium, createOneProduct);
router.put("/:pid", authAdminOrUserPremium, updateOneProduct);
router.delete("/:pid", authAdminOrUserPremium, deleteOneProduct);

export default router;
