/*
It attaches event listeners for keyup and form submission and performs input validation.
*/
const d = document;

export default function sendEmail() {
  const $inputs = d.querySelectorAll(".form [required]");

  // Create and insert error message spans for each required input field.
  $inputs.forEach((input) => {
    const $span = d.createElement("span");
    $span.dataset.id = input.name;
    $span.textContent = input.title;
    $span.classList.add("contact-form-error", "none");
    input.insertAdjacentElement("afterend", $span);
  });

  // Listen for keyup events to perform input validation.
  d.addEventListener("keyup", (e) => {
    if (e.target.matches(".form [required]")) {
      let $input = e.target;
      let pattern = $input.pattern;
      let span = d.querySelector(`span[data-id="${$input.name}"]`);

      if ($input.value === "") return span.classList.remove("is-active");

      if ($input.value > 100 || $input.value < 1)
        return span.classList.add("is-active");

      if (pattern && $input.value !== "") {
        let regex = new RegExp(pattern);

        return !regex.exec($input.value)
          ? span.classList.add("is-active")
          : span.classList.remove("is-active");
      }
    }
  });
}
