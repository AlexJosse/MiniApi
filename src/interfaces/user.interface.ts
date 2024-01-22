export interface IUser {
  id?: number;
  username: string;
  email: string;
  address: string;
  password: string;
}


export type UserWithoutPassword = Omit<IUser, 'password'>;