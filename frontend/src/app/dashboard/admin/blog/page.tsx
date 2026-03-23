"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  BarChart3,
  MessageSquare,
  ThumbsUp,
  Share2,
  Calendar,
  User,
  Tag,
  BookOpen,
  Clock,
  TrendingUp,
  Users,
  Star,
  Flag
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  status: 'draft' | 'pending' | 'published' | 'rejected' | 'blocked';
  category: string;
  tags: string[];
  views: number;
  likes: number;
  shares: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  pendingPosts: number;
  rejectedPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  topCategories: { name: string; count: number }[];
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  reports: number;
}

export default function AdminBlogManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<BlogStats>({
    totalPosts: 0,
    publishedPosts: 0,
    pendingPosts: 0,
    rejectedPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    topCategories: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Mock data - in real app, this would come from API
      setStats({
        totalPosts: 145,
        publishedPosts: 120,
        pendingPosts: 15,
        rejectedPosts: 10,
        totalViews: 45230,
        totalLikes: 1234,
        totalComments: 567,
        topCategories: [
          { name: "Hướng dẫn sử dụng", count: 35 },
          { name: "Tin tức ngành", count: 28 },
          { name: "Phỏng vấn", count: 22 },
          { name: "Phát triển nghề nghiệp", count: 18 },
          { name: "Công nghệ", count: 15 }
        ]
      });

      setPosts([
        {
          id: "1",
          title: "Hướng dẫn tạo CV chuyên nghiệp 2025",
          content: "Bài viết hướng dẫn chi tiết cách tạo CV...",
          author: "Admin",
          authorRole: "admin",
          status: "published",
          category: "Hướng dẫn sử dụng",
          tags: ["CV", "Tuyển dụng", "Hướng dẫn"],
          views: 1250,
          likes: 45,
          shares: 12,
          comments: 23,
          createdAt: "2025-01-28",
          updatedAt: "2025-01-28",
          publishedAt: "2025-01-28"
        },
        {
          id: "2",
          title: "Xu hướng công nghệ 2025 trong ngành IT",
          content: "Bài viết về xu hướng công nghệ...",
          author: "Tech Corp",
          authorRole: "employer",
          status: "pending",
          category: "Tin tức ngành",
          tags: ["IT", "Công nghệ", "Xu hướng"],
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0,
          createdAt: "2025-01-29",
          updatedAt: "2025-01-29"
        },
        {
          id: "3",
          title: "Bài viết vi phạm quy định",
          content: "Nội dung không phù hợp...",
          author: "User XYZ",
          authorRole: "job_seeker",
          status: "blocked",
          category: "Khác",
          tags: [],
          views: 50,
          likes: 2,
          shares: 0,
          comments: 5,
          createdAt: "2025-01-27",
          updatedAt: "2025-01-27"
        }
      ]);

      setComments([
        {
          id: "1",
          postId: "1",
          author: "Nguyễn Văn A",
          content: "Bài viết rất hữu ích!",
          status: "approved",
          createdAt: "2025-01-28",
          reports: 0
        },
        {
          id: "2",
          postId: "1",
          author: "Trần Thị B",
          content: "Nội dung không phù hợp",
          status: "pending",
          createdAt: "2025-01-29",
          reports: 3
        }
      ]);

    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-700">Đã xuất bản</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ duyệt</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700">Bản nháp</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Từ chối</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-700">Đã khóa</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCommentStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Đã duyệt</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Chờ duyệt</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Từ chối</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePostAction = (postId: string, action: string) => {
    // Handle approve, reject, publish, block, delete actions
    console.log(`Action ${action} for post ${postId}`);
    // In real app, this would call API
  };

  const handleCommentAction = (commentId: string, action: string) => {
    // Handle approve, reject comment actions
    console.log(`Action ${action} for comment ${commentId}`);
    // In real app, this would call API
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải dữ liệu blog...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Quản lý Blog</h1>
              <p className="text-gray-600 mt-1">Quản lý bài viết, duyệt nội dung và thống kê blog.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-[#f26b38] hover:bg-[#e05a27]">
                <Plus className="h-4 w-4 mr-2" />
                Viết bài mới
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+5</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.totalPosts}</div>
              <div className="text-sm text-gray-600">Tổng bài viết</div>
              <div className="text-xs text-green-600 mt-1">{stats.publishedPosts} đã xuất bản</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <Badge className="bg-yellow-100 text-yellow-700">{stats.pendingPosts}</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.pendingPosts}</div>
              <div className="text-sm text-gray-600">Chờ duyệt</div>
              <div className="text-xs text-orange-600 mt-1">Cần xử lý</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+12%</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Tổng lượt xem</div>
              <div className="text-xs text-green-600 mt-1">Tháng này</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <Badge className="bg-blue-100 text-blue-700">{stats.totalComments}</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.totalComments}</div>
              <div className="text-sm text-gray-600">Bình luận</div>
              <div className="text-xs text-blue-600 mt-1">Đã duyệt</div>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="posts">Bài viết</TabsTrigger>
              <TabsTrigger value="comments">Bình luận</TabsTrigger>
              <TabsTrigger value="analytics">Thống kê</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Posts */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Bài viết gần đây</h3>
                  <div className="space-y-4">
                    {posts.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{post.title}</h4>
                          <p className="text-xs text-gray-600 mb-2">Tác giả: {post.author} • {post.createdAt}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" /> {post.comments}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(post.status)}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Top Categories */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Danh mục phổ biến</h3>
                  <div className="space-y-4">
                    {stats.topCategories.map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#f26b38] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge variant="secondary">{category.count} bài</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Pending Actions */}
              <Card className="p-6 border-orange-200 bg-orange-50">
                <h3 className="text-lg font-semibold mb-4 text-orange-700 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Cần xử lý
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium">{stats.pendingPosts} bài viết chờ duyệt</p>
                      <p className="text-sm text-gray-600">Từ Employer và HR</p>
                    </div>
                    <Button size="sm" className="bg-[#f26b38] hover:bg-[#e05a27]">
                      Xem chi tiết
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium">5 bình luận bị báo cáo</p>
                      <p className="text-sm text-gray-600">Cần kiểm tra nội dung</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-6">
              {/* Filters */}
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Tìm kiếm bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Lọc theo trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="published">Đã xuất bản</SelectItem>
                      <SelectItem value="pending">Chờ duyệt</SelectItem>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                      <SelectItem value="rejected">Từ chối</SelectItem>
                      <SelectItem value="blocked">Đã khóa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Posts List */}
              <Card className="p-6">
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author} ({post.authorRole})
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="h-4 w-4" />
                              {post.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {post.createdAt}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" /> {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" /> {post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="h-4 w-4" /> {post.shares}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" /> {post.comments}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(post.status)}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {post.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handlePostAction(post.id, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-600 hover:bg-red-50"
                              onClick={() => handlePostAction(post.id, 'reject')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Từ chối
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Chỉnh sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handlePostAction(post.id, 'delete')}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quản lý bình luận</h3>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium mb-1">{comment.author}</p>
                          <p className="text-gray-700 mb-2">{comment.content}</p>
                          <p className="text-xs text-gray-500">{comment.createdAt}</p>
                          {comment.reports > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <Flag className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-600">{comment.reports} báo cáo</span>
                            </div>
                          )}
                        </div>
                        {getCommentStatusBadge(comment.status)}
                      </div>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-2">
                        {comment.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleCommentAction(comment.id, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-600 hover:bg-red-50"
                              onClick={() => handleCommentAction(comment.id, 'reject')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Từ chối
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleCommentAction(comment.id, 'delete')}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Hiệu suất bài viết
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Lượt xem trung bình</span>
                      <span className="font-semibold">312</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Lượt thích trung bình</span>
                      <span className="font-semibold">8.5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Bình luận trung bình</span>
                      <span className="font-semibold">3.9</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tỷ lệ chia sẻ</span>
                      <span className="font-semibold">2.1%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Thống kê tương tác
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Tổng tương tác</span>
                      <span className="font-semibold">{(stats.totalLikes + stats.totalComments).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Đánh giá trung bình</span>
                      <span className="font-semibold flex items-center gap-1">
                        4.2 <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Thời gian đọc TB</span>
                      <span className="font-semibold">4:32</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
