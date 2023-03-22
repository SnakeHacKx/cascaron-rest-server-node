import { Router } from "express";
import { check } from "express-validator";

import { login } from "../controllers/auth.js";
import { validateFields } from "../middlewares/validate-field.js";

export const router_auth = Router();

router_auth.post("/login", [
  check("email", "El correo es obligatorio").isEmail(),
  check("password", "La contraseña es obligatoria").not().isEmpty(),
  validateFields
],login);

export default router_auth;