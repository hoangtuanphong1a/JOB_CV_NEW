import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, MapPin } from "lucide-react";

export function SearchBar() {
  return (
    <div className="container mx-auto px-4 -mt-8 relative z-20">
      <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 border border-gray-100">
        <div className="grid lg:grid-cols-[1fr_auto_1fr_auto] gap-4 items-end">
          {/* Job Title Search */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Vị trí công việc</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Ví dụ: Developer, Marketing..."
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-12 bg-gray-200"></div>

          {/* Location Search */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Địa điểm</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Hà Nội, Hồ Chí Minh..."
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button size="lg" className="bg-[#f26b38] hover:bg-[#e05a27] h-12 px-8">
            Tìm kiếm
          </Button>
        </div>

        {/* Popular Keywords */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t">
          <span className="text-sm text-gray-600">Từ khóa phổ biến:</span>
          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors">
            ReactJS
          </button>
          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors">
            NodeJS
          </button>
          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors">
            Marketing
          </button>
          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors">
            Designer
          </button>
          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors">
            Sales
          </button>
        </div>
      </div>
    </div>
  );
}
