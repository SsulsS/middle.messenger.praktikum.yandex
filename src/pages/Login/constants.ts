import { type IFormField } from 'types/form';

export const LOGIN_FIELDS: IFormField[] = [
  {
    id: 'login-username',
    name: 'login',
    label: 'Логин',
    placeholder: 'ivanivanov',
    autocomplete: 'username',
    rule: 'login',
  },
  {
    id: 'login-password',
    name: 'password',
    label: 'Пароль',
    type: 'password',
    placeholder: '••••••••',
    autocomplete: 'current-password',
    rule: 'password',
  },
];
