import { describe, expect, it } from 'vitest';

import { collectFormData } from './collectFormData';

const createForm = (markup: string): HTMLFormElement => {
  const form = document.createElement('form');

  form.innerHTML = markup;

  return form;
};

describe('collectFormData', () => {
  it('собирает значения текстовых полей по атрибуту name', () => {
    const form = createForm(
      '<input name="login" value="ivan" /><input name="phone" value="+79001234567" />'
    );

    expect(collectFormData(form)).toEqual({
      login: 'ivan',
      phone: '+79001234567',
    });
  });

  it('учитывает только отмеченные чекбоксы', () => {
    const form = createForm(
      '<input type="checkbox" name="remember" checked /><input type="checkbox" name="subscribe" />'
    );

    expect(collectFormData(form)).toEqual({ remember: 'on' });
  });

  it('пропускает поле с невыбранным файлом', () => {
    const form = createForm(
      '<input name="login" value="ivan" /><input type="file" name="avatar" />'
    );

    expect(collectFormData(form)).toEqual({ login: 'ivan' });
  });
});
