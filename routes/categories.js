import { Router } from "express";
import { check } from "express-validator";
import {
  createCategory,
  getCategories,
  getCategoryById,
} from "../controllers/categories.js";
import { existCategoryById } from "../helpers/db-validators.js";

import { validateJWT, validateFields } from "../middlewares/index.js";

export const router_categories = Router();

// Obtener todas las categorias - publico
router_categories.get("/", getCategories);

// Obtener una categoria por id - publico
router_categories.get(
  "/:id",
  [
    check('id').custom(existCategoryById)
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
router_categories.put("/:id", (req, res) => {
  res.json("put");
});

// Borrar una categoria - Administrador
router_categories.delete("/:id", (req, res) => {
  res.json("delete");
});

export default router_categories;
