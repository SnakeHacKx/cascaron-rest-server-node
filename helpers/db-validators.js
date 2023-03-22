import Role from "../models/role.js";
import User from "../models/user.js";

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
  const userExists = await User.findById(id);

  if (!userExists) {
    throw new Error(`El id ${id} no existe en la base de datos`);
  }
};

// TODO: implementar esta validacion
const validarJSON = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).send({ status: 404, message: err.message }); // Bad request
  }
  next();
};

export { isValidRole, emailAlreadyExists, existUserById };
