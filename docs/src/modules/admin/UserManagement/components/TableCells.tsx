import dayjs from 'dayjs';

import { Badge } from '@/components/ui/badge';

import Actions from '../config/actions';
import { DATE_FORMAT, USER_STATUS_LABELS } from './constants';
import { IUserTreeNode } from '../libs/utils';

export const StatusCell = ({ row }: { row: { original: IUserTreeNode } }) => {
  const user = row.original.original;
  
  // Only show status for users (leaf nodes), not for role categories
  if (!user) {
    return <div className="w-full text-center">-</div>;
  }

  let variant: 'default' | 'destructive' | 'secondary' = 'secondary';
  let label: string = USER_STATUS_LABELS.INACTIVE;

  if (user.is_banned) {
    variant = 'destructive';
    label = USER_STATUS_LABELS.BANNED;
  } else if (user.is_active) {
    variant = 'default';
    label = USER_STATUS_LABELS.ACTIVE;
  }

  return (
    <div className="w-full text-center">
      <Badge variant={variant}>{label}</Badge>
    </div>
  );
};

export const RoleCell = ({ row }: { row: { original: IUserTreeNode } }) => {
  const user = row.original.original;
  
  // Only show roles for users (leaf nodes), not for role categories
  if (!user) {
    return <div className="w-full text-center">-</div>;
  }

  const roles = user.roles || [];
  
  if (roles.length === 0) {
    return <div className="w-full text-center text-muted-foreground">No Role</div>;
  }

  return (
    <div className="w-full text-center">
      <div className="flex flex-wrap gap-1 justify-center">
        {roles.map((role, index) => (
          <Badge key={index} variant="outline">
            {role}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export const DateCell = ({ row }: { row: { original: IUserTreeNode } }) => {
  const user = row.original.original;
  
  // Only show date for users (leaf nodes), not for role categories
  if (!user) {
    return <div className="w-full text-center">-</div>;
  }

  const createdAt = user.created_at;
  return <div className="w-full text-center">{dayjs(createdAt).format(DATE_FORMAT)}</div>;
};

export const ActionsCell = ({ row }: { row: { original: IUserTreeNode } }) => {
  const user = row.original.original;
  
  // Only show actions for users (leaf nodes), not for role categories
  if (!user) {
    return <div className="w-full text-center">-</div>;
  }

  return (
    <div className="flex justify-center">
      <Actions user={user} />
    </div>
  );
};

