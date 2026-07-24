import "./Login.scss";
import { authService } from "../../utils/auth";
import { renderAuthForm } from "../../components/authForm";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = renderAuthForm({
  pageClass: "login",
  title: "Вход",
  fields: [
    {
      id: "login-username",
      name: "login",
      label: "Логин",
      type: "text",
      placeholder: "ivanivanov",
      autocomplete: "username",
    },
    {
      id: "login-password",
      name: "password",
      label: "Пароль",
      type: "password",
      placeholder: "••••••••",
      autocomplete: "current-password",
    },
  ],
  submitText: "Войти",
  link: {
    href: "/sign-up",
    text: "Зарегистрироваться",
  },
});

const form = document.querySelector<HTMLFormElement>("form");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usernameInput = form.querySelector<HTMLInputElement>('input[name="login"]');
    const passwordInput = form.querySelector<HTMLInputElement>('input[name="password"]');

    const username = usernameInput?.value.trim() ?? "";
    const password = passwordInput?.value.trim() ?? "";
    
    const usernameError = form.querySelector<HTMLSpanElement>(".form-page__error_login");
    const passwordError = form.querySelector<HTMLSpanElement>(".form-page__error_password");

    const showFieldError = (
      input: HTMLInputElement | null,
      errorEl: HTMLSpanElement | null,
      message: string
    ) => {
      if (!input || !errorEl) return;
      input.classList.toggle("form-page__input_invalid", !!message);
      input.setAttribute("aria-invalid", String(!!message));
      errorEl.textContent = message;
    };

    let hasError = false;

    if (!username) {
      showFieldError(usernameInput, usernameError, "Пожалуйста, заполните поле Логин");
      hasError = true;
    } else {
      showFieldError(usernameInput, usernameError, "");
    }

    if (!password) {
      showFieldError(passwordInput, passwordError, "Пожалуйста, заполните поле Пароль");
      hasError = true;
    } else {
      showFieldError(passwordInput, passwordError, "");
    }

    if (hasError) return;

    authService.setUser({
      id: username,
      username,
      email: "",
      firstName: "",
      lastName: "",
    });
    window.location.href = "/";
  });
}
