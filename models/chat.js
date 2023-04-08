class Message {
  constructor(uid, username, message) {
    this.uid = uid;
    this.username = username;
    this.message = message;
  }
}

class Chat {
  constructor() {
    this.messages = [];
    this.users = {};
  }

  get last10Messages() {
    this.messages = this.messages.splice(0, 10);
    return this.messages;
  }

  get usersArr() {
    return Object.values(this.users); // [{}, {}, {}, {}, ...]
  }

  /**
   * Mansa un mensaje de un usuario a otro
   * @param {*} uid Identificador único del usuario que manda el mensaje
   * @param {*} username Nombre del usuario que manda el mensaje
   * @param {*} message Mensaje a enviar
   */
  sendMessage(uid, username, message) {
    this.messages.unshift(new Message(uid, username, message));
  }

  connectUser(user) {
    this.users[user.id] = user;
  }

  disconnectUser(id) {
    delete this.users[id];
  }
}

export default Chat;
