import React from "react";
import { motion } from "framer-motion";

const CVHero: React.FC = () => {
  return (
    <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Tất cả các mẫu CV miễn phí
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
          >
            Khám phá bộ sưu tập mẫu CV chuyên nghiệp, hiện đại và sáng tạo. 
            Tùy chỉnh dễ dàng, tải về nhanh chóng, giúp bạn nổi bật trong mắt nhà tuyển dụng.
          </motion.p>


        </div>
      </div>
    </section>
  );
};

export default CVHero;