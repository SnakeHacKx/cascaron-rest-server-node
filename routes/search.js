import { Router } from "express";
import { search } from "../controllers/index.js";

export const router_search = Router();

// collection: coleccion a la que pertenece el termino a buscar (productos, bebidas, usuarios, etc...)
// term: término de búsqueda
router_search.get("/:collection/:term", search);