import express from "express";
import cors from "cors";

import { router_users } from "../routes/users.js";
import { router_auth } from "../routes/auth.js";
import { router_categories } from "../routes/categories.js";
import { dbConnection } from "../database/config.js";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth:       "/api/auth",
      categories: "/api/categories",
      users:      "/api/users"
    };

    // Conectar a la base de datos
    this.connectToDB();

    // Middlewares
    this.middlewares();

    //Rutas de la aplicación
    this.routes();
  }

  /**
   * Metodo que manda a llamar a la base de datos
   */
  async connectToDB() {
    await dbConnection();
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
    this.app.use(this.paths.users, router_users);
    this.app.use(this.paths.auth, router_auth);
    this.app.use(this.paths.categories, router_categories);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

export default Server;
