"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditorStore, ElementData } from '@/stores/editorStore';

interface ColumnDropZoneProps {
  parentId: string;
  columnIndex: number;
  children: ElementData[];
  onRemoveChild: (childId: string) => void;
  renderChildContent: (child: ElementData) => React.ReactNode;
  isDragging: boolean;
  columnBackgroundColor?: string;
}

interface SortableChildProps {
  child: ElementData;
  onRemove: (childId: string) => void;
  renderChildContent: (child: ElementData) => React.ReactNode;
  columnBackgroundColor?: string;
}

interface ResizableColumnDividerProps {
  dividerIndex: number;
  onResize: (dividerIndex: number, deltaPercent: number) => void;
  onResizeEnd: () => void;
  isResizing: boolean;
  setIsResizing: (v: boolean) => void;
  isVisible: boolean;
}

interface ResizableColumnsProps {
  element: ElementData;
  renderChildContent: (child: ElementData) => React.ReactNode;
}

const MIN_COLUMN_WIDTH = 15;
const RESIZE_TRANSITION_DURATION = 75;

const EditableText = ({ element, onUpdate }: { element: ElementData; onUpdate: (content: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(element.content);

  useEffect(() => {
    if (!isEditing) setValue(element.content);
  }, [element.content, isEditing]);

  const handleBlur = () => {
    onUpdate(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setValue(element.content);
      setIsEditing(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="w-full border-none outline-none bg-transparent"
        style={{
          fontSize: element.styles.fontSize || undefined,
          color: element.styles.color || undefined,
        }}
        autoFocus
      />
    );
  }

  const defaultFontSize = element.type === 'heading1' ? '32px' : element.type === 'heading2' ? '24px' : element.type === 'heading3' ? '18px' : '14px';
  const Tag = element.type === 'heading1' ? 'h1' : element.type === 'heading2' ? 'h2' : element.type === 'heading3' ? 'h3' : 'p';
  return (
    <Tag
      onClick={handleClick}
      className="cursor-text hover:bg-muted/50 rounded px-1 -mx-1"
      style={{
        fontSize: element.styles.fontSize || defaultFontSize,
        color: element.styles.color || undefined,
      }}
    >
      {element.content || 'Nhấp để chỉnh sửa'}
    </Tag>
  );
};

const SortableChild = ({ child, onRemove, renderChildContent, columnBackgroundColor }: SortableChildProps) => {
  const { selectElement, selectedElementId, isDragging, updateElement } = useEditorStore();
  const isSelected = selectedElementId === child.id;
  const [dropPosition, setDropPosition] = useState<'before' | 'inside' | 'after' | null>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isChildDragging } = useSortable({
    id: child.id,
    animateLayoutChanges: ({ isSorting, wasDragging }) => {
      if (!isSorting && wasDragging) return false;
      return true;
    },
  });

  const [pointerY, setPointerY] = useState(0);
  
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setPointerY(e.clientY);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isDragging]);

  useDndMonitor({
    onDragOver: (event: any) => {
      if (!isDragging || !childRef.current || pointerY === 0) {
        setDropPosition(null);
        return;
      }

      if (event.over?.id === child.id) {
        const rect = childRef.current.getBoundingClientRect();
        const relativeY = pointerY - rect.top;
        const threshold = rect.height * 0.33;

        if (relativeY < threshold) {
          setDropPosition('before');
        } else if (relativeY > rect.height - threshold) {
          setDropPosition('after');
        } else {
          setDropPosition('inside');
        }
      } else {
        setDropPosition(null);
      }
    },
    onDragEnd: () => {
      setDropPosition(null);
      setPointerY(0);
    },
  });

  const baseStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isChildDragging ? 'none' : transition,
    pointerEvents: (isDragging ? 'none' : 'auto') as React.CSSProperties['pointerEvents'],
    margin: child.styles.margin && child.styles.margin !== '0' ? child.styles.margin : undefined,
    backgroundColor: child.styles.backgroundColor || columnBackgroundColor || undefined,
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        childRef.current = node;
      }}
      data-sortable-id={child.id}
      style={{
        ...baseStyle,
        borderRadius: child.styles.borderRadius || '0',
      }}
      suppressHydrationWarning
      className={cn(
        'relative bg-card p-2 text-sm cursor-pointer transition-colors',
        isSelected && 'border shadow-md',
        !isSelected && 'border border-transparent hover:border-blue-400/50',
        isChildDragging && 'opacity-50 z-50'
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(child.id);
      }}
    >
      {dropPosition === 'before' && (
        <div className="absolute -top-1 left-0 right-0 h-1.5 bg-blue-400 shadow-lg shadow-blue-400/50 z-50 rounded-full animate-pulse" />
      )}
      {dropPosition === 'after' && (
        <div className="absolute -bottom-1 left-0 right-0 h-1.5 bg-blue-400 shadow-lg shadow-blue-400/50 z-50 rounded-full animate-pulse" />
      )}
      {dropPosition === 'inside' && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-400/10 z-40 pointer-events-none rounded animate-pulse" />
      )}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-1 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-20"
      >
        <GripVertical className="w-3 h-3 text-muted-foreground" />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(child.id);
        }}
        className="absolute -right-1 -top-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90 z-20"
      >
        <Trash2 className="w-2.5 h-2.5" />
      </button>
      {(child.type === 'image' || child.type === 'video') && isSelected && (
        <label className="absolute top-2 right-8 p-1.5 bg-blue-400 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
          <Upload className="w-3 h-3" />
          <input
            type="file"
            accept={child.type === 'image' ? 'image/*' : 'video/*'}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (event) => {
                const result = event.target?.result as string;
                updateElement(child.id, { content: result });
              };
              reader.readAsDataURL(file);
            }}
            className="hidden"
          />
        </label>
      )}
      {['heading1', 'heading2', 'heading3', 'text'].includes(child.type) ? (
        <div style={{ padding: child.styles.padding && child.styles.padding !== '0' ? child.styles.padding : undefined }}>
          <EditableText element={child} onUpdate={(content) => updateElement(child.id, { content })} />
        </div>
      ) : (
        renderChildContent(child)
      )}
    </div>
  );
};

const ColumnDropZone = ({
  parentId,
  columnIndex,
  children,
  onRemoveChild,
  renderChildContent,
  isDragging,
  columnBackgroundColor,
}: ColumnDropZoneProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${parentId}-${columnIndex}`,
    data: {
      isColumn: true,
      parentId,
      columnIndex,
    },
  });

  const childIds = useMemo(() => children.map((c) => c.id), [children]);

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: columnBackgroundColor || undefined,
        minHeight: '100%',
      }}
      className={cn(
        'min-h-[80px] border-2 border-dashed transition-all duration-200 p-2 relative',
        isOver ? 'border-blue-400 bg-blue-400/10' : 'border-transparent bg-muted/30 hover:border-blue-400/50'
      )}
    >
      {children.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-4">
          <Plus className="w-5 h-5 text-muted-foreground/50 mb-1" />
          <span className="text-xs text-muted-foreground/70">Kéo phần tử vào đây</span>
        </div>
      ) : (
        <>
          <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
            <div>
              {children.map((child) => {
                if (child.type === '2columns' || child.type === '3columns' || child.type === '4columns') {
                  return (
                    <div key={child.id} className="relative">
                      <ResizableColumns element={child} renderChildContent={renderChildContent} />
                    </div>
                  );
                }
                return (
                  <SortableChild
                    key={child.id}
                    child={child}
                    onRemove={onRemoveChild}
                    renderChildContent={renderChildContent}
                    columnBackgroundColor={columnBackgroundColor}
                  />
                );
              })}
            </div>
          </SortableContext>
        </>
      )}
    </div>
  );
};

const ResizableColumnDivider = ({
  dividerIndex,
  onResize,
  onResizeEnd,
  isResizing,
  setIsResizing,
  isVisible,
}: ResizableColumnDividerProps) => {
  const dividerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const containerWidthRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startXRef.current = e.clientX;
      const container = dividerRef.current?.parentElement;
      if (container) {
        containerWidthRef.current = container.offsetWidth;
      }
      setIsResizing(true);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const now = performance.now();
        if (now - lastUpdateTimeRef.current < 16) return;
        lastUpdateTimeRef.current = now;
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(() => {
          const deltaX = moveEvent.clientX - startXRef.current;
          const deltaPercent = (deltaX / containerWidthRef.current) * 100;
          onResize(dividerIndex, deltaPercent);
          startXRef.current = moveEvent.clientX;
        });
      };

      const handleMouseUp = () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        setIsResizing(false);
        onResizeEnd();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [dividerIndex, onResize, onResizeEnd, setIsResizing]
  );

  return (
    <div
      ref={dividerRef}
      className={cn(
        'relative flex items-center justify-center cursor-col-resize select-none group/divider transition-all duration-150',
        isResizing && 'z-50',
        !isVisible ? 'w-0 mx-0' : 'w-4 mx-0.5'
      )}
      onMouseDown={handleMouseDown}
      style={{ willChange: isResizing ? 'transform' : 'auto' }}
    >
      <div
        className={cn(
          'absolute inset-y-0 transition-all duration-150',
          isResizing ? 'bg-blue-400 shadow-lg shadow-blue-400/30 w-[2px]' : isVisible ? 'bg-border w-[5px]' : 'w-0 bg-transparent'
        )}
      />
      <div
        className={cn(
          'absolute p-1 bg-card border border-border shadow-sm transition-all duration-150',
          isResizing ? 'opacity-100 bg-blue-400 border-blue-400' : isVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <GripVertical className={cn('w-3 h-3', isResizing ? 'text-white' : 'text-muted-foreground')} />
      </div>
    </div>
  );
};

export const ResizableColumns = ({ element, renderChildContent }: ResizableColumnsProps) => {
  const { updateColumnWidths, removeChildElement, selectElement, selectedElementId, isDragging, updateElement } = useEditorStore();
  const [isResizing, setIsResizing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [localWidths, setLocalWidths] = useState<number[]>(() => {
    if (element.columnWidths) return element.columnWidths;
    if (element.type === '2columns') return [50, 50];
    if (element.type === '3columns') return [33.33, 33.34, 33.33];
    return [25, 25, 25, 25];
  });

  const tempWidthsRef = useRef<number[]>(localWidths);

  useEffect(() => {
    if (element.columnWidths) {
      setLocalWidths(element.columnWidths);
      tempWidthsRef.current = element.columnWidths;
    }
  }, [element.columnWidths]);

  const columnCount = element.type === '2columns' ? 2 : element.type === '3columns' ? 3 : 4;
  const isSelected = selectedElementId === element.id;

  const handleResize = useCallback(
    (dividerIndex: number, deltaPercent: number) => {
      setLocalWidths((prev) => {
        const newWidths = [...prev];
        const leftIndex = dividerIndex;
        const rightIndex = dividerIndex + 1;
        const leftNewWidth = newWidths[leftIndex] + deltaPercent;
        const rightNewWidth = newWidths[rightIndex] - deltaPercent;
        if (leftNewWidth >= MIN_COLUMN_WIDTH && rightNewWidth >= MIN_COLUMN_WIDTH) {
          newWidths[leftIndex] = leftNewWidth;
          newWidths[rightIndex] = rightNewWidth;
          tempWidthsRef.current = newWidths;
        }
        return newWidths;
      });
    },
    []
  );

  const handleResizeEnd = useCallback(() => {
    updateColumnWidths(element.id, tempWidthsRef.current);
  }, [element.id, updateColumnWidths]);

  const childrenByColumn = useMemo(() => {
    const grouped: ElementData[][] = Array.from({ length: columnCount }, () => []);
    (element.children || []).forEach((child: ElementData & { columnIndex?: number }) => {
      const colIdx = child.columnIndex ?? 0;
      if (colIdx >= 0 && colIdx < columnCount) {
        grouped[colIdx].push(child);
      }
    });
    return grouped;
  }, [element.children, columnCount]);

  const columnBackgroundColors = (element as any).columnBackgroundColors || [];

  return (
    <div
      className={cn('flex w-full h-full relative', isResizing && 'select-none')}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {Array.from({ length: columnCount }).map((_, colIndex) => (
        <React.Fragment key={colIndex}>
          <div
            style={{
              width: `${localWidths[colIndex]}%`,
              transition: isResizing ? 'none' : `width ${RESIZE_TRANSITION_DURATION}ms ease-out`,
            }}
            className="shrink-0"
          >
            <ColumnDropZone
              parentId={element.id}
              columnIndex={colIndex}
              children={childrenByColumn[colIndex]}
              onRemoveChild={(childId) => removeChildElement(element.id, childId)}
              renderChildContent={renderChildContent}
              isDragging={isDragging}
              columnBackgroundColor={columnBackgroundColors[colIndex]}
            />
          </div>
          {colIndex < columnCount - 1 && (
            <ResizableColumnDivider
              dividerIndex={colIndex}
              onResize={handleResize}
              onResizeEnd={handleResizeEnd}
              isResizing={isResizing}
              setIsResizing={setIsResizing}
              isVisible={isHovering || isResizing}  
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
