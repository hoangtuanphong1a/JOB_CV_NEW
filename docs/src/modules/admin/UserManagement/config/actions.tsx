'use client';

import { Trash2, Ban, UserCheck } from 'lucide-react';
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
import { IUser } from '../libs/utils';
import { KEYS } from '@/apis/client/user/keys';
import {
  useBanUserMutation,
  useUnbanUserMutation,
  useDeleteUserMutation,
} from '@/apis/client/user/queries';

interface ActionsProps {
  user: IUser;
}

export default function Actions({ user }: ActionsProps) {
  const queryClient = useQueryClient();

  const banMutation = useBanUserMutation({
    onSuccess: async () => {
      toast.success('Đã cấm người dùng!');
      await queryClient.invalidateQueries({ queryKey: [KEYS.ADMIN_USERS] });
      await queryClient.refetchQueries({ queryKey: [KEYS.ADMIN_USERS] });
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      toast.error(error?.response?.data?.detail || error?.message || 'Có lỗi xảy ra');
    },
  });

  const unbanMutation = useUnbanUserMutation({
    onSuccess: async () => {
      toast.success('Đã bỏ cấm người dùng!');
      await queryClient.invalidateQueries({ queryKey: [KEYS.ADMIN_USERS] });
      await queryClient.refetchQueries({ queryKey: [KEYS.ADMIN_USERS] });
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      toast.error(error?.response?.data?.detail || error?.message || 'Có lỗi xảy ra');
    },
  });

  const deleteMutation = useDeleteUserMutation({
    onSuccess: async () => {
      toast.success('Xóa người dùng thành công!');
      // Invalidate và refetch ngay lập tức
      await queryClient.invalidateQueries({ queryKey: [KEYS.ADMIN_USERS] });
      await queryClient.refetchQueries({ queryKey: [KEYS.ADMIN_USERS] });
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      toast.error(error?.response?.data?.detail || error?.message || 'Có lỗi xảy ra');
    },
  });

  const handleBan = () => {
    banMutation.mutate(user.id);
  };

  const handleUnban = () => {
    unbanMutation.mutate(user.id);
  };

  const handleDelete = () => {
    deleteMutation.mutate({ userId: user.id, hardDelete: true });
  };

  return (
    <div className="flex gap-2">
      {/* Ban/Unban button */}
      {user.is_banned ? (
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 hover:text-green-700 hover:border-green-300 hover:bg-green-50"
                >
                  <UserCheck className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bỏ cấm</p>
            </TooltipContent>
          </Tooltip>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận bỏ cấm người dùng</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn bỏ cấm người dùng <strong className="text-foreground">&quot;{user.full_name || user.email || 'Người dùng'}&quot;</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleUnban}
                className="bg-green-600 hover:bg-green-700"
              >
                Bỏ cấm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-orange-600 hover:text-orange-700 hover:border-orange-300 hover:bg-orange-50"
                >
                  <Ban className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cấm</p>
            </TooltipContent>
          </Tooltip>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận cấm người dùng</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn cấm người dùng <strong className="text-foreground">&quot;{user.full_name || user.email || 'Người dùng'}&quot;</strong>? 
                Hành động này sẽ ngăn người dùng đăng nhập và sử dụng hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBan}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Cấm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Delete button */}
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
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng <strong className="text-foreground">&quot;{user.full_name || user.email || 'Người dùng'}&quot;</strong>? 
              Hành động này <span className="text-destructive font-medium">không thể hoàn tác</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

