import { Router } from "express";
import { check } from "express-validator";
import {
  loadFile,
  showImage,
  updateImage,
  updateImageCloudinary,
} from "../controllers/index.js";
import { allowedCollections } from "../helpers/index.js";
import { validateFields, validateUploadFile } from "../middlewares/index.js";

export const router_uploads = Router();

router_uploads.post("/", loadFile);

router_uploads.put(
  "/:collection/:id",
  [
    validateUploadFile,
    check("id", "No es un id de Mongo").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    // check('file').exists(),
    validateFields,
  ],
  updateImageCloudinary
  // updateImage
);

router_uploads.get(
  "/:collection/:id",
  [
    check("id", "No es un id de Mongo").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
  ],
  showImage
);

export default router_uploads;
