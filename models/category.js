import { Schema, model } from "mongoose";

const CategorySchema = Schema({
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
    required: true
  },
});

export default model("Category", CategorySchema);
