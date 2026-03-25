"use client";

import { SidebarMenu } from "./SidebarMenu";
import BreadcrumbDisplay from "../common/breadcumb-display";
import { NavUser } from "../ui/nav-user";

import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";
import React from "react";
import { useMe } from "@/hooks/useMe";
import { ROUTES } from "@/lib/routes";
import { UserRole } from "@/apis/client/auth";
import { NoticeBell } from "../common/NoticeBell";
import { SearchIcon } from "lucide-react";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user, isLoading } = useMe();

  // ✅ Lấy user từ React Query cache

  // Nếu chưa đăng nhập → chuyển về login
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return null;

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="z-50 bg-background dark:bg-background fixed min-h-16 h-16 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center justify-between w-full px-4 py-4">
            <div className="flex items-center">
              <div className="flex items-center w-[16rem]">
                <SidebarTrigger />
                <button
                  onClick={() => router.push(ROUTES.HOME)}
                  className="cursor-pointer flex items-center gap-1"
                >
                  <span className="ml-3 text-xl font-bold text-purple-500">
                    📰 POST
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between w-full">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbDisplay />
                </BreadcrumbList>
              </Breadcrumb>

              {/* 🔍 Search */}
              <div className="relative w-1/3">
                <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                  <SearchIcon className="h-4 w-4" />
                </div>
                <Input
                  id="search"
                  type="search"
                  placeholder="Tìm kiếm dịch vụ"
                  className="w-full rounded-lg bg-background pl-9"
                />
              </div>

              {/* 🔔 Notifications + User */}
              <div className="flex items-center gap-2 justify-between">
                <NoticeBell />
                <NavUser
                  user={{
                    id: user?.id || "",
                    full_name: user?.full_name || "",
                    userName: user?.userName || "",
                    email: user?.email || "",
                    avatar_url:
                      user?.avatar_url || "https://github.com/shadcn.png",
                    role: (user?.role as UserRole) || "",
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* 🧩 Sidebar + Content */}
        <div className="flex w-full h-full overflow-x-hidden">
          <SidebarMenu />
          <div className="w-full p-4 mt-15 overflow-auto">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
