import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, MapPin, Briefcase, Building2, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const stats = [
  { icon: Briefcase, label: "Việc làm", value: "50,000+" },
  { icon: Building2, label: "Công ty", value: "10,000+" },
  { icon: TrendingUp, label: "Lượt ứng tuyển", value: "1M+" },
];

const popularSearches = [
  "ReactJS Developer",
  "UI/UX Designer",
  "Product Manager",
  "Marketing",
  "Business Analyst",
  "NodeJS",
];

export function JobSearchHero() {
  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50/30 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#f26b38]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-20 relative">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl lg:text-5xl xl:text-6xl mb-4">
              Tìm công việc{" "}
              <span className="text-[#f26b38]">mơ ước</span> của bạn
            </h1>
            <p className="text-lg lg:text-xl text-gray-600">
              Khám phá hơn 50,000+ cơ hội nghề nghiệp từ các công ty hàng đầu
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-4 lg:p-6 shadow-xl border border-gray-100 mb-6"
          >
            <div className="grid lg:grid-cols-[1fr_auto_1fr_auto] gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Vị trí công việc, kỹ năng, công ty..."
                  className="pl-12 h-12 text-base border-gray-200 focus:border-[#f26b38] focus:ring-[#f26b38]"
                />
              </div>

              <div className="hidden lg:block w-px bg-gray-200"></div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Thành phố, địa điểm..."
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
          </motion.div>

          {/* Popular Searches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-8"
          >
            <span className="text-sm text-gray-600">Tìm kiếm phổ biến:</span>
            {popularSearches.map((search) => (
              <button
                key={search}
                className="px-4 py-1.5 bg-white hover:bg-orange-50 border border-gray-200 hover:border-[#f26b38] rounded-full text-sm text-gray-700 hover:text-[#f26b38] transition-all shadow-sm"
              >
                {search}
              </button>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 lg:gap-8"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                  <stat.icon className="h-6 w-6 text-[#f26b38]" />
                </div>
                <div className="text-2xl lg:text-3xl mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
