const myForm = document.querySelector("form");

  // Google Token | ID_TOKEN
  // console.log("id_token: ", response.credential);

  // con window.location.origin se obtiene por decir de una manera el root de la url
  // lo cual no importa si la url es http o https
  // const url = `${window.location.origin}/api/auth/google`;
  const url = `${window.location.origin}/api/auth/`;

myForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const formData = {};

  // For por cada uno de los elementos del formulario, ignora a
  // los que no tienen name y crea el formData
  for (let element of myForm.elements) {
    if (element.name.length > 0) {
      formData[element.name] = element.value;
    }
  }

  fetch(url + "login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .then(({token}) => {
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch(err => { 
      console.log(err);
    });
});

function handleCredentialResponse(response) {

  const body = { id_token: response.credential };

  fetch(url + "google", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then(({ token }) => {
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch(console.warn);
}

const button = document.getElementById("google_signout");
button.onclick = () => {
  console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();

  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
  });
};
