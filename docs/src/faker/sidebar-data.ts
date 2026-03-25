import type { SidebarFunction } from "@/types/sidebar-function";

export const sidebarFunctions: SidebarFunction[] = [
    // --- Main menu ---
    {
        name: "Quản lý bài viết",
        icon: "book-open",
        link: "/admin/post-management",
        sortOrder: 1,
        isActive: true,
        parentId: "0",
        id: "c0f6fbc5-5f4a-4f88-8e56-4f7b2c7a1a20",
        createdAt: "2025-08-13T08:00:00+00:00",
        updatedAt: "2025-08-13T08:10:00+00:00"
    },
    {
        name: "Quản lý tương tác",
        icon: "help-circle",
        link: "/admin/interaction-management",
        sortOrder: 1,
        isActive: true,
        parentId: "0",
        id: "c0f6fbc5-5f4a-4f88-8e56-4f7b2c7a1a21",
        createdAt: "2025-08-13T08:00:00+00:00",
        updatedAt: "2025-08-13T08:10:00+00:00"
    },
    {
        name: "Quản lý Người dùng",
        icon: "users",
        link: "/admin/user-management",
        sortOrder: 2,
        isActive: true,
        parentId: "0",
        id: "34adacfd-5e0f-4d1b-bcc8-7c9f6f3d9c9e",
        createdAt: "2025-08-13T08:05:00+00:00",
        updatedAt: "2025-08-13T08:15:00+00:00"
    },

    // --- Submenu: Quản lý khóa học ---

    {
        name: "Nội dung",
        icon: "file-text",
        link: "/admin/post-management",
        sortOrder: 3,
        isActive: true,
        parentId: "c0f6fbc5-5f4a-4f88-8e56-4f7b2c7a1a20",
        id: "1e3b8bda-98f4-4e65-9b2c-0fd96992c23b2",
        createdAt: "2025-08-13T08:43:00+00:00",
        updatedAt: "2025-08-13T08:44:00+00:00"
    },
    {
        name: "Nội dung",
        icon: "file-text",
        link: "/admin/interaction-management",
        sortOrder: 3,
        isActive: true,
        parentId: "c0f6fbc5-5f4a-4f88-8e56-4f7b2c7a1a21",
        id: "1e3b8bda-98f4-4e65-9b2c-0fd96992c23b1",
        createdAt: "2025-08-13T08:43:00+00:00",
        updatedAt: "2025-08-13T08:44:00+00:00"
    },
    {
        name: "Nội dung",
        icon: "file-text",
        link: "/admin/user-management",
        sortOrder: 3,
        isActive: true,
        parentId: "34adacfd-5e0f-4d1b-bcc8-7c9f6f3d9c9e",
        id: "1e3b8bda-98f4-4e65-9b2c-0fd96992c23b3",
        createdAt: "2025-08-13T08:43:00+00:00",
        updatedAt: "2025-08-13T08:44:00+00:00"
    },

];