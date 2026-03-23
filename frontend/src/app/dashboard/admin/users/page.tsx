"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  UserCog,
  ArrowLeft,
  AlertTriangle,
  Shield,
  Crown,
  User,
  Plus,
  Trash2,
  UserPlus
} from "lucide-react";
import { adminService, User as AdminUser } from "@/services/adminService";

interface UserDisplay {
  id: string;
  email: string;
  fullName: string;
  role: 'job-seeker' | 'employer' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  company?: string;
  applicationsCount?: number;
  jobsPostedCount?: number;
}

interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDisplay | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'job-seeker' as 'job-seeker' | 'employer' | 'admin'
  });

  useEffect(() => {
    fetchUsers();
  }, [filters, currentPage]);

  const fetchUsers = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 20,
        ...filters
      };

      const response = await adminService.getAllUsers(params);

      // Transform the data to match UI expectations
      const transformedUsers: UserDisplay[] = response.data.map(user => ({
        id: user.id,
        email: user.email,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        role: (user.userRoles?.[0]?.role?.name as UserDisplay['role']) || 'job-seeker',
        status: user.isActive ? 'active' : 'inactive',
        createdAt: user.createdAt,
        avatar: undefined, // Not available in current backend
        lastLogin: undefined, // Not available in current backend
        applicationsCount: user.applications?.length || 0,
        jobsPostedCount: user.statistics?.totalJobsPosted || 0
      }));

      setUsers(transformedUsers);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const statusMap: { [key: string]: string } = {
        'active': 'active',
        'inactive': 'inactive',
        'banned': 'banned'
      };

      await adminService.updateUserStatus(userId, statusMap[newStatus] || newStatus);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const roleMap: { [key: string]: string } = {
        'job-seeker': 'job-seeker',
        'employer': 'employer',
        'admin': 'admin'
      };

      await adminService.updateUserRole(userId, roleMap[newRole] || newRole);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      await adminService.deleteUser(userId);
      fetchUsers(); // Refresh the list
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await adminService.createUser(formData);
      fetchUsers(); // Refresh the list
      setShowCreateModal(false);
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'job-seeker'
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng');
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      // Update user details would require additional backend endpoints
      alert('Tính năng chỉnh sửa người dùng sẽ được thêm trong phiên bản tiếp theo');
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const openEditModal = (user: UserDisplay) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: '', // Not used for editing
      firstName: user.fullName.split(' ')[0] || '',
      lastName: user.fullName.split(' ').slice(1).join(' ') || '',
      role: user.role
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: UserDisplay) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-purple-600" />;
      case 'employer':
        return <UserCog className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
      employer: { label: 'Nhà tuyển dụng', color: 'bg-blue-100 text-blue-700' },
      'job-seeker': { label: 'Người tìm việc', color: 'bg-green-100 text-green-700' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig['job-seeker'];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Hoạt động', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      inactive: { label: 'Không hoạt động', color: 'bg-gray-100 text-gray-700', icon: XCircle },
      banned: { label: 'Đã khóa', color: 'bg-red-100 text-red-700', icon: Ban }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải danh sách người dùng...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
                <p className="text-gray-600 mt-1">Xem và quản lý tất cả tài khoản người dùng.</p>
              </div>
            </div>

            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#f26b38] hover:bg-[#e05a27] flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Tạo người dùng
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    className="pl-10"
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>

              <Select value={filters.role || 'all'} onValueChange={(value) => setFilters({ ...filters, role: value === 'all' ? undefined : value })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tất cả vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="job-seeker">Người tìm việc</SelectItem>
                  <SelectItem value="employer">Nhà tuyển dụng</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status || 'all'} onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? undefined : value })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="banned">Đã khóa</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setFilters({})}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Xóa bộ lọc
              </Button>
            </div>
          </Card>

          {/* Users List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Danh sách người dùng ({users.length})</h2>
            </div>

            <div className="space-y-4">
              {users.length > 0 ? users.map((user) => (
                <div key={user.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#f26b38] transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <Users className="h-6 w-6 text-[#f26b38]" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{user.fullName}</h3>
                          {getRoleIcon(user.role)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Đăng ký: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                          {user.lastLogin && <span>Đăng nhập cuối: {new Date(user.lastLogin).toLocaleDateString('vi-VN')}</span>}
                          {user.applicationsCount !== undefined && <span>Đơn ứng tuyển: {user.applicationsCount}</span>}
                          {user.jobsPostedCount !== undefined && <span>Tin đăng: {user.jobsPostedCount}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => openEditModal(user)}
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                        <Select onValueChange={(value) => handleStatusChange(user.id, value)}>
                          <SelectTrigger className="w-[120px] h-8">
                            <SelectValue placeholder="Trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Kích hoạt</SelectItem>
                            <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
                            <SelectItem value="banned">Khóa tài khoản</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => handleRoleChange(user.id, value)}>
                          <SelectTrigger className="w-[120px] h-8">
                            <SelectValue placeholder="Vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="job-seeker">Người tìm việc</SelectItem>
                            <SelectItem value="employer">Nhà tuyển dụng</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Không tìm thấy người dùng nào</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Trước
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? "bg-[#f26b38] hover:bg-[#e05a27]" : ""}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Sau
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tạo người dùng mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <Input
                  type="text"
                  placeholder="Tên"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ
                </label>
                <Input
                  type="text"
                  placeholder="Họ"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as 'job-seeker' | 'employer' | 'admin' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job-seeker">Người tìm việc</SelectItem>
                    <SelectItem value="employer">Nhà tuyển dụng</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                onClick={handleCreateUser}
                className="flex-1 bg-[#f26b38] hover:bg-[#e05a27]"
              >
                Tạo người dùng
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
