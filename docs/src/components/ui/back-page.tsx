import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function Backpage() {
  const router = useRouter();
  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={() => router.back()} className=" mt-[4px] cursor-pointer px-[6px] py-1 rounded-[8px]">
            <ChevronLeft className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Quay lại</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
