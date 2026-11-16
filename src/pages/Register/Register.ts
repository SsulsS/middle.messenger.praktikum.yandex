import { authController } from 'controllers/AuthController';

import { navigate } from 'utils/navigate';
import { ROUTES } from 'constants/general';

import AuthForm from 'components/AuthForm/AuthForm';

import { REGISTER_FIELDS } from './constants';

class RegisterPage extends AuthForm {
  constructor() {
    super({
      pageClass: 'register',
      title: 'Регистрация',
      submitText: 'Зарегистрироваться',
      link: { href: ROUTES.login, text: 'Уже есть аккаунт? Войти' },
      fields: REGISTER_FIELDS,
      onSubmit: (data) => {
        authController.register(data);
        navigate(ROUTES.chat);
      },
    });
  }
}

export default RegisterPage;
