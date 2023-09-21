import { main } from "@securesubstrates/pqkms";
import "./style.css";

async function sendForm(form: HTMLFormElement) {
  let formData = new FormData(form);
  let domain_prefix = formData.get("domain") as string;
  let email = formData.get("email") as string;
  let password = formData.get("password") as string;
  console.log(`FormData: ${domain_prefix} => ${email} => ${password}`);
  await main(
    domain_prefix,
    email,
    password,
    "https://registrar.pqkms.dev:8443"
  );
}

const onSubmit = (event: Event) => {
  event.preventDefault();
  if (event.currentTarget) {
    sendForm(event.currentTarget as HTMLFormElement);
    // .then((response) => response.json())
    // .then((data) => alert(`Response ID: ${data.id}`))
    // .catch(() => alert("HTTP Error!"));
  } else {
    alert("Invalid event target for registration form");
  }
};

const init = () => {
  const form = document.querySelector("body > div > form");
  if (form) {
    form.addEventListener("submit", onSubmit);
  } else {
    alert(`Invalid registration test configuration`);
  }
};

init();
