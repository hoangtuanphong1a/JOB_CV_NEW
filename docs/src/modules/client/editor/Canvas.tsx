"use client";

import React, { forwardRef, useMemo, useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, ImageIcon, Trash2, GripVertical, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { useEditorStore, ElementData } from '@/stores/editorStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizableColumns } from './ResizableColumns';

interface SortableElementProps {
  element: ElementData;
}

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

const renderChildContent = (child: ElementData, onUpdate?: (content: string) => void): React.ReactNode => {
  const updateContent = onUpdate || (() => {});
  switch (child.type) {
    case 'heading1':
    case 'heading2':
    case 'heading3':
    case 'text':
      return <EditableText element={child} onUpdate={updateContent} />;
    case 'button':
      return (
        <button
          className="px-3 py-1.5 text-xs font-medium w-full"
          style={{
            backgroundColor: child.styles.backgroundColor || undefined,
            color: child.styles.color || undefined,
            borderRadius: child.styles.borderRadius || '0',
          }}
        >
          {child.content}
        </button>
      );
    case 'link':
      return (
        <a href="#" className="underline text-xs" style={{ color: child.styles.color || undefined }}>
          {child.content}
        </a>
      );
    case 'divider':
      const childDividerWidth = child.styles.width || '100%';
      const childDividerHeight = child.styles.height || '1px';
      const childDividerAlign = child.styles.textAlign || 'center';
      return (
        <div 
          style={{ 
            textAlign: childDividerAlign as any,
            display: 'flex',
            justifyContent: childDividerAlign === 'left' ? 'flex-start' : childDividerAlign === 'right' ? 'flex-end' : 'center',
          }}
        >
          <hr 
            className="border-t border-border" 
            style={{ 
              width: childDividerWidth,
              height: childDividerHeight,
              borderWidth: childDividerHeight,
            }} 
          />
        </div>
      );
    case 'image':
      const childImageShape = child.styles.imageShape || 'square';
      const childImageBorderRadius = childImageShape === 'circle' ? '50%' : childImageShape === 'rounded' ? '8px' : '0';
      const childImageWidth = child.styles.width || (childImageShape === 'circle' ? '100px' : '100%');
      const childImageHeight = child.styles.height || (childImageShape === 'circle' ? '100px' : 'auto');
      const childImageAlign = child.styles.textAlign || 'center';
      return child.content ? (
        <img 
          src={child.content} 
          alt="" 
          className="h-auto object-cover"
          style={{ 
            borderRadius: childImageBorderRadius,
            width: childImageWidth,
            height: childImageHeight,
            display: 'block',
            margin: childImageAlign === 'left' ? '0 auto 0 0' : childImageAlign === 'right' ? '0 0 0 auto' : '0 auto',
          }} 
        />
      ) : (
        <div className="bg-muted p-4 flex items-center justify-center" style={{ borderRadius: child.styles.borderRadius || '0' }}>
          <ImageIcon className="w-6 h-6 text-muted-foreground" />
        </div>
      );
    default:
      return <span className="text-xs text-muted-foreground capitalize">{child.type}</span>;
  }
};

const renderElementContent = (element: ElementData, onUpdate: (content: string) => void, updateElement?: (id: string, updates: Partial<ElementData>) => void): React.ReactNode => {
  switch (element.type) {
    case 'heading1':
    case 'heading2':
    case 'heading3':
    case 'text':
      return <EditableText element={element} onUpdate={onUpdate} />;
    case 'button':
      return (
        <button
          className="px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: element.styles.backgroundColor || '#60a5fa',
            color: element.styles.color || '#ffffff',
            borderRadius: element.styles.borderRadius || '0',
          }}
        >
          {element.content}
        </button>
      );
    case 'link':
      return (
        <a href="#" className="underline text-sm" style={{ color: element.styles.color || '#60a5fa' }}>
          {element.content}
        </a>
      );
    case 'divider':
      const dividerWidth = element.styles.width || '100%';
      const dividerHeight = element.styles.height || '1px';
      const dividerAlign = element.styles.textAlign || 'center';
      return (
        <div 
          style={{ 
            textAlign: dividerAlign as any,
            display: 'flex',
            justifyContent: dividerAlign === 'left' ? 'flex-start' : dividerAlign === 'right' ? 'flex-end' : 'center',
          }}
        >
          <hr 
            className="border-t border-border my-2" 
            style={{ 
              width: dividerWidth,
              height: dividerHeight,
              borderWidth: dividerHeight,
            }} 
          />
        </div>
      );
    case 'image':
      const imageShape = element.styles.imageShape || 'square';
      const imageBorderRadius = imageShape === 'circle' ? '50%' : imageShape === 'rounded' ? '8px' : '0';
      const imageWidth = element.styles.width || (imageShape === 'circle' ? '200px' : '100%');
      const imageHeight = element.styles.height || (imageShape === 'circle' ? '200px' : 'auto');
      const imageAlign = element.styles.textAlign || 'center';
      return element.content ? (
        <img 
          src={element.content} 
          alt="" 
          className="h-auto object-cover"
          style={{ 
            borderRadius: imageBorderRadius,
            width: imageWidth,
            height: imageHeight,
            display: 'block',
            margin: imageAlign === 'left' ? '0 auto 0 0' : imageAlign === 'right' ? '0 0 0 auto' : '0 auto',
          }} 
        />
      ) : (
        <div className="bg-muted p-8 flex flex-col items-center justify-center h-full" style={{ borderRadius: element.styles.borderRadius || '0' }}>
          <ImageIcon className="w-12 h-12 text-muted-foreground mb-2" />
          <span className="text-xs text-muted-foreground">Kéo hình ảnh vào đây</span>
        </div>
      );
    case 'video':
      return (
        <div className="bg-muted p-8 flex flex-col items-center justify-center h-full" style={{ borderRadius: element.styles.borderRadius || '0' }}>
          {element.content ? (
            <video src={element.content} controls className="max-w-full h-auto" style={{ borderRadius: element.styles.borderRadius || '0' }} />
          ) : (
            <>
              <div className="w-12 h-12 bg-blue-400/10 flex items-center justify-center mb-2" style={{ borderRadius: '50%' }}>
                <div className="w-0 h-0 border-l-16 border-l-blue-400 border-y-10 border-y-transparent ml-1" />
              </div>
              <span className="text-xs text-muted-foreground">Kéo video vào đây</span>
            </>
          )}
        </div>
      );
    case '2columns':
    case '3columns':
    case '4columns':
      return <ResizableColumns element={element} renderChildContent={(child) => renderChildContent(child)} />;
    default:
      return (
        <div className="text-sm text-muted-foreground capitalize h-full flex items-center justify-center bg-muted/50" style={{ borderRadius: element.styles.borderRadius || '0' }}>
          {element.type}
        </div>
      );
  }
};

const SortableElementComponent = forwardRef<HTMLDivElement, SortableElementProps>(({ element }, ref) => {
  const { selectedElementId, selectElement, removeElement, updateElement, isDragging: globalIsDragging } = useEditorStore();
  const isSelected = selectedElementId === element.id;
  const [dropPosition, setDropPosition] = useState<'before' | 'inside' | 'after' | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: element.id,
    animateLayoutChanges: ({ isSorting, wasDragging }) => {
      if (!isSorting && wasDragging) return false;
      return true;
    },
  });

  const [pointerY, setPointerY] = useState(0);
  
  useEffect(() => {
    if (!globalIsDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setPointerY(e.clientY);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [globalIsDragging]);

  useDndMonitor({
    onDragOver: (event: any) => {
      if (!globalIsDragging || !elementRef.current || pointerY === 0) {
        setDropPosition(null);
        return;
      }

      if (event.over?.id === element.id) {
        const rect = elementRef.current.getBoundingClientRect();
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

  const style = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition: isDragging ? 'none' : transition,
    };
    if (element.styles.margin && element.styles.margin !== '0') {
      baseStyle.margin = element.styles.margin;
    }
    if (element.styles.backgroundColor) {
      baseStyle.backgroundColor = element.styles.backgroundColor;
    }
    return baseStyle;
  }, [transform, transition, isDragging, element.styles.margin, element.styles.backgroundColor]);

  const paddingStyle = useMemo(() => {
    const padding = element.styles.padding || '0';
    return padding && padding !== '0' ? { padding } : {};
  }, [element.styles.padding]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateElement(element.id, { content: result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        elementRef.current = node;
      }}
      data-sortable-id={element.id}
      suppressHydrationWarning
      className={cn(
        'relative cursor-pointer group',
        !element.styles.backgroundColor && 'bg-background',
        'transition-colors duration-150',
        'border ',
        isDragging && 'opacity-50 z-50'
      )}
      style={{
        ...style,
        borderRadius: element.styles.borderRadius || '0',
        pointerEvents: globalIsDragging && !isDragging ? 'none' : 'auto',
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
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
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeElement(element.id);
        }}
        className="absolute -right-2 -top-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-destructive/90 z-20"
        aria-label="Delete element"
      >
        <Trash2 className="w-3 h-3" />
      </button>
      {isSelected && (
        <div className="absolute inset-0  pointer-events-none animate-pulse" />
      )}
      {(element.type === 'image' || element.type === 'video') && isSelected && (
        <label className="absolute top-2 right-8 p-1.5 bg-blue-400 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
          <Upload className="w-3 h-3" />
          <input
            type="file"
            accept={element.type === 'image' ? 'image/*' : 'video/*'}
            onChange={(e) => handleFileUpload(e, element.type as 'image' | 'video')}
            className="hidden"
          />
        </label>
      )}
      <div 
        className="h-full overflow-hidden" 
        style={{
          ...(element.type === 'image' && element.content ? {} : paddingStyle),
        }}
      >
        {renderElementContent(element, (content) => updateElement(element.id, { content }))}
      </div>
    </div>
  );
});

SortableElementComponent.displayName = 'SortableElement';

export const Canvas = () => {
  const { elements, viewMode, isDragging, selectedElementId, selectElement } = useEditorStore();
  const { isOver, setNodeRef } = useDroppable({ id: 'canvas-droppable' });
  const elementIds = useMemo(() => elements.map((el) => el.id), [elements]);
  const [zoom, setZoom] = useState(100);

  const a4WidthDesktop = 794;
  const a4Height = 1123;
  const a4WidthMobile = 375;
  const canvasWidth = viewMode === 'mobile' ? a4WidthMobile : a4WidthDesktop;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 25));
  const handleZoomReset = () => setZoom(100);

  return (
    <div 
      className="flex-1 bg-muted/20 overflow-hidden flex items-center justify-center relative" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          selectElement(null);
        }
      }}
    >
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-background border border-border rounded-lg p-1 shadow-sm">
        <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 25}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium min-w-12 text-center">{zoom}%</span>
        <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleZoomReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="h-full w-full">
        <div className="flex items-center justify-center p-6" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}>
          <div
            ref={setNodeRef}
            data-canvas-content
            className={cn(
              'bg-background transition-all shadow-sm relative',
              isOver ? 'border-2 border-dashed border-blue-400 bg-blue-400/5' : 'border-2 border-dashed border-transparent',
              selectedElementId === null && 'border-transparent'
            )}
            style={{
              width: `${canvasWidth}px`,
              minHeight: `${a4Height}px`,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                selectElement(null);
              }
            }}
          >
            {elements.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center" style={{ minHeight: `${a4Height}px` }}>
                <div className="w-16 h-16 bg-muted/50 rounded-xl flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Kéo các phần tử vào đây</h3>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  Bắt đầu soạn thảo email của bạn bằng cách kéo các thành phần từ thanh bên.
                </p>
              </div>
            ) : (
              <>
                <SortableContext items={elementIds} strategy={verticalListSortingStrategy}>
                  <div>
                    {elements.map((element) => (
                      <SortableElementComponent key={element.id} element={element} />
                    ))}
                  </div>
                </SortableContext>
              </>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
