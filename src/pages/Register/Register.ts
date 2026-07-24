import "./Register.scss";
import { authService } from "../../utils/auth";
import { renderAuthForm } from "../../components/authForm";

const appDiv = document.querySelector<HTMLDivElement>("#app")!;
appDiv.className = "";
appDiv.innerHTML = renderAuthForm({
  pageClass: "register",
  title: "Регистрация",
  fields: [
    {
      id: "register-email",
      name: "email",
      label: "Почта",
      type: "email",
      placeholder: "pochta@yandex.ru",
      autocomplete: "email",
    },
    {
      id: "register-login",
      name: "login",
      label: "Логин",
      type: "text",
      placeholder: "ivanivanov",
      autocomplete: "username",
    },
    {
      id: "register-firstName",
      name: "first_name",
      label: "Имя",
      type: "text",
      placeholder: "Иван",
      autocomplete: "given-name",
    },
    {
      id: "register-lastName",
      name: "second_name",
      label: "Фамилия",
      type: "text",
      placeholder: "Фамилия",
      autocomplete: "family-name",
    },
    {
      id: "register-phone",
      name: "phone",
      label: "Телефон",
      type: "tel",
      placeholder: "Телефон",
      autocomplete: "tel",
    },
    {
      id: "register-password",
      name: "password",
      label: "Пароль",
      type: "password",
      placeholder: "Пароль",
      autocomplete: "new-password",
    },
    {
      id: "register-confirm-password",
      name: "confirm_password",
      label: "Подтвердите пароль",
      type: "password",
      placeholder: "Пароль (еще раз)",
      autocomplete: "new-password",
    },
  ],
  submitText: "Зарегистрироваться",
  link: {
    href: "/login",
    text: "Уже есть аккаунт? Войти",
  },
});

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

const form = document.querySelector<HTMLFormElement>("form");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
    const loginInput = form.querySelector<HTMLInputElement>('input[name="login"]');
    const firstNameInput = form.querySelector<HTMLInputElement>('input[name="first_name"]');
    const lastNameInput = form.querySelector<HTMLInputElement>('input[name="second_name"]');
    const phoneInput = form.querySelector<HTMLInputElement>('input[name="phone"]');
    const passwordInput = form.querySelector<HTMLInputElement>('input[name="password"]');
    const confirmPasswordInput = form.querySelector<HTMLInputElement>('input[name="confirm_password"]');

    const email = emailInput?.value.trim();
    const login = loginInput?.value.trim();
    const firstName = firstNameInput?.value.trim();
    const lastName = lastNameInput?.value.trim();
    const phone = phoneInput?.value.trim();
    const password = passwordInput?.value.trim();
    const confirmPassword = confirmPasswordInput?.value.trim();

    const emailError = form.querySelector<HTMLSpanElement>(".form-page__error_email");
    const loginError = form.querySelector<HTMLSpanElement>(".form-page__error_login");
    const firstNameError = form.querySelector<HTMLSpanElement>(".form-page__error_first_name");
    const lastNameError = form.querySelector<HTMLSpanElement>(".form-page__error_second_name");
    const phoneError = form.querySelector<HTMLSpanElement>(".form-page__error_phone");
    const passwordError = form.querySelector<HTMLSpanElement>(".form-page__error_password");
    const confirmPasswordError = form.querySelector<HTMLSpanElement>(".form-page__error_confirm_password");

    let hasError = false;

    if (!email) {
      showFieldError(emailInput, emailError, "Пожалуйста, заполните поле Почта");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError(emailInput, emailError, "Введите корректный email");
      hasError = true;
    } else {
      showFieldError(emailInput, emailError, "");
    }

    if (!login) {
      showFieldError(loginInput, loginError, "Пожалуйста, заполните поле Логин");
      hasError = true;
    } else {
      showFieldError(loginInput, loginError, "");
    }

    if (!firstName) {
      showFieldError(firstNameInput, firstNameError, "Пожалуйста, заполните поле Имя");
      hasError = true;
    } else {
      showFieldError(firstNameInput, firstNameError, "");
    }

    if (!lastName) {
      showFieldError(lastNameInput, lastNameError, "Пожалуйста, заполните поле Фамилия");
      hasError = true;
    } else {
      showFieldError(lastNameInput, lastNameError, "");
    }

    if (!phone) {
      showFieldError(phoneInput, phoneError, "Пожалуйста, заполните поле Телефон");
      hasError = true;
    } else {
      showFieldError(phoneInput, phoneError, "");
    }

    if (!password) {
      showFieldError(passwordInput, passwordError, "Пожалуйста, заполните поле Пароль");
      hasError = true;
    } else if (password.length < 6) {
      showFieldError(passwordInput, passwordError, "Пароль должен быть не менее 6 символов");
      hasError = true;
    } else {
      showFieldError(passwordInput, passwordError, "");
    }

    if (!confirmPassword) {
      showFieldError(confirmPasswordInput, confirmPasswordError, "Пожалуйста, повторите пароль");
      hasError = true;
    } else if (password && confirmPassword !== password) {
      showFieldError(confirmPasswordInput, confirmPasswordError, "Пароли не совпадают");
      hasError = true;
    } else {
      showFieldError(confirmPasswordInput, confirmPasswordError, "");
    }

    if (hasError) {
      return;
    }

    authService.setUser({
      id: login || "",
      username: login || "",
      email: email || "",
      firstName: firstName || "",
      lastName: lastName || "",
      phone: phone || "",
    });
    window.location.href = "/";
  });
}

