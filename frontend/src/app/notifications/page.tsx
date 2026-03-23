"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Mail,
  MessageCircle,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Info,
  Home,
  Settings,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: 'job_alert' | 'application_update' | 'message' | 'system' | 'marketing';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "job_alert",
      title: "Việc làm mới phù hợp với bạn",
      message: "Có 3 việc làm Frontend Developer mới phù hợp với hồ sơ của bạn tại Hà Nội.",
      timestamp: "2024-11-25T10:30:00Z",
      isRead: false,
      actionUrl: "/jobs?category=frontend&location=hanoi",
      priority: "high"
    },
    {
      id: "2",
      type: "application_update",
      title: "Đơn ứng tuyển đã được xem xét",
      message: "Công ty Tech Solutions Vietnam đã xem xét đơn ứng tuyển của bạn cho vị trí Senior Frontend Developer.",
      timestamp: "2024-11-24T14:20:00Z",
      isRead: false,
      actionUrl: "/dashboard/candidate/applications",
      priority: "high"
    },
    {
      id: "3",
      type: "message",
      title: "Tin nhắn từ nhà tuyển dụng",
      message: "HR của Creative Studio đã gửi tin nhắn về vị trí UI/UX Designer bạn đã ứng tuyển.",
      timestamp: "2024-11-24T09:15:00Z",
      isRead: true,
      actionUrl: "/messages",
      priority: "medium"
    },
    {
      id: "4",
      type: "system",
      title: "Cập nhật tính năng mới",
      message: "CVKing đã thêm tính năng tìm kiếm nâng cao. Khám phá ngay để tìm việc hiệu quả hơn!",
      timestamp: "2024-11-23T16:45:00Z",
      isRead: true,
      actionUrl: "/jobs",
      priority: "low"
    },
    {
      id: "5",
      type: "marketing",
      title: "Khuyến mãi đặc biệt",
      message: "Giảm 50% phí dịch vụ tạo CV chuyên nghiệp trong tháng này. Đừng bỏ lỡ cơ hội!",
      timestamp: "2024-11-22T11:00:00Z",
      isRead: true,
      actionUrl: "/cv-builder",
      priority: "low"
    }
  ];

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      // In a real app, this would fetch from API
      // For now, use mock data
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    // In a real app, this would make an API call
    console.log('Marked as read:', notificationId);
  };

  const handleMarkAsUnread = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: false } : notif
      )
    );
    // In a real app, this would make an API call
    console.log('Marked as unread:', notificationId);
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    // In a real app, this would make an API call
    console.log('Deleted notification:', notificationId);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    // In a real app, this would make an API call
    console.log('Marked all as read');
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_alert':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'application_update':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-purple-600" />;
      case 'system':
        return <Info className="h-5 w-5 text-orange-600" />;
      case 'marketing':
        return <Mail className="h-5 w-5 text-pink-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông báo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Thông báo</h1>
              <p className="text-gray-600 mt-1">Theo dõi các cập nhật và tin nhắn quan trọng</p>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white px-3 py-1">
                  {unreadCount} chưa đọc
                </Badge>
              )}
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-[#f26b38]">{notifications.length}</div>
              <div className="text-sm text-gray-600">Tổng số</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <div className="text-sm text-gray-600">Chưa đọc</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {notifications.filter(n => n.type === 'job_alert').length}
              </div>
              <div className="text-sm text-gray-600">Việc làm</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.type === 'application_update').length}
              </div>
              <div className="text-sm text-gray-600">Ứng tuyển</div>
            </Card>
          </div>

          {/* Mark All as Read */}
          {unreadCount > 0 && (
            <div className="mb-6">
              <Button onClick={handleMarkAllAsRead} className="bg-[#f26b38] hover:bg-[#e05a27]">
                <Eye className="h-4 w-4 mr-2" />
                Đánh dấu tất cả đã đọc
              </Button>
            </div>
          )}

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có thông báo nào</h3>
              <p className="text-gray-600">Thông báo sẽ xuất hiện khi có cập nhật mới về công việc hoặc ứng tuyển của bạn.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    !notification.isRead ? 'border-l-4 border-l-[#f26b38]' : ''
                  } ${getPriorityColor(notification.priority)}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-full ${
                      notification.isRead ? 'bg-gray-100' : 'bg-white shadow-sm'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`font-semibold transition-colors ${
                            notification.isRead ? 'text-gray-900' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            notification.isRead ? 'text-gray-600' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.isRead ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsUnread(notification.id);
                              }}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <EyeOff className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                        {notification.actionUrl && (
                          <Badge variant="outline" className="text-xs">
                            Có thể thao tác
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Help Section */}
          <Card className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Quản lý thông báo hiệu quả</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Đọc thông báo thường xuyên để không bỏ lỡ cơ hội việc làm</li>
              <li>• Cài đặt thông báo trong phần cài đặt để nhận tin tức phù hợp</li>
              <li>• Sử dụng bộ lọc để tập trung vào loại thông báo quan trọng</li>
              <li>• Xóa thông báo cũ để giữ danh sách gọn gàng</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
