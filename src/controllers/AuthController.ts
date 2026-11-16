import { authService } from 'services/AuthService';

import { getFormText } from 'utils/getFormText';
import { readFileAsDataUrl } from 'utils/readFileAsDataUrl';
import { type TFormData } from 'types/form';
import { type IUser } from 'types/user';

class AuthController {
  public getCurrentUser(): IUser | null {
    return authService.getUser();
  }

  public isAuthenticated(): boolean {
    return authService.getUser() !== null;
  }

  public login(data: TFormData): IUser {
    const login = getFormText(data, 'login');
    const user: IUser = {
      id: login,
      login,
      email: '',
      firstName: '',
      secondName: '',
      phone: '',
    };

    authService.saveUser(user);

    return user;
  }

  public register(data: TFormData): IUser {
    const login = getFormText(data, 'login');
    const user: IUser = {
      id: login,
      login,
      email: getFormText(data, 'email'),
      firstName: getFormText(data, 'first_name'),
      secondName: getFormText(data, 'second_name'),
      phone: getFormText(data, 'phone'),
    };

    authService.saveUser(user);

    return user;
  }

  public async updateProfile(data: TFormData): Promise<IUser> {
    const currentUser = authService.getUser();

    if (!currentUser) {
      throw new Error('Нельзя обновить профиль: пользователь не авторизован');
    }

    const avatarFile = data.avatar;
    const avatar =
      avatarFile instanceof File
        ? await readFileAsDataUrl(avatarFile)
        : currentUser.avatar;

    const updatedUser: IUser = {
      ...currentUser,
      login: getFormText(data, 'login'),
      email: getFormText(data, 'email'),
      firstName: getFormText(data, 'first_name'),
      secondName: getFormText(data, 'second_name'),
      phone: getFormText(data, 'phone'),
      displayName: getFormText(data, 'display_name'),
      avatar,
    };

    authService.saveUser(updatedUser);

    return updatedUser;
  }

  public logout(): void {
    authService.removeUser();
  }
}

export const authController = new AuthController();
