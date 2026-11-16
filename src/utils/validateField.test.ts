import { describe, expect, it } from 'vitest';

import { validateField } from './validateField';

describe('validateField: first_name / second_name', () => {
  it('принимает имя с заглавной буквы', () => {
    expect(validateField('first_name', 'Иван')).toBe('');
    expect(validateField('first_name', 'Anna-Maria')).toBe('');
  });

  it('отклоняет имя со строчной первой буквы', () => {
    expect(validateField('first_name', 'иван')).not.toBe('');
  });

  it('отклоняет имя с цифрами или пробелом', () => {
    expect(validateField('first_name', 'Иван1')).not.toBe('');
    expect(validateField('first_name', 'Иван Петров')).not.toBe('');
  });
});

describe('validateField: login', () => {
  it('принимает валидный логин', () => {
    expect(validateField('login', 'ivan_ivanov-1')).toBe('');
  });

  it('отклоняет слишком короткий логин', () => {
    expect(validateField('login', 'ab')).not.toBe('');
  });

  it('отклоняет логин из одних цифр', () => {
    expect(validateField('login', '123456')).not.toBe('');
  });

  it('отклоняет логин с пробелом', () => {
    expect(validateField('login', 'ivan ivanov')).not.toBe('');
  });
});

describe('validateField: email', () => {
  it('принимает корректный email', () => {
    expect(validateField('email', 'pochta@yandex.ru')).toBe('');
    expect(validateField('email', 'user@mail.yandex.ru')).toBe('');
  });

  it('отклоняет email без буквы между @ и точкой', () => {
    expect(validateField('email', 'test@.ru')).not.toBe('');
  });

  it('отклоняет email без @', () => {
    expect(validateField('email', 'testyandex.ru')).not.toBe('');
  });
});

describe('validateField: password', () => {
  it('принимает пароль с заглавной буквой и цифрой', () => {
    expect(validateField('password', 'Password1')).toBe('');
  });

  it('отклоняет короткий пароль', () => {
    expect(validateField('password', 'Pas1')).not.toBe('');
  });

  it('отклоняет пароль без цифры', () => {
    expect(validateField('password', 'Password')).not.toBe('');
  });

  it('отклоняет пароль без заглавной буквы', () => {
    expect(validateField('password', 'password1')).not.toBe('');
  });
});

describe('validateField: phone', () => {
  it('принимает телефон с плюсом', () => {
    expect(validateField('phone', '+79001234567')).toBe('');
  });

  it('принимает телефон без плюса', () => {
    expect(validateField('phone', '89001234567')).toBe('');
  });

  it('отклоняет слишком короткий телефон', () => {
    expect(validateField('phone', '12345')).not.toBe('');
  });
});

describe('validateField: message', () => {
  it('отклоняет пустое сообщение', () => {
    expect(validateField('message', '')).not.toBe('');
    expect(validateField('message', '   ')).not.toBe('');
  });

  it('принимает непустое сообщение', () => {
    expect(validateField('message', 'Привет!')).toBe('');
  });
});
