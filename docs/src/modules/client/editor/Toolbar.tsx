"use client";

import React, { useState } from 'react';
import { ChevronDown, Download, Monitor, Save, Smartphone, FileImage, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEditorStore } from '@/stores/editorStore';

export const Toolbar = () => {
  const { viewMode, setViewMode, elements } = useEditorStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleSaveJSON = () => {
    const dataStr = JSON.stringify(elements, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (type: 'png' | 'pdf') => {
    setIsExporting(true);
    try {
      const canvasElement = document.querySelector('[data-canvas-content]') as HTMLElement;
      if (!canvasElement) {
        alert('Không tìm thấy canvas để xuất');
        return;
      }

      const clonedElement = canvasElement.cloneNode(true) as HTMLElement;
      clonedElement.style.border = 'none';
      clonedElement.style.margin = '0';
      clonedElement.style.padding = '0';
      clonedElement.style.boxShadow = 'none';
      const exportWidth = viewMode === 'mobile' ? 375 : 794;
      clonedElement.style.width = `${exportWidth}px`;
      clonedElement.style.maxWidth = `${exportWidth}px`;
      clonedElement.style.overflow = 'hidden';
      
      clonedElement.className = clonedElement.className.replace(/border[-\w]*/g, '');
      
      const allChildren = clonedElement.querySelectorAll('*');
      allChildren.forEach((child) => {
        const htmlChild = child as HTMLElement;
        if (htmlChild.style.maxWidth === '') {
          htmlChild.style.maxWidth = '100%';
        }
      });
      
      const html = clonedElement.outerHTML;

      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html,
          type,
          width: exportWidth,
          height: 1123,
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `design.${type}`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert(`Lỗi khi xuất ${type.toUpperCase()}. Vui lòng thử lại.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-12 bg-background border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {viewMode === 'desktop' ? (
                <Monitor className="w-4 h-4" />
              ) : (
                <Smartphone className="w-4 h-4" />
              )}
              {viewMode === 'desktop' ? 'Desktop' : 'Mobile'}
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setViewMode('desktop')}>
              <Monitor className="w-4 h-4 mr-2" />
              Desktop
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setViewMode('mobile')}>
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="default" 
          size="sm" 
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 gap-2 shadow-sm"
          onClick={handleSaveJSON}
        >
          <Save className="w-4 h-4" />
          Lưu Thiết Kế
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2" disabled={isExporting}>
              <Download className="w-4 h-4" />
              Xuất
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport('png')} disabled={isExporting}>
              <FileImage className="w-4 h-4 mr-2" />
              Xuất ảnh (PNG)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('pdf')} disabled={isExporting}>
              <FileText className="w-4 h-4 mr-2" />
              Xuất PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
