import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // createIndexes: true,
      // findOneAndUpdate: false,
    });

    console.log(' **** Base de datos online **** ');
  } catch (error) {
    throw new Error(`Error al iniciar la conexión a la base de datos: ${error.message}`);
  }
};

export { dbConnection };
