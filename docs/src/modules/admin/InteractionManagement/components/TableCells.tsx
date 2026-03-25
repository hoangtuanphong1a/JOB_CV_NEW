import dayjs from 'dayjs';

import { Badge } from '@/components/ui/badge';

import Actions from '../config/actions';
import { DATE_FORMAT, INTERACTION_TYPES, COMMENT_STATUS_LABELS } from '@/lib/const';
import { IInteractionNode } from '../libs/utils';
import { CommentEntity } from '@/apis/client/comment/types';
import { LikeUser } from '@/apis/client/like/types';
import { IPost } from '@/apis/client/blog/types';

// Ensure INTERACTION_TYPES is available
const INTERACTION_TYPES_SAFE = INTERACTION_TYPES || {
  POST: 'post',
  COMMENT: 'comment',
  LIKE: 'like',
};

export const TypeCell = ({ row }: { row: { original: IInteractionNode } }) => {
  const node = row.original;
  
  if (!node) {
    return <div className="w-full text-center">-</div>;
  }

  const typeLabels: Record<string, string> = {
    [INTERACTION_TYPES_SAFE.POST]: 'Bài viết',
    [INTERACTION_TYPES_SAFE.COMMENT]: 'Bình luận',
    [INTERACTION_TYPES_SAFE.LIKE]: 'Lượt thích',
  };

  const variantMap: Record<string, 'default' | 'secondary' | 'outline'> = {
    [INTERACTION_TYPES_SAFE.POST]: 'default',
    [INTERACTION_TYPES_SAFE.COMMENT]: 'secondary',
    [INTERACTION_TYPES_SAFE.LIKE]: 'outline',
  };

  return (
    <div className="w-full text-center">
      <Badge variant={variantMap[node.type] || 'default'}>
        {typeLabels[node.type] || node.type}
      </Badge>
    </div>
  );
};

export const StatusCell = ({ row }: { row: { original: IInteractionNode } }) => {
  const node = row.original;
  
  // Only show status for comments
  if (node.type !== INTERACTION_TYPES_SAFE.COMMENT || !node.original) {
    return <div className="w-full text-center">-</div>;
  }

  const comment = node.original as CommentEntity;
  const status = comment.status || 'approved';

  const statusLabels: Record<string, string> = {
    approved: COMMENT_STATUS_LABELS.APPROVED,
    pending: COMMENT_STATUS_LABELS.PENDING,
    rejected: COMMENT_STATUS_LABELS.REJECTED,
    hidden: COMMENT_STATUS_LABELS.HIDDEN,
  };

  return (
    <div className="w-full text-center">
      <Badge >
        {statusLabels[status] || status}
      </Badge>
    </div>
  );
};

export const DateCell = ({ row }: { row: { original: IInteractionNode } }) => {
  const node = row.original;
  
  if (!node.original) {
    return <div className="w-full text-center">-</div>;
  }

  let date: string | null = null;

  if (node.type === INTERACTION_TYPES_SAFE.POST) {
    const post = node.original as IPost;
    date = post.created_at;
  } else if (node.type === INTERACTION_TYPES_SAFE.COMMENT) {
    const comment = node.original as CommentEntity;
    date = comment.created_at;
  } else if (node.type === INTERACTION_TYPES_SAFE.LIKE) {
    const like = node.original as LikeUser;
    date = like.liked_at;
  }

  if (!date) {
    return <div className="w-full text-center">-</div>;
  }

  return <div className="w-full text-center">{dayjs(date).format(DATE_FORMAT)}</div>;
};

export const ActionsCell = ({ row }: { row: { original: IInteractionNode } }) => {
  const node = row.original;
  
  // Only show actions for comments and likes (not for post parent nodes or category nodes)
  if (node.type === INTERACTION_TYPES_SAFE.POST || !node.original) {
    return <div className="w-full text-center">-</div>;
  }

  return (
    <div className="flex justify-center">
      <Actions node={node} />
    </div>
  );
};

