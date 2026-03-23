"use client";

import { Code, Palette, TrendingUp, Megaphone, Users, Calculator, Wrench, Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jobService, JobCategory } from "@/services/jobService";

const iconMap = {
  'Công nghệ thông tin': Code,
  'Thiết kế': Palette,
  'Đồ họa': Palette,
  'Kinh doanh': TrendingUp,
  'Bán hàng': TrendingUp,
  'Marketing': Megaphone,
  'PR': Megaphone,
  'Nhân sự': Users,
  'Kế toán': Calculator,
  'Tài chính': Calculator,
  'Kỹ thuật': Wrench,
  'Công nghệ': Wrench,
  'Y tế': Heart,
  'Chăm sóc sức khỏe': Heart,
};

const colorMap = [
  "from-[#f26b38] to-[#e05a27]",
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-blue-500",
  "from-teal-500 to-green-500",
  "from-gray-500 to-slate-500",
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-yellow-500 to-orange-500",
];

interface CategoryWithCount extends JobCategory {
  jobCount?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function JobCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await jobService.getJobCategories();

      // Add icons, colors, and mock job counts
      const categoriesWithUI = response.map((category, index) => {
        // Find matching icon based on category name
        const iconKey = Object.keys(iconMap).find(key =>
          category.name.toLowerCase().includes(key.toLowerCase())
        ) || Object.keys(iconMap)[index % Object.keys(iconMap).length];

        return {
          ...category,
          jobCount: Math.floor(Math.random() * 2000) + 500, // Mock job count
          icon: iconMap[iconKey as keyof typeof iconMap],
          color: colorMap[index % colorMap.length],
        };
      });

      setCategories(categoriesWithUI);
    } catch (error) {
      console.error('Error fetching job categories:', error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    const params = new URLSearchParams();
    params.set('category', categoryName);
    router.push(`/jobs?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#f26b38]" />
            <span className="ml-2 text-gray-600">Đang tải danh mục ngành nghề...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl mb-4">
            Khám phá theo ngành nghề
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tìm kiếm cơ hội việc làm phù hợp với chuyên môn và đam mê của bạn
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                  <div className="relative space-y-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="text-left">
                      <h3 className="text-sm mb-1 group-hover:text-[#f26b38] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.jobCount?.toLocaleString('en-US') || 0} việc làm
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Code className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có danh mục nào</h3>
            <p className="text-gray-600">Danh mục ngành nghề sẽ xuất hiện khi có dữ liệu từ hệ thống.</p>
          </div>
        )}
      </div>
    </section>
  );
}
