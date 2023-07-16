export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface UserJwtPayload {
  email: string;
  id: string;
}
