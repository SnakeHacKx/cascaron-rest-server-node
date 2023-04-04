import { Schema, model } from "mongoose";

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },

  state: {
    type: Boolean,
    default: true,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Esto tiene que estar igual al del modelo en user.js
    required: true,
  },

  price: {
    type: Number,
    default: 0,
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: "Category", // Relacion con el modelo de categoria
    required: true,
  },

  description: { type: String },
  
  available: { type: Boolean, default: true },

  image: { type: String },
});

ProductSchema.methods.toJSON = function () {
  // Con el ...user lo que hago es que el resto de parametros los pongo todos ahi (en el user)
  const { __v, state, ...data } = this.toObject();
  return data;
};

export default model("Product", ProductSchema);
