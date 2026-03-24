import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Users,
  Building2,
  Share2,
  Bookmark,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const relatedJobs = [
  {
    id: 1,
    title: "Senior Backend Developer",
    company: "Tech Solutions",
    salary: "25-35 triệu",
    location: "Hà Nội",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "Innovation Lab",
    salary: "30-40 triệu",
    location: "Hồ Chí Minh",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "Cloud Systems",
    salary: "28-38 triệu",
    location: "Đà Nẵng",
  },
];

export function JobDetailContent() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div>
            {/* Job Header Card */}
            <Card className="p-6 lg:p-8 bg-white mb-6">
              <div className="flex gap-6 mb-6">
                {/* Company Logo */}
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 border border-gray-200 flex-shrink-0"></div>

                {/* Job Title & Company */}
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl mb-2">
                    Senior Frontend Developer
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">TechViet Solutions</p>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Hà Nội</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>30-45 triệu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Full-time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Đăng 2 giờ trước</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-[#f26b38] hover:bg-[#e05a27] flex-1 sm:flex-none">
                  Ứng tuyển ngay
                </Button>
                <Button variant="outline" size="lg" className="border-[#f26b38] text-[#f26b38] hover:bg-orange-50">
                  <Bookmark className="h-5 w-5 mr-2" />
                  Lưu tin
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </Card>

            {/* Job Description */}
            <Card className="p-6 lg:p-8 bg-white mb-6">
              <h2 className="text-xl mb-4">Mô tả công việc</h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  Chúng tôi đang tìm kiếm một Senior Frontend Developer tài năng để tham gia vào đội ngũ phát triển sản phẩm của chúng tôi. 
                  Bạn sẽ có cơ hội làm việc với các công nghệ hiện đại nhất và đóng góp vào việc xây dựng các ứng dụng web quy mô lớn.
                </p>
                <p>
                  Đây là cơ hội tuyệt vời để phát triển kỹ năng, làm việc trong môi trường năng động và 
                  được học hỏi từ những chuyên gia hàng đầu trong ngành.
                </p>
              </div>
            </Card>

            {/* Requirements */}
            <Card className="p-6 lg:p-8 bg-white mb-6">
              <h2 className="text-xl mb-4">Yêu cầu ứng viên</h2>
              <ul className="space-y-3">
                {[
                  "5+ năm kinh nghiệm phát triển Frontend với React",
                  "Thành thạo TypeScript, HTML5, CSS3, và các công cụ build hiện đại",
                  "Kinh nghiệm với Next.js, Redux, và React Query",
                  "Hiểu biết sâu về responsive design và cross-browser compatibility",
                  "Kỹ năng làm việc nhóm tốt và khả năng giao tiếp hiệu quả",
                  "Có kinh nghiệm với testing (Jest, React Testing Library)",
                ].map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-[#f26b38] flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Benefits */}
            <Card className="p-6 lg:p-8 bg-white mb-6">
              <h2 className="text-xl mb-4">Quyền lợi</h2>
              <ul className="space-y-3">
                {[
                  "Mức lương cạnh tranh, thưởng theo hiệu suất",
                  "Bảo hiểm sức khỏe cao cấp cho nhân viên và gia đình",
                  "Làm việc từ xa 2 ngày/tuần",
                  "Ngân sách đào tạo và phát triển kỹ năng",
                  "Các hoạt động team building, du lịch hàng năm",
                  "Môi trường làm việc trẻ trung, sáng tạo",
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-[#f26b38] flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Skills */}
            <Card className="p-6 lg:p-8 bg-white">
              <h2 className="text-xl mb-4">Kỹ năng yêu cầu</h2>
              <div className="flex flex-wrap gap-2">
                {["ReactJS", "TypeScript", "Next.js", "TailwindCSS", "Redux", "Git", "Agile", "REST API"].map(
                  (skill) => (
                    <Badge key={skill} className="bg-orange-100 text-[#f26b38] border border-orange-200 px-4 py-2 hover:bg-orange-200">
                      {skill}
                    </Badge>
                  )
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside>
            {/* Company Card */}
            <Card className="p-6 bg-white mb-6 sticky top-20">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 border border-gray-200 mx-auto mb-4"></div>
                <h3 className="text-lg mb-2">TechViet Solutions</h3>
                <p className="text-sm text-gray-600">Công ty công nghệ hàng đầu</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Users className="h-4 w-4 text-[#f26b38]" />
                  <span className="text-gray-600">500-1000 nhân viên</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-[#f26b38]" />
                  <span className="text-gray-600">Công nghệ thông tin</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-[#f26b38]" />
                  <span className="text-gray-600">Hà Nội, Việt Nam</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-[#f26b38]" />
                  <span className="text-gray-600">Thành lập 2015</span>
                </div>
              </div>

              <Button variant="outline" className="w-full border-[#f26b38] text-[#f26b38] hover:bg-orange-50">
                Xem trang công ty
              </Button>
            </Card>

            {/* Related Jobs */}
            <Card className="p-6 bg-white">
              <h3 className="text-lg mb-4">Việc làm liên quan</h3>
              <div className="space-y-4">
                {relatedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#f26b38] transition-colors cursor-pointer group"
                  >
                    <h4 className="text-sm mb-1 group-hover:text-[#f26b38] transition-colors">
                      {job.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">{job.company}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{job.location}</span>
                      <span>{job.salary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
