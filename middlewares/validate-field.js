import { validationResult } from "express-validator";

const validateFields = (req, res, next) => { 
  // Validacion con express-validator
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(400).json(validationErrors);
  }

  // Si llega a este punto, sigue con el siguiente middleware
  next();
}

export {
  validateFields
};