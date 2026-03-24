import { Button } from "./ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-20 lg:py-28 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-[#f26b38] rounded-full">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">1000+ việc làm mới mỗi ngày</span>
            </div>

            <h1 className="text-4xl lg:text-6xl">
              Tìm công việc
              <br />
              <span className="bg-gradient-to-r from-[#f26b38] to-[#e05a27] bg-clip-text text-transparent">
                mơ ước của bạn
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl">
              Khám phá hàng nghìn cơ hội nghề nghiệp từ các công ty hàng đầu. 
              Tạo CV chuyên nghiệp và ứng tuyển ngay hôm nay.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-[#f26b38] hover:bg-[#e05a27] group">
                Tìm việc ngay
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300">
                Tạo CV miễn phí
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div>
                <div className="text-3xl">10,000+</div>
                <div className="text-sm text-gray-600">Việc làm</div>
              </div>
              <div>
                <div className="text-3xl">5,000+</div>
                <div className="text-sm text-gray-600">Công ty</div>
              </div>
              <div>
                <div className="text-3xl">50,000+</div>
                <div className="text-sm text-gray-600">Ứng viên</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1589979034086-5885b60c8f59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMG9mZmljZXxlbnwxfHx8fDE3NjQzMzA3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Professional workspace"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Ứng tuyển thành công</div>
                  <div>+1,247 hôm nay</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
