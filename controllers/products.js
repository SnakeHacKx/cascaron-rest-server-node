import { response } from "express";
import { Product } from "../models/index.js";

/**
 * Crea una nueva categoría
 * @param {request} req Solicitud HTTP
 * @param {response} res Respuesta HTTP
 */
const createProduct = async (req, res = response) => {
  const { state, user, ...body } = req.body;

  const productDB = await Product.findOne({ name: body.name });

  if (productDB) {
    return res.status(400).json({
      msg: `El producto ${productDB.name} ya existe`,
    });
  }

  // Generar la data a guardar
  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.user._id,
  };

  const product = new Product(data);

  // Guardar en DB
  await product.save();

  res.status(201).json(product);
};

/**
 * Obtiene los productos
 * @param {request} req Solicitud HTTP
 * @param {response} req Respuesta HTTP
 */
const getProducts = async (req = request, res = response) => {
  // Argumentos opcionales
  const { limit = 5, from = 0 } = req.query;

  // Regreso solo los productos que tengan el state en true
  const query = { state: true };
  // TODO: validar que el from y el limit sean numeros

  //* El Promise.all hace que se ejecuten las promesas de forma simultanea
  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("user", "name")
      .populate("category", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    products,
  });
};

/**
 * Obtiene un producto por su ID
 */
const getProductById = async (req, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  res.json(product);
};

/**
 * Actualiza un producto por su ID
 */
const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase();
  }

  data.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.json(product);
};

/**
 * Elimina un producto por su ID {state: false}
 */
const deleteProduct = async (req, res = response) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );

  res.json(deletedProduct);
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
