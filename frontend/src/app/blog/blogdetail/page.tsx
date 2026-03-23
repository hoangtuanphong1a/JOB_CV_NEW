"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Eye,
  Share2,
  Heart,
  MessageCircle,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Send,
  MoreHorizontal,
  BookOpen,
  Users,
  Star,
  Quote,
  ExternalLink,
  TrendingUp,
  Award,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// API base URL - adjust this based on your environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Type definitions
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
    expertise?: string[];
    followers?: number;
  };
  tags?: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  readingTime?: number;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: string;
  slug: string;
  category?: string;
  readingTime?: number;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

export default function BlogDetailPage() {
  const router = useRouter();

  // State management
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [userLikes, setUserLikes] = useState(0);
  const [activeSection, setActiveSection] = useState('content');

  // Fetch featured blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to fetch a featured blog post first, fallback to first published post
        const response = await fetch(`${API_BASE_URL}/blog?page=1&limit=1&status=published`);
        if (!response.ok) {
          throw new Error('Không thể tải bài viết');
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const post = data.data[0];
          // Enhanced post data with additional fields
          const enhancedPost = {
            ...post,
            category: 'Tuyển dụng',
            difficulty: 'intermediate' as const,
            author: {
              ...post.author,
              expertise: ['Tuyển dụng', 'HR', 'Phát triển nghề nghiệp'],
              followers: 1250
            }
          };
          setBlogPost(enhancedPost);

          // Fetch related posts (excluding current post)
          const relatedResponse = await fetch(`${API_BASE_URL}/blog?page=1&limit=4&status=published`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            const enhancedRelatedPosts = relatedData.data
              .filter((p: RelatedPost) => p.id !== post.id)
              .slice(0, 3)
              .map((p: RelatedPost) => ({
                ...p,
                category: ['Tuyển dụng', 'IT', 'Kinh nghiệm'][Math.floor(Math.random() * 3)],
                readingTime: Math.floor(Math.random() * 10) + 3
              }));
            setRelatedPosts(enhancedRelatedPosts);
          }

          // Enhanced comments data
          setComments([
            {
              id: '1',
              author: {
                name: 'Nguyễn Văn B',
                avatar: undefined,
                role: 'HR Manager'
              },
              content: 'Bài viết rất hữu ích! Cảm ơn tác giả đã chia sẻ những kinh nghiệm thực tế.',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              likes: 8,
              replies: [
                {
                  id: '1-1',
                  author: { name: 'Trần Thị C', role: 'Developer' },
                  content: 'Đồng ý! Mình đã áp dụng và thấy hiệu quả rõ rệt.',
                  createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                  likes: 3
                }
              ]
            },
            {
              id: '2',
              author: {
                name: 'Phạm Minh D',
                avatar: undefined,
                role: 'Job Seeker'
              },
              content: 'Câu hỏi: Có tips nào cho người mới bắt đầu tìm việc không?',
              createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
              likes: 5
            }
          ]);
        } else {
          throw new Error('Không tìm thấy bài viết nào');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải bài viết');
        console.error('Error fetching blog post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, []);

  // Reading progress tracking
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setUserLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: {
          name: 'Bạn',
          avatar: undefined,
          role: 'Reader'
        },
        content: commentText,
        createdAt: new Date().toISOString(),
        likes: 0
      };
      setComments(prev => [newComment, ...prev]);
      setCommentText("");
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this article: ${blogPost?.title}`;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return <CheckCircle className="h-3 w-3" />;
      case 'intermediate': return <TrendingUp className="h-3 w-3" />;
      case 'advanced': return <Award className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-6">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-[#f26b38] border-t-transparent rounded-full mx-auto"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 w-20 h-20 border-4 border-orange-300 border-t-transparent rounded-full mx-auto opacity-50"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-700">Đang tải bài viết...</p>
              <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg mx-auto px-6"
          >
            <div className="text-8xl mb-6">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/blog')}
                className="bg-[#f26b38] hover:bg-[#e05a27] text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang blog
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="ml-4 px-8 py-3 rounded-xl border-2 hover:bg-gray-50"
              >
                Thử lại
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // No blog post found
  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg mx-auto px-6"
          >
            <div className="text-8xl mb-6">📝</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Chưa có bài viết</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">Hiện tại chưa có bài viết nào được xuất bản.</p>
            <Button
              onClick={() => router.push('/blog')}
              className="bg-[#f26b38] hover:bg-[#e05a27] text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại trang blog
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-200 shadow-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-[#f26b38] via-orange-400 to-pink-500 shadow-sm"
            style={{ width: `${readingProgress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-indigo-200/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            {/* Category & Difficulty Badge */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 rounded-full text-sm font-medium">
                <BookOpen className="mr-1 h-3 w-3" />
                {blogPost.category}
              </Badge>
              <Badge className={`px-4 py-2 rounded-full text-sm font-medium border ${getDifficultyColor(blogPost.difficulty)}`}>
                {getDifficultyIcon(blogPost.difficulty)}
                <span className="ml-1 capitalize">{blogPost.difficulty}</span>
              </Badge>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/blog')}
                className="hover:bg-white/60 backdrop-blur-sm rounded-full transition-all duration-300"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Blog
              </Button>
              <span className="text-gray-400">•</span>
              <span className="text-gray-900 font-medium bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full">
                {blogPost.title}
              </span>
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight"
            >
              {blogPost.title}
            </motion.h1>

            {/* Excerpt */}
            {blogPost.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed"
              >
                {blogPost.excerpt}
              </motion.p>
            )}

            {/* Meta Information Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center gap-6 mb-12"
            >
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-white/20">
                <Calendar className="h-5 w-5 text-[#f26b38]" />
                <div className="text-left">
                  <div className="text-sm text-gray-500">Ngày đăng</div>
                  <div className="font-semibold text-gray-900">{new Date(blogPost.publishedAt).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-white/20">
                <Clock className="h-5 w-5 text-[#f26b38]" />
                <div className="text-left">
                  <div className="text-sm text-gray-500">Thời gian đọc</div>
                  <div className="font-semibold text-gray-900">{blogPost.readingTime || 5} phút</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-white/20">
                <Eye className="h-5 w-5 text-[#f26b38]" />
                <div className="text-left">
                  <div className="text-sm text-gray-500">Lượt xem</div>
                  <div className="font-semibold text-gray-900">{blogPost.viewCount.toLocaleString()}</div>
                </div>
              </div>
            </motion.div>

            {/* Author Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Card className="max-w-2xl mx-auto mb-12 bg-white/90 backdrop-blur-md border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-full ring-4 ring-white shadow-xl overflow-hidden bg-gradient-to-br from-[#f26b38] to-orange-400 flex items-center justify-center">
                        {blogPost.author.avatar ? (
                          <img
                            src={blogPost.author.avatar}
                            alt={blogPost.author.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-2xl">
                            {blogPost.author.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-xl">{blogPost.author.name}</h3>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Award className="mr-1 h-3 w-3" />
                          Expert
                        </Badge>
                      </div>
                      {blogPost.author.bio && (
                        <p className="text-gray-600 leading-relaxed mb-3">{blogPost.author.bio}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {blogPost.author.followers?.toLocaleString()} followers
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          4.8 rating
                        </span>
                      </div>
                      {blogPost.author.expertise && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {blogPost.author.expertise.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center justify-center gap-6 mb-16"
            >
              <Button
                variant="outline"
                size="lg"
                className={`flex items-center gap-3 rounded-2xl px-8 py-4 border-2 hover:shadow-xl transition-all duration-300 ${
                  isLiked
                    ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100 shadow-lg'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50 bg-white/80 backdrop-blur-sm'
                }`}
                onClick={handleLike}
              >
                <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-bold text-lg">{blogPost.likeCount + userLikes}</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-3 rounded-2xl px-8 py-4 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-6 w-6" />
                <span className="font-bold text-lg">{blogPost.commentCount + comments.length}</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`flex items-center gap-3 rounded-2xl px-8 py-4 border-2 hover:shadow-xl transition-all duration-300 ${
                  isBookmarked
                    ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 bg-white/80 backdrop-blur-sm'
                }`}
                onClick={handleBookmark}
              >
                <Bookmark className={`h-6 w-6 ${isBookmarked ? 'fill-current' : ''}`} />
                <span className="font-bold text-lg">{isBookmarked ? 'Đã lưu' : 'Lưu bài'}</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-3 rounded-2xl px-8 py-4 border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
                onClick={() => handleShare('facebook')}
              >
                <Share2 className="h-6 w-6" />
                <span className="font-bold text-lg">Chia sẻ</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content Navigation */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-8">
              <Button
                variant={activeSection === 'content' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSection('content')}
                className={activeSection === 'content' ? 'bg-[#f26b38] hover:bg-[#e05a27]' : ''}
              >
                Nội dung
              </Button>
              <Button
                variant={activeSection === 'comments' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSection('comments')}
                className={activeSection === 'comments' ? 'bg-[#f26b38] hover:bg-[#e05a27]' : ''}
              >
                Bình luận ({blogPost.commentCount + comments.length})
              </Button>
              <Button
                variant={activeSection === 'related' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSection('related')}
                className={activeSection === 'related' ? 'bg-[#f26b38] hover:bg-[#e05a27]' : ''}
              >
                Bài viết liên quan
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              <span>{blogPost.viewCount.toLocaleString()} lượt xem</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-3">
            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                <img
                  src={blogPost.featuredImage || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=600&fit=crop'}
                  alt={blogPost.title}
                  className="w-full h-64 md:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-xl font-bold mb-2">{blogPost.title}</h3>
                  <p className="text-sm opacity-90">{blogPost.excerpt}</p>
                </div>
              </div>
            </motion.div>

            {/* Article Body */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="prose prose-xl max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-[#f26b38] prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-[#f26b38] prose-blockquote:text-gray-600 mb-12"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />

            {/* Tags */}
            {blogPost.tags && blogPost.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-12"
              >
                <div className="flex flex-wrap gap-3">
                  {blogPost.tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200 px-4 py-2 rounded-full text-sm font-medium hover:shadow-md transition-all duration-300 cursor-pointer"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-12"
            >
              <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Chia sẻ bài viết</h3>
                    <p className="text-gray-600 mb-6">Giúp người khác khám phá nội dung hữu ích này</p>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-3 bg-white hover:bg-blue-50 border-blue-200 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={() => handleShare('facebook')}
                      >
                        <Facebook className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">Facebook</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-3 bg-white hover:bg-blue-50 border-blue-200 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={() => handleShare('twitter')}
                      >
                        <Twitter className="h-5 w-5 text-blue-400" />
                        <span className="font-semibold">Twitter</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center gap-3 bg-white hover:bg-blue-50 border-blue-200 rounded-xl px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={() => handleShare('linkedin')}
                      >
                        <Linkedin className="h-5 w-5 text-blue-700" />
                        <span className="font-semibold">LinkedIn</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <MessageCircle className="h-6 w-6 text-[#f26b38]" />
                      Bình luận ({blogPost.commentCount + comments.length})
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComments(!showComments)}
                      className="text-[#f26b38] hover:bg-orange-50"
                    >
                      {showComments ? 'Ẩn' : 'Hiện'} bình luận
                    </Button>
                  </div>
                </CardHeader>

                {showComments && (
                  <CardContent className="space-y-6">
                    {/* Comment Form */}
                    <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-100">
                      <form onSubmit={handleComment} className="space-y-4">
                        <Textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                          rows={4}
                          className="bg-white border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-[#f26b38] focus:border-transparent"
                        />
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500">Hãy tôn trọng và xây dựng</p>
                          <Button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="bg-[#f26b38] hover:bg-[#e05a27] text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Đăng bình luận
                          </Button>
                        </div>
                      </form>
                    </div>

                    <Separator />

                    {/* Comments List */}
                    <div className="space-y-6">
                      {comments.map((comment, index) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex gap-4 p-4 bg-gray-50 rounded-2xl"
                        >
                          <div className="h-10 w-10 rounded-full ring-2 ring-white shadow-md overflow-hidden bg-gradient-to-br from-[#f26b38] to-orange-400 flex items-center justify-center">
                            {comment.author.avatar ? (
                              <img
                                src={comment.author.avatar}
                                alt={comment.author.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-semibold">
                                {comment.author.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{comment.author.name}</h4>
                              {comment.author.role && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  {comment.author.role}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  day: 'numeric',
                                  month: 'numeric'
                                })}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                            <div className="flex items-center gap-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-red-500 h-auto p-0"
                              >
                                <ThumbsUp className="mr-1 h-3 w-3" />
                                <span className="text-xs">{comment.likes}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-blue-500 h-auto p-0"
                              >
                                <span className="text-xs">Trả lời</span>
                              </Button>
                            </div>

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-4 ml-6 space-y-3">
                                {comment.replies.map((reply, replyIndex) => (
                                  <div key={reply.id} className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100">
                                    <div className="h-8 w-8 rounded-full ring-1 ring-gray-200 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                      <span className="text-white font-semibold text-xs">
                                        {reply.author.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h5 className="font-medium text-gray-900 text-sm">{reply.author.name}</h5>
                                        <span className="text-xs text-gray-500">
                                          {new Date(reply.createdAt).toLocaleString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-[#f26b38]" />
                      Bài viết liên quan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {relatedPosts.map((post: RelatedPost, index: number) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group cursor-pointer"
                          onClick={() => router.push(`/blog/${post.slug}`)}
                        >
                          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
                            <div className="aspect-video overflow-hidden">
                              <img
                                src={post.featuredImage || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=200&fit=crop'}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <CardContent className="p-6">
                              <div className="flex items-center gap-2 mb-3">
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                  {post.category}
                                </Badge>
                                <span className="text-xs text-gray-500">{post.readingTime} phút đọc</span>
                              </div>
                              <h4 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#f26b38] transition-colors leading-tight">
                                {post.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {Math.floor(Math.random() * 1000) + 100}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Author Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-pink-50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#f26b38]" />
                    Về tác giả
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full ring-4 ring-white shadow-xl overflow-hidden bg-gradient-to-br from-[#f26b38] to-orange-400 flex items-center justify-center">
                      {blogPost.author.avatar ? (
                        <img
                          src={blogPost.author.avatar}
                          alt={blogPost.author.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-xl">
                          {blogPost.author.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">{blogPost.author.name}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{blogPost.author.bio}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1 rounded-lg border-blue-200 hover:bg-blue-50">
                      <Linkedin className="h-4 w-4 mr-1 text-blue-600" />
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 rounded-lg border-blue-400 hover:bg-blue-50">
                      <Twitter className="h-4 w-4 mr-1 text-blue-400" />
                      Twitter
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-[#f26b38] hover:bg-[#e05a27] text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Xem tất cả bài viết
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Reading Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Tiến độ đọc</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#f26b38] mb-2">{Math.round(readingProgress)}%</div>
                    <div className="text-sm text-gray-600 mb-4">Hoàn thành</div>
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-[#f26b38] to-orange-400 h-full rounded-full"
                        style={{ width: `${readingProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Popular Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Tags phổ biến</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["CV", "Tuyển dụng", "Phỏng vấn", "IT", "Kinh nghiệm", "Học tập", "Công việc", "Phát triển", "Lãnh đạo"].map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-full text-sm hover:bg-blue-100 cursor-pointer transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📧</div>
                    <h3 className="font-bold text-gray-900 mb-2">Đăng ký nhận tin</h3>
                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                      Nhận những bài viết mới nhất về tuyển dụng và phát triển nghề nghiệp
                    </p>
                    <div className="space-y-4">
                      <Input
                        placeholder="Nhập email của bạn"
                        className="bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f26b38] focus:border-transparent"
                      />
                      <Button className="w-full bg-[#f26b38] hover:bg-[#e05a27] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <Send className="mr-2 h-4 w-4" />
                        Đăng ký ngay
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Thống kê</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Lượt thích</span>
                    <span className="font-bold text-[#f26b38]">{blogPost.likeCount + userLikes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bình luận</span>
                    <span className="font-bold text-blue-600">{blogPost.commentCount + comments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Lượt xem</span>
                    <span className="font-bold text-purple-600">{blogPost.viewCount.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Độ khó</span>
                    <Badge className={`text-xs ${getDifficultyColor(blogPost.difficulty)}`}>
                      {getDifficultyIcon(blogPost.difficulty)}
                      <span className="ml-1 capitalize">{blogPost.difficulty}</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  );
}
