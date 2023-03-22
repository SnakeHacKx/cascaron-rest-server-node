import { response } from "express";
import bcryptjs from 'bcryptjs';
import User from "../models/user.js";
import { generateJWT } from "../helpers/generate-jwt.js";

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    //* Verificar si el email existe
    const user = await User.findOne({ email });

    if (!user) {
      //! No poner lo del - correo al final, esto es solo para visualizarlo en desarrollo
      return res.status(400).json({
        msg: "El usuario o la contraseña no son correctos - correo",
      });
    }

    //* Verificar si el usuario esta activo
    if (!user.state) {
      //! No poner lo del - estado: false al final, esto es solo para visualizarlo en desarrollo
      return res.status(400).json({
        msg: "El usuario o la contraseña no son correctos - estado: false",
      });
    }

    //* Verificar la contraseña
    // el compareSync compara la contraseña ingresada y la que esta en base de datos
    const validPassword = bcryptjs.compareSync(password, user.password);
    
    if (!validPassword) {
      //! No poner lo del - password al final, esto es solo para visualizarlo en desarrollo
      return res.status(400).json({
        msg: "El usuario o la contraseña no son correctos - password",
      });
    }

    //* Generar el JWT
    const token = await generateJWT(user.id);

    // res.json({
    //   msg: "login ok"
    // });


    res.json({
      user,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hable con el administrador" });
  }
};

export { login };
