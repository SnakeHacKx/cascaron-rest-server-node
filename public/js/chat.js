let user = null;
let socket = null;
const url = `${window.location.origin}/api/auth/`;

// Referencias HTML
const txtUid = document.querySelector("#txtUid");
const txtMessage = document.querySelector("#txtMessage");
const ulUsers = document.querySelector("#ulUsers");
const ulMessages = document.querySelector("#ulMessages");
const google_signout = document.querySelector("#google_signout");

/**
 * Valida el JWT del localStorage con sockets
 */
const validateJWT = async () => {
  const token = localStorage.getItem("token") || "";

  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token en el servidor");
  }

  const resp = await fetch(url, {
    headers: { "x-token": token },
  });

  const { user: userDB, token: tokenDB } = await resp.json();
  // console.log(userDB, tokenDB);

  // Renovar el token
  localStorage.getItem("token", tokenDB);
  user = userDB;
  document.title = user.name;

  await connectSocket();
};

const connectSocket = async () => {
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log("Sockets online");
  });

  socket.on("disconnect", () => {
    console.log("Sockets offline");
  });

  socket.on("receive-message", drawMessages);

  socket.on("connected-users", drawActiveUsers);

  socket.on("private-message", (payload) => {
    console.log("Privado: ", payload);
  });
};

const drawActiveUsers = (users = []) => {
  let usersHTML = "";
  users.forEach(({ name, uid }) => {
    usersHTML += `
    <li class="list-group-item">
      <p>
        <h5 class="text-success">${name}</h5>
        <span class="fs-6 text-muted">${uid}</span>
      </p>
    </li>
    `;
  });

  ulUsers.innerHTML = usersHTML;
};

const drawMessages = (messages = []) => {
  let messagesHTML = "";
  messages.forEach(({ username, message }) => {
    messagesHTML += `
    <li class="list-group-item">
      <p>
        <span class="text-primary">${username}: </span>
        <span>${message}</span>
      </p>
    </li>
    `;
  });

  ulMessages.innerHTML = messagesHTML;
};

txtMessage.addEventListener("keyup", ({ keyCode }) => {
  const message = txtMessage.value;
  const uid = txtUid.value;

  // TODO: hacer mas validaciones (ejemplo: pasarlo por el trim)

  if (keyCode !== 13) return;

  if (message.length === 0) return;

  //* Recomendación
  // Siempre mandar un objeto, aunque sea un solo argumento, ya que
  // podria ser que despues se requiera mandar mas informacion y es
  // mucho mas facil de implementar
  socket.emit("send-message", { message, uid });

  txtMessage.value = "";
});

const main = async () => {
  await validateJWT();
};

main();
