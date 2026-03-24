import { Button } from "./ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function BlogHero() {
  return (
    <section className="relative min-h-[500px] lg:min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80"
          alt="Blog background"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 h-full">
        <div className="flex items-center min-h-[500px] lg:min-h-[600px]">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm">Blog & Cẩm nang nghề nghiệp</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Khám phá kiến thức
              <br />
              <span className="text-[#f26b38]">chuyên sâu về sự nghiệp</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              Chia sẻ kiến thức, kinh nghiệm và xu hướng mới nhất về tuyển dụng,
              phát triển sự nghiệp và thị trường lao động Việt Nam.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-[#f26b38] hover:bg-[#e05a27] group"
              >
                Khám phá bài viết
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Đăng ký newsletter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
