'use client';

import { Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { IInteractionNode } from '../libs/utils';
import { INTERACTION_TYPES } from '@/lib/const';
import { KEYS as BLOG_KEYS } from '@/apis/client/blog/keys';
import { KEYS as COMMENT_KEYS } from '@/apis/client/comment/keys';
import { useDeleteCommentMutation } from '@/apis/client/comment/queries';
import { useUnlikePostMutation } from '@/apis/client/like/queries';
import { CommentEntity } from '@/apis/client/comment/types';
import { LikeUser } from '@/apis/client/like/types';

// Ensure INTERACTION_TYPES is available
const INTERACTION_TYPES_SAFE = INTERACTION_TYPES || {
  POST: 'post',
  COMMENT: 'comment',
  LIKE: 'like',
};

interface ActionsProps {
  node: IInteractionNode;
}

export default function Actions({ node }: ActionsProps) {
  const queryClient = useQueryClient();

  const deleteCommentMutation = useDeleteCommentMutation({
    onSuccess: async () => {
      toast.success('Xóa bình luận thành công!');
      // Invalidate và refetch queries
      await queryClient.invalidateQueries({ queryKey: [BLOG_KEYS.BLOG] });
      await queryClient.invalidateQueries({ queryKey: [COMMENT_KEYS.COMMENT_QUERY_KEY] });
      await queryClient.refetchQueries({ queryKey: [BLOG_KEYS.BLOG] });
      await queryClient.refetchQueries({ queryKey: [COMMENT_KEYS.COMMENT_QUERY_KEY] });
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      toast.error(error?.response?.data?.detail || error?.message || 'Có lỗi xảy ra');
    },
  });

  const unlikePostMutation = useUnlikePostMutation({
    onSuccess: async () => {
      toast.success('Đã bỏ thích bài viết!');
      // Invalidate và refetch queries
      await queryClient.invalidateQueries({ queryKey: [BLOG_KEYS.BLOG] });
      await queryClient.invalidateQueries({ queryKey: ['post-likes'] });
      await queryClient.refetchQueries({ queryKey: [BLOG_KEYS.BLOG] });
      await queryClient.refetchQueries({ queryKey: ['post-likes'] });
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      toast.error(error?.response?.data?.detail || error?.message || 'Có lỗi xảy ra');
    },
  });

  const handleDelete = () => {
    if (node.type === INTERACTION_TYPES_SAFE.COMMENT) {
      // Delete comment
      const comment = node.original as CommentEntity;
      deleteCommentMutation.mutate(comment.id);
    } else if (node.type === INTERACTION_TYPES_SAFE.LIKE) {
      // Unlike post - Admin can remove likes from other users
      if (node.postId) {
        const like = node.original as LikeUser;
        const targetUserId = like?.user_id; // Get user_id from LikeUser
        unlikePostMutation.mutate({ 
          postId: node.postId, 
          targetUserId: targetUserId 
        });
      }
    }
  };

  const getDeleteMessage = () => {
    if (node.type === INTERACTION_TYPES_SAFE.COMMENT) {
      return `Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.`;
    } else if (node.type === INTERACTION_TYPES_SAFE.LIKE) {
      return `Bạn có chắc chắn muốn bỏ thích bài viết này?`;
    }
    return 'Bạn có chắc chắn muốn xóa?';
  };

  const getDeleteTitle = () => {
    if (node.type === INTERACTION_TYPES_SAFE.COMMENT) {
      return 'Xác nhận xóa bình luận';
    } else if (node.type === INTERACTION_TYPES_SAFE.LIKE) {
      return 'Xác nhận bỏ thích';
    }
    return 'Xác nhận xóa';
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Xóa</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getDeleteTitle()}</AlertDialogTitle>
          <AlertDialogDescription>
            {getDeleteMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

