import { Block, type IBlockProps } from 'core/Block';

import { authController } from 'controllers/AuthController';

import { navigate } from 'utils/navigate';
import { type TFormData } from 'types/form';
import { type IUser } from 'types/user';
import { ROUTES } from 'constants/general';

import Button from 'components/Button/Button';
import Form from 'components/Form/Form';
import Modal from 'components/Modal/Modal';

import {
  EMPTY_VALUE_TEXT,
  PASSWORD_FIELDS,
  PROFILE_INPUT_CLASSES,
  getProfileFields,
} from './constants';
import template from './Profile.hbs?raw';
import './Profile.scss';

interface IProfileDetail {
  label: string;
  value: string;
}

interface IProfilePageProps extends IBlockProps {
  fullName: string;
  avatarUrl: string;
  details: IProfileDetail[];
  chatUrl: string;
}

type TProfileViewProps = Pick<
  IProfilePageProps,
  'fullName' | 'avatarUrl' | 'details'
>;

const GUEST_USER: IUser = {
  id: '',
  login: '',
  email: '',
  firstName: '',
  secondName: '',
  phone: '',
};

const PROFILE_FORM_STYLE = {
  className: 'profile__form',
  titleClass: 'profile__form-title',
  statusClass: 'profile__status',
  submitText: 'Сохранить',
  submitClass: 'profile__submit-button',
  inputClasses: PROFILE_INPUT_CLASSES,
};

const getViewProps = (user: IUser): TProfileViewProps => {
  const fullName = `${user.firstName} ${user.secondName}`.trim();

  return {
    fullName: fullName || user.login,
    avatarUrl: user.avatar ?? '',
    details: [
      { label: 'Почта', value: user.email || EMPTY_VALUE_TEXT },
      { label: 'Логин', value: user.login },
      { label: 'Имя', value: user.firstName || EMPTY_VALUE_TEXT },
      { label: 'Фамилия', value: user.secondName || EMPTY_VALUE_TEXT },
      { label: 'Имя в чате', value: user.displayName || user.login },
      { label: 'Телефон', value: user.phone || EMPTY_VALUE_TEXT },
    ],
  };
};

class ProfilePage extends Block<IProfilePageProps> {
  private readonly editForm: Form;

  constructor() {
    const user = authController.getCurrentUser() ?? GUEST_USER;

    const editForm = new Form({
      ...PROFILE_FORM_STYLE,
      title: 'Изменить данные',
      fields: getProfileFields(user),
      onSubmit: (data) => this._handleProfileSubmit(data),
    });
    const passwordForm = new Form({
      ...PROFILE_FORM_STYLE,
      title: 'Изменить пароль',
      fields: PASSWORD_FIELDS,
      onSubmit: () => {
        passwordForm.reset();
        passwordForm.showStatus('Пароль успешно изменён', 'success');
      },
    });
    const editModal = new Modal({
      title: 'Изменить данные',
      content: editForm,
    });
    const passwordModal = new Modal({
      title: 'Изменить пароль',
      content: passwordForm,
    });

    super({
      ...getViewProps(user),
      chatUrl: ROUTES.chat,
      editModal,
      passwordModal,
      openEditButton: new Button({
        text: 'Изменить данные',
        className: 'profile__action-button',
        events: { click: () => editModal.open() },
      }),
      openPasswordButton: new Button({
        text: 'Изменить пароль',
        className: 'profile__action-button',
        events: { click: () => passwordModal.open() },
      }),
      logoutButton: new Button({
        text: 'Выйти',
        className: 'profile__logout-button',
        events: {
          click: () => {
            authController.logout();
            navigate(ROUTES.login);
          },
        },
      }),
    });

    this.editForm = editForm;
  }

  protected render(): DocumentFragment {
    return this.compile(template);
  }

  private _handleProfileSubmit(data: TFormData): void {
    authController
      .updateProfile(data)
      .then((user) => {
        this.setProps(getViewProps(user));
        this.editForm.showStatus('Данные профиля обновлены', 'success');
      })
      .catch((error: unknown) => {
        const reason = error instanceof Error ? error.message : String(error);

        this.editForm.showStatus(
          `Не удалось сохранить профиль: ${reason}`,
          'error'
        );
      });
  }
}

export default ProfilePage;
