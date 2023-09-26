// We import the form validation function from an external module
import formValidation from "./modules/formValidation.js";

// Dom elements
const d = document,
  $form = d.querySelector("form"),
  $submitBtn = d.getElementById("submit-btn"),
  $removeBtn = d.querySelector(".remove-btn"),
  entpoint = `https://64fbd694605a026163ae0ce0.mockapi.io/users`;

// Get info using Fetch
function getInfo(options) {
  let { url, metodo, exito, datos } = options;

  fetch(url, {
    method: metodo || "GET",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(datos),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((res) => exito(res))
    .catch((err) => {
      let message = `Error ${err.status || "00"}: ${err.statusText || "unknown error"
        }`;
      d.querySelector(
        ".users-table"
      ).innerHTML = `<td colspan="4">${message}</td>`;
    });
}

d.addEventListener("DOMContentLoaded", () => {
  // Show info in DOM
  getInfo({
    url: entpoint,
    exito: (res) => {
      let usersHtml = "";
      res.forEach((el) => {
        // Generate an HTML table with the data obtained.
        usersHtml += `
                <tr>
                    <td>${el.name}</td>
                    <td class="email">${el.email}</td>
                    <td>${el.age}</td>
                    <td>
                        <button class="edit-btn btn" data-id=${el.id
          } data-name=${encodeURIComponent(el.name)} data-email=${el.email
          } data-age=${el.age}>Edit</button>
                        <button class="delete-btn btn" data-id=${el.id
          }>Delete</button>
                    </td>
                </tr>
            `;
      });
      formValidation();
      d.querySelector(".users-table").innerHTML = usersHtml;
    },
  });
});

// Click
d.addEventListener("click", (e) => {
  // We show or hide a confirmation box to delete items.
  if (e.target.matches(".delete-btn") || e.target.matches(".cancel-btn")) {
    d.querySelector(".confirmation-box").classList.toggle("is-active");
    $removeBtn.dataset.id = e.target.getAttribute("data-id");
  }

  // We delete an item when the deletion is confirmed.
  if (e.target.matches(".remove-btn")) {
    d.querySelector(".confirmation-box").classList.toggle("is-active");
    getInfo({
      exito: () => location.reload(),
      url: `${entpoint}/${e.target.getAttribute("data-id")}`,
      metodo: "DELETE",
    });
  }

  // We fill the form with the data of the element selected to edit.
  if (e.target.matches(".edit-btn")) {
    $submitBtn.value = "Edit user";
    $submitBtn.classList.add("clicked");
    $form.email.value = e.target.getAttribute("data-email");
    $form.name.value = decodeURIComponent(e.target.getAttribute("data-name"));
    $form.age.value = e.target.getAttribute("data-age");
    $form.hidden.id = e.target.getAttribute("data-id");
  }

  // We restore the form to the initial state.
  if (e.target.matches(".clean-btn")) {
    $submitBtn.classList.remove("clicked");
    $submitBtn.value = "Add user";
  }
});

// Submit
$form.addEventListener("submit", (e) => {
  e.preventDefault();
  let metodo = $form.hidden.id ? "PUT" : "POST";

  // We send the form data to the API
  getInfo({
    url: `${entpoint}/${$form.hidden.id || ""}`,
    metodo,
    exito: () => location.reload(),
    datos: {
      name: $form.name.value,
      email: $form.email.value,
      age: $form.age.value,
    },
  });
});
