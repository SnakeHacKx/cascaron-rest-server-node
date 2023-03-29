import { Router } from "express";
import { check } from "express-validator";

import {
  emailAlreadyExists,
  existUserById,
  isValidRole,
} from "../helpers/db-validators.js";

import {
  validateFields,
  validateJWT,
  hasAdminRole,
  hasRole,
} from "../middlewares/index.js";

import {
  getUsers,
  createNewUser,
  patchUsers,
  deleteUsers,
  updateUser,
} from "../controllers/users.js";

// Esto no es una instancia porque no lleva la palabra new
// solo se manda a llamara a la clase Router
export const router_users = Router();

// router.cosoHTTP(ruta, middlewares para validaciones (opcional), controlador del coso HTTP);

router_users.get("/", getUsers);

router_users.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existUserById),
    check("role").custom(isValidRole),
    validateFields,
  ],
  updateUser
);

router_users.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La contraseña debe tener más de 6 caracteres").isLength({
      min: 6,
    }), // esto puede validarse con una expresion regular
    check("email", "El correo no es válido").isEmail(),
    check("email").custom(emailAlreadyExists),
    check("role").custom(isValidRole), //* Es lo mismo que esto: check("role").custom((role) => isValidRole(role)),
    // check('role', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validateFields,
  ],
  createNewUser
);

router_users.delete(
  "/:id",
  [
    validateJWT,
    // hasAdminRole,
    hasRole("ADMIN_ROLE", "RECRUITER_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existUserById),
    validateFields,
  ],
  deleteUsers
);

router_users.patch("/", patchUsers);

export default router_users;
