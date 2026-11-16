import { type IValidationCheck, type TValidationRule } from 'types/form';

export const REQUIRED_ERR_TEXT = 'Поле не может быть пустым';

const NAME_REGEX = /^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё-]*$/;
const LOGIN_REGEX = /^[A-Za-z0-9_-]{3,20}$/;
const NOT_ONLY_DIGITS_REGEX = /\D/;
const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]*[A-Za-z][A-Za-z0-9-]*(\.[A-Za-z0-9-]+)+$/;
const PASSWORD_REGEX = /^(?=.*[A-ZА-ЯЁ])(?=.*\d).{8,40}$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;

const NAME_CHECKS: IValidationCheck[] = [
  {
    pattern: NAME_REGEX,
    message:
      'Только буквы, первая — заглавная, без пробелов и цифр (допустим дефис)',
  },
];

export const VALIDATION_CHECKS: Record<TValidationRule, IValidationCheck[]> = {
  first_name: NAME_CHECKS,
  second_name: NAME_CHECKS,
  login: [
    {
      pattern: LOGIN_REGEX,
      message: '3–20 символов: латиница, цифры, дефис и подчёркивание',
    },
    {
      pattern: NOT_ONLY_DIGITS_REGEX,
      message: 'Логин не может состоять только из цифр',
    },
  ],
  email: [{ pattern: EMAIL_REGEX, message: 'Введите корректный email' }],
  password: [
    {
      pattern: PASSWORD_REGEX,
      message: '8–40 символов, минимум одна заглавная буква и одна цифра',
    },
  ],
  phone: [
    { pattern: PHONE_REGEX, message: '10–15 цифр, может начинаться с +' },
  ],
  message: [],
};
