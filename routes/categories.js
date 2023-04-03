import { Router } from "express";
import { check } from "express-validator";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.js";
import { existCategoryById } from "../helpers/db-validators.js";

import { validateJWT, validateFields, hasAdminRole } from "../middlewares/index.js";

export const router_categories = Router();

// Obtener todas las categorias - publico
router_categories.get("/", getCategories);

// Obtener una categoria por id - publico
router_categories.get(
  "/:id",
  [
    check("id", "No es un id de Mongo válido").isMongoId(),
    check("id").custom(existCategoryById),
    validateFields,
  ],
  getCategoryById
  );
  
  // Crear categoria - privado - cualquier persona con un token valido
  router_categories.post(
    "/",
    [
      validateJWT,
      check("name", "El nombre es obligatorio").not().isEmpty(),
      validateFields,
    ],
    createCategory
);

// Actualizar categoria - privado - cualquier persona con un token valido
router_categories.put("/:id", [
  validateJWT,
  check("category", "No es un id de Mongo").isMongoId(),
  check("name", "El nombre es obligatorio").not().isEmpty(),
  check("id").custom(existCategoryById),
  validateFields,
], updateCategory);

// Borrar una categoria - Administrador
router_categories.delete("/:id", [
  validateJWT,
  hasAdminRole,
  check("id", "No es un id de Mongo válido").isMongoId(),
  check("id").custom(existCategoryById),
  validateFields
],deleteCategory);

export default router_categories;
