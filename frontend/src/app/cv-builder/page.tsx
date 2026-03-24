"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Custom Components
import CVCard from "@/components/CVCard";
import FilterTabs from "@/components/FilterTabs";
import Pagination from "@/components/Pagination";
import SkeletonCVCard from "@/components/SkeletonCVCard";
import CVHero from "@/components/CVHero";

// Icons
import { ChevronRight, Home, ChevronRight as ChevronRightIcon } from "lucide-react";

// Types
interface CVTemplate {
  id: string;
  name: string;
  category: "professional" | "modern" | "creative";
  rating: number;
  thumbnail: string;
  isFree: boolean;
  previewUrl: string;
  downloadUrl: string;
}

const CVBuilderPage = () => {
  const router = useRouter();
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<CVTemplate[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const templatesPerPage = 12;

  // Mock data for CV templates
  const mockTemplates: CVTemplate[] = [
    {
      id: "1",
      name: "Mẫu CV Chuyên Nghiệp #1",
      category: "professional",
      rating: 4.8,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/1",
      downloadUrl: "/download/cv-1"
    },
    {
      id: "2",
      name: "Mẫu CV Hiện Đại #1",
      category: "modern",
      rating: 4.6,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/2",
      downloadUrl: "/download/cv-2"
    },
    {
      id: "3",
      name: "Mẫu CV Sáng Tạo #1",
      category: "creative",
      rating: 4.9,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/3",
      downloadUrl: "/download/cv-3"
    },
    {
      id: "4",
      name: "Mẫu CV Chuyên Nghiệp #2",
      category: "professional",
      rating: 4.7,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/4",
      downloadUrl: "/download/cv-4"
    },
    {
      id: "5",
      name: "Mẫu CV Hiện Đại #2",
      category: "modern",
      rating: 4.5,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/5",
      downloadUrl: "/download/cv-5"
    },
    {
      id: "6",
      name: "Mẫu CV Sáng Tạo #2",
      category: "creative",
      rating: 4.8,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/6",
      downloadUrl: "/download/cv-6"
    },
    {
      id: "7",
      name: "Mẫu CV Chuyên Nghiệp #3",
      category: "professional",
      rating: 4.9,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/7",
      downloadUrl: "/download/cv-7"
    },
    {
      id: "8",
      name: "Mẫu CV Hiện Đại #3",
      category: "modern",
      rating: 4.4,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/8",
      downloadUrl: "/download/cv-8"
    },
    {
      id: "9",
      name: "Mẫu CV Sáng Tạo #3",
      category: "creative",
      rating: 4.7,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/9",
      downloadUrl: "/download/cv-9"
    },
    {
      id: "10",
      name: "Mẫu CV Chuyên Nghiệp #4",
      category: "professional",
      rating: 4.6,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/10",
      downloadUrl: "/download/cv-10"
    },
    {
      id: "11",
      name: "Mẫu CV Hiện Đại #4",
      category: "modern",
      rating: 4.8,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/11",
      downloadUrl: "/download/cv-11"
    },
    {
      id: "12",
      name: "Mẫu CV Sáng Tạo #4",
      category: "creative",
      rating: 4.5,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/12",
      downloadUrl: "/download/cv-12"
    },
    {
      id: "13",
      name: "Mẫu CV Chuyên Nghiệp #5",
      category: "professional",
      rating: 4.9,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/13",
      downloadUrl: "/download/cv-13"
    },
    {
      id: "14",
      name: "Mẫu CV Hiện Đại #5",
      category: "modern",
      rating: 4.7,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/14",
      downloadUrl: "/download/cv-14"
    },
    {
      id: "15",
      name: "Mẫu CV Sáng Tạo #5",
      category: "creative",
      rating: 4.6,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/15",
      downloadUrl: "/download/cv-15"
    },
    {
      id: "16",
      name: "Mẫu CV Chuyên Nghiệp #6",
      category: "professional",
      rating: 4.8,
      thumbnail: "/api/placeholder/400/300",
      isFree: true,
      previewUrl: "/cv-preview/16",
      downloadUrl: "/download/cv-16"
    },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setTemplates(mockTemplates);
      setFilteredTemplates(mockTemplates);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Use useMemo to optimize filtering and avoid calling setState in effect
  const filteredTemplatesMemo = useMemo(() => {
    return templates.filter(template => 
      activeTab === "all" || template.category === activeTab
    );
  }, [activeTab, templates]);

  const totalPages = Math.ceil(filteredTemplatesMemo.length / templatesPerPage);
  const startIndex = (currentPage - 1) * templatesPerPage;
  const endIndex = startIndex + templatesPerPage;
  const currentTemplates = filteredTemplatesMemo.slice(startIndex, endIndex);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <CVHero />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <section className="mb-8">
          <FilterTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </section>

        {/* CV Templates Grid */}
        <section className="mb-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCVCard key={index} />
              ))}
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {currentTemplates.map((template, index) => (
                    <CVCard
                      key={template.id}
                      template={template}
                      delay={index * 0.1}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              {filteredTemplates.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">Không tìm thấy mẫu CV phù hợp</div>
                  <Button 
                    onClick={() => setActiveTab("all")}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Xem tất cả mẫu
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Pagination */}
        {!isLoading && filteredTemplates.length > templatesPerPage && (
          <section className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Giới thiệu */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Giới thiệu</h3>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi cung cấp các mẫu CV chuyên nghiệp, được thiết kế bởi các chuyên gia 
                trong lĩnh vực tuyển dụng. Giúp bạn tạo ấn tượng tốt với nhà tuyển dụng ngay từ cái nhìn đầu tiên.
              </p>
              <div className="flex gap-4 mt-6">
                <Button variant="outline" size="sm" className="border-gray-200">
                  Về chúng tôi
                </Button>
                <Button variant="outline" size="sm" className="border-gray-200">
                  Liên hệ
                </Button>
              </div>
            </div>

            {/* Hỗ trợ */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Hướng dẫn sử dụng</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Câu hỏi thường gặp</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Báo lỗi</a></li>
              </ul>
            </div>

            {/* Chính sách */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chính sách</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Chính sách hoàn tiền</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Quyền sở hữu trí tuệ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 CV Builder. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              {/* Social Icons */}
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                Facebook
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                Twitter
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CVBuilderPage;