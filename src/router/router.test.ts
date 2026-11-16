import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { authController } from 'controllers/AuthController';

import { navigate } from 'utils/navigate';
import { ROUTES } from 'constants/general';

import { initRouter } from './router';

const getPageText = (): string => document.body.textContent ?? '';

describe('router', () => {
  beforeAll(() => {
    document.body.innerHTML = '<main id="app"></main>';
    initRouter();
  });

  beforeEach(() => {
    authController.logout();
  });

  it('перенаправляет гостя с защищённой страницы на вход', () => {
    navigate(ROUTES.chat);

    expect(window.location.pathname).toBe(ROUTES.login);
    expect(getPageText()).toContain('Вход');
  });

  it('открывает защищённую страницу авторизованному пользователю', () => {
    authController.login({ login: 'ivan' });
    navigate(ROUTES.profile);

    expect(window.location.pathname).toBe(ROUTES.profile);
    expect(getPageText()).toContain('Назад к чатам');
  });

  it('показывает страницу 404 для неизвестного адреса', () => {
    navigate('/unknown-page');

    expect(window.location.pathname).toBe(ROUTES.notFound);
    expect(getPageText()).toContain('404');
  });

  it('переходит по внутренней ссылке без перезагрузки страницы', () => {
    navigate(ROUTES.login);

    const link = document.querySelector<HTMLAnchorElement>(
      `a[href="${ROUTES.signUp}"]`
    );
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    link?.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(window.location.pathname).toBe(ROUTES.signUp);
    expect(getPageText()).toContain('Регистрация');
  });
});
