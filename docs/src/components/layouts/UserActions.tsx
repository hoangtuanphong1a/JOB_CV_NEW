"use client";

import { UserRole } from "@/apis/client/auth";
import { useUserStore } from "@/stores";

import { NavUser } from "@/components/ui/nav-user";

export function UserActions() {
  const user = useUserStore((state) => state.user);
  console.log("hay", user);
  

  return (
    <div className="flex items-center justify-between gap-2">
      <NavUser
        user={{
          id: user?.id || "",
          full_name: user?.full_name || "",
          userName: user?.userName || "",
          email: user?.email || "",
          avatar_url: user?.avatar_url || "https://github.com/shadcn.png",
          role: (user?.role as UserRole) || "",
        }}
      />
    </div>
  );
}
