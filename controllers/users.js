import { request, response } from "express";

const getUsers = (req = request, res = response) => {
  const { q, name = "No name", apiKey, page = 1, limit } = req.query;

  res.json({
    msg: "GET API - controlador",
    q,
    name,
    apiKey,
    page,
    limit,
  });
};

const putUsers = (req, res = response) => {
  const { id } = req.params; // este id es el que esta en la ruta del put en users.js

  res.json({
    msg: "PUT API - controlador",
    id,
  });
};

const postUsers = (req, res = response) => {
  const { name, age } = req.body; // Esto es la información que solicita/manda el usuario

  res.json({
    msg: "POST API - controlador",
    name,
    age,
  });
};

const patchUsers = (req, res = response) => {
  res.json({
    msg: "PATCH API - controlador",
  });
};

const deleteUsers = (req, res = response) => {
  res.json({
    msg: "DELETE API - controlador",
  });
};

export { getUsers, postUsers, patchUsers, deleteUsers, putUsers };
