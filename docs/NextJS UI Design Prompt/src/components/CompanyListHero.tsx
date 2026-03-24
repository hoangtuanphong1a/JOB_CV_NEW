import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, MapPin, Building2, Users, Award, Star } from "lucide-react";
import { motion } from "motion/react";

const stats = [
  { label: "Công ty hàng đầu", value: "10,000+", icon: Building2 },
  { label: "Ứng viên tin tưởng", value: "2M+", icon: Users },
  { label: "Đánh giá 5 sao", value: "50,000+", icon: Star },
];

const industries = [
  { name: "Công nghệ IT", count: "15,234", color: "from-blue-500 to-blue-600" },
  { name: "Tài chính - Ngân hàng", count: "8,456", color: "from-green-500 to-green-600" },
  { name: "Marketing - PR", count: "6,789", color: "from-purple-500 to-purple-600" },
  { name: "E-commerce", count: "5,123", color: "from-orange-500 to-orange-600" },
  { name: "Giáo dục", count: "4,567", color: "from-pink-500 to-pink-600" },
  { name: "Sản xuất", count: "3,890", color: "from-indigo-500 to-indigo-600" },
];

export function CompanyListHero() {
  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-white to-red-50/30 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#f26b38]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-10 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/10 to-red-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-20 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-[#f26b38] px-4 py-2 rounded-full text-sm mb-6">
            <Award className="h-4 w-4" />
            <span>Khám phá công ty uy tín hàng đầu Việt Nam</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl xl:text-6xl mb-4">
            Tìm kiếm{" "}
            <span className="text-[#f26b38]">môi trường làm việc</span>{" "}
            lý tưởng
          </h1>
          <p className="text-lg lg:text-xl text-gray-600">
            Khám phá văn hóa công ty, phúc lợi và cơ hội phát triển sự nghiệp tại hơn 10,000 doanh nghiệp
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-xl border border-gray-100">
            <div className="grid lg:grid-cols-[1fr_auto_1fr_auto] gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Tên công ty, ngành nghề..."
                  className="pl-12 h-12 text-base border-gray-200 focus:border-[#f26b38] focus:ring-[#f26b38]"
                />
              </div>

              <div className="hidden lg:block w-px bg-gray-200"></div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Thành phố, khu vực..."
                  className="pl-12 h-12 text-base border-gray-200 focus:border-[#f26b38] focus:ring-[#f26b38]"
                />
              </div>

              <Button 
                size="lg" 
                className="h-12 bg-[#f26b38] hover:bg-[#e05a27] text-base px-8"
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Industries Quick Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <h3 className="text-center text-sm text-gray-600 mb-4">Ngành nghề nổi bật</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {industries.map((industry, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                className="group bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-white border border-gray-200 hover:border-[#f26b38] rounded-xl p-4 text-left transition-all shadow-sm hover:shadow-md"
              >
                <div className={`inline-flex w-10 h-10 rounded-lg bg-gradient-to-br ${industry.color} items-center justify-center mb-2`}>
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm text-gray-900 mb-1 group-hover:text-[#f26b38] transition-colors line-clamp-2">
                  {industry.name}
                </div>
                <div className="text-xs text-gray-500">{industry.count} công ty</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-3 gap-4 lg:gap-8 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#f26b38] to-[#e05a27] rounded-full mb-3">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl lg:text-3xl mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
