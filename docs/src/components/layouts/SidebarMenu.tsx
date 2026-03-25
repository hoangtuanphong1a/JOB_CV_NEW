import * as React from "react"
import { NavMain } from "@/components/ui/nav-main" 
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavHome } from "@/components/ui/nav-home" 
import { sidebarFunctions } from "@/faker/sidebar-data"

export function SidebarMenu({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="pt-16 fixed">
      <SidebarContent>
        <NavMain items={sidebarFunctions} />
      </SidebarContent>
      <SidebarFooter>
        <NavHome /> 
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}