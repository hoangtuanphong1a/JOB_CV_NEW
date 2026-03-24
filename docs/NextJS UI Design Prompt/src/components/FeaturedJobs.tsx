import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Bookmark, MapPin, DollarSign, Clock, Briefcase } from "lucide-react";

const jobs = [
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
    logo: "https://images.unsplash.com/photo-1629904888132-038af9df34ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29tcGFueSUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjQzMzk2NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true,
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
    logo: "https://images.unsplash.com/photo-1760611656007-f767a8082758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBtZWV0aW5nfGVufDF8fHx8MTc2NDI2MjExN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true,
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
    logo: "https://images.unsplash.com/photo-1624555130858-7ea5b8192c49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwdGVhbSUyMHdvcmtpbmd8ZW58MXx8fHwxNzY0MjgyMzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
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
    logo: "https://images.unsplash.com/photo-1598520106830-8c45c2035460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGlubm92YXRpb258ZW58MXx8fHwxNzY0MjkzMTE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true,
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
    logo: "https://images.unsplash.com/photo-1722149493669-30098ef78f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjYXJlZXJ8ZW58MXx8fHwxNzY0MzM5NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
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
    logo: "https://images.unsplash.com/photo-1589979034086-5885b60c8f59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMG9mZmljZXxlbnwxfHx8fDE3NjQzMzA3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false,
  },
];

export function FeaturedJobs() {
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
          <Button variant="outline" className="hidden md:flex">
            Xem tất cả
          </Button>
        </div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-xl transition-shadow duration-300 group relative">
              {/* Featured Badge */}
              {job.featured && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-[#f26b38] to-[#e05a27] text-white border-0">
                    ⭐ Nổi bật
                  </Badge>
                </div>
              )}

              {/* Company Logo & Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border">
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg mb-1 group-hover:text-[#f26b38] transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                <button className="text-gray-400 hover:text-[#f26b38] transition-colors">
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>

              {/* Job Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 flex-shrink-0" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4 flex-shrink-0" />
                  <span>{job.type} • {job.level}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{job.posted}</span>
                </div>
                <Button size="sm" variant="ghost" className="text-[#f26b38] hover:text-[#e05a27] hover:bg-orange-50">
                  Ứng tuyển
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" className="w-full">
            Xem tất cả việc làm
          </Button>
        </div>
      </div>
    </section>
  );
}
