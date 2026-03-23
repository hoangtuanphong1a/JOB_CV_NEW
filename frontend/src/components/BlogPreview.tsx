"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { useRouter } from "next/navigation";

const posts = [
  {
    id: 1,
    title: "10 Kỹ năng mềm quan trọng giúp bạn thành công trong công việc",
    excerpt: "Khám phá những kỹ năng thiết yếu mà mọi chuyên gia cần có để phát triển sự nghiệp trong thời đại số...",
    category: "Kỹ năng",
    date: "25/11/2024",
    readTime: "5 phút đọc",
    image: "https://images.unsplash.com/photo-1722149493669-30098ef78f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjYXJlZXJ8ZW58MXx8fHwxNzY0MzM5NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    title: "Cách viết CV xin việc ấn tượng thu hút nhà tuyển dụng",
    excerpt: "Hướng dẫn chi tiết từng bước tạo một bản CV chuyên nghiệp, nổi bật và tăng cơ hội được nhận vào làm...",
    category: "CV & Phỏng vấn",
    date: "23/11/2024",
    readTime: "7 phút đọc",
    image: "https://images.unsplash.com/photo-1598520106830-8c45c2035460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGlubm92YXRpb258ZW58MXx8fHwxNzY0MjkzMTE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    title: "Xu hướng tuyển dụng IT năm 2024: Những vị trí hot nhất",
    excerpt: "Phân tích thị trường lao động IT Việt Nam và dự báo những công nghệ, vị trí việc làm được săn đón nhất...",
    category: "Xu hướng",
    date: "20/11/2024",
    readTime: "6 phút đọc",
    image: "https://images.unsplash.com/photo-1624555130858-7ea5b8192c49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwdGVhbSUyMHdvcmtpbmd8ZW58MXx8fHwxNzY0MjgyMzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function BlogPreview() {
  const router = useRouter();

  const handleReadMore = (postSlug: string) => {
    router.push(`/blog/${postSlug}`);
  };

  const handleViewBlog = () => {
    router.push('/blog');
  };

  const handleViewAllBlogs = () => {
    router.push('/blog');
  };

  // Function to create slug from title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl mb-2">
              Blog & Cẩm nang nghề nghiệp
            </h2>
            <p className="text-lg text-gray-600">
              Kiến thức và kinh nghiệm hữu ích cho sự nghiệp của bạn
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex" onClick={handleViewAllBlogs}>
            Xem tất cả
          </Button>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={handleViewBlog}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadMore(createSlug(post.title));
                  }}
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

        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" className="w-full" onClick={handleViewAllBlogs}>
            Xem tất cả bài viết
          </Button>
        </div>
      </div>
    </section>
  );
}
