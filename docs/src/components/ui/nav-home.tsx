"use client"

import { MoveLeft } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

export function NavHome() {
  const router = useRouter()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          tooltip="Về trang chủ"
          className="flex items-center bg-linear-to-r from-primary to-purple-400 rounded-3xl text-white hover:text-white hover:shadow-lg transition-all duration-200 group-data-[collapsible=icon]:bg-linear-to-r group-data-[collapsible=icon]:border-none"
          onClick={() => router.push("/")}
        >
          <MoveLeft className="mx-2 h-4 w-4" />
          <span className="ml-6">Về trang chủ</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
