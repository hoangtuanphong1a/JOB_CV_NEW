"use client";

import React, { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import { Toolbar } from './Toolbar';
import { ElementsSidebar } from './ElementsSidebar';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { useEditorStore } from '@/stores/editorStore';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmailEditor = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropInfo, setDropInfo] = useState<{ overId: string; position: 'before' | 'after' | 'inside' } | null>(null);
  const [pointerY, setPointerY] = useState<number>(0);
  const { addElement, addElementToColumn, moveElementToCanvas, moveElementToColumn, reorderElements, setIsDragging, elements, insertElementAt } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setIsDragging(true);
    setActiveId(String(event.active.id));
    if (typeof window !== 'undefined' && window.event) {
      setPointerY((window.event as MouseEvent).clientY);
    }
  }, [setIsDragging]);

  useEffect(() => {
    if (!activeId) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPointerY(e.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [activeId]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setDropInfo(null);
      return;
    }

    const overId = String(over.id);
    if (over.data.current?.isColumn) {
      setDropInfo(null);
      return;
    }

    const element = document.querySelector(`[data-sortable-id="${overId}"]`) as HTMLElement;
    if (element && pointerY > 0) {
      const rect = element.getBoundingClientRect();
      const relativeY = pointerY - rect.top;
      const threshold = rect.height * 0.33;

      let position: 'before' | 'after' | 'inside' = 'after';
      if (relativeY < threshold) {
        position = 'before';
      } else if (relativeY > rect.height - threshold) {
        position = 'after';
      } else {
        position = 'inside';
      }

      setDropInfo({ overId, position });
    } else {
      setDropInfo(null);
    }
  }, [pointerY]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setIsDragging(false);
      setActiveId(null);
      setDropInfo(null);
      
      const { active, over } = event;
      if (!over) return;

      const activeId = String(active.id);
      const overId = String(over.id);
      const position = dropInfo?.overId === overId ? dropInfo.position : null;

      if (activeId.startsWith('element-') && over.data.current?.isColumn) {
        const elementType = active.data.current?.type;
        const defaultContent = active.data.current?.defaultContent || '';
        const parentId = over.data.current?.parentId;
        const columnIndex = over.data.current?.columnIndex;
        if (elementType && parentId !== undefined && columnIndex !== undefined) {
          addElementToColumn(parentId, columnIndex, {
            type: elementType,
            content: defaultContent,
            styles: {},
          });
        }
        return;
      }

      if (activeId.startsWith('element-') && position && overId !== 'canvas-droppable' && !over.data.current?.isColumn) {
        const elementType = active.data.current?.type;
        const defaultContent = active.data.current?.defaultContent || '';
        if (elementType) {
          insertElementAt(
            { type: elementType, content: defaultContent, styles: {} },
            overId,
            position
          );
        }
        return;
      }

      if (activeId.startsWith('element-') && overId === 'canvas-droppable') {
        const elementType = active.data.current?.type;
        const defaultContent = active.data.current?.defaultContent || '';
        if (elementType) {
          addElement({
            type: elementType,
            content: defaultContent,
            styles: {},
          });
        }
        return;
      }

      if (overId === 'canvas-droppable' && !activeId.startsWith('element-')) {
        const isInColumn = elements.some((el) => el.children?.some((child) => child.id === activeId));
        if (isInColumn) {
          moveElementToCanvas(activeId);
        } else {
          const overElement = elements.find((e) => e.id === overId);
          if (overElement) {
            reorderElements(activeId, overId);
          }
        }
        return;
      }

      if (over.data.current?.isColumn && !activeId.startsWith('element-')) {
        const parentId = over.data.current?.parentId;
        const columnIndex = over.data.current?.columnIndex;
        const element = elements.find((e) => e.id === activeId);
        if (element && parentId !== undefined && columnIndex !== undefined) {
          moveElementToColumn(activeId, parentId, columnIndex);
        }
        return;
      }

      if (activeId !== overId && !activeId.startsWith('element-')) {
        reorderElements(activeId, overId);
      }
    },
    [addElement, addElementToColumn, moveElementToCanvas, moveElementToColumn, reorderElements, setIsDragging, elements, insertElementAt, dropInfo]
  );

  const renderDragOverlay = () => {
    if (!activeId) return null;
    
    if (activeId.startsWith('element-')) {
      const elementType = activeId.replace('element-', '');
      return (
        <div className="bg-background border border-blue-400 rounded-lg p-3 shadow-lg opacity-90">
          <span className="text-sm font-medium">{elementType}</span>
        </div>
      );
    }
    
    let element = elements.find((e) => e.id === activeId);
    if (!element) {
      for (const el of elements) {
        if (el.children) {
          element = el.children.find((c) => c.id === activeId);
          if (element) break;
        }
      }
    }
    
    if (element) {
      return (
        <div className="bg-background border border-blue-400 rounded-lg p-3 shadow-lg opacity-90 max-w-xs">
          <span className="text-sm font-medium">{element.type}</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        <Toolbar />
        <div className="flex-1 flex overflow-hidden">
          <ElementsSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <Canvas />
          {!isPropertiesCollapsed ? (
            <PropertiesPanel />
          ) : (
            <div className="w-0 border-l border-border relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full p-1 h-12 rounded-l-md rounded-r-none border border-l-0 border-border bg-background hover:bg-accent z-10"
                onClick={() => setIsPropertiesCollapsed(false)}
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <DragOverlay>{renderDragOverlay()}</DragOverlay>
    </DndContext>
  );
};
