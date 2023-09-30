import productService from "../services/products.service.js";
import logger from "../utils/logger.js";
export const findAllProducts = async (req, res) => {
  try {
    const products = await productService.getAll(query);
    products ? res.status(200).json(products) : res.status(200).json(products);

    if (products) {
      res.render("products");
    } else {
      res.status(200).send({ message: "No hay productos" });
    }
  } catch (error) {
    req.error("Error al encontrar los productos");
    error.status(500).json({ error: error });
  }
};

export const findProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productService.findById(pid);
    if (product) {
      res.render("productDetail", { product });
    } else {
      res.status(200).json({ message: "No hay productos" });
    }
  } catch (error) {
    logger.error("Error al encontrar el producto");
    res.status(500).json({ error: error });
  }
};
export const createOneProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock ||
      !status ||
      !category
    ) {
      CustomError.createError({
        name: "Error de creacións",
        cause: generateProductErrorInfo(req.body),
        message: "Error al crear el producto",
      });
      return;
    }

    const ownerEmail = req.user.role === "Premium" ? req.user.email : undefined;

    const newProduct = await createOne({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
      owner: ownerEmail,
    });

    res
      .status(201)
      .send({ message: "Producto creado exitosamente", product: newProduct });
  } catch (error) {
    req.logger.error("Error in createOneProduct");
    next(error);
  }
};

export const updateOneProduct = async (req, res) => {
  const pid = req.params.pid;
  const product = await productService.findById(pid);
  const obj = req.body;
  try {
    // rol del usuario
    if (
      req.user.role === "Admin" ||
      (req.user.role === "Premium" && req.user.email === product.owner)
    ) {
      await updateOne(pid, obj);
      res.status(200).send({ message: "Product update" });
    }
  } catch (error) {
    req.logger.error("Error in updateOneProduct");
    res.status(500).json({ error: error });
  }
};

export const deleteOneProduct = async (req, res) => {
  const pid = req.params.pid;
  const product = await productService.findById(pid);
  try {
    //comprobar rol del usuario
    if (
      req.user.role === "Admin" ||
      (req.user.role === "Premium" && req.user.email === product.owner)
    ) {
      const deleteProduct = await productService.deleteOne(pid);
      res
        .status(200)
        .json({ message: "Product delete", product: deleteProduct });
    }
  } catch (error) {
    req.logger.error("Error in deleteOneProduct");
    res.status(500).json({ error: error });
  }
};
