import { AdminUser } from '@/apis/client/user/types';

// Re-export AdminUser as IUser for consistency with module naming
export type IUser = AdminUser;

export interface IUserTreeNode {
  id: string;
  name: string;
  subRows?: IUserTreeNode[];
  original?: IUser; // Store original user data for leaf nodes
}

export function buildTreeFromUsers(users: IUser[]): IUserTreeNode[] {
  // Group users by role
  const usersByRole = users.reduce((acc, user) => {
    const roleName = user.roles && user.roles.length > 0 ? user.roles[0] : 'No Role';
    if (!acc[roleName]) {
      acc[roleName] = [];
    }
    acc[roleName].push(user);
    return acc;
  }, {} as Record<string, IUser[]>);

  // Build tree structure: role as parent, users as children
  return Object.entries(usersByRole).map(([roleName, roleUsers]) => ({
    id: `role-${roleName}`,
    name: roleName,
    subRows: roleUsers.map((user) => ({
      id: user.id,
      name: user.full_name || user.email || 'Không rõ',
      original: user,
    })),
  }));
}

