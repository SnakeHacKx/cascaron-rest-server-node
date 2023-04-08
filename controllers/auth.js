import { response } from "express";
import bcryptjs from "bcryptjs";
import User from "../models/user.js";
import { generateJWT } from "../helpers/generate-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

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
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hable con el administrador" });
  }
};

const googleSignIn = async (req, res = repsonse) => {
  const { id_token } = req.body;

  try {
    const { name, img, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      // Si el usuario no existe debo crearlo
      const data = {
        name,
        email,
        password: ":p",
        img,
        google: true,
        role: "USER_ROLE",
      };

      user = new User(data);
      await user.save();
    }

    // Si el usuario en DB tiene el estado en false
    if (!user.state) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    //* Generar el JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    json.status(400).json({ ok: false, msg: "El token no se pudo verificar" });
  }
};

/**
 * Se encarga de validar el token del usuario y de ser necesario, lo renueva
 */
const renewToken = async(req, res = response) => {
  const { user } = req;

  //* Generar el JWT
  const token = await generateJWT(user.id);

  res.json({
    user,
    token
  });
};

export { login, googleSignIn, renewToken };
