import { type Block } from 'core/Block';

import { ROUTES } from 'constants/general';

import ChatPage from 'pages/Chat/Chat';
import { NOT_FOUND_PROPS, SERVER_ERROR_PROPS } from 'pages/Error/constants';
import ErrorPage from 'pages/Error/Error';
import LoginPage from 'pages/Login/Login';
import ProfilePage from 'pages/Profile/Profile';
import RegisterPage from 'pages/Register/Register';

export interface IRoute {
  path: string;
  isProtected: boolean;
  createPage: () => Block;
}

export const LOGIN_ROUTE: IRoute = {
  path: ROUTES.login,
  isProtected: false,
  createPage: () => new LoginPage(),
};

export const NOT_FOUND_ROUTE: IRoute = {
  path: ROUTES.notFound,
  isProtected: false,
  createPage: () => new ErrorPage(NOT_FOUND_PROPS),
};

export const APP_ROUTES: IRoute[] = [
  LOGIN_ROUTE,
  NOT_FOUND_ROUTE,
  {
    path: ROUTES.chat,
    isProtected: true,
    createPage: () => new ChatPage(),
  },
  {
    path: ROUTES.signUp,
    isProtected: false,
    createPage: () => new RegisterPage(),
  },
  {
    path: ROUTES.profile,
    isProtected: true,
    createPage: () => new ProfilePage(),
  },
  {
    path: ROUTES.serverError,
    isProtected: false,
    createPage: () => new ErrorPage(SERVER_ERROR_PROPS),
  },
];
