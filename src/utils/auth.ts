

const AUTH_KEY = 'user_auth';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  avatar?: string;
  displayName?: string;
}

export const authService = {
  isAuthenticated(): boolean {
    const auth = localStorage.getItem(AUTH_KEY);
    return !!auth;
  },

  
  getUser(): User | null {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) return null;
    try {
      return JSON.parse(auth);
    } catch {
      return null;
    }
  },


  setUser(user: User): void {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  
  logout(): void {
    localStorage.removeItem(AUTH_KEY);
  },
};
