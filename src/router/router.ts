import { renderBlock } from 'core/renderBlock';

import { authController } from 'controllers/AuthController';

import { navigate } from 'utils/navigate';
import { ROOT_SELECTOR } from 'constants/general';

import {
  APP_ROUTES,
  LOGIN_ROUTE,
  NOT_FOUND_ROUTE,
  type IRoute,
} from './routes';

const resolveRoute = (pathname: string): IRoute => {
  const route = APP_ROUTES.find(({ path }) => path === pathname);

  if (!route) {
    return NOT_FOUND_ROUTE;
  }

  if (route.isProtected && !authController.isAuthenticated()) {
    return LOGIN_ROUTE;
  }

  return route;
};

const renderCurrentRoute = (): void => {
  const { pathname } = window.location;
  const route = resolveRoute(pathname);

  if (route.path !== pathname) {
    window.history.replaceState(null, '', route.path);
  }

  renderBlock(ROOT_SELECTOR, route.createPage());
};

const handleLinkClick = (event: MouseEvent): void => {
  const link =
    event.target instanceof Element ? event.target.closest('a') : null;
  const href = link?.getAttribute('href');
  const isModifiedClick = event.ctrlKey || event.metaKey || event.shiftKey;
  const isInternalLink = Boolean(href?.startsWith('/'));

  if (!href || !isInternalLink || isModifiedClick) {
    return;
  }

  event.preventDefault();
  navigate(href);
};

export const initRouter = (): void => {
  window.addEventListener('popstate', renderCurrentRoute);
  document.addEventListener('click', handleLinkClick);
  renderCurrentRoute();
};
