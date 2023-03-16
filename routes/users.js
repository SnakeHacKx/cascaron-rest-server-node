import { Router } from "express";
import {
  getUsers,
  postUsers,
  patchUsers,
  deleteUsers,
  putUsers,
} from "../controllers/users.js";

// Esto no es una instancia porque no lleva la palabra new
// solo se manda a llamara a la clase Router
export const router = Router();

router.get("/", getUsers);
router.put("/:id", putUsers);
router.post("/", postUsers);
router.delete("/", deleteUsers);
router.patch("/", patchUsers);

export default router;
