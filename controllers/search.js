import { response } from "express";
import { Types } from "mongoose";
import { User, Product, Category } from "../models/index.js";

const { ObjectId } = Types;

const availableCollections = ["users", "categories", "products", "roles"];

const searchUsers = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const user = await User.findById(term);
    return res.json({
      // Si el usuario existe regreso el arreglo con el usuario, si no, un arreglo vacio
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(term, "i");

  //? Aqui tambien se podria implementar el User.count para saber cuantos resultados tengo
  const users = await User.find({
    $or: [
      { name: regex },
      { email: regex }, //? Aqui podria estar el nombre de usuario en FindAPro
    ],
    $and: [{ state: true }],
  });

  res.json({ results: users });
};

const searchCategories = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const category = await Category.findById(term);
    return res.json({
      results: category ? [category] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const categories = await Category.find({ name: regex, state: true });

  res.json({ results: categories });
};

const searchProducts = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  if (isMongoID) {
    const product = await Product.findById(term).populate("category", "name");
    return res.json({
      // Si el usuario existe regreso el arreglo con el usuario, si no, un arreglo vacio
      results: product ? [product] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const products = await Product.find({ name: regex, state: true }).populate(
    "category",
    "name"
  );

  res.json({ results: products });
};

const search = (req, res = response) => {
  const { collection, term } = req.params;

  if (!availableCollections.includes(collection)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${availableCollections}`,
    });
  }

  switch (collection) {
    case "users":
      searchUsers(term, res);
      break;

    case "categories":
      searchCategories(term, res);
      break;

    case "products":
      searchProducts(term, res);
      break;

    default:
      res.status(500).json({
        msg: "No se ha implementado esta búsqueda en el backend",
      });
  }
};

export { search };
