"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Shield,
  Save,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Lock,
  Globe,
  Users,
  Trash2,
  Download,
  Camera,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";
import UserService, { UpdateProfileData } from "@/services/userService";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    bio?: string;
    roles?: string[];
    avatar?: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    marketingEmails: false,
    smsNotifications: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessaging: true,
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");

  // Predefined avatar options
  const avatarOptions = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User1",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User2", 
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User3",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User4",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User5",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User6",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User7",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User8",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User9",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User10",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User11",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User12",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User13",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User14",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User15",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User16",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User17",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User18",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User19",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User20",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User21",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User22",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User23",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User24",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User25",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User26",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User27",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User28",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User29",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User30",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User31",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=User32",
  ];

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/auth/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Load user settings (in a real app, this would come from API)
      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        location: parsedUser.location || "",
        bio: parsedUser.bio || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Load notification preferences (mock data)
      setNotifications({
        emailNotifications: true,
        jobAlerts: true,
        applicationUpdates: true,
        marketingEmails: false,
        smsNotifications: false,
      });

      // Load privacy settings (mock data)
      setPrivacy({
        profileVisibility: "public",
        showEmail: false,
        showPhone: false,
        allowMessaging: true,
      });
    } catch (error) {
      console.error("Error loading user data:", error);
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrivacyChange = (field: string, value: string | boolean) => {
    setPrivacy((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: null, text: '' }), 3000);
  };

  const handleSaveProfile = async () => {
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        showMessage('error', 'Vui lòng nhập họ và tên');
        return;
      }

      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        showMessage('error', 'Vui lòng nhập email hợp lệ');
        return;
      }

      // Prepare data for API call
      const updateData: UpdateProfileData = {
        phone: formData.phone || undefined,
        bio: formData.bio || undefined,
        location: formData.location || undefined,
        email: formData.email || undefined,
        fullName: formData.name || undefined,
      };

      // Call the backend API to update profile
      const updatedUser = await UserService.updateProfile(updateData);

      // Preserve existing user data (especially roles) when updating
      const currentUserData = user || {};
      const mergedUserData = {
        ...currentUserData,  // Keep existing data including roles
        ...updatedUser,      // Override with updated data
        // Ensure roles are preserved if not returned by API
        roles: updatedUser.roles || currentUserData.roles || [],
        // Construct name from firstName and lastName if available
        name: updatedUser.firstName && updatedUser.lastName 
          ? `${updatedUser.firstName} ${updatedUser.lastName}`
          : updatedUser.firstName || formData.name || currentUserData.name,
      };

      // Save merged user data back to localStorage
      localStorage.setItem("user", JSON.stringify(mergedUserData));

      // Update local state
      setUser(mergedUserData);

      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent("userLogin"));

      showMessage('success', 'Thông tin cá nhân đã được cập nhật!');
    } catch (error) {
      console.error("Error saving profile:", error);
      showMessage('error', 'Có lỗi xảy ra khi lưu thông tin! Vui lòng thử lại.');
    }
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  const handleSaveAvatar = () => {
    if (selectedAvatar) {
      // Update user data with new avatar
      const updatedUser = { ...user, avatar: selectedAvatar };
      
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update local state
      setUser(updatedUser);
      
      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent("userLogin"));
      
      // Close modal
      setIsAvatarModalOpen(false);
      
      showMessage('success', 'Ảnh đại diện đã được cập nhật!');
    }
  };

  const handleResetAvatar = () => {
    // Remove avatar from user data
    const updatedUser = { ...user };
    delete updatedUser.avatar;
    
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // Update local state
    setUser(updatedUser);
    
    // Dispatch custom event to update header
    window.dispatchEvent(new CustomEvent("userLogin"));
    
    showMessage('success', 'Ảnh đại diện đã được đặt lại!');
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword) {
      showMessage('error', 'Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (!formData.newPassword) {
      showMessage('error', 'Vui lòng nhập mật khẩu mới');
      return;
    }

    if (formData.newPassword.length < 6) {
      showMessage('error', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showMessage('error', 'Mật khẩu xác nhận không khớp!');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      showMessage('error', 'Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    try {
      await UserService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      // Clear password fields after successful change
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      showMessage('success', 'Mật khẩu đã được thay đổi!');
    } catch (error) {
      console.error("Error changing password:", error);
      showMessage('error', 'Có lỗi xảy ra khi đổi mật khẩu! Vui lòng kiểm tra mật khẩu hiện tại.');
    }
  };

  const handleSaveNotifications = async () => {
    // In a real app, this would make an API call
    console.log("Saving notifications:", notifications);
    showMessage('success', 'Cài đặt thông báo đã được lưu!');
  };

  const handleSavePrivacy = async () => {
    // In a real app, this would make an API call
    console.log("Saving privacy:", privacy);
    showMessage('success', 'Cài đặt bảo mật đã được lưu!');
  };

  const getProfileCompletion = () => {
    const fields = [
      formData.name,
      formData.email,
      formData.phone,
      formData.location,
      formData.bio,
    ];
    const completed = fields.filter(field => field && field.trim()).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải cài đặt...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <div>
                <h1 className="text-3xl font-bold">Cài đặt tài khoản</h1>
                <p className="text-gray-600 mt-1">
                  Quản lý thông tin và cài đặt của bạn
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Đã xác thực email</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Hồ sơ hoàn thiện {getProfileCompletion()}%</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Success/Error Messages */}
          {message.type && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}

                  <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                      {/* Profile Settings */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <User className="h-6 w-6 text-[#f26b38]" />
                            <div>
                              <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                              <p className="text-sm text-gray-600">Cập nhật thông tin cá nhân của bạn</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#f26b38] h-2 rounded-full" 
                                style={{ width: `${getProfileCompletion()}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{getProfileCompletion()}%</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-3 gap-6">
                            {/* Avatar Section */}
                            <div className="md:col-span-1 space-y-4">
                              <div className="text-center">
                                <div className="relative inline-block">
                                  <img
                                    src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg cursor-pointer"
                                    onClick={() => setIsAvatarModalOpen(true)}
                                  />
                                  <button
                                    onClick={() => setIsAvatarModalOpen(true)}
                                    className="absolute bottom-0 right-0 bg-[#f26b38] text-white p-2 rounded-full shadow-lg hover:bg-[#e05a27] transition-colors"
                                  >
                                    <Camera className="h-4 w-4" />
                                  </button>
                                </div>
                                <h3 className="font-semibold">{user?.name || "User"}</h3>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                              </div>
                            </div>

                            {/* Profile Form */}
                            <div className="md:col-span-2 space-y-6">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="name">Họ và tên <span className="text-red-500">*</span></Label>
                                  <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    placeholder="Nhập họ và tên"
                                    className="border-gray-300 focus:border-[#f26b38] focus:ring-[#f26b38]"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="Nhập email"
                                    className="border-gray-300 focus:border-[#f26b38] focus:ring-[#f26b38]"
                                  />
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="phone">Số điện thoại</Label>
                                  <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    placeholder="Nhập số điện thoại"
                                    className="border-gray-300 focus:border-[#f26b38] focus:ring-[#f26b38]"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="location">Địa điểm</Label>
                                  <Input
                                    id="location"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange("location", e.target.value)}
                                    placeholder="Nhập địa điểm"
                                    className="border-gray-300 focus:border-[#f26b38] focus:ring-[#f26b38]"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="bio">Giới thiệu bản thân</Label>
                                <Textarea
                                  id="bio"
                                  value={formData.bio}
                                  onChange={(e) => handleInputChange("bio", e.target.value)}
                                  placeholder="Viết một chút về bản thân..."
                                  rows={4}
                                  className="border-gray-300 focus:border-[#f26b38] focus:ring-[#f26b38]"
                                />
                              </div>

                              <div className="flex justify-end">
                                <Button
                                  onClick={handleSaveProfile}
                                  className="bg-[#f26b38] hover:bg-[#e05a27] text-white"
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Lưu thay đổi
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Avatar Modal */}
                      {isAvatarModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Chọn ảnh đại diện</h3>
                                <button
                                  onClick={() => setIsAvatarModalOpen(false)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <XCircle className="h-6 w-6" />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-4 mb-6">
                                {avatarOptions.map((avatar, index) => (
                                  <div key={index} className="text-center">
                                    <div className="relative">
                                      <img
                                        src={avatar}
                                        alt={`Avatar ${index + 1}`}
                                        className={`w-16 h-16 rounded-full cursor-pointer border-2 ${
                                          selectedAvatar === avatar || (user?.avatar === avatar && !selectedAvatar)
                                            ? 'border-[#f26b38] shadow-lg'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        onClick={() => handleAvatarChange(avatar)}
                                      />
                                      {(selectedAvatar === avatar || (user?.avatar === avatar && !selectedAvatar)) && (
                                        <div className="absolute -top-1 -right-1 bg-[#f26b38] text-white rounded-full p-1">
                                          <CheckCircle className="h-4 w-4" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="flex justify-between">
                                <Button
                                  variant="outline"
                                  onClick={handleResetAvatar}
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Đặt lại
                                </Button>
                                <div className="space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsAvatarModalOpen(false)}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    onClick={handleSaveAvatar}
                                    className="bg-[#f26b38] hover:bg-[#e05a27] text-white"
                                  >
                                    <Save className="h-4 w-4 mr-2" />
                                    Lưu
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Password Change */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Shield className="h-6 w-6 text-[#f26b38]" />
                            <div>
                              <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
                              <p className="text-sm text-gray-600">Cập nhật mật khẩu bảo mật tài khoản</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                              <div className="relative">
                                <Input
                                  id="currentPassword"
                                  type={showPassword.current ? "text" : "password"}
                                  value={formData.currentPassword}
                                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                                  placeholder="Nhập mật khẩu hiện tại"
                                  className="border-gray-300 focus:border-[#f26b38] focus:ring-[#f26b38] pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                  {showPassword.current ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                <div className="relative">
                                  <Input
                                    id="newPassword"
                                    type={showPassword.new ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                                    placeholder="Nhập mật khẩu mới"
                                    className="border-gray-300 focus:border-[#f26b38] focus:ring-[#f26b38] pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                  >
                                    {showPassword.new ? (
                                      <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                  </button>
                                </div>
                                {formData.newPassword && formData.newPassword.length < 6 && (
                                  <p className="text-red-500 text-sm">Mật khẩu phải có ít nhất 6 ký tự</p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                                <div className="relative">
                                  <Input
                                    id="confirmPassword"
                                    type={showPassword.confirm ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                    placeholder="Nhập lại mật khẩu mới"
                                    className="border-gray-300 focus:border-[#f26b38] focus:ring-[#f26b38] pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                  >
                                    {showPassword.confirm ? (
                                      <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                  </button>
                                </div>
                                {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                  <p className="text-red-500 text-sm">Mật khẩu xác nhận không khớp</p>
                                )}
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button 
                                onClick={handleChangePassword}
                                className="bg-[#f26b38] hover:bg-[#e05a27] text-white"
                              >
                                <Lock className="h-4 w-4 mr-2" />
                                Đổi mật khẩu
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Notification Settings */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Bell className="h-6 w-6 text-[#f26b38]" />
                            <div>
                              <h2 className="text-xl font-semibold">Cài đặt thông báo</h2>
                              <p className="text-sm text-gray-600">Quản lý cách bạn nhận thông báo</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div>
                                <Label className="font-medium">Thông báo email</Label>
                                <p className="text-sm text-gray-600">
                                  Nhận thông báo qua email về các cập nhật quan trọng
                                </p>
                              </div>
                              <Switch
                                checked={notifications.emailNotifications}
                                onCheckedChange={(checked: boolean) =>
                                  handleNotificationChange("emailNotifications", checked)
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div>
                                <Label className="font-medium">Cảnh báo việc làm</Label>
                                <p className="text-sm text-gray-600">
                                  Thông báo khi có việc làm phù hợp với hồ sơ của bạn
                                </p>
                              </div>
                              <Switch
                                checked={notifications.jobAlerts}
                                onCheckedChange={(checked: boolean) =>
                                  handleNotificationChange("jobAlerts", checked)
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div>
                                <Label className="font-medium">Cập nhật đơn ứng tuyển</Label>
                                <p className="text-sm text-gray-600">
                                  Thông báo trạng thái đơn ứng tuyển và phản hồi từ nhà tuyển dụng
                                </p>
                              </div>
                              <Switch
                                checked={notifications.applicationUpdates}
                                onCheckedChange={(checked: boolean) =>
                                  handleNotificationChange("applicationUpdates", checked)
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div>
                                <Label className="font-medium">Email marketing</Label>
                                <p className="text-sm text-gray-600">
                                  Nhận tin tức, khuyến mãi và các chương trình đặc biệt
                                </p>
                              </div>
                              <Switch
                                checked={notifications.marketingEmails}
                                onCheckedChange={(checked: boolean) =>
                                  handleNotificationChange("marketingEmails", checked)
                                }
                              />
                            </div>

                            <div className="flex justify-end mt-6">
                              <Button 
                                onClick={handleSaveNotifications}
                                className="bg-[#f26b38] hover:bg-[#e05a27] text-white"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Lưu cài đặt thông báo
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Account Status */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Trạng thái tài khoản</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Xác thực email</span>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Đã xác thực</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">Số điện thoại</span>
                      </div>
                      <Badge 
                        className={
                          formData.phone
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {formData.phone ? "Đã xác thực" : "Chưa xác thực"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Hồ sơ CV</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        Hoàn thiện {getProfileCompletion()}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-[#f26b38]" />
                    <h3 className="font-semibold">Bảo mật & Quyền riêng tư</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Quyền xem hồ sơ</Label>
                      <select
                        value={privacy.profileVisibility}
                        onChange={(e) =>
                          handlePrivacyChange("profileVisibility", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-[#f26b38] focus:ring-[#f26b38]"
                      >
                        <option value="public">Công khai</option>
                        <option value="private">Riêng tư</option>
                        <option value="employers">Chỉ nhà tuyển dụng</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <Label className="font-medium">Hiển thị email</Label>
                        <p className="text-sm text-gray-600">
                          Cho phép người khác xem email của bạn
                        </p>
                      </div>
                      <Switch
                        checked={privacy.showEmail}
                        onCheckedChange={(checked: string | boolean) =>
                          handlePrivacyChange("showEmail", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <Label className="font-medium">Hiển thị số điện thoại</Label>
                        <p className="text-sm text-gray-600">
                          Cho phép người khác xem số điện thoại của bạn
                        </p>
                      </div>
                      <Switch
                        checked={privacy.showPhone}
                        onCheckedChange={(checked: string | boolean) =>
                          handlePrivacyChange("showPhone", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <Label className="font-medium">Cho phép nhắn tin</Label>
                        <p className="text-sm text-gray-600">
                          Cho phép người khác nhắn tin cho bạn
                        </p>
                      </div>
                      <Switch
                        checked={privacy.allowMessaging}
                        onCheckedChange={(checked: string | boolean) =>
                          handlePrivacyChange("allowMessaging", checked)
                        }
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSavePrivacy}
                        className="bg-[#f26b38] hover:bg-[#e05a27] text-white w-full"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Lưu cài đặt bảo mật
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <h3 className="font-semibold text-red-600">Khu vực nguy hiểm</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Tải xuống dữ liệu
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa tài khoản
                    </Button>
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
