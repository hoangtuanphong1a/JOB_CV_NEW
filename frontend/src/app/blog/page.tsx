"use client";

import React, { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  Calendar,
  Clock,
  Eye,
  Share2,
  Heart,
  MessageCircle,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Static blog posts data
const staticBlogPosts = [
  {
    id: "1",
    slug: "10-ky-nang-mem-quan-trong-giup-ban-thanh-cong-trong-cong-viec",
    title: "10 Kỹ năng mềm quan trọng giúp bạn thành công trong công việc",
    content: `
      <h2>Giới thiệu</h2>
      <p>Trong thời đại số hóa ngày nay, kỹ năng mềm đóng vai trò quan trọng không kém gì kỹ năng chuyên môn. Những kỹ năng này không chỉ giúp bạn hoàn thành công việc tốt hơn mà còn tạo nền tảng cho sự phát triển nghề nghiệp lâu dài.</p>

      <h2>1. Kỹ năng giao tiếp</h2>
      <p>Kỹ năng giao tiếp hiệu quả là nền tảng của mọi mối quan hệ trong công việc. Bạn cần biết cách truyền đạt ý tưởng rõ ràng, lắng nghe tích cực và thích ứng với phong cách giao tiếp của đồng nghiệp.</p>

      <h2>2. Tư duy phản biện</h2>
      <p>Khả năng phân tích thông tin, đánh giá các lựa chọn và đưa ra quyết định sáng suốt là yếu tố then chốt để thành công trong bất kỳ lĩnh vực nào.</p>

      <h2>3. Quản lý thời gian</h2>
      <p>Biết cách ưu tiên công việc, phân bổ thời gian hợp lý và đáp ứng deadline là kỹ năng thiết yếu trong môi trường làm việc hiện đại.</p>

      <h2>4. Làm việc nhóm</h2>
      <p>Khả năng hợp tác hiệu quả với đồng nghiệp, tôn trọng ý kiến khác nhau và đóng góp tích cực cho mục tiêu chung của nhóm.</p>

      <h2>5. Giải quyết vấn đề</h2>
      <p>Khả năng xác định vấn đề, phân tích nguyên nhân và tìm ra giải pháp phù hợp là kỹ năng quan trọng trong mọi lĩnh vực.</p>

      <h2>Kết luận</h2>
      <p>Việc phát triển kỹ năng mềm cần thời gian và sự kiên trì. Hãy bắt đầu từ những kỹ năng cơ bản và dần dần nâng cao để đạt được mục tiêu nghề nghiệp của mình.</p>
    `,
    excerpt: "Khám phá những kỹ năng thiết yếu mà mọi chuyên gia cần có để phát triển sự nghiệp trong thời đại số...",
    featuredImage: "https://images.unsplash.com/photo-1722149493669-30098ef78f9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjYXJlZXJ8ZW58MXx8fHwxNzY0MzM5NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Chuyên gia phát triển sự nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực tuyển dụng."
    },
    tags: ["Kỹ năng mềm", "Phát triển sự nghiệp", "Giao tiếp"],
    viewCount: 1250,
    likeCount: 89,
    commentCount: 24,
    publishedAt: "2024-11-25T00:00:00Z",
    readingTime: 5
  },
  {
    id: "2",
    slug: "cach-viet-cv-xin-viec-an-tuong-thu-hut-nha-tuyen-dung",
    title: "Cách viết CV xin việc ấn tượng thu hút nhà tuyển dụng",
    content: `
      <h2>Lý do CV quan trọng</h2>
      <p>CV là lá thư giới thiệu đầu tiên của bạn với nhà tuyển dụng. Một CV ấn tượng có thể tạo nên sự khác biệt giữa việc được mời phỏng vấn hay bị loại ngay từ vòng đầu.</p>

      <h2>Cấu trúc CV chuẩn</h2>
      <p>Một CV chuẩn thường bao gồm các phần: Thông tin cá nhân, Mục tiêu nghề nghiệp, Học vấn, Kinh nghiệm làm việc, Kỹ năng và Sở thích.</p>

      <h2>Lưu ý quan trọng</h2>
      <ul>
        <li>Sử dụng ngôn ngữ hành động (action verbs)</li>
        <li>Định lượng thành tích khi có thể</li>
        <li>Giữ CV ngắn gọn, súc tích</li>
        <li>Chú ý đến format và layout</li>
      </ul>

      <h2>Mẹo để CV nổi bật</h2>
      <p>Hãy tùy chỉnh CV cho từng vị trí ứng tuyển, sử dụng từ khóa phù hợp và đảm bảo CV phản ánh đúng giá trị bạn mang lại cho công ty.</p>

      <h2>Kết luận</h2>
      <p>Viết CV là nghệ thuật kể chuyện về bản thân. Hãy đầu tư thời gian để tạo ra một CV chuyên nghiệp và ấn tượng để tạo ấn tượng tốt với nhà tuyển dụng.</p>
    `,
    excerpt: "Hướng dẫn chi tiết từng bước tạo một bản CV chuyên nghiệp, nổi bật và tăng cơ hội được nhận vào làm...",
    featuredImage: "https://images.unsplash.com/photo-1598520106830-8c45c2035460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGlubm92YXRpb258ZW58MXx8fHwxNzY0MjkzMTE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Chuyên gia phát triển sự nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực tuyển dụng."
    },
    tags: ["CV", "Tuyển dụng", "Phỏng vấn"],
    viewCount: 2150,
    likeCount: 156,
    commentCount: 42,
    publishedAt: "2024-11-23T00:00:00Z",
    readingTime: 7
  },
  {
    id: "3",
    slug: "xu-huong-tuyen-dung-it-nam-2024-nhung-vi-tri-hot-nhat",
    title: "Xu hướng tuyển dụng IT năm 2024: Những vị trí hot nhất",
    content: `
      <h2>Thị trường IT Việt Nam 2024</h2>
      <p>Năm 2024 chứng kiến sự bùng nổ của thị trường công nghệ thông tin với nhu cầu tuyển dụng tăng cao và mức lương cạnh tranh.</p>

      <h2>Các vị trí hot nhất</h2>
      <p>AI Engineer, Cloud Architect, Cybersecurity Specialist, Full-stack Developer và Data Scientist là những vị trí được săn đón nhất.</p>

      <h2>Kỹ năng cần thiết</h2>
      <p>Ngoài kiến thức chuyên môn, các công ty đang tìm kiếm ứng viên có khả năng làm việc nhóm, tư duy phản biện và khả năng học hỏi liên tục.</p>

      <h2>Dự báo tương lai</h2>
      <p>Xu hướng số hóa sẽ tiếp tục thúc đẩy nhu cầu tuyển dụng IT, đặc biệt trong lĩnh vực AI, Blockchain và Cloud Computing.</p>

      <h2>Lời khuyên cho ứng viên</h2>
      <p>Hãy liên tục cập nhật kiến thức, tham gia các dự án thực tế và xây dựng portfolio để tăng cơ hội việc làm trong lĩnh vực IT đầy cạnh tranh.</p>
    `,
    excerpt: "Phân tích thị trường lao động IT Việt Nam và dự báo những công nghệ, vị trí việc làm được săn đón nhất...",
    featuredImage: "https://images.unsplash.com/photo-1624555130858-7ea5b8192c49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwdGVhbSUyMHdvcmtpbmd8ZW58MXx8fHwxNzY0MjgyMzAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Chuyên gia phát triển sự nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực tuyển dụng."
    },
    tags: ["IT", "Tuyển dụng", "Xu hướng"],
    viewCount: 1890,
    likeCount: 134,
    commentCount: 38,
    publishedAt: "2024-11-20T00:00:00Z",
    readingTime: 6
  },
  {
    id: "4",
    slug: "cach-viet-cv-an-tuong-de-gay-chu-y-voi-nha-tuyen-dung",
    title: "Cách viết CV ấn tượng để gây chú ý với nhà tuyển dụng",
    content: `
      <h2>Tầm quan trọng của CV trong quá trình ứng tuyển</h2>
      <p>CV là công cụ marketing bản thân đầu tiên mà bạn gửi đến nhà tuyển dụng. Một CV ấn tượng không chỉ giúp bạn vượt qua vòng lọc sơ loại mà còn tạo ấn tượng tốt ngay từ đầu.</p>

      <h2>Nguyên tắc cơ bản khi viết CV</h2>
      <p>CV cần được thiết kế chuyên nghiệp, dễ đọc và tập trung vào những thông tin quan trọng nhất. Hãy sử dụng ngôn ngữ hành động và định lượng thành tích khi có thể.</p>

      <h2>Cấu trúc CV hiệu quả</h2>
      <ul>
        <li><strong>Thông tin cá nhân:</strong> Họ tên, thông tin liên hệ, LinkedIn profile</li>
        <li><strong>Tóm tắt chuyên nghiệp:</strong> Giới thiệu ngắn gọn về bản thân</li>
        <li><strong>Kinh nghiệm làm việc:</strong> Liệt kê theo thứ tự thời gian, tập trung vào thành tích</li>
        <li><strong>Học vấn:</strong> Bằng cấp, chứng chỉ liên quan</li>
        <li><strong>Kỹ năng:</strong> Phân chia theo nhóm và mức độ thành thạo</li>
      </ul>

      <h2>Lỗi phổ biến cần tránh</h2>
      <p>Tránh viết CV quá dài, sử dụng font chữ lạ, hoặc đưa thông tin cá nhân không liên quan. Hãy tùy chỉnh CV cho từng vị trí ứng tuyển.</p>

      <h2>Mẹo để CV nổi bật</h2>
      <p>Sử dụng từ khóa phù hợp với ngành nghề, thêm portfolio hoặc dự án cá nhân, và đảm bảo CV được kiểm tra lỗi chính tả kỹ lưỡng.</p>

      <h2>Kết luận</h2>
      <p>Viết CV là quá trình kể chuyện về hành trình nghề nghiệp của bạn. Hãy đầu tư thời gian để tạo ra một CV phản ánh đúng giá trị và tiềm năng của bạn.</p>
    `,
    excerpt: "Hướng dẫn đầy đủ cách tạo CV ấn tượng, chuyên nghiệp để thu hút sự chú ý của nhà tuyển dụng từ cái nhìn đầu tiên...",
    featuredImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXN1bWV8ZW58MXx8fHwxNzY0MzM5NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    author: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Chuyên gia phát triển sự nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực tuyển dụng."
    },
    tags: ["CV", "Tuyển dụng", "Phát triển sự nghiệp"],
    viewCount: 2450,
    likeCount: 198,
    commentCount: 67,
    publishedAt: "2024-11-18T00:00:00Z",
    readingTime: 8
  },
  {
    id: "5",
    slug: "bi-quyet-phong-van-thanh-cong-trong-thoi-dai-so",
    title: "Bí quyết phỏng vấn thành công trong thời đại số",
    content: `
      <h2>Xu hướng phỏng vấn trực tuyến</h2>
      <p>Với sự phát triển của công nghệ, phỏng vấn trực tuyến đã trở thành phương thức phổ biến. Việc chuẩn bị kỹ lưỡng cho các cuộc phỏng vấn online là yếu tố quyết định thành công.</p>

      <h2>Chuẩn bị kỹ thuật</h2>
      <p>Đảm bảo kết nối internet ổn định, chọn không gian yên tĩnh, kiểm tra camera và micro. Sử dụng nền tảng phỏng vấn chuyên nghiệp và làm quen với các tính năng.</p>

      <h2>Nội dung chuẩn bị</h2>
      <p>Nghiên cứu kỹ về công ty, chuẩn bị câu trả lời cho các câu hỏi thường gặp, và chuẩn bị câu hỏi để hỏi nhà tuyển dụng. Luyện tập trước gương hoặc với bạn bè.</p>

      <h2>Thể hiện bản thân</h2>
      <p>Mặc trang phục chuyên nghiệp, duy trì giao tiếp bằng mắt, thể hiện sự nhiệt tình và tự tin. Sử dụng ngôn ngữ cơ thể tích cực và trả lời rõ ràng, logic.</p>

      <h2>Câu hỏi thường gặp</h2>
      <ul>
        <li>"Hãy kể về bản thân"</li>
        <li>"Điểm mạnh/yếu của bạn là gì?"</li>
        <li>"Tại sao bạn muốn làm việc ở đây?"</li>
        <li>"Bạn thấy mình trong 5 năm tới như thế nào?"</li>
      </ul>

      <h2>Sau phỏng vấn</h2>
      <p>Gửi email cảm ơn, theo dõi kết quả và học hỏi từ trải nghiệm để cải thiện lần sau.</p>

      <h2>Kết luận</h2>
      <p>Phỏng vấn thành công đòi hỏi sự chuẩn bị kỹ lưỡng và sự tự tin. Hãy luôn học hỏi và cải thiện kỹ năng phỏng vấn của mình.</p>
    `,
    excerpt: "Hướng dẫn đầy đủ cách chuẩn bị và thực hiện phỏng vấn trực tuyến thành công trong kỷ nguyên số hóa...",
    featuredImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwaW50ZXJ2aWV3fGVufDF8fHx8MTc2NDMzOTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    author: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Chuyên gia phát triển sự nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực tuyển dụng."
    },
    tags: ["Phỏng vấn", "Tuyển dụng", "Kỹ năng mềm"],
    viewCount: 3120,
    likeCount: 245,
    commentCount: 89,
    publishedAt: "2024-11-15T00:00:00Z",
    readingTime: 10
  },
  {
    id: "6",
    slug: "xay-dung-thuong-hieu-ca-nhan-tren-linkedin",
    title: "Xây dựng thương hiệu cá nhân trên LinkedIn",
    content: `
      <h2>Tầm quan trọng của Personal Branding</h2>
      <p>Trong thời đại số hóa, thương hiệu cá nhân đóng vai trò quan trọng trong sự nghiệp. LinkedIn là nền tảng lý tưởng để xây dựng và phát triển thương hiệu cá nhân của bạn.</p>

      <h2>Hồ sơ LinkedIn chuyên nghiệp</h2>
      <p>Ảnh đại diện chuyên nghiệp, tiêu đề hấp dẫn, tóm tắt cá nhân ấn tượng và kinh nghiệm làm việc chi tiết là những yếu tố cơ bản để tạo ấn tượng tốt.</p>

      <h2>Chiến lược nội dung</h2>
      <p>Chia sẻ kiến thức chuyên môn, bình luận về xu hướng ngành, kết nối với cộng đồng và tham gia các cuộc thảo luận để tăng visibility và credibility.</p>

      <h2>Mạng lưới quan hệ</h2>
      <p>Kết nối có chọn lọc với các chuyên gia trong ngành, tham gia nhóm chuyên ngành và tương tác tích cực với mạng lưới của bạn.</p>

      <h2>Xây dựng uy tín</h2>
      <p>Viết bài đăng chất lượng, chia sẻ thành tựu, nhận endorsements và recommendations. Tham gia các khóa học để nâng cao kỹ năng.</p>

      <h2>Đo lường và điều chỉnh</h2>
      <p>Theo dõi các chỉ số như số lượng kết nối, tương tác, và điều chỉnh chiến lược dựa trên kết quả để tối ưu hóa hiệu quả.</p>

      <h2>Kết luận</h2>
      <p>Xây dựng thương hiệu cá nhân là quá trình lâu dài đòi hỏi sự kiên trì và nhất quán. Hãy bắt đầu ngay hôm nay để tạo dựng vị thế của bạn trong ngành.</p>
    `,
    excerpt: "Hướng dẫn chi tiết cách xây dựng và phát triển thương hiệu cá nhân chuyên nghiệp trên LinkedIn...",
    featuredImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW5kaW4lMjBwcm9maWxlfGVufDF8fHx8MTc2NDMzOTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    author: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Chuyên gia phát triển sự nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực tuyển dụng."
    },
    tags: ["LinkedIn", "Personal Branding", "Mạng xã hội"],
    viewCount: 2780,
    likeCount: 312,
    commentCount: 124,
    publishedAt: "2024-11-12T00:00:00Z",
    readingTime: 9
  },
  {
    id: "7",
    slug: "quan-ly-thoi-gian-hieu-qua-cho-nguoi-di-lam",
    title: "Quản lý thời gian hiệu quả cho người đi làm",
    content: `
      <h2>Tầm quan trọng của quản lý thời gian</h2>
      <p>Trong môi trường làm việc cạnh tranh ngày nay, khả năng quản lý thời gian hiệu quả không chỉ giúp bạn hoàn thành công việc mà còn tạo điều kiện để phát triển cá nhân và sự nghiệp.</p>

      <h2>Đánh giá thời gian hiện tại</h2>
      <p>Bước đầu tiên là theo dõi cách bạn sử dụng thời gian trong một tuần. Ghi chép lại các hoạt động để xác định những khoảng thời gian bị lãng phí.</p>

      <h2>Thiết lập ưu tiên</h2>
      <p>Sử dụng ma trận Eisenhower để phân loại công việc theo mức độ quan trọng và urgent. Tập trung vào những nhiệm vụ quan trọng nhưng không urgent để phát triển lâu dài.</p>

      <h2>Kỹ thuật quản lý thời gian</h2>
      <ul>
        <li><strong>Pomodoro Technique:</strong> Làm việc tập trung 25 phút, nghỉ 5 phút</li>
        <li><strong>Time Blocking:</strong> Phân bổ thời gian cụ thể cho từng nhiệm vụ</li>
        <li><strong>Two-Minute Rule:</strong> Nếu việc mất dưới 2 phút, làm ngay</li>
        <li><strong>Eat the Frog:</strong> Làm việc khó nhất trước tiên</li>
      </ul>

      <h2>Công cụ hỗ trợ</h2>
      <p>Sử dụng ứng dụng như Todoist, Trello, Notion hoặc Google Calendar để lên kế hoạch và theo dõi tiến độ. Đồng bộ hóa giữa các thiết bị để truy cập mọi lúc.</p>

      <h2>Tránh phân tâm</h2>
      <p>Tắt thông báo, tạo không gian làm việc yên tĩnh, và học cách từ chối những yêu cầu không cần thiết để tập trung vào mục tiêu chính.</p>

      <h2>Cân bằng cuộc sống</h2>
      <p>Quản lý thời gian hiệu quả không chỉ cho công việc mà còn cho cuộc sống cá nhân. Đừng quên dành thời gian cho gia đình, sức khỏe và sở thích.</p>

      <h2>Kết luận</h2>
      <p>Quản lý thời gian là kỹ năng có thể học được. Hãy bắt đầu với những thay đổi nhỏ và kiên trì áp dụng để thấy sự khác biệt trong cuộc sống và sự nghiệp.</p>
    `,
    excerpt: "Hướng dẫn chi tiết các phương pháp và kỹ thuật quản lý thời gian hiệu quả cho người đi làm trong môi trường cạnh tranh...",
    featuredImage: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aW1lJTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3NjQzMzk2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    author: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Chuyên gia phát triển sự nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực tuyển dụng."
    },
    tags: ["Quản lý thời gian", "Hiệu suất", "Sản xuất"],
    viewCount: 1980,
    likeCount: 167,
    commentCount: 56,
    publishedAt: "2024-11-10T00:00:00Z",
    readingTime: 7
  },
  {
    id: "8",
    slug: "xu-huong-tuyen-dung-2025-ai-va-cong-nghe-moi",
    title: "Xu hướng tuyển dụng 2025: AI và công nghệ mới",
    content: `
      <h2>Thị trường lao động 2025</h2>
      <p>Năm 2025 chứng kiến sự thay đổi mạnh mẽ trong thị trường lao động với sự trỗi dậy của AI và các công nghệ mới. Các nhà tuyển dụng đang tìm kiếm những kỹ năng phù hợp với tương lai.</p>

      <h2>Vai trò của AI trong tuyển dụng</h2>
      <p>AI không chỉ thay thế con người mà còn bổ sung và nâng cao hiệu quả tuyển dụng. Các công cụ AI giúp sàng lọc CV, phỏng vấn sơ loại và dự đoán phù hợp ứng viên.</p>

      <h2>Kỹ năng AI quan trọng</h2>
      <ul>
        <li><strong>Prompt Engineering:</strong> Viết prompt hiệu quả cho AI</li>
        <li><strong>Machine Learning:</strong> Hiểu và áp dụng ML cơ bản</li>
        <li><strong>Data Analysis:</strong> Phân tích dữ liệu với AI</li>
        <li><strong>AI Ethics:</strong> Hiểu đạo đức trong AI</li>
        <li><strong>Automation:</strong> Thiết kế quy trình tự động</li>
      </ul>

      <h2>Công nghệ mới nổi</h2>
      <p>Web3, Metaverse, Quantum Computing, Edge Computing và Sustainable Technology là những lĩnh vực đang phát triển mạnh và cần nguồn nhân lực chất lượng cao.</p>

      <h2>Thay đổi trong cách làm việc</h2>
      <p>Mô hình hybrid work, remote-first, và gig economy ngày càng phổ biến. Các kỹ năng mềm như thích ứng thay đổi và học tập liên tục trở nên quan trọng hơn bao giờ hết.</p>

      <h2>Chiến lược phát triển nghề nghiệp</h2>
      <p>Học tập liên tục, cập nhật xu hướng công nghệ, xây dựng portfolio kỹ thuật số và networking trong cộng đồng công nghệ là những bước đi quan trọng.</p>

      <h2>Dự báo ngành nghề</h2>
      <p>Các ngành như AI/ML Engineering, Cloud Architecture, Cybersecurity, Data Science, và UX/UI Design sẽ tiếp tục tăng trưởng mạnh trong những năm tới.</p>

      <h2>Lời khuyên cho người lao động</h2>
      <p>Đừng sợ hãi thay đổi mà hãy chủ động học hỏi. Sự kết hợp giữa kỹ năng kỹ thuật và kỹ năng mềm sẽ tạo nên lợi thế cạnh tranh trong thị trường lao động tương lai.</p>

      <h2>Kết luận</h2>
      <p>Thị trường lao động 2025 đòi hỏi sự linh hoạt và khả năng thích ứng. Những ai sẵn sàng học hỏi và đổi mới sẽ là những người thành công trong kỷ nguyên số.</p>
    `,
    excerpt: "Phân tích xu hướng tuyển dụng 2025 với trọng tâm vào AI, công nghệ mới và những kỹ năng cần thiết cho tương lai...",
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMHRlY2hub2xvZ3xlbnwxfHx8fDE3NjQzMzk2NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    author: {
      id: "1",
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      bio: "Chuyên gia phát triển sự nghiệp với hơn 10 năm kinh nghiệm trong lĩnh vực tuyển dụng."
    },
    tags: ["AI", "Xu hướng", "Công nghệ", "Tuyển dụng"],
    viewCount: 4250,
    likeCount: 387,
    commentCount: 156,
    publishedAt: "2024-11-08T00:00:00Z",
    readingTime: 12
  }
];

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  tags?: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  readingTime?: number;
}

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!resolvedParams.slug) return;

      try {
        setIsLoading(true);
        setError(null);

        const staticPost = staticBlogPosts.find((post) => post.slug === resolvedParams.slug);
        if (staticPost) {
          setBlogPost(staticPost);
        } else {
          throw new Error("Blog post not found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load blog post"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [resolvedParams.slug]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Comment submitted:", commentText);
    setCommentText("");
  };

  const handleShare = (platform: string) => {
    console.log(`Sharing to ${platform}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy bài viết
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push("/blog")}>
            Quay lại trang blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={blogPost.featuredImage}
            alt={blogPost.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        </div>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/blog")}
          className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-sm rounded-full px-4 py-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Quay lại</span>
        </motion.button>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium border border-white/20">
                {blogPost.tags?.[0] || "Blog"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {blogPost.title}
            </h1>

            {blogPost.excerpt && (
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                {blogPost.excerpt}
              </p>
            )}

            <div className="flex items-center justify-center gap-8 text-white/80 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(blogPost.publishedAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{blogPost.readingTime || 5} phút đọc</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>{blogPost.viewCount} lượt xem</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                  {blogPost.author.avatar ? (
                    <img
                      src={blogPost.author.avatar}
                      alt={blogPost.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">
                      {blogPost.author.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-white font-semibold text-lg">
                  {blogPost.author.name}
                </div>
                <div className="text-white/80 text-sm">
                  {blogPost.author.bio}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                onClick={handleLike}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {blogPost.likeCount + (isLiked ? 1 : 0)}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {blogPost.commentCount}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                onClick={handleBookmark}
              >
                <Bookmark
                  className={`h-5 w-5 mr-2 ${
                    isBookmarked ? "fill-blue-500 text-blue-500" : ""
                  }`}
                />
                {isBookmarked ? "Đã lưu" : "Lưu bài"}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                onClick={() => handleShare("facebook")}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Chia sẻ
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center text-white/60">
            <span className="text-sm mb-2">Cuộn để đọc</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
            >
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
            onClick={handleLike}
            className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg backdrop-blur-sm transition-all ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </motion.button>

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9 }}
            onClick={handleBookmark}
            className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg backdrop-blur-sm transition-all ${
              isBookmarked
                ? "bg-blue-500 text-white"
                : "bg-white/80 text-gray-700 hover:bg-blue-500 hover:text-white"
            }`}
          >
            <Bookmark
              className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
            />
          </motion.button>

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.0 }}
            onClick={() => handleShare("facebook")}
            className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-white/80 text-gray-700 hover:bg-blue-600 hover:text-white transition-all backdrop-blur-sm"
          >
            <Share2 className="h-5 w-5" />
          </motion.button>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
              >
                <header className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                      {blogPost.tags?.[0] || "Blog"}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(blogPost.publishedAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {blogPost.readingTime || 5} phút đọc
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {blogPost.title}
                  </h1>

                  {blogPost.excerpt && (
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {blogPost.excerpt}
                    </p>
                  )}
                </header>

                <div
                  className="prose prose-xl prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-orange-200 prose-blockquote:bg-orange-50 prose-blockquote:p-6 prose-blockquote:rounded-lg prose-ul:text-gray-700 prose-ol:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: blogPost.content }}
                />

                <footer className="mt-12 pt-8 border-t border-gray-200">
                  {blogPost.tags && blogPost.tags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Tags:
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {blogPost.tags.map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-gradient-to-r from-orange-50 to-pink-50 text-orange-700 border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                      Thích bài viết này? Hãy chia sẻ!
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-3 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
                        onClick={() => handleShare("facebook")}
                      >
                        <Facebook className="h-5 w-5" />
                        Facebook
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-3 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 transition-all"
                        onClick={() => handleShare("twitter")}
                      >
                        <Twitter className="h-5 w-5" />
                        Twitter
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-3 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
                        onClick={() => handleShare("linkedin")}
                      >
                        <Linkedin className="h-5 w-5" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                </footer>
              </motion.article>

              {showComments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Bình luận ({blogPost.commentCount})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleComment} className="mb-6">
                        <Textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Viết bình luận của bạn..."
                          rows={4}
                          className="mb-4"
                        />
                        <Button
                          type="submit"
                          className="bg-[#f26b38] hover:bg-[#e05a27]"
                        >
                          Đăng bình luận
                        </Button>
                      </form>

                      <Separator className="mb-6" />

                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                            U
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">
                                Nguyễn Văn B
                              </span>
                              <span className="text-xs text-gray-500">
                                2 giờ trước
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              Bài viết rất hữu ích! Cảm ơn tác giả đã chia sẻ.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                            T
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">
                                Trần Thị C
                              </span>
                              <span className="text-xs text-gray-500">
                                5 giờ trước
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              Mình đã áp dụng theo hướng dẫn này và thành công
                              lắm!
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Về tác giả</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={blogPost.author.avatar}
                        alt={blogPost.author.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {blogPost.author.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {blogPost.author.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Đăng ký nhận tin
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Nhận những bài viết mới nhất về tuyển dụng và phát triển
                      nghề nghiệp
                    </p>
                    <div className="space-y-3">
                      <Input placeholder="Nhập email của bạn" />
                      <Button className="w-full bg-[#f26b38] hover:bg-[#e05a27]">
                        Đăng ký
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
