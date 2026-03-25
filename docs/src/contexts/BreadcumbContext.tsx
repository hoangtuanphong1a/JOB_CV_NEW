"use client";

import { sidebarFunctions } from '@/faker/sidebar-data';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  id: string;
  name: string;
  link: string;
  parentId?: string;
}

interface BreadcrumbContextType {
  currentPath: BreadcrumbItem[];
  setCurrentPath: (link: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within BreadcrumbProvider');
  }
  return context;
};

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<BreadcrumbItem[]>([]);
  const pathname = usePathname();

  // Hàm cập nhật breadcrumb - đã gộp luôn logic build để tránh warning
  const updateCurrentPath = useCallback(
    (link: string) => {
      const path: BreadcrumbItem[] = [];

      // Tìm item hiện tại theo link
      const currentItem = sidebarFunctions.find((item) => item.link === link);

      if (currentItem) {
        path.push({
          id: currentItem.id!,
          name: currentItem.name,
          link: currentItem.link,
          parentId: currentItem.parentId,
        });

        // Nếu có parent → thêm parent vào đầu mảng
        if (currentItem.parentId && currentItem.parentId !== '0') {
          const parentItem = sidebarFunctions.find((item) => item.id === currentItem.parentId);
          if (parentItem) {
            path.unshift({
              id: parentItem.id!,
              name: parentItem.name,
              link: parentItem.link,
              parentId: parentItem.parentId,
            });
          }
        }
      }

      setCurrentPath(path);
    },
    [] // sidebarFunctions là data tĩnh → không cần dependency
  );

  // Cập nhật breadcrumb khi pathname thay đổi
  useEffect(() => {
    if (pathname) {
      updateCurrentPath(pathname);
    }
  }, [pathname, updateCurrentPath]);

  return (
    <BreadcrumbContext.Provider value={{ currentPath, setCurrentPath: updateCurrentPath }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};