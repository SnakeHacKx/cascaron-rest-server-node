import { User, Category, Product } from "../models/index.js";
import Role from "../models/role.js";

const isValidRole = async (role = "") => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`El rol ${role} no está registrado en la Base de Datos`);
  }
};

const emailAlreadyExists = async (email = "") => {
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    throw new Error(`El correo ${email} ya está registrado`);
  }
};

const existUserById = async (id) => {
  
  // console.log(typeof id);

  const userExists = await User.findById(id);

  if (!userExists) {
    throw new Error(`El id ${id} no existe en la base de datos`);
  }
};

const existCategoryById = async (id) => {
  const categoryExists = await Category.findById(id);

  if (!categoryExists) {
    throw new Error(`La categoria con ${id} no existe en la base de datos`);
  }
};

const existProductById = async (id) => {
  const productExists = await Product.findById(id);

  if (!productExists) {
    throw new Error(`La categoria con ${id} no existe en la base de datos`);
  }
};

/**
 * Valida las colecciones permitidas
 */
const allowedCollections = (collection = "", collections = []) => {
  const included = collections.includes(collection);
  if (!included) {
    throw new Error(
      `La colección ${collection} no está permitida - colecciones permitidas: ${collections}`
    );
  }

  return true;
};

// TODO: Implementar esta validacion
const validarJSON = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ status: 404, message: err.message }); // Bad request
  }
  next();
};

export {
  isValidRole,
  emailAlreadyExists,
  existUserById,
  existCategoryById,
  existProductById,
  allowedCollections,
};
