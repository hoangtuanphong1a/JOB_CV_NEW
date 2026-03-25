"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IUser, KEYS, useLogoutMutation } from "@/apis/client/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores";
import { BarChart3, CirclePlus, LogOut, Settings, User } from "lucide-react";
import { toast } from "sonner";

import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "./badge";
import { IconDotsVertical } from "@tabler/icons-react";

interface Props {
  user: IUser;
}

export function NavUser({ user }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: logout } = useLogoutMutation({
    onSuccess: () => {
      useUserStore.getState().clearUser();
      queryClient.invalidateQueries({ queryKey: [KEYS.AUTH_ME] });
      queryClient.clear();
      router.push(ROUTES.LOGIN);
      toast.success("Đăng xuất thành công");
    },
    // onError: onMutateError,
  });

  const handleLogout = () => {
    logout();
  };

  // Chuẩn hóa role (không phân biệt hoa/thường)
  const role = user.role.toLowerCase();
  const isAdmin = role === "admin";
  const isUser = role === "user";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center">
          <Avatar className="h-10 w-10 rounded-lg ">
            <AvatarImage src={user.avatar_url} alt={user.userName} />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight px-2">
            {/* <span className="truncate font-medium"> {user.name} </span> */}
            <span className="text-muted-foreground truncate text-md">
              {" "}
              {user.full_name}{" "}
            </span>
          </div>
          <IconDotsVertical className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-72" align="end" tabIndex={-1}>
        {/* === THÔNG TIN USER === */}
        <Link
          href={isAdmin ? "/admin" : ROUTES.HOME}
          className={isAdmin ? "pointer-events-none cursor-default" : ""}
        >
          <DropdownMenuItem className="gap-3">
            <Avatar className="h-10 w-10">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={user.userName} />
              ) : (
                <AvatarFallback>
                  {user.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col items-start gap-0">
              <div className="flex items-center gap-2">
                <div className="font-medium">{user.userName}</div>
                {isAdmin && (
                  <Badge
                    variant="secondary"
                    className="text-xs border-purple-300"
                  >
                    Quản trị viên
                  </Badge>
                )}
                {isUser && (
                  <Badge
                    variant="secondary"
                    className="text-xs border-purple-300"
                  >
                    Người dùng
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground max-w-[200px] truncate text-sm pt-1">
                {user.email}
              </div>
            </div>
          </DropdownMenuItem>
        </Link>
        {/* === ADMIN PANEL === */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
              ADMIN PANEL
            </div>
            <DropdownMenuItem
              onClick={() => router.push(ROUTES.ADMIN)}
              className="flex"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem
          onClick={() => router.push(ROUTES.PROFILE)}
          className="flex items-center"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(ROUTES.CREATE_POST)}
          className="flex items-center"
        >
          <CirclePlus className="mr-2 h-4 w-4" />
          <span>Tạo bài viết</span>
        </DropdownMenuItem>
        {/* === CÀI ĐẶT (chỉ user thường) === */}
        {!isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(ROUTES.SETTINGS)}
              className="flex items-center"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuItem>
          </>
        )}

        {/* === ĐĂNG XUẤT === */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          id="logout-button"
          onClick={handleLogout}
          className="text-red-600 hover:text-red-600! focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4 text-red-600" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
