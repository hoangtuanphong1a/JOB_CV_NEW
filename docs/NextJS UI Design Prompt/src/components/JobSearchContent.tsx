import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Bookmark, 
  DollarSign, 
  Briefcase, 
  Clock,
  ChevronDown
} from "lucide-react";
import { JobSearchHero } from "./JobSearchHero";

const jobs = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "TechViet Solutions",
    location: "Hà Nội",
    salary: "30-45 triệu",
    type: "Full-time",
    level: "Senior",
    tags: ["ReactJS", "NodeJS", "AWS"],
    posted: "2 giờ trước",
    saved: false,
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Creative Hub",
    location: "Hồ Chí Minh",
    salary: "18-25 triệu",
    type: "Full-time",
    level: "Middle",
    tags: ["Figma", "Adobe XD", "Prototyping"],
    posted: "5 giờ trước",
    saved: true,
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Startup Innovation",
    location: "Hà Nội",
    salary: "35-50 triệu",
    type: "Full-time",
    level: "Senior",
    tags: ["Agile", "Scrum", "Product Strategy"],
    posted: "1 ngày trước",
    saved: false,
  },
  {
    id: 4,
    title: "Backend Engineer",
    company: "FinTech Pro",
    location: "Đà Nẵng",
    salary: "22-32 triệu",
    type: "Full-time",
    level: "Middle",
    tags: ["Python", "Django", "PostgreSQL"],
    posted: "1 ngày trước",
    saved: false,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Cloud Systems",
    location: "Remote",
    salary: "28-40 triệu",
    type: "Remote",
    level: "Senior",
    tags: ["Docker", "Kubernetes", "CI/CD"],
    posted: "2 ngày trước",
    saved: true,
  },
  {
    id: 6,
    title: "Marketing Manager",
    company: "Growth Agency",
    location: "Hồ Chí Minh",
    salary: "25-35 triệu",
    type: "Full-time",
    level: "Senior",
    tags: ["Digital Marketing", "SEO", "Analytics"],
    posted: "2 ngày trước",
    saved: false,
  },
];

const jobTypes = ["Full-time", "Part-time", "Remote", "Contract", "Internship"];
const experienceLevels = ["Intern", "Junior", "Middle", "Senior", "Lead"];
const skills = ["ReactJS", "NodeJS", "Python", "Java", "AWS", "Docker", "Figma", "UI/UX"];

export function JobSearchContent() {
  const [showFilters, setShowFilters] = useState(true);
  const [salaryRange, setSalaryRange] = useState([10, 50]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <JobSearchHero />
      
      {/* Main Content */}
      <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg">Bộ lọc</h2>
                <Button variant="ghost" size="sm" className="text-[#f26b38] hover:text-[#e05a27]">
                  Xóa tất cả
                </Button>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <h3 className="text-sm text-gray-600 mb-3">Loại công việc</h3>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <Checkbox className="data-[state=checked]:bg-[#f26b38] data-[state=checked]:border-[#f26b38]" />
                      <span className="text-sm text-gray-700 group-hover:text-[#f26b38]">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <h3 className="text-sm text-gray-600 mb-3">Cấp bậc</h3>
                <div className="space-y-2">
                  {experienceLevels.map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer group">
                      <Checkbox className="data-[state=checked]:bg-[#f26b38] data-[state=checked]:border-[#f26b38]" />
                      <span className="text-sm text-gray-700 group-hover:text-[#f26b38]">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <h3 className="text-sm text-gray-600 mb-3">Mức lương (triệu VNĐ)</h3>
                <div className="px-2">
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    min={0}
                    max={100}
                    step={5}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{salaryRange[0]} triệu</span>
                    <span>{salaryRange[1]} triệu</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-sm text-gray-600 mb-3">Kỹ năng</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      className="px-3 py-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-full text-xs text-gray-700 hover:text-[#f26b38] transition-colors"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Job Listings */}
          <div>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                Tìm thấy <span className="text-gray-900">247</span> việc làm
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-[#f26b38]"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
                <select className="bg-white border border-gray-200 text-gray-700 rounded-lg px-3 py-2 text-sm">
                  <option>Mới nhất</option>
                  <option>Lương cao nhất</option>
                  <option>Liên quan nhất</option>
                </select>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="p-6 bg-white hover:border-[#f26b38] hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex gap-4">
                    {/* Company Logo */}
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 border border-gray-200 flex-shrink-0"></div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg mb-1 group-hover:text-[#f26b38] transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                        <button className={`${job.saved ? 'text-[#f26b38]' : 'text-gray-400'} hover:text-[#f26b38] transition-colors`}>
                          <Bookmark className={`h-5 w-5 ${job.saved ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                          <Clock className="h-3 w-3" />
                          <span>{job.posted}</span>
                        </div>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="hidden md:flex items-center">
                      <Button variant="outline" className="border-[#f26b38] text-[#f26b38] hover:bg-orange-50">
                        Ứng tuyển
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Apply Button */}
                  <div className="md:hidden mt-4 pt-4 border-t">
                    <Button className="w-full bg-[#f26b38] hover:bg-[#e05a27]">
                      Ứng tuyển ngay
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="sm">
                Trước
              </Button>
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? "default" : "outline"}
                  size="sm"
                  className={page === 1 ? "bg-[#f26b38] hover:bg-[#e05a27]" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button variant="outline" size="sm">
                Sau
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}