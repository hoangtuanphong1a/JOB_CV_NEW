import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// UI Components
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// Icons
import { Eye, Download, Star, TrendingUp } from "lucide-react";

interface CVTemplate {
  id: string;
  name: string;
  category: "professional" | "modern" | "creative";
  rating: number;
  thumbnail: string;
  isFree: boolean;
  previewUrl: string;
  downloadUrl: string;
}

interface CVCardProps {
  template: CVTemplate;
  delay?: number;
}

const CVCard: React.FC<CVCardProps> = ({ template, delay = 0 }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "professional":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "modern":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "creative":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "professional":
        return "Chuyên nghiệp";
      case "modern":
        return "Hiện đại";
      case "creative":
        return "Sáng tạo";
      default:
        return "Khác";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-200">
        
        {/* Image Container */}
        <div className="relative h-80 md:h-96 lg:h-[420px] xl:h-[480px] overflow-hidden">
          <img
            src="https://www.topcv.vn/cv/snapshot/template-cv/mau-cv-an-tuong-6-_VlJVBQcNCQgBBVdWAgMCVQFTUAYPVgBUCVNRAQb0f5.webp?t=1756435041&color=574040&template_name=impressive_6_v2&lang=vi"
            alt={template.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-3">
              <Link href={`/cv-template/${template.id}`}>
                <Button 
                  variant="secondary" 
                  className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 min-w-[130px] px-4 py-2"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Xem trước
                </Button>
              </Link>
              <Link href={`/cv-template/${template.id}`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px] px-4 py-2">
                  <Download className="w-4 h-4 mr-2" />
                  Sử dụng mẫu
                </Button>
              </Link>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={`${getCategoryColor(template.category)} text-xs font-medium px-2 py-1`}>
              {getCategoryLabel(template.category)}
            </Badge>
          </div>

          {/* Free Badge */}
          {template.isFree && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-medium px-2 py-1">
                Miễn phí
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {template.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{template.rating}</span>
            </div>
            <span className="text-xs text-gray-500">(124 đánh giá)</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href={`/cv-template/${template.id}`}>
              <Button 
                variant="outline" 
                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem trước
              </Button>
            </Link>
            <Link href={`/cv-template/${template.id}`}>
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                <Download className="w-4 h-4 mr-2" />
                Sử dụng mẫu
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hover Shadow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default CVCard;