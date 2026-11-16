import { authController } from 'controllers/AuthController';

import { navigate } from 'utils/navigate';
import { ROUTES } from 'constants/general';

import AuthForm from 'components/AuthForm/AuthForm';

import { LOGIN_FIELDS } from './constants';

class LoginPage extends AuthForm {
  constructor() {
    super({
      pageClass: 'login',
      title: 'Вход',
      submitText: 'Войти',
      link: { href: ROUTES.signUp, text: 'Зарегистрироваться' },
      fields: LOGIN_FIELDS,
      onSubmit: (data) => {
        authController.login(data);
        navigate(ROUTES.chat);
      },
    });
  }
}

export default LoginPage;
