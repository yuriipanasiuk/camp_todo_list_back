export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface UserJwtPayload {
  _id: string;
}

export interface IPayload {
  _id: string;
}

export interface IRefresh {
  accessToken: string;
  refreshToken: string;
}
