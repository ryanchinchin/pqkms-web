import {
  register_user,
  fetch_user_projects,
  login_user,
} from "@securesubstrates/pqkms";
import "./style.css";

const REG_STATUS_SELECTOR: string = `body > div.registration > div.read-the-docs`;

const LOGIN_STATUS_SELECTOR: string = `body > div.login > div.read-the-docs`;

async function sendRegistrationRequest(form: HTMLFormElement): Promise<string> {
  let formData = new FormData(form);
  let domain_prefix = formData.get("domain") as string;
  let email = formData.get("email") as string;
  let password = formData.get("password") as string;
  return register_user(
    domain_prefix.trim(),
    email.trim(),
    password,
    "https://registrar.pqkms.dev:8443"
  );
}

async function sendLoginRequest(form: HTMLFormElement): Promise<string> {
  let formData = new FormData(form);
  let email = formData.get("email") as string;
  let password = formData.get("password") as string;
  let project_list = await fetch_user_projects(
    "https://registrar.pqkms.dev:8443",
    email.trim()
  );
  let auth_inf = await login_user(project_list[0], password);
  let sk = await auth_inf.enclaveSigningKey();
  let jwk = await globalThis.crypto.subtle.exportKey("jwk", sk);
  return JSON.stringify(jwk);
}

function regDivElement(): HTMLDivElement {
  return document.querySelector("body > div.registration") as HTMLDivElement;
}

function statusElement(selector: string): HTMLDivElement | null {
  let status_element = document.querySelector(selector) as HTMLDivElement;

  if (status_element) {
    return status_element;
  } else {
    let reg_elem = regDivElement();

    if (reg_elem) {
      let status_element = document.createElement("div");
      reg_elem.appendChild(status_element);
      return status_element;
    } else {
      return null;
    }
  }
}

function setStatus(selector: string, msg: string) {
  let status = statusElement(selector);
  if (status) {
    status.innerText = msg;
  }
}

const doRegistration = (event: Event) => {
  event.preventDefault();
  if (event.currentTarget) {
    sendRegistrationRequest(event.currentTarget as HTMLFormElement)
      .then((m) => setStatus(REG_STATUS_SELECTOR, m))
      .catch((e) => {
        setStatus(REG_STATUS_SELECTOR, `Registration failed: ${e.message}`);
      });
  } else {
    setStatus(
      REG_STATUS_SELECTOR,
      "Invalid event target for registration form"
    );
  }
};

const doLogin = (event: Event) => {
  event.preventDefault();
  if (event.currentTarget) {
    sendLoginRequest(event.currentTarget as HTMLFormElement)
      .then((m) => setStatus(LOGIN_STATUS_SELECTOR, m))
      .catch((e) => {
        alert(`Login failed: ${e}`);
      });
  } else {
    alert("Invalid event target for registration form");
  }
};

const init = () => {
  const registration_form = document.querySelector(
    "body > div.registration > form"
  );

  const login_form = document.querySelector("body > div.login > form");

  if (registration_form) {
    registration_form.addEventListener("submit", doRegistration);
  }

  if (login_form) {
    login_form.addEventListener("submit", doLogin);
  }
};

init();
