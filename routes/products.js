import { Router } from "express";
import { check } from "express-validator";

import {
  validateJWT,
  validateFields,
  hasAdminRole,
} from "../middlewares/index.js";

import {
  existCategoryById,
  existProductById,
} from "../helpers/db-validators.js";

import {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/products.js";

export const router_products = Router();

// Obtener todas las categorias - publico
router_products.get("/", getProducts);

// Obtener una categoria por id - publico
router_products.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existProductById),
    validateFields,
  ],
  getProductById
);

// Crear nuevo producto - privado - cualquier persona con un token valido
router_products.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("category", "No es un id de Mongo").isMongoId(),
    check("category").custom(existCategoryById),
    validateFields,
  ],
  createProduct
);

// Actualizar producto - privado - cualquier persona con un token valido
router_products.put(
  "/:id",
  [
    validateJWT,
    // check("category", "No es un id de Mongo").isMongoId(),
    check("id").custom(existProductById),
    validateFields,
  ],
  updateProduct
);

// Borrar un producto - Administrador
router_products.delete(
  "/:id",
  [
    validateJWT,
    hasAdminRole,
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existProductById),
    validateFields,
  ],
  deleteProduct
);

export default router_products;
