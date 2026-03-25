import React, { useState } from 'react';
import { DialogTitle } from '@radix-ui/react-dialog';
import dayjs from 'dayjs';
import { Row } from '@tanstack/react-table';

import { DATE_FORMAT, STATUS_LABELS } from '@/lib/const';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog';

// Cell renderers
export const IndexCell = ({ row }: { row: Row<unknown> }) => <p className="text-center w-full">{row.index + 1}</p>;

export const IndexCellDecimal = ({ row }: { row: Row<unknown> }) => {
  const parentRow = row.getParentRow?.(); // lấy row cha nếu có
  const parentIndex = parentRow ? parentRow.index + 1 : row.index + 1;
  const childIndex = parentRow ? row.index + 1 : null;

  return <p className="text-center w-full">{childIndex ? `${parentIndex}.${childIndex}` : parentIndex}</p>;
};

interface NameCellProps {
  row: Row<unknown>;
  field?: string;
}
export const NameCell = ({ row, field = 'title' }: NameCellProps) => {
  const original = row.original as Record<string, unknown>;
  const name = original?.[field] || '-';
  return <div className="font-medium break-words whitespace-normal">{String(name)}</div>;
};
interface ContentCellProps {
  row: Row<unknown>;
  field?: string;
  maxLength?: number;
}

export const ContentCell = ({ row, field = 'title', maxLength = 50 }: ContentCellProps) => {
  const original = row.original as Record<string, unknown>;
  const fullText = String(original?.[field] || '-');
  const isTruncated = fullText.length > maxLength; // check có bị truncate không
  const truncatedText = isTruncated ? fullText.slice(0, maxLength) + '…' : fullText;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Cell */}
      <div
        className={`cursor-pointer break-words whitespace-normal  ${isTruncated ? 'truncate' : ''}`}
        onClick={() => isTruncated && setIsOpen(true)} // chỉ mở modal khi truncate
        title={fullText}
      >
        {truncatedText}
      </div>

      {/* Modal */}
      {isOpen && isTruncated && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nội dung</DialogTitle>
            </DialogHeader>
            <DialogDescription>{fullText}</DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
export const BackgroundGradientCell = ({ row }: { row: Row<unknown> }) => {
  const bgGradient = row.getValue('bgGradient') as string;
  return <div style={{ background: bgGradient }} className="w-36 h-24 rounded-md"></div>;
};
export const StatusCell = ({ row }: { row: Row<unknown> }) => {
  const status = row.getValue('status') as 'active' | 'inactive';
  const isActive = status === 'active';
  return (
    <div className="w-full text-center">
      <Badge >
        {isActive ? STATUS_LABELS.ACTIVE : STATUS_LABELS.INACTIVE}
      </Badge>
    </div>
  );
};

export const DateCell = ({ row }: { row: Row<unknown> }) => {
  const createdAt = row.getValue('createdAt') as string;
  return <div className="w-full text-center">{dayjs(createdAt).format(DATE_FORMAT)}</div>;
};
