import { type IUser } from 'types/user';
import { USER_STORAGE_KEY } from 'constants/general';

const REQUIRED_USER_FIELDS = [
  'id',
  'login',
  'email',
  'firstName',
  'secondName',
  'phone',
];

const isUser = (value: unknown): value is IUser => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const fields: Record<string, unknown> = { ...value };

  return REQUIRED_USER_FIELDS.every((name) => typeof fields[name] === 'string');
};

class AuthService {
  public getUser(): IUser | null {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      const user: unknown = JSON.parse(storedUser);

      return isUser(user) ? user : null;
    } catch (error) {
      if (error instanceof SyntaxError) {
        return null;
      }

      throw error;
    }
  }

  public saveUser(user: IUser): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  public removeUser(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export const authService = new AuthService();
