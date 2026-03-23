"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Settings,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Tag,
  Briefcase,
  BarChart3,
  Users,
  TrendingUp
} from "lucide-react";
import { adminService } from "@/services/adminService";

interface Skill {
  id: string;
  name: string;
  description?: string;
  category?: string;
  usageCount?: number;
  createdAt: string;
}

interface JobCategory {
  id: string;
  name: string;
  description?: string;
  usageCount?: number;
  createdAt: string;
  jobCount?: number;
}

interface ContentStats {
  totalSkills: number;
  totalCategories: number;
  skillsThisMonth: number;
  categoriesThisMonth: number;
}

export default function AdminContentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'skills' | 'categories'>('skills');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [stats, setStats] = useState<ContentStats>({
    totalSkills: 0,
    totalCategories: 0,
    skillsThisMonth: 0,
    categoriesThisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Skill | JobCategory | null>(null);

  useEffect(() => {
    fetchContentData();
  }, [activeTab]);

  const fetchContentData = async () => {
    try {
      // Fetch stats
      const statsData = await adminService.getContentStats();
      setStats(statsData);

      // Fetch skills or categories based on active tab
      if (activeTab === 'skills') {
        const skillsResponse = await adminService.getAllSkills();
        setSkills(skillsResponse.data || []);
      } else {
        const categoriesResponse = await adminService.getAllJobCategories();
        setCategories(categoriesResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching content data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async (skillData: { name: string; description?: string; category?: string }) => {
    try {
      await adminService.createSkill(skillData);
      fetchContentData();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };

  const handleAddCategory = async (categoryData: { name: string; description?: string }) => {
    try {
      await adminService.createJobCategory(categoryData);
      fetchContentData();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateSkill = async (id: string, skillData: { name?: string; description?: string; category?: string }) => {
    try {
      await adminService.updateSkill(id, skillData);
      fetchContentData();
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating skill:', error);
    }
  };

  const handleUpdateCategory = async (id: string, categoryData: { name?: string; description?: string }) => {
    try {
      await adminService.updateJobCategory(id, categoryData);
      fetchContentData();
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa kỹ năng này?')) return;

    try {
      await adminService.deleteSkill(id);
      fetchContentData();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    try {
      await adminService.deleteJobCategory(id);
      fetchContentData();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải dữ liệu nội dung...</p>
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
                <h1 className="text-3xl font-bold">Quản lý nội dung</h1>
                <p className="text-gray-600 mt-1">Quản lý kỹ năng và danh mục công việc trên hệ thống.</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.totalSkills}</div>
              <div className="text-sm text-gray-600">Tổng kỹ năng</div>
              <div className="text-xs text-green-600 mt-1">+{stats.skillsThisMonth} tháng này</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.totalCategories}</div>
              <div className="text-sm text-gray-600">Danh mục việc làm</div>
              <div className="text-xs text-green-600 mt-1">+{stats.categoriesThisMonth} tháng này</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {skills.reduce((sum, skill) => sum + (skill.usageCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Lượt sử dụng kỹ năng</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {categories.reduce((sum, cat) => sum + (cat.jobCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Việc làm theo danh mục</div>
            </Card>
          </div>

          {/* Content Management */}
          <Card className="p-6">
            {/* Tabs */}
            <div className="flex items-center gap-6 mb-6">
              <button
                onClick={() => setActiveTab('skills')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'skills'
                    ? 'bg-[#f26b38] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Tag className="h-4 w-4" />
                Kỹ năng ({skills.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'categories'
                    ? 'bg-[#f26b38] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Danh mục ({categories.length})
              </button>
            </div>

            {/* Search and Add */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={`Tìm kiếm ${activeTab === 'skills' ? 'kỹ năng' : 'danh mục'}...`}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-[#f26b38] hover:bg-[#e05a27] flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Thêm {activeTab === 'skills' ? 'kỹ năng' : 'danh mục'}
              </Button>
            </div>

            {/* Content List */}
            <div className="space-y-4">
              {activeTab === 'skills' ? (
                filteredSkills.length > 0 ? filteredSkills.map((skill) => (
                  <div key={skill.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#f26b38] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{skill.name}</h3>
                          {skill.category && (
                            <Badge variant="secondary">{skill.category}</Badge>
                          )}
                        </div>
                        {skill.description && (
                          <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Được sử dụng: {skill.usageCount} lần</span>
                          <span>Tạo: {new Date(skill.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setEditingItem(skill)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteSkill(skill.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12">
                    <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Không tìm thấy kỹ năng nào</p>
                  </div>
                )
              ) : (
                filteredCategories.length > 0 ? filteredCategories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#f26b38] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{category.name}</h3>
                          <Badge variant="outline">{category.jobCount} việc làm</Badge>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                        )}
                        <div className="text-xs text-gray-500">
                          Tạo: {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setEditingItem(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteCategory(category.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Không tìm thấy danh mục nào</p>
                  </div>
                )
              )}
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
