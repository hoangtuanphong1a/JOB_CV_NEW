"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FeaturedCompanies } from "@/components/FeaturedCompanies";
import { CompaniesHero } from "@/components/CompaniesHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, MapPin, ArrowRight, Users } from "lucide-react";

interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  size: string;
  jobsCount: number;
  logo?: string;
  isFollowing: boolean;
  rating: number;
  description: string;
}

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const industries = [
    "all",
    "Công nghệ thông tin",
    "Kinh doanh",
    "Thiết kế",
    "Marketing",
    "Tài chính",
    "Nhân sự",
    "Sản xuất"
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm, selectedIndustry]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies?limit=100'); // Get more companies
      if (response.ok) {
        const data = await response.json();
        // API returns { data: Company[], total, page, limit, totalPages }
        setCompanies(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = companies;

    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry !== "all") {
      filtered = filtered.filter(company => company.industry === selectedIndustry);
    }

    setFilteredCompanies(filtered);
  };

  const handleFollowCompany = async (companyId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`/api/companies/${companyId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCompanies(companies.map(company =>
          company.id === companyId
            ? { ...company, isFollowing: !company.isFollowing }
            : company
        ));
      }
    } catch (error) {
      console.error('Error following company:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50">
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách công ty...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <CompaniesHero />
      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Khám phá công ty hàng đầu
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tìm hiểu về các nhà tuyển dụng uy tín và cơ hội phát triển sự nghiệp
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Tìm kiếm công ty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f26b38] focus:border-transparent"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>
                    {industry === "all" ? "Tất cả ngành nghề" : industry}
                  </option>
                ))}
              </select>

              <div className="text-sm text-gray-600 flex items-center">
                <span>{filteredCompanies.length} công ty được tìm thấy</span>
              </div>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-[#f26b38] hover:shadow-xl transition-all duration-300"
              >
                {/* Company Logo */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f26b38] to-[#e05a27] flex items-center justify-center mb-4">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <Building2 className="h-8 w-8 text-white" />
                  )}
                </div>

                {/* Company Info */}
                <div className="space-y-3 mb-4">
                  <Link href={`/companies/${company.id}`}>
                    <h3 className="text-xl font-semibold group-hover:text-[#f26b38] transition-colors cursor-pointer">
                      {company.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600">{company.industry}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{company.size} nhân viên</span>
                  </div>
                </div>

                {/* Rating and Jobs */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${star <= Math.floor(company.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">{company.rating}</span>
                  </div>
                  <Badge variant="secondary">
                    {company.jobsCount} việc làm
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    variant={company.isFollowing ? "outline" : "default"}
                    className={company.isFollowing ? "border-gray-300" : "bg-[#f26b38] hover:bg-[#e05a27]"}
                    onClick={() => handleFollowCompany(company.id)}
                  >
                    {company.isFollowing ? 'Đã theo dõi' : 'Theo dõi'}
                  </Button>
                  <Link href={`/companies/${company.id}`}>
                    <Button size="sm" variant="outline" className="border-[#f26b38] text-[#f26b38] hover:bg-orange-50">
                      Xem chi tiết
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Companies Section */}
          <FeaturedCompanies />

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#f26b38] to-[#e05a27] rounded-2xl p-8 text-center text-white mt-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Bạn là nhà tuyển dụng?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Đăng tin tuyển dụng ngay để tìm kiếm ứng viên phù hợp nhất cho doanh nghiệp của bạn
            </p>
            <Link href="/jobs/post">
              <Button size="lg" variant="secondary" className="bg-white text-[#f26b38] hover:bg-gray-100">
                Đăng tin tuyển dụng
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
