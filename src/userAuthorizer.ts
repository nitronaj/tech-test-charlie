import { safeCompare } from './safeCompare';
import { USERS } from './userLogins';

interface User {
  userLogin: string;
  password: string;
}

interface UserAuthorizer {
  (username: string, password: string): boolean;
}

export const userAuthorizer: UserAuthorizer = (reqUsername, reqPassword) => {
  const users: User[] = USERS.users;

  return users.some(
    ({ userLogin, password }) =>
      safeCompare(reqUsername, userLogin) && safeCompare(reqPassword, password)
  );
};
