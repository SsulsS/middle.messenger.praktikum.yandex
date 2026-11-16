import { type IFormField } from 'types/form';
import { type IUser } from 'types/user';

import { type IInputClasses } from 'components/Input/Input';

export const EMPTY_VALUE_TEXT = 'не указан';

export const PROFILE_INPUT_CLASSES: IInputClasses = {
  wrapperClass: 'profile__field',
  labelClass: 'profile__field-label',
  fieldClass: 'profile__input',
  invalidClass: 'profile__input_invalid',
  errorClass: 'profile__error',
};

export const getProfileFields = (user: IUser): IFormField[] => {
  return [
    {
      id: 'edit-first-name',
      name: 'first_name',
      label: 'Имя',
      value: user.firstName,
      autocomplete: 'given-name',
      rule: 'first_name',
    },
    {
      id: 'edit-second-name',
      name: 'second_name',
      label: 'Фамилия',
      value: user.secondName,
      autocomplete: 'family-name',
      rule: 'second_name',
    },
    {
      id: 'edit-display-name',
      name: 'display_name',
      label: 'Имя в чате',
      value: user.displayName,
      autocomplete: 'nickname',
    },
    {
      id: 'edit-login',
      name: 'login',
      label: 'Логин',
      value: user.login,
      autocomplete: 'username',
      rule: 'login',
    },
    {
      id: 'edit-email',
      name: 'email',
      label: 'Почта',
      type: 'email',
      value: user.email,
      autocomplete: 'email',
      rule: 'email',
    },
    {
      id: 'edit-phone',
      name: 'phone',
      label: 'Телефон',
      type: 'tel',
      value: user.phone,
      placeholder: '+79001234567',
      autocomplete: 'tel',
      rule: 'phone',
    },
    {
      id: 'edit-avatar',
      name: 'avatar',
      label: 'Аватар',
      type: 'file',
    },
  ];
};

export const PASSWORD_FIELDS: IFormField[] = [
  {
    id: 'edit-old-password',
    name: 'oldPassword',
    label: 'Старый пароль',
    type: 'password',
    autocomplete: 'current-password',
    rule: 'password',
  },
  {
    id: 'edit-new-password',
    name: 'newPassword',
    label: 'Новый пароль',
    type: 'password',
    autocomplete: 'new-password',
    rule: 'password',
  },
];
