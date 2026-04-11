export interface User {
  id: string;
  username: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  usernameOrEmail: string;
  password: string;
}
