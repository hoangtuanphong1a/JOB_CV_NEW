'use client';

import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface TreeTableRowProps<TData> {
  row: Row<TData>;
  onRowClick: (row: Row<TData>) => void;
  enableTreeView: boolean;
  extraData?: unknown;
}

function TreeTableRow<TData>({ row, onRowClick, enableTreeView }: TreeTableRowProps<TData>) {
  const depth = row.depth;
  const isParent = row.getCanExpand();

  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && 'selected'}
      className={`hover:bg-gray-50 cursor-pointer ${depth > 0 ? 'bg-gray-25' : ''} ${isParent ? 'font-medium' : ''}`}
    >
      {row.getVisibleCells().map((cell, index) => {
        const isNameCell = index === 1;

        return (
          <TableCell
            key={cell.id}
            style={{
              width: cell.column.columnDef.size,
              paddingLeft: enableTreeView && index === 0 ? `${depth * 20 + 16}px` : undefined,
            }}
            onClick={() => {
              if (isNameCell && isParent) {
                return;
              }

              if (!isParent) {
                onRowClick(row);
              }
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

interface DataTableProps<TData, TValue> {
  // isSearch?: boolean;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (id: string) => void;
  actions?: React.ReactNode;
  enableTreeView?: boolean;
  getSubRows?: (row: TData) => TData[] | undefined;
  extraData?: unknown;
  isToolbar?: boolean;
  isPagination?: boolean;
}

export function DataTable<TData extends { id?: string }, TValue>({
  columns,
  data,
  onRowClick,
  actions,
  enableTreeView = false,
  getSubRows,
  extraData,
  isToolbar = true,
  isPagination = true,
}: DataTableProps<TData, TValue> & { extraData?: unknown }) {
  const [expanded, setExpanded] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns: [...columns],
    state: {
      expanded,
      globalFilter,
      sorting,
      pagination,
      rowSelection,
    },
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: getSubRows || ((row: TData) => (row as { children?: TData[]; subRows?: TData[] }).children || (row as { children?: TData[]; subRows?: TData[] }).subRows || []),
    enableExpanding: enableTreeView,
  });

  const handleRowClick = (row: Row<TData>) => {
    if (onRowClick && row.original && typeof row.original === 'object' && 'id' in row.original) {
      onRowClick(String((row.original as { id?: string }).id));
    }
  };

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  return (
    <>
      {/* Toolbar */}
      {isToolbar && (
        <div className="flex items-center justify-between gap-4 pb-4">
          {/* Search */}
          {/* {isSearch && ( */}
          <Input
            placeholder="Tìm kiếm..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-80"
          />
          {/* )} */}

          {actions}
        </div>
      )}
      {/* Table */}
      <div className="rounded-xl border-y overflow-hidden">
        <Table className="w-full border-collapse table-fixed">
          {table.getRowModel().rows?.length > 0 && (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.column.columnDef.size }}
                      className="font-bold cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <>
                            {header.column.getIsSorted() === 'asc' && <ArrowUp className="w-4 h-4 ml-1" />}
                            {header.column.getIsSorted() === 'desc' && <ArrowDown className="w-4 h-4 ml-1" />}
                            {!header.column.getIsSorted() && <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />}
                          </>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          )}

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <TreeTableRow
                    key={row.id}
                    row={row}
                    extraData={extraData}
                    onRowClick={handleRowClick}
                    enableTreeView={enableTreeView}
                  />
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={enableTreeView ? columns.length + 1 : columns.length} className="h-24 text-center">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {isPagination && (
        <div className="flex justify-between items-center mt-2">
          {/* Select page size */}
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Số dòng" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.previousPage();
                  }}
                  className={table.getCanPreviousPage() ? '' : 'pointer-events-none opacity-50'}
                />
              </PaginationItem>

              {Array.from({ length: pageCount }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      table.setPageIndex(i);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.nextPage();
                  }}
                  className={table.getCanNextPage() ? '' : 'pointer-events-none opacity-50'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
