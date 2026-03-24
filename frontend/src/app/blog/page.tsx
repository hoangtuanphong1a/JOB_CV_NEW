"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, ArrowRight, Filter } from "lucide-react";
import { BlogHero } from "@/components/BlogHero";

const blogPosts = [
  {
    id: 1,
    slug: "10-ky-nang-mem-quan-trong-giup-ban-thanh-cong-trong-cong-viec",
    title: "10 Kỹ năng mềm quan trọng giúp bạn thành công trong công việc",
    excerpt:
      "Khám phá những kỹ năng thiết yếu mà mọi chuyên gia cần có để phát triển sự nghiệp trong thời đại số...",
    image: "https://images.unsplash.com/photo-1722149493669-30098ef78f9f?w=600",
    category: "Kỹ năng",
    date: "25/11/2024",
    readTime: "5 phút đọc",
  },
  {
    id: 2,
    slug: "cach-viet-cv-an-tuong-de-gay-chu-y-voi-nha-tuyen-dung",
    title: "Cách viết CV ấn tượng để gây chú ý với nhà tuyển dụng",
    excerpt:
      "Hướng dẫn chi tiết từng bước tạo một bản CV chuyên nghiệp, nổi bật và tăng cơ hội được nhận vào làm...",
    image: "https://images.unsplash.com/photo-1693045181178-d5d83fb070c8?w=600",
    category: "CV & Phỏng vấn",
    date: "23/11/2024",
    readTime: "7 phút đọc",
  },
  {
    id: 3,
    slug: "bi-quyet-phong-van-thanh-cong-trong-thoi-dai-so",
    title: "Bí quyết phỏng vấn thành công trong thời đại số",
    excerpt:
      "Những kỹ năng và mẹo giúp bạn tự tin trong các buổi phỏng vấn trực tuyến và trực tiếp...",
    image: "https://images.unsplash.com/photo-1758520144426-edf40a58f299?w=600",
    category: "Phỏng vấn",
    date: "20/11/2024",
    readTime: "6 phút đọc",
  },
  {
    id: 4,
    slug: "xu-huong-tuyen-dung-2024-ai-va-cong-nghe-moi",
    title: "Xu hướng tuyển dụng 2024: AI và công nghệ mới",
    excerpt:
      "Phân tích thị trường lao động Việt Nam và dự báo những công nghệ, vị trí việc làm được săn đón nhất...",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
    category: "Xu hướng",
    date: "18/11/2024",
    readTime: "8 phút đọc",
  },
  {
    id: 5,
    slug: "quan-ly-thoi-gian-hieu-qua-cho-nguoi-di-lam",
    title: "Quản lý thời gian hiệu quả cho người đi làm",
    excerpt:
      "Những phương pháp và công cụ giúp bạn cân bằng giữa công việc và cuộc sống cá nhân...",
    image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=600",
    category: "Kỹ năng",
    date: "15/11/2024",
    readTime: "6 phút đọc",
  },
  {
    id: 6,
    slug: "xay-dung-thuong-hieu-ca-nhan-tren-linkedin",
    title: "Xây dựng thương hiệu cá nhân trên LinkedIn",
    excerpt:
      "Cách tạo dựng hình ảnh chuyên nghiệp và thu hút nhà tuyển dụng trên nền tảng mạng xã hội...",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600",
    category: "Branding",
    date: "12/11/2024",
    readTime: "7 phút đọc",
  },
  {
    id: 7,
    slug: "luong-va-phuc-loi-trong-nganh-cong-nghe-thong-tin",
    title: "Lương và phúc lợi trong ngành công nghệ thông tin",
    excerpt:
      "Báo cáo chi tiết về mức lương, phúc lợi và xu hướng đãi ngộ trong ngành IT Việt Nam...",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600",
    category: "Xu hướng",
    date: "10/11/2024",
    readTime: "9 phút đọc",
  },
  {
    id: 8,
    slug: "ky-nang-giao-tiep-hieu-qua-trong-moi-truong-lam-viec",
    title: "Kỹ năng giao tiếp hiệu quả trong môi trường làm việc",
    excerpt:
      "Hướng dẫn cách xây dựng mối quan hệ tốt với đồng nghiệp và cấp trên thông qua giao tiếp...",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600",
    category: "Kỹ năng",
    date: "08/11/2024",
    readTime: "6 phút đọc",
  },
  {
    id: 9,
    slug: "chuan-bi-ho-so-xin-viec-cho-sinh-vien-moi-ra-truong",
    title: "Chuẩn bị hồ sơ xin việc cho sinh viên mới ra trường",
    excerpt:
      "Hướng dẫn toàn diện cho sinh viên năm cuối về cách chuẩn bị hồ sơ và tìm việc làm...",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",
    category: "CV & Phỏng vấn",
    date: "05/11/2024",
    readTime: "8 phút đọc",
  },
];

const categories = [
  "Tất cả",
  "Kỹ năng",
  "CV & Phỏng vấn",
  "Phỏng vấn",
  "Xu hướng",
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "Tất cả" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHero />
      <div className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl mb-2">Bài viết mới nhất</h2>
              <p className="text-lg text-gray-600">
                Kiến thức và kinh nghiệm hữu ích cho sự nghiệp của bạn
              </p>
            </div>
            <Button variant="outline" className="hidden md:flex">
              Xem tất cả
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="lg:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
              </Button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-[#f26b38] hover:bg-[#e05a27]"
                      : ""
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Tìm thấy{" "}
              <span className="text-gray-900 font-medium">
                {filteredPosts.length}
              </span>{" "}
              bài viết
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
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
                  <Link href={`/blog/${post.slug}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#f26b38] hover:text-[#e05a27] hover:bg-orange-50 p-0 h-auto group/btn"
                    >
                      Đọc thêm
                      <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button className="bg-[#f26b38] hover:bg-[#e05a27]">
              Xem thêm bài viết
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
