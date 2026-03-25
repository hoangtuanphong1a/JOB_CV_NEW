 
"use client";

import {
  LogOut,
  Settings,
  KeyRound,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLogoutMutation } from "@/apis/client/auth/queries"
import { ChangePasswordModal } from "../common/modal/change-password-modal";
import { IUser } from "@/apis/client/auth"
import { useUserStore } from "@/stores";



export function NavUser({ user }: { user: Partial<Omit<IUser, "id" | "username">> }) {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const clearUser = useUserStore((s) => s.clearUser);

   const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      clearUser(); 
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-sidebar-accent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ml-2"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  alt={user?.full_name}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.full_name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.full_name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={"https://github.com/shadcn.png"}
                    alt={user?.full_name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.full_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.full_name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setPasswordModalOpen(true)}
              >
                <KeyRound />
                Đổi mật khẩu
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <Settings />
                Cài đặt
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>


      <ChangePasswordModal
        passwordModalOpen={passwordModalOpen}
        setPasswordModalOpen={setPasswordModalOpen}
        user={user}
        loading={false}
        handleChangePassword={() => alert("Đổi mật khẩu thành công")}
      />
    </SidebarMenu>
  );
}
