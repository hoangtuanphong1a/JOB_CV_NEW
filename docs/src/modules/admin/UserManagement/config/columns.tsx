'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { IndexCellDecimal } from '@/components/ui/Table/TableCells';
import { CenteredHeader } from '@/components/ui/Table/TableHeaders';

import { StatusCell, RoleCell, DateCell, ActionsCell } from '../components/TableCells';
import { IUserTreeNode } from '../libs/utils';

export const columns: ColumnDef<IUserTreeNode>[] = [
  {
    id: 'stt',
    header: () => <CenteredHeader>STT</CenteredHeader>,
    cell: IndexCellDecimal,
    enableSorting: false,
    size: 20,
  },
  {
    accessorKey: 'name',
    header: () => <CenteredHeader>Họ tên / Email</CenteredHeader>,
    cell: ({ row }) => {
      const depth = row.depth;
      const indent = depth * 20;
      const isExpanded = row.getIsExpanded();
      const isParent = row.getCanExpand();

      return (
        <div
          onClick={(e) => {
            if (!isParent) return;
            e.stopPropagation();
            row.toggleExpanded();
          }}
          style={{ paddingLeft: `${indent}px` }}
          className="flex items-center gap-2"
        >
          {isParent && (
            <button className="hover:bg-gray-100 rounded">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
          <span className={isParent ? 'cursor-pointer font-semibold' : ''}>{row.original.name}</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: 'roles',
    header: () => <CenteredHeader>Vai trò</CenteredHeader>,
    cell: RoleCell,
    enableSorting: false,
    size: 150,
  },
  {
    id: 'status',
    header: () => <CenteredHeader>Trạng thái</CenteredHeader>,
    cell: StatusCell,
    enableSorting: false,
    size: 120,
  },
  {
    id: 'created_at',
    header: () => <CenteredHeader>Ngày tạo</CenteredHeader>,
    cell: DateCell,
    enableSorting: false,
    size: 150,
  },
  {
    id: 'actions',
    header: () => <CenteredHeader>Hành động</CenteredHeader>,
    cell: ActionsCell,
    enableSorting: false,
    size: 120,
  },
];

