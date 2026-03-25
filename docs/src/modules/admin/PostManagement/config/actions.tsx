'use client';

import { useState } from 'react';
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
import { useDeletePostMutation } from '@/apis/client/blog/queries';
import { IPost } from '@/apis/client/blog/types';
import { KEYS } from '@/apis/client/blog/keys';
import { toast } from 'sonner';

import UpdatePostDialog from '../components/UpdatePostDialog';

interface ActionsProps {
  post: IPost;
}

export default function Actions({ post }: ActionsProps) {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useDeletePostMutation({
    onSuccess: () => {
      toast.success('Xóa bài viết thành công!');
      queryClient.invalidateQueries({ queryKey: [KEYS.BLOG] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa');
    },
  });

  const handleUpdateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [KEYS.BLOG] });
  };

  return (
    <>
      <div className="flex gap-2">
        {/* Nút Sửa */}
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setUpdateDialogOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chỉnh sửa</p>
          </TooltipContent>
        </Tooltip> */}

        {/* Nút Xóa với AlertDialog chuẩn shadcn */}
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
              <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa bài viết <strong className="text-foreground">“{post.title}”</strong>? 
                Hành động này <span className="text-destructive font-medium">không thể hoàn tác</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate(post.id)}
                disabled={deleteMutation.isPending}
                className="bg-destructive hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Dialog cập nhật bài viết */}
      <UpdatePostDialog
        post={post}
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        onSuccess={handleUpdateSuccess}
      />
    </>
  );
}