import dayjs from 'dayjs';

import { Badge } from '@/components/ui/badge';

import Actions from '../config/actions';
import { DATE_FORMAT, STATUS_LABELS } from './constants';
import { ITreeNode } from '../libs/utils';

export const StatusCell = ({ row }: { row: { original: ITreeNode } }) => {
  const post = row.original.original;
  
  // Only show status for posts (leaf nodes), not for user categories
  if (!post) {
    return <div className="w-full text-center">-</div>;
  }

  const status = post.status;
  const isPublished = status === 'published';
  const isDraft = status === 'draft';
  const isArchived = status === 'archived';

  let label = status;

  if (isPublished) {
    label = STATUS_LABELS.PUBLISHED;
  } else if (isDraft) {
    label = STATUS_LABELS.DRAFT;
  } else if (isArchived) {
    label = STATUS_LABELS.ARCHIVED;
  }

  return (
    <div className="w-full text-center">
      <Badge >{label}</Badge>
    </div>
  );
};

export const DateCell = ({ row }: { row: { original: ITreeNode } }) => {
  const post = row.original.original;
  
  // Only show date for posts (leaf nodes), not for user categories
  if (!post) {
    return <div className="w-full text-center">-</div>;
  }

  const createdAt = post.created_at;
  return <div className="w-full text-center">{dayjs(createdAt).format(DATE_FORMAT)}</div>;
};

export const ActionsCell = ({ row }: { row: { original: ITreeNode } }) => {
  const post = row.original.original;
  
  // Only show actions for posts (leaf nodes), not for user categories
  if (!post) {
    return <div className="w-full text-center">-</div>;
  }

  return (
    <div className="flex justify-center">
      <Actions post={post} />
    </div>
  );
};
