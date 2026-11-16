import { afterEach, describe, expect, it, vi } from 'vitest';

import { type IFormField, type TFormData } from 'types/form';

import Form from './Form';

const FIELDS: IFormField[] = [
  { id: 'login', name: 'login', label: 'Логин', rule: 'login' },
  { id: 'nickname', name: 'display_name', label: 'Имя в чате' },
];

const createForm = (onSubmit: (data: TFormData) => void): Form => {
  return new Form({
    className: 'form',
    fields: FIELDS,
    submitText: 'Сохранить',
    statusClass: 'form__status',
    onSubmit,
  });
};

const fillField = (form: Form, name: string, value: string): void => {
  const field = form
    .getContent()
    ?.querySelector<HTMLInputElement>(`input[name="${name}"]`);

  if (field) {
    field.value = value;
  }
};

const submit = (form: Form): Event => {
  const event = new Event('submit', { cancelable: true });

  form.getContent()?.dispatchEvent(event);

  return event;
};

const getErrorText = (form: Form): string => {
  return (
    form.getContent()?.querySelector('[data-role="error"]')?.textContent ?? ''
  );
};

describe('Form', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('валидирует поле по событию blur', () => {
    const form = createForm(vi.fn());

    fillField(form, 'login', 'ab');
    form
      .getContent()
      ?.querySelector('input[name="login"]')
      ?.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));

    expect(getErrorText(form)).not.toBe('');
  });

  it('не отправляет невалидную форму и показывает ошибки', () => {
    const handleSubmit = vi.fn();
    const form = createForm(handleSubmit);
    const event = submit(form);

    expect(event.defaultPrevented).toBe(true);
    expect(handleSubmit).not.toHaveBeenCalled();
    expect(getErrorText(form)).not.toBe('');
  });

  it('выводит данные в консоль и передаёт их в onSubmit', () => {
    const handleSubmit = vi.fn();
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const form = createForm(handleSubmit);
    const expectedData = { login: 'ivan_1', display_name: 'Ваня' };

    fillField(form, 'login', 'ivan_1');
    fillField(form, 'display_name', 'Ваня');
    submit(form);

    expect(logSpy).toHaveBeenCalledWith(expectedData);
    expect(handleSubmit).toHaveBeenCalledWith(expectedData);
  });

  it('showStatus показывает сообщение и сохраняет введённые значения', () => {
    const form = createForm(vi.fn());

    fillField(form, 'login', 'ivan_1');
    form.showStatus('Сохранено', 'success');

    const status = form.getContent()?.querySelector('[role="status"]');
    const field = form.getContent()?.querySelector('input');

    expect(status?.textContent).toBe('Сохранено');
    expect(status?.classList.contains('form__status_success')).toBe(true);
    expect(field?.value).toBe('ivan_1');
  });
});
