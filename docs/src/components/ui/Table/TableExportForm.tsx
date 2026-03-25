import { IconCsv, IconFileExcel, IconPdf, IconPrinter } from '@tabler/icons-react';
import { UploadIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  onExportExcel?: () => void;
  onExportCsv?: () => void;
  onExportPdf?: () => void;
  onPrint?: () => void;
}

const TableExportForm = ({ onExportExcel, onExportCsv, onExportPdf, onPrint }: Props) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UploadIcon className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" onClick={onExportExcel}>
            <IconFileExcel className="mr-2 h-4 w-4" />
            File Excel
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={onExportCsv}>
            <IconCsv className="mr-2 h-4 w-4" />
            File CSV
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={onExportPdf}>
            <IconPdf className="mr-2 h-4 w-4" />
            File PDF
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={onPrint}>
            <IconPrinter className="mr-2 h-4 w-4" />
            Print
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableExportForm;
