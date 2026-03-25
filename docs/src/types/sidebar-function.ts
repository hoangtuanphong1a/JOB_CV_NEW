export interface SidebarFunction {
    id?: string;
    name: string;
    icon: string;
    link: string;
    sortOrder: number;
    isActive?: boolean;
    parentId: string;
    parentName?: string;
    createdAt?: string;
    updatedAt?: string;
}