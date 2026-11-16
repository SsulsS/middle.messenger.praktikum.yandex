import { describe, expect, it } from 'vitest';

import Input from './Input';

describe('Input', () => {
  it('рендерит label, имя, id и тип по умолчанию', () => {
    const input = new Input({ id: 'login', name: 'login', label: 'Логин' });
    const field = input.getInputElement();

    expect(input.getContent()?.querySelector('label')?.textContent).toBe(
      'Логин'
    );
    expect(field?.getAttribute('name')).toBe('login');
    expect(field?.getAttribute('id')).toBe('login');
    expect(field?.getAttribute('type')).toBe('text');
  });

  it('показывает ошибку без потери введённого значения', () => {
    const input = new Input({ id: 'login', name: 'login' });
    const fieldBefore = input.getInputElement();

    if (fieldBefore) {
      fieldBefore.value = 'набранный текст';
    }

    input.setProps({ error: 'Обязательное поле' });

    const fieldAfter = input.getInputElement();
    const errorElement = input
      .getContent()
      ?.querySelector('[data-role="error"]');

    expect(fieldAfter).toBe(fieldBefore);
    expect(fieldAfter?.value).toBe('набранный текст');
    expect(fieldAfter?.classList.contains('form-page__input_invalid')).toBe(
      true
    );
    expect(fieldAfter?.getAttribute('aria-invalid')).toBe('true');
    expect(errorElement?.textContent).toBe('Обязательное поле');
  });

  it('снимает признак ошибки, когда error становится пустым', () => {
    const input = new Input({ id: 'email', name: 'email', error: 'Ошибка' });

    input.setProps({ error: '' });

    expect(
      input.getInputElement()?.classList.contains('form-page__input_invalid')
    ).toBe(false);
  });

  it('getValue() читает актуальное значение из DOM', () => {
    const input = new Input({ id: 'message', name: 'message' });
    const field = input.getInputElement();

    if (field) {
      field.value = 'привет';
    }

    expect(input.getValue()).toBe('привет');
  });
});
