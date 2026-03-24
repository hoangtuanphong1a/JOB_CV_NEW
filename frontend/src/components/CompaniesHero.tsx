import { Button } from "./ui/button";
import { Search, Building2, Sparkles, MapPin, Award, TrendingUp, Users, Globe } from "lucide-react";
import { useState } from "react";

export function CompaniesHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [industry, setIndustry] = useState("");

  return (
    <section className="relative min-h-[500px] lg:min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
          alt="Companies background"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent"></div>
      </div>

      {/* Content - Different Layout: Centered with Feature Cards */}
      <div className="container mx-auto px-4 relative z-10 h-full">
        <div className="flex flex-col items-center justify-center min-h-[500px] lg:min-h-[600px] text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full mb-6">
            <Award className="h-4 w-4" />
            <span className="text-sm">Top 1% nhà tuyển dụng hàng đầu Việt Nam</span>
          </div>

          {/* Title - Centered */}
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
            Nơi hội tụ của
            <br />
            <span className="text-[#f26b38]">nhà tuyển dụng tài năng</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-2xl">
            Kết nối với những doanh nghiệp tiên phong, nơi làm việc lý tưởng 
            cho sự phát triển nghề nghiệp bền vững và cơ hội thăng tiến vượt trội.
          </p>

          {/* Search Box - Centered */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 w-full max-w-4xl mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tên công ty hoặc ngành nghề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] outline-none h-12"
                />
              </div>

              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ngành nghề..."
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:border-[#f26b38] focus:ring-1 focus:ring-[#f26b38] outline-none h-12"
                />
              </div>

              <Button className="bg-[#f26b38] hover:bg-[#e05a27] h-12 text-base font-semibold">
                Khám phá ngay
              </Button>
            </div>
          </div>

          {/* Feature Cards - Different Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-[#f26b38] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">2,500+</div>
              <div className="text-sm text-gray-300">Doanh nghiệp uy tín</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-[#f26b38] rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">50,000+</div>
              <div className="text-sm text-gray-300">Nhân tài đã tuyển</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-[#f26b38] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">95%</div>
              <div className="text-sm text-gray-300">Hài lòng với môi trường</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}