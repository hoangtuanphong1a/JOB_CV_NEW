"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
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
  Palette,
  Save,
  ArrowLeft,
  Home,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
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

  const handleSaveProfile = async () => {
    try {
      // Prepare data for API call
      const updateData: UpdateProfileData = {
        phone: formData.phone || undefined,
        bio: formData.bio || undefined,
        address: formData.location || undefined, // Map location to address
      };

      // Split name into firstName and lastName (simple split by space)
      const nameParts = formData.name.trim().split(' ');
      if (nameParts.length > 1) {
        updateData.lastName = nameParts.pop() || '';
        updateData.firstName = nameParts.join(' ');
      } else {
        updateData.firstName = formData.name;
        updateData.lastName = '';
      }

      // Call the backend API to update profile
      const updatedUser = await UserService.updateProfile(updateData);

      // Save updated user data back to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update local state
      setUser(updatedUser);

      console.log("Profile saved successfully:", updatedUser);
      alert("Thông tin cá nhân đã được cập nhật!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Có lỗi xảy ra khi lưu thông tin! Vui lòng thử lại.");
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
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

      console.log("Password changed successfully");
      alert("Mật khẩu đã được thay đổi!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Có lỗi xảy ra khi đổi mật khẩu! Vui lòng kiểm tra mật khẩu hiện tại.");
    }
  };

  const handleSaveNotifications = async () => {
    // In a real app, this would make an API call
    console.log("Saving notifications:", notifications);
    alert("Cài đặt thông báo đã được lưu!");
  };

  const handleSavePrivacy = async () => {
    // In a real app, this would make an API call
    console.log("Saving privacy:", privacy);
    alert("Cài đặt bảo mật đã được lưu!");
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
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Cài đặt tài khoản</h1>
              <p className="text-gray-600 mt-1">
                Quản lý thông tin và cài đặt của bạn
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Profile Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <User className="h-5 w-5 text-[#f26b38]" />
                  <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Nhập email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Địa điểm</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        placeholder="Nhập địa điểm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Giới thiệu bản thân</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Viết một chút về bản thân..."
                      rows={4}
                    />
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    className="bg-[#f26b38] hover:bg-[#e05a27]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                </div>
              </Card>

              {/* Password Change */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-5 w-5 text-[#f26b38]" />
                  <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        handleInputChange("currentPassword", e.target.value)
                      }
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newPassword">Mật khẩu mới</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) =>
                          handleInputChange("newPassword", e.target.value)
                        }
                        placeholder="Nhập mật khẩu mới"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>
                  </div>

                  <Button onClick={handleChangePassword} variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Đổi mật khẩu
                  </Button>
                </div>
              </Card>

              {/* Notification Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="h-5 w-5 text-[#f26b38]" />
                  <h2 className="text-xl font-semibold">Cài đặt thông báo</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Thông báo email</Label>
                      <p className="text-sm text-gray-600">
                        Nhận thông báo qua email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked: boolean) =>
                        handleNotificationChange("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cảnh báo việc làm</Label>
                      <p className="text-sm text-gray-600">
                        Thông báo khi có việc làm phù hợp
                      </p>
                    </div>
                    <Switch
                      checked={notifications.jobAlerts}
                      onCheckedChange={(checked: boolean) =>
                        handleNotificationChange("jobAlerts", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cập nhật đơn ứng tuyển</Label>
                      <p className="text-sm text-gray-600">
                        Thông báo trạng thái đơn ứng tuyển
                      </p>
                    </div>
                    <Switch
                      checked={notifications.applicationUpdates}
                      onCheckedChange={(checked: boolean) =>
                        handleNotificationChange("applicationUpdates", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email marketing</Label>
                      <p className="text-sm text-gray-600">
                        Nhận tin tức và khuyến mãi
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked: boolean) =>
                        handleNotificationChange("marketingEmails", checked)
                      }
                    />
                  </div>

                  <Button onClick={handleSaveNotifications} variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Lưu cài đặt thông báo
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Trạng thái tài khoản</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Xác thực email</span>
                    <Badge className="bg-green-100 text-green-700">
                      Đã xác thực
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Số điện thoại</span>
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hồ sơ CV</span>
                    <Badge className="bg-blue-100 text-blue-700">
                      Hoàn thiện 75%
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Privacy Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-5 w-5 text-[#f26b38]" />
                  <h3 className="font-semibold">Bảo mật & Quyền riêng tư</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Quyền xem hồ sơ</Label>
                    <select
                      value={privacy.profileVisibility}
                      onChange={(e) =>
                        handlePrivacyChange("profileVisibility", e.target.value)
                      }
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="public">Công khai</option>
                      <option value="private">Riêng tư</option>
                      <option value="employers">Chỉ nhà tuyển dụng</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Hiển thị email</Label>
                      <p className="text-sm text-gray-600">
                        Cho phép người khác xem email
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showEmail}
                      onCheckedChange={(checked: string | boolean) =>
                        handlePrivacyChange("showEmail", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Hiển thị số điện thoại</Label>
                      <p className="text-sm text-gray-600">
                        Cho phép người khác xem số điện thoại
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showPhone}
                      onCheckedChange={(checked: string | boolean) =>
                        handlePrivacyChange("showPhone", checked)
                      }
                    />
                  </div>

                  <Button
                    onClick={handleSavePrivacy}
                    variant="outline"
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Lưu cài đặt bảo mật
                  </Button>
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="p-6 border-red-200">
                <h3 className="font-semibold text-red-600 mb-4">
                  Khu vực nguy hiểm
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Tải xuống dữ liệu
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Xóa tài khoản
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
