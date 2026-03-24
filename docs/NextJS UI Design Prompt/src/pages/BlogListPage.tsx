import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { BlogListHero } from "../components/BlogListHero";

const posts = [
  {
    id: 1,
    title: "10 Kỹ năng mềm quan trọng giúp bạn thành công trong công việc",
    excerpt: "Khám phá những kỹ năng thiết yếu mà mọi chuyên gia cần có để phát triển sự nghiệp trong thời đại số...",
    category: "Kỹ năng",
    date: "25/11/2024",
    readTime: "5 phút đọc",
    image: "https://images.unsplash.com/photo-1722149493669-30098ef78f9f?w=800",
  },
  {
    id: 2,
    title: "Cách viết CV xin việc ấn tượng thu hút nhà tuyển dụng",
    excerpt: "Hướng dẫn chi tiết từng bước tạo một bản CV chuyên nghiệp, nổi bật và tăng cơ hội được nhận vào làm...",
    category: "CV & Phỏng vấn",
    date: "23/11/2024",
    readTime: "7 phút đọc",
    image: "https://images.unsplash.com/photo-1693045181178-d5d83fb070c8?w=800",
  },
  {
    id: 3,
    title: "Xu hướng tuyển dụng IT năm 2025: Những vị trí hot nhất",
    excerpt: "Phân tích thị trường lao động IT Việt Nam và dự báo những công nghệ, vị trí việc làm được săn đón nhất...",
    category: "Xu hướng",
    date: "20/11/2024",
    readTime: "6 phút đọc",
    image: "https://images.unsplash.com/photo-1624555130858-7ea5b8192c49?w=800",
  },
  {
    id: 4,
    title: "Bí quyết phỏng vấn xin việc thành công",
    excerpt: "Những tips quan trọng giúp bạn tự tin và ghi điểm trong buổi phỏng vấn...",
    category: "CV & Phỏng vấn",
    date: "18/11/2024",
    readTime: "8 phút đọc",
    image: "https://images.unsplash.com/photo-1758520144426-edf40a58f299?w=800",
  },
  {
    id: 5,
    title: "Làm thế nào để đàm phán lương hiệu quả",
    excerpt: "Chiến lược đàm phán mức lương xứng đáng với năng lực của bạn...",
    category: "Kỹ năng",
    date: "15/11/2024",
    readTime: "6 phút đọc",
    image: "https://images.unsplash.com/photo-1598520106830-8c45c2035460?w=800",
  },
  {
    id: 6,
    title: "Cách xây dựng thương hiệu cá nhân trên LinkedIn",
    excerpt: "Hướng dẫn tận dụng LinkedIn để tăng cơ hội nghề nghiệp...",
    category: "Kỹ năng",
    date: "12/11/2024",
    readTime: "5 phút đọc",
    image: "https://images.unsplash.com/photo-1638342863994-ae4eee256688?w=800",
  },
];

const categories = ["Tất cả", "Kỹ năng", "CV & Phỏng vấn", "Xu hướng", "Kinh nghiệm"];

export function BlogListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <BlogListHero />
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white text-gray-900">
                      {post.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg mb-2 line-clamp-2 group-hover:text-[#f26b38] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Read More */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#f26b38] hover:text-[#e05a27] hover:bg-orange-50 p-0 h-auto group/btn"
                  >
                    Đọc thêm
                    <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button variant="outline" size="sm">
              Trước
            </Button>
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="sm"
                className={page === 1 ? "bg-[#f26b38] hover:bg-[#e05a27]" : ""}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm">
              Sau
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}