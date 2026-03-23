"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  User,
  ArrowRight,
  Filter,
} from "lucide-react";
import { BlogHero } from "@/components/BlogHero";

const blogPosts = [
  {
    id: 1,
    slug: "10-ky-nang-mem-quan-trong-giup-ban-thanh-cong-trong-cong-viec",
    title: "10 Kỹ năng mềm quan trọng giúp bạn thành công trong công việc",
    excerpt:
      "Trong thế giới công việc hiện đại, kỹ năng mềm đang ngày càng trở nên quan trọng không kém gì kỹ năng chuyên môn...",
    image: "https://images.unsplash.com/photo-1722149493669-30098ef78f9f?w=600",
    category: "Kỹ năng",
    author: "CVKing Team",
    date: "25/11/2024",
    readTime: "5 phút đọc",
    views: "1.2K",
    tags: ["Kỹ năng mềm", "Phát triển cá nhân", "Sự nghiệp"],
  },
  {
    id: 2,
    slug: "cach-viet-cv-an-tuong-de-gay-chu-y-voi-nha-tuyen-dung",
    title: "Cách viết CV ấn tượng để gây chú ý với nhà tuyển dụng",
    excerpt:
      "CV là yếu tố đầu tiên mà nhà tuyển dụng nhìn vào. Học cách tạo CV chuyên nghiệp và thu hút...",
    image: "https://images.unsplash.com/photo-1693045181178-d5d83fb070c8?w=600",
    category: "CV",
    author: "Nguyễn Thị Linh",
    date: "20/11/2024",
    readTime: "7 phút đọc",
    views: "856",
    tags: ["CV", "Ứng tuyển", "Việc làm"],
  },
  {
    id: 3,
    slug: "bi-quyet-phong-van-thanh-cong-trong-thoi-dai-so",
    title: "Bí quyết phỏng vấn thành công trong thời đại số",
    excerpt:
      "Những kỹ năng và mẹo giúp bạn tự tin trong các buổi phỏng vấn trực tuyến và trực tiếp...",
    image: "https://images.unsplash.com/photo-1758520144426-edf40a58f299?w=600",
    category: "Phỏng vấn",
    author: "Trần Văn Minh",
    date: "18/11/2024",
    readTime: "8 phút đọc",
    views: "1.8K",
    tags: ["Phỏng vấn", "Kỹ năng", "Việc làm"],
  },
  {
    id: 4,
    slug: "xay-dung-thuong-hieu-ca-nhan-tren-linkedin",
    title: "Xây dựng thương hiệu cá nhân trên LinkedIn",
    excerpt:
      "Cách tạo dựng hình ảnh chuyên nghiệp và thu hút nhà tuyển dụng trên nền tảng mạng xã hội...",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600",
    category: "Branding",
    author: "Lê Thị Mai",
    date: "15/11/2024",
    readTime: "6 phút đọc",
    views: "742",
    tags: ["LinkedIn", "Branding", "Mạng xã hội"],
  },
  {
    id: 5,
    slug: "quan-ly-thoi-gian-hieu-qua-cho-nguoi-di-lam",
    title: "Quản lý thời gian hiệu quả cho người đi làm",
    excerpt:
      "Những phương pháp và công cụ giúp bạn cân bằng giữa công việc và cuộc sống cá nhân...",
    image: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b827?w=600",
    category: "Sản xuất",
    author: "Phạm Quốc Anh",
    date: "12/11/2024",
    readTime: "6 phút đọc",
    views: "923",
    tags: ["Quản lý thời gian", "Sản xuất", "Work-life balance"],
  },
  {
    id: 6,
    slug: "xu-huong-tuyen-dung-2025-ai-va-cong-nghe-moi",
    title: "Xu hướng tuyển dụng 2025: AI và công nghệ mới",
    excerpt:
      "Khám phá những thay đổi trong thị trường lao động Việt Nam với sự ảnh hưởng của AI...",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
    category: "Xu hướng",
    author: "CVKing Team",
    date: "10/11/2024",
    readTime: "9 phút đọc",
    views: "2.1K",
    tags: ["AI", "Công nghệ", "Tuyển dụng"],
  },
];

const categories = [
  "Tất cả",
  "Kỹ năng",
  "CV",
  "Phỏng vấn",
  "Branding",
  "Sản xuất",
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
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Blog CVKing
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
                Chia sẻ kiến thức, kinh nghiệm và xu hướng mới nhất về tuyển
                dụng, phát triển sự nghiệp và thị trường lao động Việt Nam.
              </p>
              <Link href="/blog/blogdetail">
                <Button className="bg-[#f26b38] hover:bg-[#e05a27]">
                  Xem bài viết nổi bật
                </Button>
              </Link>
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
                  Bộ lọc nâng cao
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
                <Card
                  key={post.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-[#f26b38]/20 overflow-hidden"
                >
                  {/* Featured Image */}
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-6">
                    {/* Category Badge */}
                    <Badge className="mb-3 bg-[#f26b38]/10 text-[#f26b38] hover:bg-[#f26b38]/20">
                      {post.category}
                    </Badge>

                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-[#f26b38] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#f26b38] hover:text-[#e05a27] p-0"
                        >
                          Đọc thêm
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
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
    </div>
  );
}
