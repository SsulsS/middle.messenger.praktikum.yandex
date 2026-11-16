import { type IFormField } from 'types/form';

import { type IInputClasses } from 'components/Input/Input';

export const NO_CHAT_TITLE = 'Выберите чат';
export const NO_CHAT_TEXT = 'Выберите чат, чтобы отправить сообщение';
export const NO_MESSAGES_TEXT = 'В этом чате ещё нет сообщений';

export const MESSAGE_FIELDS: IFormField[] = [
  {
    id: 'message-input',
    name: 'message',
    placeholder: 'Сообщение',
    autocomplete: 'off',
    rule: 'message',
  },
];

export const MESSAGE_INPUT_CLASSES: IInputClasses = {
  wrapperClass: 'chat__input-wrap',
  labelClass: 'chat__input-label',
  fieldClass: 'chat__message-input',
  invalidClass: 'chat__message-input_invalid',
  errorClass: 'chat__input-error',
};
