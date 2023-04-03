import { response } from "express";
import { Category } from "../models/index.js";

/**
 * Crea una nueva categoría
 * @param {request} req Solicitud HTTP
 * @param {response} res Respuesta HTTP
 */
const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      msg: `La categoria ${categoryDB.name} ya existe`,
    });
  }

  // Generar la data a guardar
  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);

  // Guardar en DB
  await category.save();

  res.status(201).json(category);
};

/**
 * Obtiene las categorias
 */
const getCategories = async (req = request, res = response) => {
  // Argumentos opcionales
  const { limit = 5, from = 0 } = req.query;

  // Regreso solo las categorias que tengan el state en true
  const query = { state: true };
  // TODO: validar que el from y el limit sean numeros

  //* El Promise.all hace que se ejecuten las promesas de forma simultanea
  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate("user", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    categories,
  });
};

/**
 * Obtiene una categoria por su ID
 */
const getCategoryById = async (req, res = response) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate("user", "name");

  res.json(category);
};



// updateCategory
const updateCategory = async (req, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const category = await Category.findByIdAndUpdate(id, data, { new: true });

  res.json(category);
};

// removeCategory - state:false
const deleteCategory = async (req, res = response) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndUpdate(
    id,
    { state: false },
    { new: true }
  );

  res.json(deletedCategory);
};

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
