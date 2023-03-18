// {
//   name: 'name';
//   email: 'example@example.com',
//   password: 'gretwhgtr564r54h5tr4h5s',
//   img: '645665736756',
//   role: 'admin',
//   state: false, // si el usuario esta activo o ha eliminado
//   google: true,
// }

import { Schema, model } from 'mongoose';

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },

  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
  },

  password: {
    type: String,
    required: [true, 'La contraseña es obligatorio'],
  },

  img: {
    type: String,
  },

  role: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE']
  },

  state: {
    type: Boolean,
    default: true
  },

  google: {
    type: Boolean,
    default: false
  }
});

/**
 * Funcion que saca la version y la contraseña del objeto json, ya que no es buena
 * practica mantener la contraseña del usuario.
 */
UserSchema.methods.toJSON = function () {
  // Con el ...user lo que hago es que el resto de parametros los pongo todos ahi (en el user)
  const { __v, password, ...user } = this.toObject();
  return user;
}

export default model('User', UserSchema);