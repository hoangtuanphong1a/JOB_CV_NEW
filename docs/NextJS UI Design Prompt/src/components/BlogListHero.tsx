import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  Search, 
  BookOpen, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Calendar,
  Clock,
  Eye
} from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const stats = [
  { icon: BookOpen, label: "Bài viết", value: "1,000+" },
  { icon: Users, label: "Độc giả", value: "500K+" },
  { icon: TrendingUp, label: "Lượt xem/tháng", value: "2M+" },
];

const categories = [
  { name: "Kỹ năng mềm", color: "bg-blue-100 text-blue-700 hover:bg-blue-200", count: "234" },
  { name: "CV & Phỏng vấn", color: "bg-green-100 text-green-700 hover:bg-green-200", count: "189" },
  { name: "Xu hướng", color: "bg-purple-100 text-purple-700 hover:bg-purple-200", count: "156" },
  { name: "Kinh nghiệm", color: "bg-orange-100 text-orange-700 hover:bg-orange-200", count: "142" },
  { name: "Phát triển sự nghiệp", color: "bg-pink-100 text-pink-700 hover:bg-pink-200", count: "128" },
];

const featuredPost = {
  title: "10 Kỹ năng mềm quan trọng giúp bạn thành công trong công việc 2025",
  excerpt: "Khám phá những kỹ năng thiết yếu mà mọi chuyên gia cần có để phát triển sự nghiệp trong thời đại số hóa và AI...",
  category: "Kỹ năng",
  date: "25/11/2024",
  readTime: "8 phút đọc",
  views: "12.5K",
  image: "https://images.unsplash.com/photo-1722149493669-30098ef78f9f?w=800",
};

export function BlogListHero() {
  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-white to-pink-50/30 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-10 w-96 h-96 bg-[#f26b38]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-pink-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl lg:text-5xl xl:text-6xl mb-4">
            Blog & Cẩm nang{" "}
            <span className="text-[#f26b38]">nghề nghiệp</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600">
            Kiến thức, kinh nghiệm và xu hướng mới nhất giúp bạn phát triển sự nghiệp thành công
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Tìm kiếm bài viết, chủ đề..."
              className="pl-12 h-14 text-base border-gray-200 bg-white shadow-lg focus:border-[#f26b38] focus:ring-[#f26b38] rounded-full"
            />
            <Button 
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#f26b38] hover:bg-[#e05a27] rounded-full"
            >
              Tìm kiếm
            </Button>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              className={`px-5 py-2.5 rounded-full text-sm transition-all shadow-sm hover:shadow-md ${category.color}`}
            >
              {category.name}
              <span className="ml-2 opacity-75">({category.count})</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-[#f26b38]" />
            <span className="text-sm text-gray-600">Bài viết nổi bật</span>
          </div>
          
          <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#f26b38] shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-0">
              {/* Image */}
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <ImageWithFallback
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[#f26b38] text-white">
                    {featuredPost.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <h2 className="text-2xl lg:text-3xl mb-4 group-hover:text-[#f26b38] transition-colors line-clamp-2">
                  {featuredPost.title}
                </h2>
                
                <p className="text-base text-gray-600 mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{featuredPost.views} lượt xem</span>
                  </div>
                </div>

                {/* Read More Button */}
                <Button
                  size="lg"
                  className="bg-[#f26b38] hover:bg-[#e05a27] group/btn w-fit"
                >
                  Đọc bài viết
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-3 gap-4 lg:gap-8 max-w-3xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 lg:p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mb-3">
                <stat.icon className="h-6 w-6 text-[#f26b38]" />
              </div>
              <div className="text-xl lg:text-3xl mb-1">{stat.value}</div>
              <div className="text-xs lg:text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
