"use client";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Bookmark, MapPin, DollarSign, Clock, Briefcase, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { jobService, Job } from "@/services/jobService";
import { SavedJobsService } from "@/services/savedJobsService";

export function FeaturedJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedJobs();
    loadSavedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      setIsLoading(true);
      // Get featured jobs (recent published jobs with high view count)
      const response = await jobService.getJobs({
        page: 1,
        limit: 6,
        status: 'published'
      });
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await SavedJobsService.getSavedJobs({ page: 1, limit: 100 });
      if (response && response.data && Array.isArray(response.data)) {
        const savedJobIds = new Set(response.data.map(saved => saved.jobId));
        setSavedJobs(savedJobIds);
      } else {
        console.warn('Saved jobs API returned unexpected data structure:', response);
        setSavedJobs(new Set());
      }
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      setSavedJobs(new Set());
    }
  };

  const handleApply = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      if (savedJobs.has(jobId)) {
        await SavedJobsService.unsaveJob(jobId);
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        await SavedJobsService.saveJob(jobId);
        setSavedJobs(prev => new Set([...prev, jobId]));
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      // If not authenticated, redirect to login
      const axiosError = error as { response?: { status: number } };
      if (axiosError?.response?.status === 401) {
        router.push('/auth/login');
      }
    }
  };

  const handleViewAllJobs = () => {
    router.push('/jobs');
  };

  const getJobSalaryDisplay = (job: Job): string => {
    if (job.minSalary && job.maxSalary) {
      return `${job.currency || 'VNĐ'} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`;
    }
    if (job.minSalary) {
      return `Từ ${job.currency || 'VNĐ'} ${job.minSalary.toLocaleString()}`;
    }
    if (job.maxSalary) {
      return `Đến ${job.currency || 'VNĐ'} ${job.maxSalary.toLocaleString()}`;
    }
    return 'Thương lượng';
  };

  const getJobLocation = (job: Job): string => {
    const parts = [job.city, job.state, job.country].filter(Boolean);
    return parts.join(', ') || 'Không xác định';
  };

  const getJobTypeDisplay = (jobType?: string): string => {
    const typeMap: { [key: string]: string } = {
      'full_time': 'Toàn thời gian',
      'part_time': 'Bán thời gian',
      'contract': 'Hợp đồng',
      'freelance': 'Freelance',
      'internship': 'Thực tập',
    };
    return typeMap[jobType || ''] || 'Không xác định';
  };

  const getTimeAgo = (dateString: string): string => {
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

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#f26b38]" />
            <span className="ml-2 text-gray-600">Đang tải việc làm nổi bật...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl mb-2">
              Việc làm nổi bật
            </h2>
            <p className="text-lg text-gray-600">
              Cơ hội nghề nghiệp tốt nhất từ các công ty hàng đầu
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex" onClick={handleViewAllJobs}>
            Xem tất cả
          </Button>
        </div>

        {/* Jobs Grid */}
        {jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-xl transition-shadow duration-300 group relative">
                {/* Company Logo & Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border">
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg mb-1 group-hover:text-[#f26b38] transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600">{job.company?.name}</p>
                  </div>
                  <button
                    onClick={() => handleSaveJob(job.id)}
                    className={`text-gray-400 hover:text-[#f26b38] transition-colors ${
                      savedJobs.has(job.id) ? 'text-[#f26b38]' : ''
                    }`}
                    title={savedJobs.has(job.id) ? 'Bỏ lưu' : 'Lưu việc làm'}
                  >
                    <Bookmark className={`h-5 w-5 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Job Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{getJobLocation(job)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span>{getJobSalaryDisplay(job)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 flex-shrink-0" />
                    <span>{getJobTypeDisplay(job.jobType)}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="text-xs">
                      {skill.name}
                    </Badge>
                  ))}
                  {job.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                  {(job.skills.length + job.tags.length) > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{(job.skills.length + job.tags.length) - 5}
                    </Badge>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{getTimeAgo(job.createdAt)}</span>
                  </div>
                  <Button
                    onClick={() => handleApply(job.id)}
                    size="sm"
                    variant="ghost"
                    className="text-[#f26b38] hover:text-[#e05a27] hover:bg-orange-50"
                  >
                    Ứng tuyển
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có việc làm nào</h3>
            <p className="text-gray-600">Việc làm sẽ xuất hiện khi có nhà tuyển dụng đăng tin.</p>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" className="w-full" onClick={handleViewAllJobs}>
            Xem tất cả việc làm
          </Button>
        </div>
      </div>
    </section>
  );
}
