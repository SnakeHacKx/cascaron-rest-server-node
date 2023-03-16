import express from "express";
import { router } from "../routes/users.js";
import cors from 'cors';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.usersPath = '/api/users';

    // Middlewares
    this.middlewares();

    //Rutas de la aplicación
    this.routes();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body en JSON
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static("public"));
  }

  /**
   * Rutas del servidor
   */
  routes() {
    this.app.use(this.usersPath, router);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

export default Server;
