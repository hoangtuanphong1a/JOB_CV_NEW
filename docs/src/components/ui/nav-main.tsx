/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ChevronRight } from "lucide-react"
import * as LucideIcons from "lucide-react"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toPascalCase } from "@/lib/to-pascal-case"

type LucideIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

interface NavMainProps {
  items: any[] | []
}

export function NavMain({ items }: NavMainProps) {
  const { state } = useSidebar()
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})
  const [activeSubItemId, setActiveSubItemId] = useState<string | null>(null)
  const router = useRouter() // ✅ Thay useNavigate bằng useRouter

  const parentItems = items.filter((item) => !item.parentId || item.parentId === "0")

  const handleToggle = (itemId: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {parentItems.map((item) => {
          const subItems = items.filter((subItem) => subItem.parentId === item.id)
          const hasChildren = subItems.length > 0
          const iconName = typeof item.icon === "string" ? toPascalCase(item.icon) : null
          const IconComponent = iconName
            ? (LucideIcons[iconName as keyof typeof LucideIcons] as LucideIconComponent)
            : null

          if (state === "expanded" || !hasChildren) {
            return (
              <Collapsible
                key={item.id}
                open={openItems[item.id!]}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="flex items-center"
                      tooltip={item.name}
                      size="lg"
                      onClick={() => {
                        handleToggle(item.id!)
                      }}
                    >
                      {IconComponent ? (
                        <IconComponent className="mr-2" />
                      ) : (
                        <span className="text-red-500">Icon Missing</span>
                      )}
                      <span>{item.name}</span>
                      {hasChildren && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {hasChildren && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {subItems.map((subItem) => {
                          const subIconName =
                            typeof subItem.icon === "string" ? toPascalCase(subItem.icon) : null
                          const SubIconComponent = subIconName
                            ? (LucideIcons[subIconName as keyof typeof LucideIcons] as LucideIconComponent)
                            : null

                          return (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton asChild size="md">
                                <button
                                  className={`cursor-pointer w-full text-left ${
                                    activeSubItemId === subItem.id
                                      ? "bg-gray-300 text-gray-900"
                                      : ""
                                  } focus:outline-none`}
                                  onClick={() => {
                                    router.push(subItem.link) // ✅ Thay navigate(subItem.link)
                                    setActiveSubItemId(subItem.id!)
                                  }}
                                >
                                  {SubIconComponent && (
                                    <SubIconComponent className="mr-2" />
                                  )}
                                  <span>{subItem.name}</span>
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            )
          } else {
            return (
              <Popover key={item.id}>
                <PopoverTrigger asChild>
                  <SidebarMenuItem>
                    <SidebarMenuButton size="lg" className="flex justify-center">
                      {IconComponent ? (
                        <IconComponent />
                      ) : (
                        <span className="text-red-500">Icon Missing</span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </PopoverTrigger>

                <PopoverContent side="right" align="start" className="w-56 p-2 ml-2.5">
                  <SidebarMenuSub className="border-l-0! before:hidden px-0">
                    {subItems.map((subItem) => {
                      const subIconName =
                        typeof subItem.icon === "string" ? toPascalCase(subItem.icon) : null
                      const SubIconComponent = subIconName
                        ? (LucideIcons[subIconName as keyof typeof LucideIcons] as LucideIconComponent)
                        : null

                      return (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton asChild size="md">
                            <button
                              className="cursor-pointer w-full"
                              onClick={() => router.push(subItem.link)} // ✅ Thay navigate(subItem.link)
                            >
                              {SubIconComponent && (
                                <SubIconComponent className="mr-2" />
                              )}
                              <span>{subItem.name}</span>
                            </button>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </PopoverContent>
              </Popover>
            )
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
