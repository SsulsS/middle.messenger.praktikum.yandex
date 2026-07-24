export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  displayName?: string;
}

export type UpdateUserPayload = Partial<Pick<User, 'username' | 'email' | 'avatar' | 'firstName' | 'lastName' | 'phone' | 'displayName'>>;
