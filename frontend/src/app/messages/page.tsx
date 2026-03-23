"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  MessageCircle,
  Send,
  Search,
  Home,
  MoreVertical,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  User,
  Building2
} from "lucide-react";
import Link from "next/link";

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    role: 'employer' | 'job_seeker';
    company?: string;
    position?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    senderId: string;
    isRead: boolean;
  };
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock conversations data
  const mockConversations: Conversation[] = [
    {
      id: "1",
      participant: {
        id: "emp1",
        name: "Nguyễn Thị B",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        role: "employer",
        company: "Tech Solutions Vietnam",
        position: "HR Manager"
      },
      lastMessage: {
        content: "Chúng tôi rất ấn tượng với hồ sơ của bạn. Bạn có thể tham gia phỏng vấn vào thứ 5 tuần sau không?",
        timestamp: "2024-11-25T14:30:00Z",
        senderId: "emp1",
        isRead: false
      },
      unreadCount: 2,
      isOnline: true
    },
    {
      id: "2",
      participant: {
        id: "emp2",
        name: "Trần Văn C",
        role: "employer",
        company: "Digital Agency Pro",
        position: "Technical Lead"
      },
      lastMessage: {
        content: "Cảm ơn bạn đã ứng tuyển vị trí Frontend Developer. Chúng tôi sẽ liên hệ lại sớm.",
        timestamp: "2024-11-24T09:15:00Z",
        senderId: "emp2",
        isRead: true
      },
      unreadCount: 0,
      isOnline: false
    },
    {
      id: "3",
      participant: {
        id: "seeker1",
        name: "Lê Thị D",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        role: "job_seeker",
        position: "UI/UX Designer"
      },
      lastMessage: {
        content: "Chào bạn, mình cũng đang tìm việc ở Hà Nội. Bạn có lời khuyên gì không?",
        timestamp: "2024-11-23T16:45:00Z",
        senderId: "seeker1",
        isRead: true
      },
      unreadCount: 0,
      isOnline: true
    }
  ];

  // Mock messages for selected conversation
  const mockMessages: Message[] = [
    {
      id: "1",
      senderId: "emp1",
      content: "Xin chào Nguyễn Văn A, cảm ơn bạn đã ứng tuyển vị trí Senior Frontend Developer tại Tech Solutions Vietnam.",
      timestamp: "2024-11-25T14:00:00Z",
      type: "text",
      isRead: true
    },
    {
      id: "2",
      senderId: "me",
      content: "Xin chào, cảm ơn anh/chị đã liên hệ. Tôi rất quan tâm đến vị trí này.",
      timestamp: "2024-11-25T14:05:00Z",
      type: "text",
      isRead: true
    },
    {
      id: "3",
      senderId: "emp1",
      content: "Sau khi xem xét hồ sơ của bạn, chúng tôi đánh giá cao kinh nghiệm của bạn với React và TypeScript.",
      timestamp: "2024-11-25T14:20:00Z",
      type: "text",
      isRead: true
    },
    {
      id: "4",
      senderId: "emp1",
      content: "Chúng tôi rất ấn tượng với hồ sơ của bạn. Bạn có thể tham gia phỏng vấn vào thứ 5 tuần sau không?",
      timestamp: "2024-11-25T14:30:00Z",
      type: "text",
      isRead: false
    }
  ];

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkAuthAndLoadData = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      // In a real app, fetch conversations from API
      setConversations(mockConversations);
      if (mockConversations.length > 0) {
        setSelectedConversation(mockConversations[0]);
        setMessages(mockMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // In a real app, fetch messages for this conversation
    setMessages(mockMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "me",
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: "text",
      isRead: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update last message in conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              lastMessage: {
                content: message.content,
                timestamp: message.timestamp,
                senderId: message.senderId,
                isRead: true
              }
            }
          : conv
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participant.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải tin nhắn...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="text-[#f26b38] border-[#f26b38] hover:bg-[#f26b38] hover:text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Trang chủ
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Tin nhắn</h1>
                <p className="text-gray-600 mt-1">Trao đổi với nhà tuyển dụng và ứng viên khác</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                {/* Search */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm cuộc trò chuyện..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Không tìm thấy cuộc trò chuyện nào</p>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => handleSelectConversation(conversation)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-orange-50 border-l-4 border-l-[#f26b38]' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                              {conversation.participant.avatar ? (
                                <img
                                  src={conversation.participant.avatar}
                                  alt={conversation.participant.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-lg font-bold text-[#f26b38]">
                                  {conversation.participant.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            {conversation.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {conversation.participant.name}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                              {conversation.participant.role === 'employer' ? (
                                <Building2 className="h-3 w-3 text-[#f26b38]" />
                              ) : (
                                <User className="h-3 w-3 text-blue-600" />
                              )}
                              <span className="text-xs text-gray-600">
                                {conversation.participant.role === 'employer'
                                  ? conversation.participant.company
                                  : conversation.participant.position
                                }
                              </span>
                            </div>

                            <p className={`text-sm truncate ${
                              !conversation.lastMessage.isRead && conversation.lastMessage.senderId !== 'me'
                                ? 'font-semibold text-gray-900'
                                : 'text-gray-600'
                            }`}>
                              {conversation.lastMessage.senderId === 'me' ? 'Bạn: ' : ''}
                              {conversation.lastMessage.content}
                            </p>

                            {conversation.unreadCount > 0 && (
                              <Badge className="mt-2 bg-red-500 text-white text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <Card className="h-full flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                          {selectedConversation.participant.avatar ? (
                            <img
                              src={selectedConversation.participant.avatar}
                              alt={selectedConversation.participant.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold text-[#f26b38]">
                              {selectedConversation.participant.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        {selectedConversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedConversation.participant.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedConversation.participant.role === 'employer'
                            ? selectedConversation.participant.company
                            : selectedConversation.participant.position
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === 'me'
                              ? 'bg-[#f26b38] text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === 'me' ? 'text-orange-100' : 'text-gray-500'
                          }`}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Button variant="ghost" size="sm">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Smile className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Nhập tin nhắn..."
                          className="min-h-[40px]"
                        />
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-[#f26b38] hover:bg-[#e05a27] px-6"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold mb-2">Chọn cuộc trò chuyện</h3>
                    <p>Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
