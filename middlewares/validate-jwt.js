import jwt from "jsonwebtoken";
import User from "../models/user.js";

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Leer al usuario que corresponde al uid
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: "Token no válido - usuario no existente en base de datos"
      });
    }

    // Verificar si el uid tiene estado en true
    if (!user.state) {
      return res.status(401).json({
        msg: "Token no válido - usuario con estado false"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({
      msg: "Token no válido",
    });
  }
};

export { validateJWT };
