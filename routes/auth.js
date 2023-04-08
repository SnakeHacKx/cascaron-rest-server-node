import { Router } from "express";
import { check } from "express-validator";

import { googleSignIn, login, renewToken } from "../controllers/auth.js";
import { validateFields, validateJWT } from "../middlewares/index.js";

export const router_auth = Router();

router_auth.post("/login", [
  check("email", "El correo es obligatorio").isEmail(),
  check("password", "La contraseña es obligatoria").not().isEmpty(),
  validateFields
], login);

router_auth.post("/google", [
  check("id_token", "El id_token es obligatorio").not().isEmpty(),
  validateFields
], googleSignIn);

router_auth.get("/", validateJWT, renewToken);

export default router_auth;