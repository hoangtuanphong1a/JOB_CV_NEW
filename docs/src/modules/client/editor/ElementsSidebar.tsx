"use client";

import React, { useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ChevronLeft, LayoutGrid, LayoutTemplate, Type, MousePointer, Link, Minus, Columns2, Columns3, Columns4, Code, Image, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ElementItem {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
  defaultContent: string;
}

interface ElementCategory {
  id: string;
  label: string;
  items: ElementItem[];
}

interface ElementsSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const elementCategories: ElementCategory[] = [
  {
    id: 'basic',
    label: 'Cơ Bản',
    items: [
      { id: 'heading1', type: 'heading1', label: 'Heading 1', icon: <span className="text-lg font-bold">H1</span>, defaultContent: 'Tiêu đề 1' },
      { id: 'heading2', type: 'heading2', label: 'Heading 2', icon: <span className="text-base font-bold">H2</span>, defaultContent: 'Tiêu đề 2' },
      { id: 'heading3', type: 'heading3', label: 'Heading 3', icon: <span className="text-sm font-bold">H3</span>, defaultContent: 'Tiêu đề 3' },
      { id: 'text', type: 'text', label: 'Text', icon: <Type className="w-5 h-5" />, defaultContent: 'Văn bản mẫu' },
      { id: 'button', type: 'button', label: 'Button', icon: <MousePointer className="w-5 h-5" />, defaultContent: 'Nhấn vào đây' },
      { id: 'link', type: 'link', label: 'Link', icon: <Link className="w-5 h-5" />, defaultContent: 'Liên kết' },
      { id: 'divider', type: 'divider', label: 'Divider', icon: <Minus className="w-5 h-5" />, defaultContent: '' },
    ],
  },
  {
    id: 'layout',
    label: 'Bố Cục',
    items: [
      { id: '2columns', type: '2columns', label: '2 Columns', icon: <Columns2 className="w-5 h-5" />, defaultContent: '' },
      { id: '3columns', type: '3columns', label: '3 Columns', icon: <Columns3 className="w-5 h-5" />, defaultContent: '' },
      { id: '4columns', type: '4columns', label: '4 Columns', icon: <Columns4 className="w-5 h-5" />, defaultContent: '' },
      { id: 'html', type: 'html', label: 'HTML', icon: <Code className="w-5 h-5" />, defaultContent: '<div>Custom HTML</div>' },
    ],
  },
  {
    id: 'media',
    label: 'Đa Phương Tiện',
    items: [
      { id: 'image', type: 'image', label: 'Image', icon: <Image className="w-5 h-5" />, defaultContent: '' },
      { id: 'video', type: 'video', label: 'Video', icon: <Video className="w-5 h-5" />, defaultContent: '' },
    ],
  },
];

const DraggableElement = ({ item }: { item: ElementItem }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `element-${item.id}`,
    data: {
      type: item.type,
      defaultContent: item.defaultContent,
    },
  });

  const style = useMemo(() => {
    if (isDragging || !transform) return undefined;
    return {
      transform: CSS.Translate.toString(transform),
    };
  }, [transform, isDragging]);

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        maxWidth: '100%',
        overflow: 'hidden',
      }}
      suppressHydrationWarning
      {...attributes}
      {...listeners}
      className={cn(
        'flex items-center gap-2 p-2.5 bg-background border border-border cursor-grab active:cursor-grabbing transition-all hover:bg-muted/50 hover:border-blue-400/50 min-w-0',
        isDragging && 'opacity-50 z-50'
      )}
    >
      <div className="text-muted-foreground shrink-0">{item.icon}</div>
      <span className="text-xs font-medium text-foreground flex-1 min-w-0 truncate">{item.label}</span>
    </div>
  );
};

export const ElementsSidebar = ({ isCollapsed, onToggle }: ElementsSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'elements' | 'templates'>('elements');

  if (isCollapsed) {
    return (
      <div className="w-8 bg-muted/30 border-r border-border flex flex-col items-center py-2">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-muted rounded-md transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-[220px] bg-muted/30 border-r border-border flex flex-col h-full overflow-x-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between bg-background">
        <div>
          <h2 className="font-semibold text-foreground text-sm">Trình Tạo Email</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Chỉnh sửa chuyên nghiệp</p>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-muted rounded-md transition-colors"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex border-b border-border bg-background">
        <button
          onClick={() => setActiveTab('elements')}
          className={cn(
            'flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground transition-all border-b-2 border-transparent hover:text-foreground hover:bg-muted/50 flex-1',
            activeTab === 'elements' && 'text-blue-400 border-blue-400 bg-blue-400/5'
          )}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-xs">Elements</span>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={cn(
            'flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground transition-all border-b-2 border-transparent hover:text-foreground hover:bg-muted/50 flex-1',
            activeTab === 'templates' && 'text-blue-400 border-blue-400 bg-blue-400/5'
          )}
        >
          <LayoutTemplate className="w-4 h-4" />
          <span className="text-xs">Templates</span>
        </button>
      </div>

      <ScrollArea className="flex-1 overflow-x-hidden" style={{ overflowX: 'hidden' }}>
        <div className="p-3 min-w-0 max-w-full">
          {activeTab === 'elements' && (
            <div className="space-y-4">
              {elementCategories.map((category) => (
                <div key={category.id} className="mb-6">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                    {category.label}
                  </h3>
                  <div className="space-y-1.5 overflow-x-hidden">
                    {category.items.map((item) => (
                      <DraggableElement key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'templates' && (
            <div className="text-center py-12 text-muted-foreground text-sm">Templates coming soon</div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};
