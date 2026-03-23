"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Server,
  Database,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  Cpu,
  MemoryStick,
  ArrowLeft,
  RefreshCw,
  Download,
  Upload,
  Settings,
  FileText,
  Eye,
  Trash2,
  Archive,
  Zap
} from "lucide-react";

interface SystemInfo {
  version: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    connections: number;
    status: 'healthy' | 'warning' | 'error';
    lastBackup: string;
  };
  environment: string;
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  source: string;
}

interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  lastRun?: string;
  nextRun?: string;
}

export default function AdminSystemPage() {
  const router = useRouter();
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'maintenance'>('overview');
  const [selectedLogLevel, setSelectedLogLevel] = useState('all');

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Fetch system info
      const infoResponse = await fetch('/api/admin/system/info', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (infoResponse.ok) {
        const infoData = await infoResponse.json();
        setSystemInfo(infoData);
      }

      // Fetch maintenance tasks
      setMaintenanceTasks([
        {
          id: 'cleanup-expired-jobs',
          name: 'Dọn dẹp tin tuyển dụng hết hạn',
          description: 'Xóa các tin tuyển dụng đã hết hạn và không còn hoạt động',
          status: 'idle',
          lastRun: '2025-01-25 10:30',
          nextRun: '2025-01-30 10:30'
        },
        {
          id: 'cleanup-old-notifications',
          name: 'Dọn dẹp thông báo cũ',
          description: 'Xóa các thông báo đã đọc và cũ hơn 30 ngày',
          status: 'idle',
          lastRun: '2025-01-24 15:45',
          nextRun: '2025-01-29 15:45'
        },
        {
          id: 'reindex-database',
          name: 'Tái lập chỉ mục cơ sở dữ liệu',
          description: 'Tối ưu hóa hiệu suất truy vấn cơ sở dữ liệu',
          status: 'idle',
          lastRun: '2025-01-20 02:00',
          nextRun: '2025-02-03 02:00'
        },
        {
          id: 'backup-database',
          name: 'Sao lưu cơ sở dữ liệu',
          description: 'Tạo bản sao lưu đầy đủ của cơ sở dữ liệu',
          status: 'completed',
          lastRun: '2025-01-28 23:00',
          nextRun: '2025-01-29 23:00'
        }
      ]);

      // Mock system logs
      setSystemLogs([
        {
          id: '1',
          timestamp: '2025-01-29 14:30:25',
          level: 'info',
          message: 'User authentication successful for user ID: 12345',
          source: 'auth-service'
        },
        {
          id: '2',
          timestamp: '2025-01-29 14:28:15',
          level: 'warn',
          message: 'High memory usage detected: 85%',
          source: 'system-monitor'
        },
        {
          id: '3',
          timestamp: '2025-01-29 14:25:40',
          level: 'error',
          message: 'Failed to send email notification to user@example.com',
          source: 'email-service'
        },
        {
          id: '4',
          timestamp: '2025-01-29 14:20:10',
          level: 'info',
          message: 'Database backup completed successfully',
          source: 'backup-service'
        },
        {
          id: '5',
          timestamp: '2025-01-29 14:15:30',
          level: 'debug',
          message: 'Cache invalidation completed for key: job_listings',
          source: 'cache-service'
        }
      ]);

    } catch (error) {
      console.error('Error fetching system data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runMaintenanceTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/system/maintenance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: taskId })
      });

      if (response.ok) {
        // Update task status
        setMaintenanceTasks(tasks =>
          tasks.map(task =>
            task.id === taskId
              ? { ...task, status: 'running' as const }
              : task
          )
        );

        // Simulate task completion after 3 seconds
        setTimeout(() => {
          setMaintenanceTasks(tasks =>
            tasks.map(task =>
              task.id === taskId
                ? { ...task, status: 'completed' as const, lastRun: new Date().toISOString() }
                : task
            )
          );
        }, 3000);
      }
    } catch (error) {
      console.error('Error running maintenance task:', error);
      setMaintenanceTasks(tasks =>
        tasks.map(task =>
          task.id === taskId
            ? { ...task, status: 'failed' as const }
            : task
        )
      );
    }
  };

  const exportLogs = async (format: 'txt' | 'json') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/system/logs/export?format=${format}&level=${selectedLogLevel}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-logs-${new Date().toISOString().split('T')[0]}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      idle: { label: 'Sẵn sàng', color: 'bg-gray-100 text-gray-700' },
      running: { label: 'Đang chạy', color: 'bg-blue-100 text-blue-700' },
      completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
      failed: { label: 'Thất bại', color: 'bg-red-100 text-red-700' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.idle;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getLogLevelBadge = (level: string) => {
    const levelConfig = {
      error: { label: 'Lỗi', color: 'bg-red-100 text-red-700' },
      warn: { label: 'Cảnh báo', color: 'bg-yellow-100 text-yellow-700' },
      info: { label: 'Thông tin', color: 'bg-blue-100 text-blue-700' },
      debug: { label: 'Debug', color: 'bg-gray-100 text-gray-700' }
    };

    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.info;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f26b38] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải thông tin hệ thống...</p>
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
                <h1 className="text-3xl font-bold">Quản lý hệ thống</h1>
                <p className="text-gray-600 mt-1">Giám sát và bảo trì hệ thống JobPortal.</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mb-8 bg-white p-1 rounded-lg border">
            {[
              { id: 'overview', label: 'Tổng quan', icon: Server },
              { id: 'logs', label: 'Logs hệ thống', icon: FileText },
              { id: 'maintenance', label: 'Bảo trì', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'logs' | 'maintenance')}
                className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#f26b38] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {systemInfo && (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* System Status Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Server className="h-8 w-8 text-blue-600" />
                        <div>
                          <div className="text-2xl font-bold">{systemInfo.version}</div>
                          <div className="text-sm text-gray-600">Phiên bản hệ thống</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Clock className="h-8 w-8 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold">{Math.floor(systemInfo.uptime / 3600)}h</div>
                          <div className="text-sm text-gray-600">Thời gian hoạt động</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Database className="h-8 w-8 text-purple-600" />
                        <div>
                          <div className="text-2xl font-bold">{systemInfo.database.connections}</div>
                          <div className="text-sm text-gray-600">Kết nối DB</div>
                        </div>
                      </div>
                      <Badge className={
                        systemInfo.database.status === 'healthy' ? 'bg-green-100 text-green-700' :
                        systemInfo.database.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {systemInfo.database.status === 'healthy' ? 'Khỏe mạnh' : systemInfo.database.status === 'warning' ? 'Cảnh báo' : 'Lỗi'}
                      </Badge>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="h-8 w-8 text-orange-600" />
                        <div>
                          <div className="text-2xl font-bold">{systemInfo.environment.toUpperCase()}</div>
                          <div className="text-sm text-gray-600">Môi trường</div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Resource Usage */}
                  <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MemoryStick className="h-5 w-5" />
                        Bộ nhớ RAM
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Sử dụng</span>
                            <span className="font-medium">{systemInfo.memory.used}MB / {systemInfo.memory.total}MB</span>
                          </div>
                          <Progress value={systemInfo.memory.percentage} className="h-3" />
                          <div className="text-xs text-gray-500 mt-1">{systemInfo.memory.percentage}% được sử dụng</div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <HardDrive className="h-5 w-5" />
                        Dung lượng đĩa
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Sử dụng</span>
                            <span className="font-medium">{systemInfo.disk.used}GB / {systemInfo.disk.total}GB</span>
                          </div>
                          <Progress value={systemInfo.disk.percentage} className="h-3" />
                          <div className="text-xs text-gray-500 mt-1">{systemInfo.disk.percentage}% được sử dụng</div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Hành động nhanh</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                        <Database className="h-6 w-6" />
                        <span className="text-sm">Sao lưu DB</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                        <Shield className="h-6 w-6" />
                        <span className="text-sm">Kiểm tra bảo mật</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                        <RefreshCw className="h-6 w-6" />
                        <span className="text-sm">Restart server</span>
                      </Button>
                      <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                        <Activity className="h-6 w-6" />
                        <span className="text-sm">Xem logs</span>
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Logs Tab */}
              {activeTab === 'logs' && (
                <div className="space-y-6">
                  {/* Log Filters */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Logs hệ thống</h3>
                      <div className="flex items-center gap-3">
                        <Select value={selectedLogLevel} onValueChange={setSelectedLogLevel}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="error">Lỗi</SelectItem>
                            <SelectItem value="warn">Cảnh báo</SelectItem>
                            <SelectItem value="info">Thông tin</SelectItem>
                            <SelectItem value="debug">Debug</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => exportLogs('txt')}>
                          <Download className="h-4 w-4 mr-2" />
                          Xuất TXT
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => exportLogs('json')}>
                          <Download className="h-4 w-4 mr-2" />
                          Xuất JSON
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {systemLogs
                        .filter(log => selectedLogLevel === 'all' || log.level === selectedLogLevel)
                        .map((log) => (
                        <div key={log.id} className="flex items-start gap-4 p-3 border border-gray-200 rounded-lg">
                          <div className="flex-shrink-0">
                            {getLogLevelBadge(log.level)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-1">
                              <span>{log.timestamp}</span>
                              <span className="font-medium">{log.source}</span>
                            </div>
                            <p className="text-sm">{log.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Maintenance Tab */}
              {activeTab === 'maintenance' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Tác vụ bảo trì hệ thống</h3>
                    <div className="space-y-4">
                      {maintenanceTasks.map((task) => (
                        <div key={task.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{task.name}</h4>
                              <p className="text-sm text-gray-600">{task.description}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {getStatusBadge(task.status)}
                              <Button
                                size="sm"
                                onClick={() => runMaintenanceTask(task.id)}
                                disabled={task.status === 'running'}
                                className="bg-[#f26b38] hover:bg-[#e05a27]"
                              >
                                {task.status === 'running' ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Đang chạy
                                  </>
                                ) : (
                                  <>
                                    <Zap className="h-4 w-4 mr-2" />
                                    Chạy ngay
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-xs text-gray-500">
                            {task.lastRun && (
                              <span>Lần chạy cuối: {new Date(task.lastRun).toLocaleString('vi-VN')}</span>
                            )}
                            {task.nextRun && (
                              <span>Lần chạy tiếp: {new Date(task.nextRun).toLocaleString('vi-VN')}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* System Health Alerts */}
                  <Card className="p-6 border-yellow-200 bg-yellow-50">
                    <h3 className="text-lg font-semibold mb-4 text-yellow-700 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Cảnh báo hệ thống
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-700">Cần dọn dẹp dữ liệu cũ</p>
                          <p className="text-xs text-yellow-600">Có 1,245 bản ghi logs cũ cần xóa</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-700">Cập nhật bảo mật</p>
                          <p className="text-xs text-yellow-600">3 gói phụ thuộc cần cập nhật</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
