import { Button } from "./ui/button";
import { Search, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

export function JobsHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  return (
    <section className="relative min-h-[500px] lg:min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80"
          alt="Jobs background"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 h-full">
        <div className="flex items-center min-h-[500px] lg:min-h-[600px]">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">10,000+ việc làm mới mỗi ngày</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Tìm việc làm
              <br />
              <span className="text-[#f26b38]">mơ ước của bạn</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu.
              Ứng tuyển ngay hôm nay và bắt đầu sự nghiệp mới.
            </p>

            {/* Search Box */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Vị trí, công ty, hoặc từ khóa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] outline-none h-12"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Địa điểm..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] outline-none h-12"
                  />
                </div>

                <Button className="bg-[#f26b38] hover:bg-[#e05a27] h-12 text-base font-semibold">
                  Tìm kiếm
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50,000+</div>
                <div className="text-sm text-gray-300">Việc làm</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10,000+</div>
                <div className="text-sm text-gray-300">Công ty</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100,000+</div>
                <div className="text-sm text-gray-300">Ứng viên</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}