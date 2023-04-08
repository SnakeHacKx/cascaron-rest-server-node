import { Socket } from "socket.io"
import { checkJWT } from "../helpers/index.js";
import { Chat } from "../models/index.js";

const chat = new Chat();

/**
 * 
 * @param {*} socket 
 * @param {*} io Es todo el servidor de sockets
 * @returns 
 */
const socketController = async (socket = new Socket(), io) => {
  const user = await checkJWT(socket.handshake.headers["x-token"]); 

  if (!user) {
    return socket.disconnect();
  }

  // console.log("Se conectó:", user.name);

  //* Agregar el usuario conectado
  chat.connectUser(user);
  io.emit("connected-users", chat.usersArr);
  socket.emit("receive-message", chat.last10Messages);

  //* Conectar al usuario a una sala especial
  /*
    Las salas disonibles son: la global, la de socket.id y ahora se crea una tercera que
    sera la de user.id
  */
  socket.join(user.id);

  //* Limpiar cuando alguien se desconecta
  socket.on("disconnect", () => {
    // console.log("Se desconectó:", user.name);
    chat.disconnectUser(user.id);
    io.emit("connected-users", chat.usersArr);
  });


  socket.on("send-message", ({ uid, message }) => {
    
    if (uid) {
      // Mensaje privado
      socket.to(uid).emit("private-message", {from: user.name, message});
    } else {
      // Mensaje publico
      chat.sendMessage(user.id, user.name, message);
      io.emit("receive-message", chat.last10Messages);
    }

  })

}

export {
  socketController
}