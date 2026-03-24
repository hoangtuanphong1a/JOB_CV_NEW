import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function BlogDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <article className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
              {/* Featured Image */}
              <div className="relative h-96">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1722149493669-30098ef78f9f?w=1200"
                  alt="Blog post"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                <div className="mb-6">
                  <Badge className="mb-4">Kỹ năng</Badge>
                  <h1 className="text-3xl lg:text-4xl mb-4">
                    10 Kỹ năng mềm quan trọng giúp bạn thành công trong công việc
                  </h1>
                  <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>25/11/2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>5 phút đọc</span>
                    </div>
                  </div>
                </div>

                {/* Article Body */}
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 mb-6">
                    Trong thế giới công việc hiện đại, kỹ năng mềm đang ngày càng trở nên quan trọng không kém gì kỹ năng chuyên môn. 
                    Dưới đây là 10 kỹ năng mềm thiết yếu mà mọi chuyên gia cần phát triển để thành công trong sự nghiệp.
                  </p>

                  <h2 className="text-2xl mb-4 mt-8">1. Kỹ năng giao tiếp</h2>
                  <p className="text-gray-700 mb-6">
                    Khả năng truyền đạt ý tưởng rõ ràng, lắng nghe tích cực và thấu hiểu người khác là nền tảng của mọi mối quan hệ 
                    công việc thành công. Giao tiếp hiệu quả giúp bạn xây dựng lòng tin và hợp tác tốt hơn với đồng nghiệp.
                  </p>

                  <h2 className="text-2xl mb-4 mt-8">2. Làm việc nhóm</h2>
                  <p className="text-gray-700 mb-6">
                    Trong môi trường làm việc ngày nay, hầu hết các dự án đều yêu cầu sự phối hợp giữa nhiều người. 
                    Khả năng làm việc nhóm hiệu quả bao gồm chia sẻ trách nhiệm, hỗ trợ đồng nghiệp và đóng góp 
                    vào mục tiêu chung của nhóm.
                  </p>

                  <h2 className="text-2xl mb-4 mt-8">3. Giải quyết vấn đề</h2>
                  <p className="text-gray-700 mb-6">
                    Nhà tuyển dụng đánh giá cao những ứng viên có khả năng phân tích tình huống, xác định vấn đề 
                    và đưa ra giải pháp sáng tạo. Kỹ năng này thể hiện tư duy logic và khả năng xử lý khủng hoảng.
                  </p>

                  <h2 className="text-2xl mb-4 mt-8">4. Quản lý thời gian</h2>
                  <p className="text-gray-700 mb-6">
                    Biết cách ưu tiên công việc, lập kế hoạch hiệu quả và tuân thủ deadline là những yếu tố quan trọng 
                    để tăng năng suất và giảm stress trong công việc.
                  </p>

                  <h2 className="text-2xl mb-4 mt-8">5. Thích nghi và linh hoạt</h2>
                  <p className="text-gray-700 mb-6">
                    Trong môi trường kinh doanh thay đổi nhanh chóng, khả năng thích nghi với hoàn cảnh mới, 
                    học hỏi công nghệ mới và linh hoạt trong cách làm việc là vô cùng quan trọng.
                  </p>
                </div>

                {/* Share Section */}
                <div className="flex items-center gap-4 pt-8 mt-8 border-t">
                  <span className="text-gray-600">Chia sẻ:</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Posts */}
            <Card className="p-6">
              <h3 className="text-xl mb-6">Bài viết liên quan</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-video rounded-lg overflow-hidden mb-3">
                      <ImageWithFallback
                        src={`https://images.unsplash.com/photo-${i === 1 ? '1693045181178-d5d83fb070c8' : '1758520144426-edf40a58f299'}?w=600`}
                        alt="Related post"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-lg mb-2 group-hover:text-[#f26b38] transition-colors">
                      {i === 1 ? "Cách viết CV xin việc ấn tượng" : "Bí quyết phỏng vấn thành công"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {i === 1 ? "7 phút đọc" : "8 phút đọc"}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
