"use client";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Building2, MapPin, ArrowRight, Users, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CompanyService, Company } from "@/services/companyService";

interface CompanyWithJobs extends Company {
  jobsCount?: number;
  isFollowing?: boolean;
}

export function FeaturedCompanies() {
  const router = useRouter();
  const [companies, setCompanies] = useState<CompanyWithJobs[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCompanies();
  }, []);

  const fetchFeaturedCompanies = async () => {
    try {
      setIsLoading(true);
      // Get companies with job counts (top companies with most jobs)
      const response = await CompanyService.getCompanies({
        page: 1,
        limit: 6
      });

      // Add mock job counts and following status for now
      const companiesWithJobs = response.data.map((company, index) => ({
        ...company,
        jobsCount: Math.floor(Math.random() * 100) + 20, // Mock job count
        isFollowing: index < 3, // Mock following status for first 3
      }));

      setCompanies(companiesWithJobs);
    } catch (error) {
      console.error('Error fetching featured companies:', error);
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewJobs = (companyId: string) => {
    router.push(`/companies/${companyId}`);
  };

  const handleViewAllCompanies = () => {
    router.push('/companies');
  };

  const getCompanyLocation = (company: CompanyWithJobs): string => {
    const parts = [company.city, company.state, company.country].filter(Boolean);
    return parts.join(', ') || 'Không xác định';
  };

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#f26b38]" />
            <span className="ml-2 text-gray-600">Đang tải công ty hàng đầu...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl mb-2">
              Công ty hàng đầu
            </h2>
            <p className="text-lg text-gray-600">
              Khám phá các nhà tuyển dụng uy tín và cơ hội phát triển sự nghiệp
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex" onClick={handleViewAllCompanies}>
            Xem tất cả
          </Button>
        </div>

        {/* Companies Grid */}
        {companies.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <div
                key={company.id}
                className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-[#f26b38] hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Featured Badge */}
                {index < 3 && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-orange-100 text-[#f26b38]">
                      Top
                    </Badge>
                  </div>
                )}

                {/* Company Logo Placeholder */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f26b38] to-[#e05a27] flex items-center justify-center mb-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>

                {/* Company Info */}
                <div className="space-y-3 mb-4">
                  <h3 className="text-xl group-hover:text-[#f26b38] transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-600">{company.industry}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{getCompanyLocation(company)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-600">
                    {company.jobsCount || 0} việc làm
                  </span>
                  <Button
                    onClick={() => handleViewJobs(company.id)}
                    size="sm"
                    variant="ghost"
                    className="text-[#f26b38] hover:text-[#e05a27] hover:bg-orange-50 group/btn"
                  >
                    Xem việc làm
                    <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có công ty nào</h3>
            <p className="text-gray-600">Công ty sẽ xuất hiện khi có nhà tuyển dụng đăng ký.</p>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" className="w-full" onClick={handleViewAllCompanies}>
            Xem tất cả công ty
          </Button>
        </div>
      </div>
    </section>
  );
}
