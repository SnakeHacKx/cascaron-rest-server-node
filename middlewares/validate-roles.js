const hasAdminRole = (req, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Se quiere verificar el rol sin verificar el token primero",
    });
  }

  // Esto se puede hacer ya que en routes/users.js ya llamo antes a
  // validateJWT y ya poseo al usuario en la request
  const { role, name } = req.user;
  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} no es administrador - No puede realizar esta acción`
    });
  }

  next();
};

const hasRole = ( ...roles ) => {
  return (req, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "Se quiere verificar el rol sin verificar el token primero",
      });
    }

    if (!roles.includes(req.user.role)) { 
      return res.status(401).json({
        msg: `Solo puedes realizar esta acción si tienes estos roles: ${roles}`,
      });
    }

    next();
  }
}

export { hasAdminRole, hasRole };
