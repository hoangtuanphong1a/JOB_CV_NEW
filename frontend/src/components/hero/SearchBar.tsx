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

// Sample jobs data for filtering
const sampleJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Solutions Vietnam",
    location: "Hà Nội",
    salary: "25-35 triệu",
    type: "Full-time",
    level: "Senior",
    tags: ["ReactJS", "TypeScript", "TailwindCSS"],
    posted: "2 giờ trước",
    description: "Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm với ReactJS và TypeScript để tham gia vào dự án thương mại điện tử lớn.",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Hồ Chí Minh",
    salary: "15-25 triệu",
    type: "Full-time",
    level: "Middle",
    tags: ["Figma", "Adobe XD", "Sketch"],
    posted: "5 giờ trước",
    description: "Vị trí UI/UX Designer với 2+ năm kinh nghiệm, thành thạo các công cụ thiết kế hiện đại.",
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "FinTech Innovations",
    location: "Đà Nẵng",
    salary: "20-30 triệu",
    type: "Full-time",
    level: "Middle",
    tags: ["NodeJS", "MongoDB", "AWS"],
    posted: "1 ngày trước",
    description: "Backend Developer có kinh nghiệm với NodeJS, MongoDB và AWS Cloud Services.",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "E-commerce Giant",
    location: "Hà Nội",
    salary: "30-45 triệu",
    type: "Full-time",
    level: "Senior",
    tags: ["Agile", "Scrum", "Product Strategy"],
    posted: "1 ngày trước",
    description: "Product Manager với kinh nghiệm quản lý sản phẩm trong lĩnh vực thương mại điện tử.",
  },
  {
    id: 5,
    title: "Marketing Executive",
    company: "Digital Agency Pro",
    location: "Hồ Chí Minh",
    salary: "12-18 triệu",
    type: "Full-time",
    level: "Junior",
    tags: ["SEO", "Social Media", "Content"],
    posted: "2 ngày trước",
    description: "Marketing Executive với kỹ năng SEO, Social Media và Content Marketing.",
  },
  {
    id: 6,
    title: "Data Analyst",
    company: "Analytics Corp",
    location: "Remote",
    salary: "18-28 triệu",
    type: "Remote",
    level: "Middle",
    tags: ["Python", "SQL", "Tableau"],
    posted: "3 ngày trước",
    description: "Data Analyst với kỹ năng Python, SQL và các công cụ visualization.",
  },
  {
    id: 7,
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "Hà Nội",
    salary: "28-40 triệu",
    type: "Full-time",
    level: "Senior",
    tags: ["Docker", "Kubernetes", "AWS"],
    posted: "4 giờ trước",
    description: "DevOps Engineer có kinh nghiệm với containerization và cloud platforms.",
  },
  {
    id: 8,
    title: "Mobile App Developer",
    company: "Mobile Solutions",
    location: "Hồ Chí Minh",
    salary: "22-35 triệu",
    type: "Full-time",
    level: "Middle",
    tags: ["React Native", "Flutter", "iOS"],
    posted: "6 giờ trước",
    description: "Mobile App Developer với kinh nghiệm React Native và Flutter.",
  },
];

export function SearchBar() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

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

  // Filter jobs based on search criteria
  const filteredJobs = React.useMemo(() => {
    let filtered = sampleJobs;

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim();
      filtered = filtered.filter(job => {
        // Search in title, company, description, tags, level, type
        const searchableText = [
          job.title,
          job.company,
          job.description,
          job.level,
          job.type,
          ...job.tags
        ].join(' ').toLowerCase();

        return searchableText.includes(keyword);
      });
    }

    if (selectedLocation) {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    return filtered;
  }, [searchKeyword, selectedLocation]);

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
    setSearchKeyword(keyword);
  };

  const handleJobClick = (jobId: number) => {
    router.push(`/jobs/jobdetail?id=${jobId}`);
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
            <motion.button
              key={keyword}
              onClick={() => handleKeywordClick(keyword)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer"
            >
              {keyword}
            </motion.button>
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
                            <p className="text-sm text-gray-600">{job.company}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                              <Clock className="h-4 w-4" />
                              <span>{job.posted}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            <span>{job.type}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {job.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            Ứng tuyển ngay
                          </Button>
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
