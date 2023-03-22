import { request, response } from "express";
import bcryptjs from "bcryptjs";
import User from "../models/user.js";

const getUsers = async (req = request, res = response) => {
  // Argumentos opcionales
  const { limit = 5, from = 0 } = req.query;

  // Regreso solo los usuarios que tengan el state en true
  const query = { state: true };
  // TODO: validar que el from y el limit sean numeros

  //* El Promise.all hace que se ejecuten las promesas de forma simultanea
  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({
    total,
    users,
  });
};

const putUsers = async (req, res = response) => {
  const { id } = req.params; // este id es el que esta en la ruta del put en users.js
  const { _id, password, google, email, ...rest } = req.body; // Sacamos lo que no se debe actualizar

  // TODO: validar contra base de datos

  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest);

  res.json(user);
};

const postUsers = async (req = request, res = response) => {
  const { name, email, password, role } = req.body; // Esto es la información que solicita/manda el usuario
  const user = new User({ name, email, password, role });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Guarda en la base de datos
  await user.save();

  res.json({
    msg: "POST API - controlador",
    user,
  });
};

const patchUsers = (req, res = response) => {
  res.json({
    msg: "PATCH API - controlador",
  });
};

const deleteUsers = async (req, res = response) => {
  const { id } = req.params;

  // const uid = req.uid;

  //! Borrar fisicamente (no recomendado)
  // const user = await User.findByIdAndDelete(id);

  //* Borrando cambiando el estado (recomendado)
  const user = await User.findByIdAndUpdate(id, { state: false });

  res.json(user);
};

export { getUsers, postUsers, patchUsers, deleteUsers, putUsers };
