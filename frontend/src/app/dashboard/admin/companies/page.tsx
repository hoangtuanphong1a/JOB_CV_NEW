"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Star,
  ExternalLink,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { adminService } from "@/services/adminService";

interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  email: string;
  phone?: string;
  address: string;
  industry: string;
  companySize: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification';
  createdAt: string;
  verifiedAt?: string;
  totalJobs: number;
  totalEmployees: number;
  rating: number;
  foundedYear?: number;
  contactPerson?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface CompanyFilters {
  status?: string;
  industry?: string;
  companySize?: string;
  search?: string;
}

export default function AdminCompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<CompanyFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCompanies();
  }, [filters, currentPage]);

  const fetchCompanies = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 20,
        ...filters
      };

      const response = await adminService.getAllCompanies(params);

      // Transform the data to match our local interface
      const transformedCompanies: Company[] = response.data.map(company => ({
        id: company.id,
        name: company.name,
        description: company.description || '',
        logo: company.logo,
        website: company.website,
        email: 'Email không có sẵn', // Not available in admin service
        phone: undefined, // Not available in admin service
        address: 'Địa chỉ không có sẵn', // Not available in admin service
        industry: 'Ngành không xác định', // Not available in admin service
        companySize: 'Không xác định', // Not available in admin service
        status: company.status as Company['status'],
        createdAt: company.createdAt,
        verifiedAt: undefined, // Not available in admin service
        totalJobs: 0, // Not available in admin service
        totalEmployees: 0, // Not available in admin service
        rating: 0, // Not available in admin service
        foundedYear: undefined, // Not available in admin service
        contactPerson: undefined // Not available in admin service
      }));

      setCompanies(transformedCompanies);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (companyId: string, newStatus: string) => {
    try {
      await adminService.updateCompanyStatus(companyId, newStatus);
      fetchCompanies(); // Refresh the list
    } catch (error) {
      console.error('Error updating company status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Hoạt động', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      inactive: { label: 'Không hoạt động', color: 'bg-gray-100 text-gray-700', icon: XCircle },
      suspended: { label: 'Tạm ngừng', color: 'bg-red-100 text-red-700', icon: XCircle },
      pending_verification: { label: 'Chờ xác minh', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getCompanySizeLabel = (size: string) => {
    const sizes = {
      '1-10': '1-10 nhân viên',
      '11-50': '11-50 nhân viên',
      '51-200': '51-200 nhân viên',
      '201-500': '201-500 nhân viên',
      '501-1000': '501-1000 nhân viên',
      '1000+': '1000+ nhân viên'
    };
    return sizes[size as keyof typeof sizes] || size;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách công ty...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Quản lý công ty</h1>
                <p className="text-gray-600 mt-1">Xem và quản lý thông tin tất cả công ty trên hệ thống.</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tên công ty..."
                    className="pl-10"
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>

              <Select value={filters.status || 'all'} onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? undefined : value })}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="suspended">Tạm ngừng</SelectItem>
                  <SelectItem value="pending_verification">Chờ xác minh</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.industry || 'all'} onValueChange={(value) => setFilters({ ...filters, industry: value === 'all' ? undefined : value })}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tất cả ngành" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ngành</SelectItem>
                  <SelectItem value="technology">Công nghệ</SelectItem>
                  <SelectItem value="finance">Tài chính</SelectItem>
                  <SelectItem value="healthcare">Y tế</SelectItem>
                  <SelectItem value="education">Giáo dục</SelectItem>
                  <SelectItem value="retail">Bán lẻ</SelectItem>
                  <SelectItem value="manufacturing">Sản xuất</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.companySize || 'all'} onValueChange={(value) => setFilters({ ...filters, companySize: value === 'all' ? undefined : value })}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Quy mô" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả quy mô</SelectItem>
                  <SelectItem value="1-10">1-10 nhân viên</SelectItem>
                  <SelectItem value="11-50">11-50 nhân viên</SelectItem>
                  <SelectItem value="51-200">51-200 nhân viên</SelectItem>
                  <SelectItem value="201-500">201-500 nhân viên</SelectItem>
                  <SelectItem value="501-1000">501-1000 nhân viên</SelectItem>
                  <SelectItem value="1000+">1000+ nhân viên</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setFilters({})}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Xóa bộ lọc
              </Button>
            </div>
          </Card>

          {/* Companies List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Danh sách công ty ({companies.length})</h2>
            </div>

            <div className="space-y-6">
              {companies.length > 0 ? companies.map((company) => (
                <div key={company.id} className="border border-gray-200 rounded-lg p-6 hover:border-[#f26b38] transition-colors">
                  <div className="flex items-start gap-6">
                    {/* Company Logo */}
                    <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-full h-full rounded-lg object-cover" />
                      ) : (
                        <Building className="h-10 w-10 text-[#f26b38]" />
                      )}
                    </div>

                    {/* Company Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold hover:text-[#f26b38] cursor-pointer">{company.name}</h3>
                            {getStatusBadge(company.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{company.address}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Thành lập {company.foundedYear || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Ngành: {company.industry}</span>
                            <span>Quy mô: {getCompanySizeLabel(company.companySize)}</span>
                            <div className="flex items-center gap-1">
                              <span>Đánh giá:</span>
                              <div className="flex items-center gap-1">
                                {renderStars(company.rating)}
                                <span className="ml-1">({company.rating})</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Xem chi tiết
                          </Button>
                          <Button size="sm" variant="outline" className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Trang công ty
                          </Button>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 line-clamp-2">{company.description}</p>

                      {/* Contact Info */}
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        {company.website && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-[#f26b38] hover:underline">
                              {company.website}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{company.email}</span>
                        </div>
                        {company.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{company.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                          <span>{company.totalJobs} tin tuyển dụng</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>{company.totalEmployees} nhân viên</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Đăng ký: {new Date(company.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>

                      {/* Contact Person */}
                      {company.contactPerson && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">Người liên hệ:</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{company.contactPerson.name}</span>
                            <span>{company.contactPerson.email}</span>
                            {company.contactPerson.phone && <span>{company.contactPerson.phone}</span>}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Actions */}
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      {company.status === 'pending_verification' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 flex-1"
                            onClick={() => handleStatusChange(company.id, 'active')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 flex-1"
                            onClick={() => handleStatusChange(company.id, 'suspended')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Từ chối
                          </Button>
                        </div>
                      )}

                      {company.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleStatusChange(company.id, 'suspended')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Tạm ngừng
                        </Button>
                      )}

                      {company.status === 'suspended' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange(company.id, 'active')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Kích hoạt
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Không tìm thấy công ty nào</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Trước
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? "bg-[#f26b38] hover:bg-[#e05a27]" : ""}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Sau
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
