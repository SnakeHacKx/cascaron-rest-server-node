import path from "path";
import fs from "fs";
import * as url from "url";
import * as dotenv from "dotenv";
import * as cloudinary from "cloudinary";

import { response } from "express";
import { uploadFile } from "../helpers/index.js";
import { User, Product } from "../models/index.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const loadFile = async (req, res = response) => {
  try {
    // const name = await uploadFile(req.files, ["txt", "pdf"], 'texts');
    const name = await uploadFile(req.files, undefined, "imgs");

    res.json({
      name,
    });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const updateImage = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No se ha encontrado el usuario con el id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No se ha encontrado el producto ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "No se ha implementado esta función en el backend",
      });
  }

  // Limpiar imagenes previas
  try {
    if (model.image) {
      // Hay que borrar la imagen del server
      const imagePath = path.join(
        __dirname,
        "../uploads",
        collection,
        model.image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
  } catch (err) {
    console.log(err);
  }

  // Aqui collection en el ultimo parametro es solamente para decir que quiero que
  // me ponga el nombre de la carpeta igual a como se llama la coleccion
  const name = await uploadFile(req.files, undefined, collection);
  model.image = name;

  await model.save();

  res.json(model);
};

const updateImageCloudinary = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No se ha encontrado el usuario con el id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No se ha encontrado el producto ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "No se ha implementado esta función en el backend",
      });
  }

  // Limpiar imagenes previas
  try {
    if (model.image) {
      const nameArr = model.image.split("/");
      const name = nameArr[nameArr.length - 1];
      const [public_id] = name.split(".");
      cloudinary.uploader.destroy(public_id);
    }
  } catch (err) {
    console.log(err);
  }

  // Subir imagen a Cloudinary
  try {
    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    model.image = secure_url;
    await model.save();
    res.json(model);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al subir la imagen a Cloudinary",
    });
  }
};

const showImage = async (req, res = response) => {
  const { id, collection } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No se ha encontrado el usuario con el id ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No se ha encontrado el producto ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "No se ha implementado esta función en el backend",
      });
  }

  // Limpiar imagenes previas
  try {
    if (model.image) {
      // Hay que borrar la imagen del server
      const imagePath = path.join(
        __dirname,
        "../uploads",
        collection,
        model.image
      );

      if (fs.existsSync(imagePath)) {
        return res.sendFile(imagePath);
      }
    }
  } catch (err) {
    console.log(err);
  }

  const imagePath = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(imagePath);
};

export { loadFile, updateImage, updateImageCloudinary, showImage };
