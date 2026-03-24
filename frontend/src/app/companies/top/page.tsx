"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  TrendingUp,
  Award,
  Building2,
  MapPin,
  Users,
  Briefcase,
  ArrowRight,
  Crown,
  Medal,
  Trophy,
  Sparkles,
  Heart,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyService, Company } from "@/services/companyService";

interface TopCompany extends Company {
  rating?: number;
  jobsCount?: number;
  followersCount?: number;
  isFeatured?: boolean;
  rank?: number;
}

export default function TopCompaniesPage() {
  const [topRatedCompanies, setTopRatedCompanies] = useState<TopCompany[]>([]);
  const [featuredCompanies, setFeaturedCompanies] = useState<TopCompany[]>([]);
  const [trendingCompanies, setTrendingCompanies] = useState<TopCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("top-rated");

  useEffect(() => {
    fetchTopCompanies();
  }, []);

  const fetchTopCompanies = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all companies
      const response = await CompanyService.getCompanies({ limit: 50 });
      const companies = response.data || [];

      // Simulate ratings and stats for demo
      const companiesWithStats: TopCompany[] = companies.map((company, index) => ({
        ...company,
        rating: Math.min(5, Math.max(3.5, 4.5 - (index * 0.05) + Math.random() * 0.5)),
        jobsCount: Math.floor(Math.random() * 50) + 5,
        followersCount: Math.floor(Math.random() * 1000) + 100,
        isFeatured: index < 10,
        rank: index + 1
      }));

      // Sort by rating for top rated
      const sortedByRating = [...companiesWithStats]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 20);
      
      // Featured companies (first 10)
      const featured = companiesWithStats
        .filter(c => c.isFeatured)
        .slice(0, 12);

      // Trending (by jobs count)
      const trending = [...companiesWithStats]
        .sort((a, b) => (b.jobsCount || 0) - (a.jobsCount || 0))
        .slice(0, 15);

      setTopRatedCompanies(sortedByRating);
      setFeaturedCompanies(featured);
      setTrendingCompanies(trending);
    } catch (error) {
      console.error('Error fetching top companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Trophy className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : star <= rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const CompanyCard = ({ company, showRank = false }: { company: TopCompany; showRank?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-[#f26b38] hover:shadow-xl transition-all duration-300"
    >
      {/* Featured Badge */}
      {company.isFeatured && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-[#f26b38] to-[#e05a27] text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            Nổi bật
          </Badge>
        </div>
      )}

      {/* Rank Badge */}
      {showRank && company.rank && company.rank <= 3 && (
        <div className="absolute -top-2 -left-2">
          <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
            {getRankIcon(company.rank)}
          </div>
        </div>
      )}

      {/* Company Logo */}
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#f26b38] to-[#e05a27] flex items-center justify-center mb-4">
        {company.logo ? (
          <img src={company.logo} alt={company.name} className="w-full h-full rounded-xl object-cover" />
        ) : (
          <Building2 className="h-8 w-8 text-white" />
        )}
      </div>

      {/* Company Info */}
      <div className="mb-4">
        <Link href={`/companies/${company.id}`}>
          <h3 className="text-xl font-semibold group-hover:text-[#f26b38] transition-colors cursor-pointer">
            {company.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mt-1">{company.industry || "Chưa cập nhật"}</p>
      </div>

      {/* Rating */}
      <div className="mb-4">
        {renderStars(company.rating || 4.5)}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{company.city || company.address || "Việt Nam"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Briefcase className="h-4 w-4" />
          <span>{company.jobsCount} việc làm</span>
        </div>
      </div>

      {/* Followers */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Heart className="h-4 w-4" />
          <span>{company.followersCount} người theo dõi</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Eye className="h-4 w-4" />
          <span>{Math.floor((company.followersCount || 0) * 2.5)} lượt xem</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link href={`/companies/${company.id}`} className="flex-1">
          <Button size="sm" variant="outline" className="w-full border-[#f26b38] text-[#f26b38] hover:bg-orange-50">
            Xem chi tiết
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách công ty...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#f26b38] to-[#e05a27] text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-12 w-12 text-yellow-300" />
              <h1 className="text-4xl lg:text-5xl font-bold">Công ty hàng đầu</h1>
            </div>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Khám phá những công ty uy tín và được đánh giá cao nhất trên nền tảng
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">{topRatedCompanies.length}</div>
              <div className="text-sm text-gray-600">Công ty đánh giá cao</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-8 w-8 text-[#f26b38] mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">{featuredCompanies.length}</div>
              <div className="text-sm text-gray-600">Công ty nổi bật</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">{trendingCompanies.length}</div>
              <div className="text-sm text-gray-600">Công ty xu hướng</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">Điểm đánh giá trung bình</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white border shadow-sm mb-8">
            <TabsTrigger value="top-rated" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Đánh giá cao nhất
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Công ty nổi bật
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Xu hướng
            </TabsTrigger>
          </TabsList>

          {/* Top Rated Companies */}
          <TabsContent value="top-rated">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Công ty được đánh giá cao nhất
                </h2>
                <p className="text-gray-600">
                  Những công ty có điểm đánh giá cao nhất từ người dùng và ứng viên
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topRatedCompanies.map((company, index) => (
                  <CompanyCard key={company.id} company={{...company, rank: index + 1}} showRank={true} />
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Featured Companies */}
          <TabsContent value="featured">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Công ty nổi bật
                </h2>
                <p className="text-gray-600">
                  Các đối tác chiến lược và nhà tuyển dụng hàng đầu
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredCompanies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Trending Companies */}
          <TabsContent value="trending">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Công ty xu hướng
                </h2>
                <p className="text-gray-600">
                  Các công ty đang tuyển dụng nhiều việc làm nhất
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingCompanies.map((company, index) => (
                  <CompanyCard key={company.id} company={{...company, rank: index + 1}} showRank={true} />
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-[#f26b38] to-[#e05a27] text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Bạn muốn công ty của bạn được nổi bật?
              </h3>
              <p className="text-lg mb-6 text-orange-100">
                Đăng ký để trở thành đối tác và tiếp cận hàng nghìn ứng viên tiềm năng
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" variant="secondary" className="bg-white text-[#f26b38] hover:bg-gray-100">
                    Đăng ký ngay
                  </Button>
                </Link>
                <Link href="/companies">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#f26b38]">
                    Xem tất cả công ty
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}