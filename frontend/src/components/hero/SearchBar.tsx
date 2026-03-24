"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Clock, DollarSign, Briefcase, Bookmark, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

interface Job {
  id: string;
  title: string;
  company?: {
    name: string;
  };
  city?: string;
  minSalary?: number;
  maxSalary?: number;
  jobType?: string;
  experienceLevel?: string;
  skills?: Array<{ name: string }>;
  createdAt: string;
  description?: string;
}

export function SearchBar() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const popularKeywords = ['ReactJS', 'NodeJS', 'Marketing', 'Designer', 'Sales'];
  const locations = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Remote',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
    'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
    'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
    'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
    'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
    'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
    'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
    'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
    'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh',
    'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
  ].sort();

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/jobs', {
          params: {
            limit: 20,
            status: 'published'
          }
        });
        setJobs(response.data.data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search criteria
  const filteredJobs = React.useMemo(() => {
    let filtered = jobs;

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(job => {
        const searchableText = [
          job.title,
          job.company?.name || '',
          job.description || '',
          job.experienceLevel || '',
          job.jobType || '',
          ...(job.skills?.map(s => s.name) || [])
        ].join(' ').toLowerCase();

        return searchableText.includes(keyword);
      });
    }

    if (selectedLocation) {
      filtered = filtered.filter(job => job.city === selectedLocation);
    }

    return filtered;
  }, [jobs, searchKeyword, selectedLocation]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchKeyword.trim()) {
      params.set('keyword', searchKeyword.trim());
    }
    if (selectedLocation) {
      params.set('location', selectedLocation);
    }

    const queryString = params.toString();
    router.push(`/jobs${queryString ? `?${queryString}` : ''}`);
  };

  const handleKeywordClick = (keyword: string) => {
    // Transfer keyword to search input
    setSearchKeyword(keyword);
    // Focus on search input
    const searchInput = document.querySelector('input[placeholder="Tên công việc, kỹ năng..."]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleApply = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    router.push(`/jobs/${jobId}/apply`);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Thương lượng';
    const formatAmount = (amount: number) => {
      return (amount / 1000000).toFixed(0) + ' triệu';
    };
    if (min && max) {
      return `${formatAmount(min)} - ${formatAmount(max)}`;
    }
    if (min) return `Từ ${formatAmount(min)}`;
    if (max) return `Đến ${formatAmount(max)}`;
    return 'Thương lượng';
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa đăng';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày trước`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} tháng trước`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8"
      >
        {/* Search Form */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tên công việc, kỹ năng..."
              className="pl-10 h-14 text-base border-2 border-gray-200 focus:border-orange-500 rounded-xl"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="pl-10 h-14 text-base border-2 border-gray-200 focus:border-orange-500 rounded-xl">
                <SelectValue placeholder="Địa điểm làm việc" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSearch}
            className="bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Search className="h-5 w-5 mr-2" />
            Tìm việc làm
          </Button>
        </div>

        {/* Popular Keywords */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-gray-600 text-sm font-medium">Từ khóa hot:</span>
          {popularKeywords.map((keyword, index) => (
            <button
              key={keyword}
              onClick={() => handleKeywordClick(keyword)}
              className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-1 hover:scale-105"
              style={{ 
                pointerEvents: 'auto',
                animationDelay: `${index * 0.1}s`
              }}
            >
              {keyword}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search Results */}
      {(searchKeyword || selectedLocation) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Kết quả tìm kiếm ({filteredJobs.length})
            </h3>
            {filteredJobs.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchKeyword('');
                  setSelectedLocation('');
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy công việc phù hợp
              </h4>
              <p className="text-gray-600 mb-4">
                Hãy thử từ khóa khác hoặc địa điểm khác
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchKeyword('');
                  setSelectedLocation('');
                }}
              >
                Xem tất cả công việc
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredJobs.slice(0, 6).map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => handleJobClick(job.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-6 w-6 text-orange-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                              {job.title}
                            </h4>
                            <p className="text-sm text-gray-600">{job.company?.name || 'Công ty'}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                              <Clock className="h-4 w-4" />
                              <span>{getTimeAgo(job.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.city || 'Không xác định'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatSalary(job.minSalary, job.maxSalary)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.jobType || 'Toàn thời gian'}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          {job.description || 'Chưa có mô tả'}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {job.skills?.slice(0, 3).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill.name}
                              </Badge>
                            ))}
                          </div>

                          <button
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer z-10 relative"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApply(e, job.id);
                            }}
                            style={{ pointerEvents: 'auto' }}
                          >
                            Ứng tuyển ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {filteredJobs.length > 6 && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={handleSearch}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    Xem thêm {filteredJobs.length - 6} công việc khác
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}