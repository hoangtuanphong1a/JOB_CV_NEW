"use client";

import React from 'react';
import { Settings, MousePointer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/stores/editorStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';

export const PropertiesPanel = () => {
  const { getSelectedElement, updateElement } = useEditorStore();
  const selectedElement = getSelectedElement();

  const handleStyleChange = (key: string, value: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        styles: { ...selectedElement.styles, [key]: value },
      });
    }
  };

  const handleContentChange = (content: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { content });
    }
  };

  const handleColumnBackgroundChange = (columnIndex: number, color: string) => {
    if (selectedElement && (selectedElement.type === '2columns' || selectedElement.type === '3columns' || selectedElement.type === '4columns')) {
      const currentColors = (selectedElement as any).columnBackgroundColors || [];
      const newColors = [...currentColors];
      newColors[columnIndex] = color;
      updateElement(selectedElement.id, {
        columnBackgroundColors: newColors,
      } as any);
    }
  };

  const isColumnLayout = selectedElement && (selectedElement.type === '2columns' || selectedElement.type === '3columns' || selectedElement.type === '4columns');
  const columnCount = isColumnLayout ? (selectedElement.type === '2columns' ? 2 : selectedElement.type === '3columns' ? 3 : 4) : 0;
  const columnBackgroundColors = isColumnLayout ? ((selectedElement as any).columnBackgroundColors || []) : [];

  return (
    <aside className="w-[280px] bg-background border-l border-border flex flex-col h-full">
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-400/10 flex items-center justify-center shrink-0">
            <Settings className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm">Thuộc Tính</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Chọn phần tử để chỉnh sửa</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {!selectedElement ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mb-4">
                <MousePointer className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="font-medium text-foreground mb-1">Chưa chọn phần tử</h4>
              <p className="text-xs text-muted-foreground max-w-[200px]">Nhấp vào phần tử trên canvas để chỉnh sửa</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-muted/50 p-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Loại phần tử</span>
                <p className="font-medium text-foreground capitalize mt-0.5">{selectedElement.type}</p>
              </div>

              {['heading1', 'heading2', 'heading3', 'text', 'button', 'link'].includes(selectedElement.type) && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Nội dung</Label>
                  <Input
                    value={selectedElement.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Nhập nội dung..."
                  />
                </div>
              )}

              {isColumnLayout && (
                <div className="space-y-3">
                  <Label className="text-xs font-medium">Chiều rộng các cột (%)</Label>
                  {Array.from({ length: columnCount }).map((_, idx) => {
                    const currentWidth = selectedElement.columnWidths?.[idx] ?? (columnCount === 2 ? 50 : columnCount === 3 ? 33.33 : 25);
                    return (
                      <div key={idx} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Cột {idx + 1} ({currentWidth.toFixed(1)}%)</Label>
                        <Slider
                          value={[currentWidth]}
                          onValueChange={(value) => {
                            const newWidths = [...(selectedElement.columnWidths || Array.from({ length: columnCount }, (_, i) => 
                              columnCount === 2 ? 50 : columnCount === 3 ? 33.33 : 25
                            ))];
                            newWidths[idx] = value[0];
                            const total = newWidths.reduce((sum, w) => sum + w, 0);
                            newWidths.forEach((_, i) => {
                              newWidths[i] = (newWidths[i] / total) * 100;
                            });
                            updateElement(selectedElement.id, { columnWidths: newWidths });
                          }}
                          min={10}
                          max={90}
                          step={0.1}
                          className="w-full"
                        />
                        <Input
                          type="number"
                          value={currentWidth.toFixed(1)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value) && value >= 10 && value <= 90) {
                              const newWidths = [...(selectedElement.columnWidths || Array.from({ length: columnCount }, (_, i) => 
                                columnCount === 2 ? 50 : columnCount === 3 ? 33.33 : 25
                              ))];
                              newWidths[idx] = value;
                              const total = newWidths.reduce((sum, w) => sum + w, 0);
                              newWidths.forEach((_, i) => {
                                newWidths[i] = (newWidths[i] / total) * 100;
                              });
                              updateElement(selectedElement.id, { columnWidths: newWidths });
                            }
                          }}
                          placeholder="50"
                          className="mt-2"
                          step="0.1"
                          min="10"
                          max="90"
                        />
                      </div>
                    );
                  })}
                  <Label className="text-xs font-medium">Màu nền các cột</Label>
                  {Array.from({ length: columnCount }).map((_, idx) => (
                    <div key={idx} className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Cột {idx + 1}</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={columnBackgroundColors[idx] || '#ffffff'}
                          onChange={(e) => handleColumnBackgroundChange(idx, e.target.value)}
                          className="w-10 h-10 border border-border cursor-pointer"
                        />
                        <Input
                          value={columnBackgroundColors[idx] || '#ffffff'}
                          onChange={(e) => handleColumnBackgroundChange(idx, e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-xs font-medium">Màu nền</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={selectedElement.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="w-10 h-10 border border-border cursor-pointer"
                  />
                  <Input
                    value={selectedElement.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Màu chữ</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={selectedElement.styles.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="w-10 h-10 border border-border cursor-pointer"
                  />
                  <Input
                    value={selectedElement.styles.color || '#000000'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Padding</Label>
                <Input
                  value={selectedElement.styles.padding || '0'}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  placeholder="0 hoặc 16px"
                />
                <div className="flex gap-1">
                  {['0', '8px', '16px', '24px'].map((val) => (
                    <Button
                      key={val}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleStyleChange('padding', val)}
                    >
                      {val}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Margin</Label>
                <Input
                  value={selectedElement.styles.margin || '0'}
                  onChange={(e) => handleStyleChange('margin', e.target.value)}
                  placeholder="0 hoặc 16px"
                />
                <div className="flex gap-1">
                  {['0', '8px', '16px', '24px'].map((val) => (
                    <Button
                      key={val}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => handleStyleChange('margin', val)}
                    >
                      {val}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Cỡ chữ</Label>
                <Input
                  value={selectedElement.styles.fontSize || '14px'}
                  onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                  placeholder="14px"
                />
              </div>

              {selectedElement.type === 'image' && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Hình dạng ảnh</Label>
                  <div className="flex gap-1">
                    {['square', 'rounded', 'circle'].map((shape) => (
                      <Button
                        key={shape}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => handleStyleChange('imageShape', shape)}
                      >
                        {shape === 'square' ? 'Vuông' : shape === 'rounded' ? 'Bo góc' : 'Tròn'}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {selectedElement.type === 'button' && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Bo góc</Label>
                  <Input
                    value={selectedElement.styles.borderRadius || '0'}
                    onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                    placeholder="0 hoặc 8px"
                  />
                  <div className="flex gap-1">
                    {['0', '4px', '8px', '16px', '50%'].map((val) => (
                      <Button
                        key={val}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => handleStyleChange('borderRadius', val)}
                      >
                        {val}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {selectedElement.type === 'image' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Chiều rộng {selectedElement.styles.width ? `(${selectedElement.styles.width})` : ''}</Label>
                    <Slider
                      value={[parseInt(selectedElement.styles.width?.replace('%', '').replace('px', '') || '100')]}
                      onValueChange={(value) => {
                        const widthValue = selectedElement.styles.width?.includes('px') 
                          ? `${value[0]}px` 
                          : `${value[0]}%`;
                        handleStyleChange('width', widthValue);
                      }}
                      min={0}
                      max={selectedElement.styles.width?.includes('px') ? 1000 : 100}
                      step={1}
                      className="w-full"
                    />
                    <Input
                      value={selectedElement.styles.width || ''}
                      onChange={(e) => handleStyleChange('width', e.target.value)}
                      placeholder="100% hoặc 200px"
                      className="mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Chiều cao {selectedElement.styles.height ? `(${selectedElement.styles.height})` : ''}</Label>
                    <div className="flex gap-1 mb-2">
                      <Button
                        variant={selectedElement.styles.height === 'auto' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => handleStyleChange('height', 'auto')}
                      >
                        Auto
                      </Button>
                    </div>
                    <Slider
                      value={[selectedElement.styles.height === 'auto' ? 200 : parseInt(selectedElement.styles.height?.replace('px', '') || '200')]}
                      onValueChange={(value) => {
                        if (selectedElement.styles.height !== 'auto') {
                          handleStyleChange('height', `${value[0]}px`);
                        }
                      }}
                      min={0}
                      max={1000}
                      step={1}
                      className="w-full"
                      disabled={selectedElement.styles.height === 'auto'}
                    />
                    <Input
                      value={selectedElement.styles.height || ''}
                      onChange={(e) => handleStyleChange('height', e.target.value)}
                      placeholder="auto hoặc 200px"
                      className="mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Căn chỉnh</Label>
                    <div className="flex gap-1">
                      {['left', 'center', 'right'].map((align) => (
                        <Button
                          key={align}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => handleStyleChange('textAlign', align)}
                        >
                          {align === 'left' ? 'Trái' : align === 'center' ? 'Giữa' : 'Phải'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {selectedElement.type === 'divider' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Độ rộng {selectedElement.styles.width ? `(${selectedElement.styles.width})` : ''}</Label>
                    <Slider
                      value={[parseInt(selectedElement.styles.width?.replace('%', '') || '100')]}
                      onValueChange={(value) => handleStyleChange('width', `${value[0]}%`)}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <Input
                      value={selectedElement.styles.width || ''}
                      onChange={(e) => handleStyleChange('width', e.target.value)}
                      placeholder="100% hoặc 200px"
                      className="mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Chiều cao {selectedElement.styles.height ? `(${selectedElement.styles.height})` : ''}</Label>
                    <Slider
                      value={[parseInt(selectedElement.styles.height?.replace('px', '') || '1')]}
                      onValueChange={(value) => handleStyleChange('height', `${value[0]}px`)}
                      min={1}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                    <Input
                      value={selectedElement.styles.height || ''}
                      onChange={(e) => handleStyleChange('height', e.target.value)}
                      placeholder="1px hoặc 2px"
                      className="mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Căn chỉnh</Label>
                    <div className="flex gap-1">
                      {['left', 'center', 'right'].map((align) => (
                        <Button
                          key={align}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => handleStyleChange('textAlign', align)}
                        >
                          {align === 'left' ? 'Trái' : align === 'center' ? 'Giữa' : 'Phải'}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};
