import { describe, expect, it, vi } from 'vitest';

import Button from './Button';

describe('Button', () => {
  it('рендерит текст и тип кнопки', () => {
    const root = new Button({ text: 'Войти', type: 'submit' }).getContent();

    expect(root?.tagName).toBe('BUTTON');
    expect(root?.textContent).toBe('Войти');
    expect(root?.getAttribute('type')).toBe('submit');
  });

  it('использует тип и класс по умолчанию', () => {
    const root = new Button({ text: 'Сохранить' }).getContent();

    expect(root?.getAttribute('type')).toBe('button');
    expect(root?.classList.contains('form-page__button')).toBe(true);
  });

  it('вызывает обработчик клика из props.events', () => {
    const handleClick = vi.fn();
    const button = new Button({
      text: 'Выйти',
      events: { click: handleClick },
    });

    button.getContent()?.dispatchEvent(new MouseEvent('click'));

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
