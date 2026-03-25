import { create } from 'zustand';
import { nanoid } from 'nanoid';

export interface ElementData {
  id: string;
  type: string;
  content: string;
  styles: {
    width?: string;
    height?: string;
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    imageShape?: 'square' | 'circle' | 'rounded'; // ✅ FIX 6: Hình dạng ảnh
  };
  children?: ElementData[];
  columnWidths?: number[];
  columnBackgroundColors?: string[]; // ✅ FIX 3: Màu nền riêng cho mỗi column
}

export interface EditorState {
  elements: ElementData[];
  selectedElementId: string | null;
  viewMode: 'desktop' | 'mobile';
  isDragging: boolean;
  
  addElement: (element: Omit<ElementData, 'id'>, parentId?: string, columnIndex?: number, insertIndex?: number) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<ElementData>) => void;
  selectElement: (id: string | null) => void;
  setViewMode: (mode: 'desktop' | 'mobile') => void;
  setIsDragging: (isDragging: boolean) => void;
  reorderElements: (activeId: string, overId: string) => void;
  clearCanvas: () => void;
  getSelectedElement: () => ElementData | null;
  addElementToColumn: (parentId: string, columnIndex: number, element: Omit<ElementData, 'id'>, insertIndex?: number) => void;
  insertElementAt: (element: Omit<ElementData, 'id'>, targetId: string, position: 'before' | 'after' | 'inside') => void;
  updateColumnWidths: (elementId: string, widths: number[]) => void;
  removeChildElement: (parentId: string, childId: string) => void;
  moveElementToCanvas: (elementId: string) => void;
  moveElementToColumn: (elementId: string, parentId: string, columnIndex: number) => void;
}

const findAndUpdateElement = (
  elements: ElementData[],
  id: string,
  updater: (el: ElementData) => ElementData
): ElementData[] => {
  return elements.map((el) => {
    if (el.id === id) {
      return updater(el);
    }
    if (el.children && el.children.length > 0) {
      return {
        ...el,
        children: findAndUpdateElement(el.children, id, updater),
      };
    }
    return el;
  });
};

const findAndRemoveElement = (elements: ElementData[], id: string): ElementData[] => {
  return elements
    .filter((el) => el.id !== id)
    .map((el) => {
      if (el.children && el.children.length > 0) {
        return {
          ...el,
          children: findAndRemoveElement(el.children, id),
        };
      }
      return el;
    });
};

const findElementById = (elements: ElementData[], id: string): ElementData | null => {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children) {
      const found = findElementById(el.children, id);
      if (found) return found;
    }
  }
  return null;
};

const findAndRemoveFromColumns = (elements: ElementData[], id: string): ElementData[] => {
  return elements.map((el) => {
    if (el.children && el.children.length > 0) {
      return {
        ...el,
        children: el.children.filter((child) => child.id !== id),
      };
    }
    return el;
  });
};

export const useEditorStore = create<EditorState>((set, get) => ({
  elements: [],
  selectedElementId: null,
  viewMode: 'desktop',
  isDragging: false,
  
  addElement: (element, parentId, columnIndex, insertIndex) => {
    const newElement: ElementData = {
      ...element,
      id: nanoid(),
    };

    if (element.type === '2columns') {
      newElement.columnWidths = [50, 50];
      newElement.children = [];
    } else if (element.type === '3columns') {
      newElement.columnWidths = [33.33, 33.34, 33.33];
      newElement.children = [];
    } else if (element.type === '4columns') {
      newElement.columnWidths = [25, 25, 25, 25];
      newElement.children = [];
    }

    if (parentId !== undefined && columnIndex !== undefined) {
      set((state) => ({
        elements: findAndUpdateElement(state.elements, parentId, (el) => {
          const children = el.children || [];
          const columnChildren = children.filter((c) => (c as any).columnIndex === columnIndex);
          
          if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= columnChildren.length) {
            const newChildren = [...children];
            let currentIndex = 0;
            for (let i = 0; i < children.length; i++) {
              if ((children[i] as any).columnIndex === columnIndex) {
                if (currentIndex === insertIndex) {
                  newChildren.splice(i, 0, { ...newElement, columnIndex } as any);
                  return { ...el, children: newChildren };
                }
                currentIndex++;
              }
            }
            if (currentIndex === insertIndex) {
              newChildren.push({ ...newElement, columnIndex } as any);
            }
            return { ...el, children: newChildren };
          }
          
          return {
            ...el,
            children: [...children, { ...newElement, columnIndex } as any],
          };
        }),
        selectedElementId: newElement.id,
      }));
    } else {
      if (insertIndex !== undefined && insertIndex >= 0) {
        set((state) => {
          const newElements = [...state.elements];
          newElements.splice(insertIndex, 0, newElement);
          return { elements: newElements, selectedElementId: newElement.id };
        });
      } else {
        set((state) => ({
          elements: [...state.elements, newElement],
          selectedElementId: newElement.id,
        }));
      }
    }
  },
  
  removeElement: (id) => {
    set((state) => ({
      elements: findAndRemoveElement(state.elements, id),
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    }));
  },
  
  updateElement: (id, updates) => {
    set((state) => ({
      elements: findAndUpdateElement(state.elements, id, (el) => ({
        ...el,
        ...updates,
        styles: { ...el.styles, ...updates.styles },
      })),
    }));
  },
  
  selectElement: (id) => {
    set({ selectedElementId: id });
  },
  
  setViewMode: (mode) => {
    set({ viewMode: mode });
  },
  
  setIsDragging: (isDragging) => {
    set({ isDragging });
  },
  
  reorderElements: (activeId, overId) => {
    set((state) => {
      // ✅ Case 1: Both in canvas - giữ nguyên cách sắp xếp đơn giản
      const activeIndex = state.elements.findIndex((el) => el.id === activeId);
      const overIndex = state.elements.findIndex((el) => el.id === overId);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        const newElements = [...state.elements];
        const [removed] = newElements.splice(activeIndex, 1);
        newElements.splice(overIndex, 0, removed);
        return { elements: newElements };
      }

      // ✅ Case 2: Both in columns - cải thiện di chuyển giữa các cột
      let activeChild: ElementData | null = null;
      let activeParentId: string | null = null;
      let activeColumnIndex: number | null = null;
      let overChild: ElementData | null = null;
      let overParentId: string | null = null;
      let overColumnIndex: number | null = null;

      // Tìm active và over child
      for (const el of state.elements) {
        if (el.children) {
          if (!activeChild) {
            const found = el.children.find((c) => c.id === activeId);
            if (found) {
              activeChild = found;
              activeParentId = el.id;
              activeColumnIndex = (found as any).columnIndex;
            }
          }
          if (!overChild) {
            const found = el.children.find((c) => c.id === overId);
            if (found) {
              overChild = found;
              overParentId = el.id;
              overColumnIndex = (found as any).columnIndex;
            }
          }
          if (activeChild && overChild) break;
        }
      }

      if (activeChild && overChild && activeParentId && overParentId) {
        // ✅ Cùng column layout - sắp xếp đơn giản + cập nhật columnIndex
        if (activeParentId === overParentId) {
          return {
            elements: findAndUpdateElement(state.elements, activeParentId, (el) => {
              const newChildren = el.children ? [...el.children] : [];
              const activeIndex = newChildren.findIndex((c) => c.id === activeId);
              const overIndex = newChildren.findIndex((c) => c.id === overId);
              
              if (activeIndex !== -1 && overIndex !== -1) {
                const [removed] = newChildren.splice(activeIndex, 1);
                // ✅ Cập nhật columnIndex khi di chuyển sang cột khác
                const updatedChild = { ...removed, columnIndex: overColumnIndex } as any;
                newChildren.splice(overIndex, 0, updatedChild);
              }
              
              return { ...el, children: newChildren };
            }),
          };
        }
        
        // ✅ Khác column layout - di chuyển element sang column mới
        const newElements = findAndUpdateElement(state.elements, activeParentId, (el) => ({
          ...el,
          children: (el.children || []).filter((c) => c.id !== activeId),
        }));

        return {
          elements: findAndUpdateElement(newElements, overParentId, (el) => {
            const newChildren = el.children ? [...el.children] : [];
            const overIndex = newChildren.findIndex((c) => c.id === overId);
            const updatedChild = { ...activeChild, columnIndex: overColumnIndex } as any;
            
            if (overIndex !== -1) {
              newChildren.splice(overIndex, 0, updatedChild);
            } else {
              newChildren.push(updatedChild);
            }
            
            return { ...el, children: newChildren };
          }),
        };
      }

      return state;
    });
  },
  
  clearCanvas: () => {
    set({ elements: [], selectedElementId: null });
  },
  
  getSelectedElement: () => {
    const state = get();
    const findElement = (elements: ElementData[]): ElementData | null => {
      for (const el of elements) {
        if (el.id === state.selectedElementId) return el;
        if (el.children) {
          const found = findElement(el.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findElement(state.elements);
  },

  addElementToColumn: (parentId, columnIndex, element, insertIndex) => {
    const newElement: ElementData = {
      ...element,
      id: nanoid(),
    };

    set((state) => ({
      elements: findAndUpdateElement(state.elements, parentId, (el) => {
        const children = el.children || [];
        const columnChildren = children.filter((c) => (c as any).columnIndex === columnIndex);
        
        if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= columnChildren.length) {
          const newChildren = [...children];
          let currentIndex = 0;
          for (let i = 0; i < children.length; i++) {
            if ((children[i] as any).columnIndex === columnIndex) {
              if (currentIndex === insertIndex) {
                newChildren.splice(i, 0, { ...newElement, columnIndex } as any);
                return { ...el, children: newChildren };
              }
              currentIndex++;
            }
          }
          if (currentIndex === insertIndex) {
            newChildren.push({ ...newElement, columnIndex } as any);
          }
          return { ...el, children: newChildren };
        }
        
        return {
          ...el,
          children: [...children, { ...newElement, columnIndex } as any],
        };
      }),
      selectedElementId: newElement.id,
    }));
  },

  insertElementAt: (element, targetId, position) => {
    const newElement: ElementData = {
      ...element,
      id: nanoid(),
    };

    if (element.type === '2columns') {
      newElement.columnWidths = [50, 50];
      newElement.children = [];
    } else if (element.type === '3columns') {
      newElement.columnWidths = [33.33, 33.34, 33.33];
      newElement.children = [];
    } else if (element.type === '4columns') {
      newElement.columnWidths = [25, 25, 25, 25];
      newElement.children = [];
    }

    set((state) => {
      // ✅ FIX: Tìm target trong canvas elements
      let targetIndex = state.elements.findIndex((el) => el.id === targetId);
      let targetElement: ElementData | null = null;
      let isInColumn = false;
      let parentId: string | null = null;
      let columnIndex: number | null = null;

      if (targetIndex !== -1) {
        targetElement = state.elements[targetIndex];
      } else {
        // ✅ FIX: Tìm target trong column children
        for (const el of state.elements) {
          if (el.children) {
            const childIndex = el.children.findIndex((c) => c.id === targetId);
            if (childIndex !== -1) {
              targetElement = el.children[childIndex];
              isInColumn = true;
              parentId = el.id;
              columnIndex = (el.children[childIndex] as any).columnIndex;
              break;
            }
          }
        }
      }

      if (!targetElement) {
        return { elements: [...state.elements, newElement], selectedElementId: newElement.id };
      }

      if (isInColumn && parentId !== null && columnIndex !== null) {
        // ✅ FIX: Insert vào column children
        return {
          elements: findAndUpdateElement(state.elements, parentId, (el) => {
            const children = el.children || [];
            const columnChildren = children.filter((c) => (c as any).columnIndex === columnIndex);
            const targetChildIndex = columnChildren.findIndex((c) => c.id === targetId);
            
            if (targetChildIndex === -1) {
              return el;
            }

            const newChildren = [...children];
            let currentIndex = 0;
            let insertAt = -1;

            for (let i = 0; i < children.length; i++) {
              if ((children[i] as any).columnIndex === columnIndex) {
                if (currentIndex === targetChildIndex) {
                  insertAt = i;
                  break;
                }
                currentIndex++;
              }
            }

            if (insertAt !== -1) {
              if (position === 'before') {
                newChildren.splice(insertAt, 0, { ...newElement, columnIndex } as any);
              } else if (position === 'after') {
                newChildren.splice(insertAt + 1, 0, { ...newElement, columnIndex } as any);
              } else if (position === 'inside') {
                const targetChild = children[insertAt];
                if (targetChild.children) {
                  targetChild.children = [newElement, ...targetChild.children];
                } else {
                  targetChild.children = [newElement];
                }
              }
            }

            return { ...el, children: newChildren };
          }),
          selectedElementId: newElement.id,
        };
      }

      // Insert vào canvas
      const newElements = [...state.elements];
      if (position === 'before') {
        newElements.splice(targetIndex, 0, newElement);
      } else if (position === 'after') {
        newElements.splice(targetIndex + 1, 0, newElement);
      } else if (position === 'inside') {
        const target = state.elements[targetIndex];
        if (target.children) {
          target.children = [newElement, ...target.children];
        } else {
          target.children = [newElement];
        }
      }

      return { elements: newElements, selectedElementId: newElement.id };
    });
  },

  updateColumnWidths: (elementId, widths) => {
    set((state) => ({
      elements: findAndUpdateElement(state.elements, elementId, (el) => ({
        ...el,
        columnWidths: widths,
      })),
    }));
  },

  removeChildElement: (parentId, childId) => {
    set((state) => ({
      elements: findAndUpdateElement(state.elements, parentId, (el) => ({
        ...el,
        children: (el.children || []).filter((child) => child.id !== childId),
      })),
      selectedElementId: state.selectedElementId === childId ? null : state.selectedElementId,
    }));
  },

  // ✅ FIX 5: Move element từ column ra canvas
  moveElementToCanvas: (elementId) => {
    set((state) => {
      const element = findElementById(state.elements, elementId);
      if (!element) return state;

      const { columnIndex, ...elementWithoutColumn } = element as ElementData & { columnIndex?: number };
      const newElements = findAndRemoveFromColumns(state.elements, elementId);
      
      return {
        elements: [...newElements, elementWithoutColumn],
        selectedElementId: elementId,
      };
    });
  },

  // ✅ FIX 5: Move element từ canvas vào column
  moveElementToColumn: (elementId, parentId, columnIndex) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === elementId);
      if (!element) return state;

      const newElements = state.elements.filter((el) => el.id !== elementId);

      return {
        elements: findAndUpdateElement(newElements, parentId, (el) => {
          const children = el.children || [];
          return {
            ...el,
            children: [...children, { ...element, columnIndex } as ElementData & { columnIndex: number }],
          };
        }),
        selectedElementId: elementId,
      };
    });
  },

}));
