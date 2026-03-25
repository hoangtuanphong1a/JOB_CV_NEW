const prefixUser = '/users';
const prefixAdmin = '/admin/users';

export const KEYS = {
  USER_ME: `${prefixUser}/me`,
  USER_ME_AVATAR: `${prefixUser}/me/avatar`,
  USER_BY_USERNAME: (username: string) => `${prefixUser}/${username}`,
  USER_STATS: (username: string) => `${prefixUser}/${username}/stats`,
  ADMIN_USERS: prefixAdmin,
  ADMIN_USERS_BAN: (userId: string) => `${prefixAdmin}/${userId}/ban`,
  ADMIN_USERS_DELETE: (userId: string) => `${prefixAdmin}/${userId}`,
} as const;

