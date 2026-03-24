# Admin API - Swagger Test Examples

## Mục lục
1. [Dashboard Overview](#1-dashboard-overview)
2. [User Management - Quản lý người dùng](#2-user-management)
3. [Job Management - Quản lý công việc](#3-job-management)
4. [Company Management - Quản lý công ty](#4-company-management)
5. [Candidate Management - Quản lý ứng viên](#5-candidate-management)
6. [Employer Management - Quản lý nhà tuyển dụng](#6-employer-management)
7. [Content Management - Quản lý nội dung](#7-content-management)
8. [Blog Management - Quản lý blog](#8-blog-management)
9. [Advertisement Management - Quản lý quảng cáo](#9-advertisement-management)
10. [Statistics & Reports - Thống kê & báo cáo](#10-statistics--reports)
11. [Service Package Management - Quản lý gói dịch vụ](#11-service-package-management)
12. [Violation Reports - Báo cáo vi phạm](#12-violation-reports)
13. [User Role Management - Quản lý phân quyền](#13-user-role-management)
14. [System Activity Monitoring - Theo dõi hệ thống](#14-system-activity-monitoring)

---

## 1. Dashboard Overview

### GET /admin/dashboard/overview
**Mô tả:** Lấy tổng quan thống kê dashboard

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "users": {
    "total": 15234,
    "active": 12456,
    "newToday": 156
  },
  "jobs": {
    "total": 8921,
    "active": 5432,
    "newToday": 89
  },
  "companies": {
    "total": 2341,
    "active": 1876,
    "newToday": 23
  },
  "applications": {
    "total": 45678,
    "pending": 3421,
    "newToday": 567
  },
  "revenue": {
    "total": 1250000000,
    "thisMonth": 125000000,
    "growth": 12.5
  },
  "system": {
    "uptime": 864000,
    "memoryUsage": 512,
    "diskUsage": 45
  }
}
```

---

### GET /admin/dashboard/charts
**Mô tả:** Lấy dữ liệu biểu đồ dashboard

**Request Query Parameters:**
```json
{
  "period": "30d"
}
```

**Response 200:**
```json
{
  "userRegistrations": [
    {
      "date": "2026-03-01",
      "count": 45
    },
    {
      "date": "2026-03-02",
      "count": 52
    }
  ],
  "jobPostings": [
    {
      "date": "2026-03-01",
      "count": 23
    },
    {
      "date": "2026-03-02",
      "count": 31
    }
  ],
  "applications": [
    {
      "date": "2026-03-01",
      "count": 156
    },
    {
      "date": "2026-03-02",
      "count": 189
    }
  ],
  "period": "30d"
}
```

---

## 2. User Management

### POST /admin/users
**Mô tả:** Tạo người dùng mới (admin only)

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "Password123!",
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "role": "job_seeker"
}
```

**Response 201:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "newuser@example.com",
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "isActive": true,
  "createdAt": "2026-03-24T03:30:00.000Z",
  "userRoles": [
    {
      "id": "role-id-123",
      "role": {
        "id": "job-seeker-role-id",
        "name": "job_seeker"
      }
    }
  ]
}
```

**Response 409 (Conflict):**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

---

### GET /admin/users
**Mô tả:** Lấy danh sách tất cả người dùng với bộ lọc admin

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "role": "job_seeker",
  "status": "active",
  "search": "nguyen"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "nguyenvana@example.com",
      "firstName": "Nguyễn",
      "lastName": "Văn A",
      "isActive": true,
      "createdAt": "2026-03-20T10:00:00.000Z",
      "userRoles": [
        {
          "id": "ur-1",
          "role": {
            "id": "role-1",
            "name": "job_seeker"
          }
        }
      ]
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
```

---

### GET /admin/users/:id/details
**Mô tả:** Lấy thông tin chi tiết người dùng cho admin

**Request URL:**
```
GET /admin/users/550e8400-e29b-41d4-a716-446655440001/details
```

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "email": "nguyenvana@example.com",
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "phone": "0901234567",
  "avatar": "https://example.com/avatar.jpg",
  "isActive": true,
  "statusReason": null,
  "lastLoginAt": "2026-03-24T02:15:00.000Z",
  "createdAt": "2026-01-15T08:00:00.000Z",
  "updatedAt": "2026-03-24T02:15:00.000Z",
  "userRoles": [
    {
      "id": "ur-1",
      "role": {
        "id": "role-1",
        "name": "job_seeker",
        "description": "Ứng viên tìm việc"
      }
    }
  ],
  "jobSeekerProfiles": [
    {
      "id": "jsp-1",
      "profileCompletion": 85,
      "currentPosition": "Frontend Developer",
      "yearsOfExperience": 3
    }
  ],
  "statistics": {
    "totalApplications": 25,
    "totalJobsPosted": 0,
    "activeJobs": 0
  }
}
```

---

### PUT /admin/users/:id/status
**Mô tả:** Cập nhật trạng thái người dùng (kích hoạt/vô hiệu hóa/cấm)

**Request URL:**
```
PUT /admin/users/550e8400-e29b-41d4-a716-446655440001/status
```

**Request Body:**
```json
{
  "status": "inactive",
  "reason": "Vi phạm quy định cộng đồng - spam"
}
```

**Response 200:**
```json
{
  "message": "User status updated successfully"
}
```

---

### PUT /admin/users/:id/role
**Mô tả:** Cập nhật vai trò người dùng

**Request URL:**
```
PUT /admin/users/550e8400-e29b-41d4-a716-446655440001/role
```

**Request Body:**
```json
{
  "role": "employer"
}
```

**Response 200:**
```json
{
  "message": "User role updated successfully"
}
```

---

### DELETE /admin/users/:id
**Mô tả:** Xóa người dùng (admin only)

**Request URL:**
```
DELETE /admin/users/550e8400-e29b-41d4-a716-446655440001
```

**Response 204:** (No Content)

---

## 3. Job Management

### GET /admin/jobs
**Mô tả:** Lấy danh sách tất cả công việc cho admin quản lý

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "status": "published",
  "company": "Tech",
  "search": "developer"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "job-001",
      "title": "Senior Frontend Developer",
      "status": "published",
      "company": {
        "id": "company-001",
        "name": "Tech Solutions Việt Nam"
      },
      "createdAt": "2026-03-20T10:00:00.000Z",
      "applicationCount": 45
    }
  ],
  "total": 500,
  "page": 1,
  "limit": 10,
  "totalPages": 50
}
```

---

### GET /admin/jobs/pending
**Mô tả:** Lấy danh sách công việc chờ duyệt

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 20
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "job-002",
      "title": "Backend Developer",
      "status": "draft",
      "company": {
        "id": "company-002",
        "name": "Innovative Software Co."
      },
      "category": {
        "id": "cat-1",
        "name": "IT - Phần mềm"
      },
      "createdAt": "2026-03-23T15:00:00.000Z",
      "skills": [
        {
          "id": "skill-1",
          "name": "Node.js"
        },
        {
          "id": "skill-2",
          "name": "TypeScript"
        }
      ]
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 20,
  "totalPages": 2
}
```

---

### POST /admin/jobs/:id/approve
**Mô tả:** Duyệt tin tuyển dụng

**Request URL:**
```
POST /admin/jobs/job-002/approve
```

**Request Body:**
```json
{
  "notes": "Tin đăng hợp lệ, đã được duyệt",
  "isVip": true,
  "isHot": false
}
```

**Response 200:**
```json
{
  "message": "Job approved successfully",
  "job": {
    "id": "job-002",
    "title": "Backend Developer",
    "status": "published"
  }
}
```

---

### POST /admin/jobs/:id/reject
**Mô tả:** Từ chối tin tuyển dụng

**Request URL:**
```
POST /admin/jobs/job-003/reject
```

**Request Body:**
```json
{
  "reason": "Tin đăng chứa thông tin không phù hợp. Vui lòng loại bỏ các từ ngữ phân biệt đối xử.",
  "reasonCode": "inappropriate"
}
```

**Response 200:**
```json
{
  "message": "Job rejected successfully",
  "job": {
    "id": "job-003",
    "title": "Marketing Manager",
    "status": "closed",
    "rejectionReason": "Tin đăng chứa thông tin không phù hợp. Vui lòng loại bỏ các từ ngữ phân biệt đối xử."
  }
}
```

---

### PUT /admin/jobs/:id/flags
**Mô tả:** Cập nhật cờ tin tuyển dụng (VIP, HOT, Featured)

**Request URL:**
```
PUT /admin/jobs/job-001/flags
```

**Request Body:**
```json
{
  "isVip": true,
  "isHot": true,
  "isFeatured": false,
  "isUrgent": true
}
```

**Response 200:**
```json
{
  "message": "Job flags updated successfully",
  "job": {
    "id": "job-001",
    "isVip": true,
    "isHot": true,
    "isFeatured": false,
    "isUrgent": true
  }
}
```

---

### PUT /admin/jobs/:id/status
**Mô tả:** Cập nhật trạng thái công việc

**Request URL:**
```
PUT /admin/jobs/job-001/status
```

**Request Body:**
```json
{
  "status": "closed",
  "reason": "Hết hạn tuyển dụng"
}
```

**Response 200:**
```json
{
  "message": "Job status updated successfully"
}
```

---

### DELETE /admin/jobs/:id
**Mô tả:** Xóa công việc (admin only)

**Request URL:**
```
DELETE /admin/jobs/job-001
```

**Response 204:** (No Content)

---

### GET /admin/jobs/statistics/by-category
**Mô tả:** Thống kê công việc theo ngành nghề

**Request Query Parameters:**
```json
{
  "startDate": "2026-03-01",
  "endDate": "2026-03-24"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "categoryName": "IT - Phần mềm",
      "jobCount": 234,
      "avgMinSalary": 15000000,
      "avgMaxSalary": 35000000
    },
    {
      "categoryName": "Kinh doanh",
      "jobCount": 189,
      "avgMinSalary": 10000000,
      "avgMaxSalary": 25000000
    },
    {
      "categoryName": "Marketing",
      "jobCount": 156,
      "avgMinSalary": 12000000,
      "avgMaxSalary": 28000000
    }
  ],
  "period": {
    "startDate": "2026-03-01",
    "endDate": "2026-03-24"
  }
}
```

---

### GET /admin/jobs/statistics/by-status
**Mô tả:** Thống kê công việc theo trạng thái

**Response 200:**
```json
{
  "data": [
    {
      "status": "published",
      "count": 1234
    },
    {
      "status": "draft",
      "count": 456
    },
    {
      "status": "closed",
      "count": 789
    },
    {
      "status": "expired",
      "count": 234
    }
  ]
}
```

---

## 4. Company Management

### GET /admin/companies
**Mô tả:** Lấy danh sách tất cả công ty cho admin quản lý

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "status": "active",
  "search": "Tech"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "company-001",
      "name": "Tech Solutions Việt Nam",
      "email": "contact@techsolutions.vn",
      "status": "active",
      "isVerified": true,
      "verifiedAt": "2026-02-15T10:00:00.000Z",
      "createdAt": "2026-01-10T08:00:00.000Z",
      "owner": {
        "id": "user-001",
        "email": "hr@techsolutions.vn",
        "firstName": "Trần",
        "lastName": "Văn B"
      }
    }
  ],
  "total": 200,
  "page": 1,
  "limit": 10,
  "totalPages": 20
}
```

---

### PUT /admin/companies/:id/status
**Mô tả:** Cập nhật trạng thái công ty

**Request URL:**
```
PUT /admin/companies/company-001/status
```

**Request Body:**
```json
{
  "status": "suspended",
  "reason": "Vi phạm quy định đăng tin tuyển dụng"
}
```

**Response 200:**
```json
{
  "message": "Company status updated successfully"
}
```

---

### PUT /admin/companies/:id/verify
**Mô tả:** Xác minh hoặc hủy xác minh công ty

**Request URL:**
```
PUT /admin/companies/company-002/verify
```

**Request Body:**
```json
{
  "isVerified": true,
  "adminNotes": "Đã xác minh giấy phép kinh doanh và thông tin công ty"
}
```

**Response 200:**
```json
{
  "message": "Company verified successfully",
  "company": {
    "id": "company-002",
    "name": "Innovative Software Co.",
    "isVerified": true,
    "verifiedAt": "2026-03-24T03:45:00.000Z"
  }
}
```

---

### GET /admin/companies/pending-verifications
**Mô tả:** Lấy danh sách công ty chờ xác minh

**Response 200:**
```json
{
  "data": [
    {
      "id": "company-003",
      "name": "Startup Tech Hub",
      "email": "info@startuptechub.vn",
      "isVerified": false,
      "createdAt": "2026-03-22T14:00:00.000Z",
      "owner": {
        "id": "user-005",
        "email": "founder@startuptechub.vn",
        "firstName": "Lê",
        "lastName": "Văn C"
      }
    }
  ],
  "total": 15
}
```

---

### DELETE /admin/companies/:id
**Mô tả:** Xóa công ty (admin only)

**Request URL:**
```
DELETE /admin/companies/company-003
```

**Response 204:** (No Content)

---

## 5. Candidate Management

### GET /admin/candidates
**Mô tả:** Lấy danh sách tất cả ứng viên với thông tin hồ sơ

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "profileStatus": "pending",
  "status": "active",
  "search": "nguyen"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "user-010",
      "email": "candidate@example.com",
      "firstName": "Nguyễn",
      "lastName": "Thị D",
      "isActive": true,
      "profileStatus": "pending",
      "profileCompletion": 85,
      "createdAt": "2026-03-15T10:00:00.000Z",
      "jobSeekerProfiles": [
        {
          "id": "jsp-010",
          "currentPosition": "Frontend Developer",
          "yearsOfExperience": 3
        }
      ]
    }
  ],
  "total": 500,
  "page": 1,
  "limit": 10,
  "totalPages": 50
}
```

---

### GET /admin/candidates/:id/profile
**Mô tả:** Lấy hồ sơ chi tiết ứng viên để xem xét

**Request URL:**
```
GET /admin/candidates/user-010/profile
```

**Response 200:**
```json
{
  "id": "user-010",
  "email": "candidate@example.com",
  "firstName": "Nguyễn",
  "lastName": "Thị D",
  "phone": "0901234567",
  "avatar": "https://example.com/avatar-d.jpg",
  "isActive": true,
  "createdAt": "2026-03-15T10:00:00.000Z",
  "profile": {
    "id": "jsp-010",
    "profileCompletion": 85,
    "currentPosition": "Frontend Developer",
    "yearsOfExperience": 3,
    "education": [
      {
        "id": "edu-1",
        "school": "Đại học Bách Khoa Hà Nội",
        "degree": "Cử nhân",
        "fieldOfStudy": "Khoa học máy tính",
        "startYear": 2018,
        "endYear": 2022
      }
    ],
    "experience": [
      {
        "id": "exp-1",
        "company": "Tech Corp",
        "position": "Junior Developer",
        "startDate": "2022-06-01",
        "endDate": "2024-12-31",
        "description": "Phát triển ứng dụng web với React"
      }
    ],
    "skills": [
      {
        "id": "skill-1",
        "name": "React",
        "level": "Intermediate"
      },
      {
        "id": "skill-2",
        "name": "TypeScript",
        "level": "Intermediate"
      }
    ]
  },
  "statistics": {
    "totalApplications": 25,
    "profileCompletion": 85
  }
}
```

---

### PUT /admin/candidates/:id/approve-profile
**Mô tả:** Duyệt hồ sơ ứng viên

**Request URL:**
```
PUT /admin/candidates/user-010/approve-profile
```

**Request Body:**
```json
{
  "notes": "Hồ sơ đầy đủ và hợp lệ"
}
```

**Response 200:**
```json
{
  "message": "Candidate profile approved successfully"
}
```

---

### PUT /admin/candidates/:id/reject-profile
**Mô tả:** Từ chối hồ sơ ứng viên

**Request URL:**
```
PUT /admin/candidates/user-011/reject-profile
```

**Request Body:**
```json
{
  "reason": "Hồ sơ thiếu thông tin kinh nghiệm làm việc. Vui lòng cập nhật đầy đủ."
}
```

**Response 200:**
```json
{
  "message": "Candidate profile rejected successfully"
}
```

---

### PUT /admin/candidates/:id/lock-account
**Mô tả:** Khóa tài khoản ứng viên

**Request URL:**
```
PUT /admin/candidates/user-012/lock-account
```

**Request Body:**
```json
{
  "reason": "Phát hiện hành vi gian lận trong quá trình ứng tuyển",
  "duration": 30
}
```

**Response 200:**
```json
{
  "message": "Candidate account locked successfully"
}
```

---

### PUT /admin/candidates/:id/unlock-account
**Mô tả:** Mở khóa tài khoản ứng viên

**Request URL:**
```
PUT /admin/candidates/user-012/unlock-account
```

**Request Body:**
```json
{
  "reason": "Đã xác minh và xử lý vấn đề, mở khóa tài khoản"
}
```

**Response 200:**
```json
{
  "message": "Candidate account unlocked successfully"
}
```

---

### GET /admin/candidates/:id/activity-history
**Mô tả:** Lấy lịch sử hoạt động của ứng viên

**Request URL:**
```
GET /admin/candidates/user-010/activity-history
```

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 20,
  "startDate": "2026-03-01",
  "endDate": "2026-03-24"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "app-001",
      "status": "pending",
      "job": {
        "id": "job-001",
        "title": "Senior Frontend Developer",
        "company": {
          "name": "Tech Solutions Việt Nam"
        }
      },
      "createdAt": "2026-03-20T10:00:00.000Z"
    },
    {
      "id": "app-002",
      "status": "reviewing",
      "job": {
        "id": "job-002",
        "title": "React Developer",
        "company": {
          "name": "Innovative Software Co."
        }
      },
      "createdAt": "2026-03-18T15:30:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 20
}
```

---

## 6. Employer Management

### GET /admin/employers
**Mô tả:** Lấy danh sách tất cả nhà tuyển dụng

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "companyStatus": "active",
  "verificationStatus": "verified",
  "search": "Tech"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "user-020",
      "email": "hr@techsolutions.vn",
      "firstName": "Trần",
      "lastName": "Văn B",
      "isActive": true,
      "createdAt": "2026-01-10T08:00:00.000Z",
      "employerProfiles": [
        {
          "id": "ep-020",
          "company": {
            "id": "company-001",
            "name": "Tech Solutions Việt Nam",
            "status": "active",
            "isVerified": true
          }
        }
      ]
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
```

---

### GET /admin/employers/:id/company
**Mô tả:** Lấy thông tin chi tiết công ty của nhà tuyển dụng

**Request URL:**
```
GET /admin/employers/user-020/company
```

**Response 200:**
```json
{
  "id": "user-020",
  "email": "hr@techsolutions.vn",
  "firstName": "Trần",
  "lastName": "Văn B",
  "company": {
    "id": "company-001",
    "name": "Tech Solutions Việt Nam",
    "description": "Công ty công nghệ hàng đầu Việt Nam",
    "website": "https://techsolutions.vn",
    "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
    "employeeCount": "100-500",
    "status": "active",
    "isVerified": true,
    "verifiedAt": "2026-02-15T10:00:00.000Z"
  },
  "statistics": {
    "totalJobs": 45,
    "activeJobs": 12
  }
}
```

---

### PUT /admin/employers/:id/approve-company
**Mô tả:** Duyệt công ty của nhà tuyển dụng

**Request URL:**
```
PUT /admin/employers/user-021/approve-company
```

**Request Body:**
```json
{
  "notes": "Đã xác minh thông tin công ty và giấy phép kinh doanh"
}
```

**Response 200:**
```json
{
  "message": "Employer company approved successfully"
}
```

---

### PUT /admin/employers/:id/reject-company
**Mô tả:** Từ chối công ty của nhà tuyển dụng

**Request URL:**
```
PUT /admin/employers/user-022/reject-company
```

**Request Body:**
```json
{
  "reason": "Không thể xác minh thông tin công ty. Vui lòng cung cấp giấy phép kinh doanh hợp lệ."
}
```

**Response 200:**
```json
{
  "message": "Employer company rejected successfully"
}
```

---

### PUT /admin/employers/:id/suspend-company
**Mô tả:** Tạm khóa công ty của nhà tuyển dụng

**Request URL:**
```
PUT /admin/employers/user-023/suspend-company
```

**Request Body:**
```json
{
  "reason": "Vi phạm quy định đăng tin tuyển dụng phân biệt đối xử",
  "duration": 30
}
```

**Response 200:**
```json
{
  "message": "Employer company suspended successfully"
}
```

---

### GET /admin/employers/:id/activity-history
**Mô tả:** Lấy lịch sử hoạt động của nhà tuyển dụng

**Request URL:**
```
GET /admin/employers/user-020/activity-history
```

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 20,
  "startDate": "2026-03-01",
  "endDate": "2026-03-24"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "job-001",
      "title": "Senior Frontend Developer",
      "status": "published",
      "company": {
        "name": "Tech Solutions Việt Nam"
      },
      "applications": [
        {
          "id": "app-001"
        },
        {
          "id": "app-002"
        }
      ],
      "createdAt": "2026-03-20T10:00:00.000Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}
```

---

### GET /admin/employers/:id/jobs
**Mô tả:** Lấy danh sách tin tuyển dụng của nhà tuyển dụng

**Request URL:**
```
GET /admin/employers/user-020/jobs
```

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "status": "published"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "job-001",
      "title": "Senior Frontend Developer",
      "status": "published",
      "company": {
        "name": "Tech Solutions Việt Nam"
      },
      "applications": [
        {
          "id": "app-001"
        }
      ],
      "createdAt": "2026-03-20T10:00:00.000Z"
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

---

### PUT /admin/employers/:id/jobs/:jobId/violation
**Mô tả:** Báo cáo vi phạm tin tuyển dụng

**Request URL:**
```
PUT /admin/employers/user-020/jobs/job-001/violation
```

**Request Body:**
```json
{
  "violationType": "misleading",
  "description": "Mức lương đăng tuyển không đúng với thực tế",
  "action": "warning"
}
```

**Response 200:**
```json
{
  "message": "Job violation reported successfully"
}
```

---

## 7. Content Management

### GET /admin/content/stats
**Mô tả:** Lấy thống kê quản lý nội dung

**Response 200:**
```json
{
  "totalSkills": 456,
  "totalCategories": 25,
  "skillsThisMonth": 23,
  "categoriesThisMonth": 3
}
```

---

### GET /admin/content/skills
**Mô tả:** Lấy danh sách tất cả kỹ năng

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "search": "react"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "skill-001",
      "name": "React",
      "description": "Thư viện JavaScript xây dựng giao diện người dùng",
      "category": "Frontend",
      "usageCount": 234,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "total": 456,
  "page": 1,
  "limit": 10,
  "totalPages": 46
}
```

---

### POST /admin/content/skills
**Mô tả:** Tạo kỹ năng mới

**Request Body:**
```json
{
  "name": "Vue.js 3",
  "description": "Framework JavaScript tiến bộ cho xây dựng giao diện",
  "category": "Frontend"
}
```

**Response 201:**
```json
{
  "id": "skill-457",
  "name": "Vue.js 3",
  "description": "Framework JavaScript tiến bộ cho xây dựng giao diện",
  "category": "Frontend",
  "createdAt": "2026-03-24T03:50:00.000Z"
}
```

---

### PUT /admin/content/skills/:id
**Mô tả:** Cập nhật kỹ năng

**Request URL:**
```
PUT /admin/content/skills/skill-001
```

**Request Body:**
```json
{
  "name": "React 18",
  "description": "Thư viện JavaScript phiên bản 18",
  "category": "Frontend"
}
```

**Response 200:**
```json
{
  "message": "Skill updated successfully"
}
```

---

### DELETE /admin/content/skills/:id
**Mô tả:** Xóa kỹ năng

**Request URL:**
```
DELETE /admin/content/skills/skill-457
```

**Response 204:** (No Content)

---

### GET /admin/content/job-categories
**Mô tả:** Lấy danh sách tất cả danh mục ngành nghề

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "search": "IT"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "cat-001",
      "name": "IT - Phần mềm",
      "description": "Lập trình, phát triển phần mềm",
      "usageCount": 567,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

### POST /admin/content/job-categories
**Mô tả:** Tạo danh mục ngành nghề mới

**Request Body:**
```json
{
  "name": "AI & Machine Learning",
  "description": "Trí tuệ nhân tạo và học máy"
}
```

**Response 201:**
```json
{
  "id": "cat-026",
  "name": "AI & Machine Learning",
  "description": "Trí tuệ nhân tạo và học máy",
  "createdAt": "2026-03-24T03:55:00.000Z"
}
```

---

### PUT /admin/content/job-categories/:id
**Mô tả:** Cập nhật danh mục ngành nghề

**Request URL:**
```
PUT /admin/content/job-categories/cat-001
```

**Request Body:**
```json
{
  "name": "IT & Software Development",
  "description": "Phát triển phần mềm và công nghệ thông tin"
}
```

**Response 200:**
```json
{
  "message": "Job category updated successfully"
}
```

---

### DELETE /admin/content/job-categories/:id
**Mô tả:** Xóa danh mục ngành nghề

**Request URL:**
```
DELETE /admin/content/job-categories/cat-026
```

**Response 204:** (No Content)

---

### GET /admin/job-categories/statistics
**Mô tả:** Lấy thống kê danh mục ngành nghề với xu hướng

**Request Query Parameters:**
```json
{
  "period": "30d"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "cat-001",
      "name": "IT - Phần mềm",
      "jobCount": 234,
      "applicationCount": 1567,
      "trend": "up"
    },
    {
      "id": "cat-002",
      "name": "Kinh doanh",
      "jobCount": 189,
      "applicationCount": 1234,
      "trend": "up"
    }
  ],
  "period": "30d"
}
```

---

### PUT /admin/job-categories/:id/salary-range
**Mô tả:** Cập nhật mức lương trung bình cho danh mục

**Request URL:**
```
PUT /admin/job-categories/cat-001/salary-range
```

**Request Body:**
```json
{
  "minSalary": 15000000,
  "maxSalary": 45000000,
  "currency": "VND"
}
```

**Response 200:**
```json
{
  "message": "Salary range updated successfully",
  "category": {
    "id": "cat-001",
    "name": "IT - Phần mềm"
  }
}
```

---

### GET /admin/job-categories/trends
**Mô tả:** Lấy xu hướng tuyển dụng theo danh mục

**Request Query Parameters:**
```json
{
  "period": "30d"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "date": "2026-03-01",
      "categoryName": "IT - Phần mềm",
      "jobCount": 15
    },
    {
      "date": "2026-03-02",
      "categoryName": "IT - Phần mềm",
      "jobCount": 18
    },
    {
      "date": "2026-03-01",
      "categoryName": "Kinh doanh",
      "jobCount": 12
    }
  ],
  "period": "30d"
}
```

---

## 8. Blog Management

### GET /admin/blogs
**Mô tả:** Lấy danh sách tất cả bài viết blog cho admin

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 20,
  "status": "published",
  "category": "career_guide",
  "search": "phỏng vấn"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "blog-001",
      "title": "10 mẹo phỏng vấn thành công",
      "excerpt": "Những mẹo hữu ích giúp bạn tự tin hơn trong buổi phỏng vấn...",
      "category": "interview_tips",
      "status": "published",
      "isFeatured": true,
      "viewCount": 1234,
      "commentCount": 45,
      "author": {
        "id": "user-001",
        "firstName": "Admin",
        "lastName": "System"
      },
      "createdAt": "2026-03-15T10:00:00.000Z",
      "publishedAt": "2026-03-15T14:00:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

---

### POST /admin/blogs
**Mô tả:** Tạo bài viết blog mới

**Request Body:**
```json
{
  "title": "Xu hướng việc làm IT năm 2026",
  "content": "<h2>Những kỹ năng hot nhất năm 2026</h2><p>Nội dung chi tiết về xu hướng việc làm...</p>",
  "excerpt": "Tổng quan về các vị trí và kỹ năng IT được săn đón nhất năm 2026",
  "category": "market_news",
  "tags": ["IT", "việc làm", "xu hướng", "2026"],
  "featuredImage": "https://example.com/images/it-trends-2026.jpg",
  "status": "published",
  "isFeatured": true
}
```

**Response 201:**
```json
{
  "message": "Blog post created successfully",
  "id": "blog-151",
  "title": "Xu hướng việc làm IT năm 2026",
  "status": "published",
  "slug": "xu-huong-viec-lam-it-nam-2026",
  "createdAt": "2026-03-24T04:00:00.000Z"
}
```

---

### PUT /admin/blogs/:id
**Mô tả:** Cập nhật bài viết blog

**Request URL:**
```
PUT /admin/blogs/blog-001
```

**Request Body:**
```json
{
  "title": "10 mẹo phỏng vấn thành công (Cập nhật)",
  "content": "<h2>Nội dung đã cập nhật</h2><p>Nội dung chi tiết...</p>",
  "excerpt": "Bản cập nhật với những mẹo mới nhất",
  "status": "published",
  "isFeatured": false
}
```

**Response 200:**
```json
{
  "message": "Blog post updated successfully",
  "id": "blog-001",
  "title": "10 mẹo phỏng vấn thành công (Cập nhật)",
  "updatedAt": "2026-03-24T04:05:00.000Z"
}
```

---

### DELETE /admin/blogs/:id
**Mô tả:** Xóa bài viết blog

**Request URL:**
```
DELETE /admin/blogs/blog-151
```

**Response 204:** (No Content)

---

### GET /admin/blogs/statistics
**Mô tả:** Lấy thống kê blog

**Response 200:**
```json
{
  "totalPosts": 150,
  "publishedPosts": 120,
  "draftPosts": 25,
  "archivedPosts": 5,
  "totalViews": 456789,
  "totalComments": 2345,
  "topCategories": [
    {
      "category": "career_guide",
      "count": 45
    },
    {
      "category": "interview_tips",
      "count": 38
    },
    {
      "category": "market_news",
      "count": 32
    }
  ]
}
```

---

### GET /admin/blog/comments/pending
**Mô tả:** Lấy danh sách bình luận blog chờ duyệt

**Response 200:**
```json
{
  "data": [
    {
      "id": "comment-001",
      "content": "Bài viết rất hữu ích, cảm ơn tác giả!",
      "isApproved": false,
      "blog": {
        "id": "blog-001",
        "title": "10 mẹo phỏng vấn thành công"
      },
      "author": {
        "id": "user-050",
        "firstName": "Lê",
        "lastName": "Văn E"
      },
      "createdAt": "2026-03-23T16:00:00.000Z"
    }
  ],
  "total": 15
}
```

---

### PUT /admin/blog/comments/:id/approve
**Mô tả:** Duyệt bình luận blog

**Request URL:**
```
PUT /admin/blog/comments/comment-001/approve
```

**Response 200:**
```json
{
  "id": "comment-001",
  "content": "Bài viết rất hữu ích, cảm ơn tác giả!",
  "isApproved": true,
  "approvedAt": "2026-03-24T04:10:00.000Z"
}
```

---

### DELETE /admin/blog/comments/:id/reject
**Mô tả:** Từ chối bình luận blog

**Request URL:**
```
DELETE /admin/blog/comments/comment-002/reject
```

**Response 204:** (No Content)

---

### POST /admin/blog/comments/bulk-approve
**Mô tả:** Duyệt hàng loạt bình luận

**Request Body:**
```json
{
  "commentIds": ["comment-001", "comment-002", "comment-003"]
}
```

**Response 200:**
```json
{
  "approved": 3,
  "failed": 0
}
```

---

### POST /admin/blog/comments/bulk-reject
**Mô tả:** Từ chối hàng loạt bình luận

**Request Body:**
```json
{
  "commentIds": ["comment-004", "comment-005"]
}
```

**Response 200:**
```json
{
  "rejected": 2,
  "failed": 0
}
```

---

## 9. Advertisement Management

### GET /admin/advertisements
**Mô tả:** Lấy danh sách tất cả quảng cáo

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 20,
  "status": "active",
  "position": "homepage_banner"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "ad-001",
      "title": "Khuyến mãi mùa hè",
      "imageUrl": "https://example.com/banners/summer-sale.jpg",
      "targetUrl": "https://example.com/summer-sale",
      "position": "homepage_banner",
      "status": "active",
      "startDate": "2026-03-01",
      "endDate": "2026-03-31",
      "budget": 5000000,
      "spent": 2500000,
      "impressions": 125000,
      "clicks": 3750,
      "advertiserName": "Công ty ABC",
      "advertiserEmail": "marketing@abc.com",
      "createdAt": "2026-02-25T10:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 20,
  "totalPages": 2
}
```

---

### POST /admin/advertisements
**Mô tả:** Tạo quảng cáo mới

**Request Body:**
```json
{
  "title": "Tuyển dụng IT Developer",
  "imageUrl": "https://example.com/banners/it-recruitment.jpg",
  "targetUrl": "https://example.com/careers/it",
  "position": "sidebar",
  "startDate": "2026-04-01",
  "endDate": "2026-04-30",
  "budget": 3000000,
  "advertiserName": "Tech Company XYZ",
  "advertiserEmail": "hr@techxyz.com"
}
```

**Response 201:**
```json
{
  "message": "Advertisement created successfully",
  "id": "ad-026",
  "title": "Tuyển dụng IT Developer",
  "position": "sidebar",
  "status": "active",
  "createdAt": "2026-03-24T04:15:00.000Z"
}
```

---

### PUT /admin/advertisements/:id
**Mô tả:** Cập nhật quảng cáo

**Request URL:**
```
PUT /admin/advertisements/ad-001
```

**Request Body:**
```json
{
  "title": "Khuyến mãi mùa hè - Giảm giá 50%",
  "budget": 7000000,
  "status": "active"
}
```

**Response 200:**
```json
{
  "message": "Advertisement updated successfully",
  "id": "ad-001",
  "title": "Khuyến mãi mùa hè - Giảm giá 50%",
  "updatedAt": "2026-03-24T04:20:00.000Z"
}
```

---

### DELETE /admin/advertisements/:id
**Mô tả:** Xóa quảng cáo

**Request URL:**
```
DELETE /admin/advertisements/ad-026
```

**Response 204:** (No Content)

---

### GET /admin/advertisements/:id/statistics
**Mô tả:** Lấy thống kê hiệu suất quảng cáo

**Request URL:**
```
GET /admin/advertisements/ad-001/statistics
```

**Response 200:**
```json
{
  "id": "ad-001",
  "title": "Khuyến mãi mùa hè",
  "impressions": 125000,
  "clicks": 3750,
  "ctr": 3.0,
  "conversions": 125,
  "spent": 2500000,
  "remainingBudget": 2500000,
  "dailyStats": [
    {
      "date": "2026-03-20",
      "impressions": 5000,
      "clicks": 150,
      "spent": 100000
    },
    {
      "date": "2026-03-21",
      "impressions": 5500,
      "clicks": 165,
      "spent": 110000
    }
  ]
}
```

---

### GET /admin/advertisements/statistics/overview
**Mô tả:** Lấy tổng quan thống kê quảng cáo

**Response 200:**
```json
{
  "totalAds": 25,
  "activeAds": 18,
  "totalImpressions": 1250000,
  "totalClicks": 37500,
  "totalSpent": 25000000,
  "averageCTR": 3.0
}
```

---

## 10. Statistics & Reports

### 10.1 User Statistics

### GET /admin/statistics/users/overview
**Mô tả:** Lấy tổng quan thống kê người dùng

**Request Query Parameters:**
```json
{
  "period": "30d"
}
```

**Response 200:**
```json
{
  "totalUsers": 15234,
  "newUsers": 456,
  "activeUsers": 12456,
  "jobSeekers": 11234,
  "employers": 3456,
  "admins": 25,
  "hrs": 519,
  "growthRate": 3.09,
  "period": "30d"
}
```

---

### GET /admin/statistics/users/registrations
**Mô tả:** Lấy thống kê đăng ký người dùng

**Request Query Parameters:**
```json
{
  "period": "30d",
  "groupBy": "day"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "date": "2026-03-01",
      "registrations": 45
    },
    {
      "date": "2026-03-02",
      "registrations": 52
    },
    {
      "date": "2026-03-03",
      "registrations": 38
    }
  ],
  "period": "30d",
  "groupBy": "day"
}
```

---

### GET /admin/statistics/users/conversion
**Mô tả:** Lấy thống kê tỷ lệ chuyển đổi người dùng

**Request Query Parameters:**
```json
{
  "period": "30d"
}
```

**Response 200:**
```json
{
  "totalRegistrations": 456,
  "activeUsers": 389,
  "usersWithApplications": 234,
  "activationRate": 85.31,
  "applicationRate": 51.32,
  "period": "30d"
}
```

---

### GET /admin/statistics/users/activity
**Mô tả:** Lấy thống kê hoạt động người dùng

**Request Query Parameters:**
```json
{
  "period": "30d"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "date": "2026-03-01",
      "activeUsers": 1234
    },
    {
      "date": "2026-03-02",
      "activeUsers": 1345
    },
    {
      "date": "2026-03-03",
      "activeUsers": 1189
    }
  ],
  "period": "30d"
}
```

---

### 10.2 Job Statistics

### GET /admin/statistics/jobs/overview
**Mô tả:** Lấy tổng quan thống kê việc làm

**Request Query Parameters:**
```json
{
  "period": "30d"
}
```

**Response 200:**
```json
{
  "totalJobs": 8921,
  "newJobs": 234,
  "activeJobs": 5432,
  "totalApplications": 45678,
  "avgApplicationsPerJob": 8.41,
  "period": "30d"
}
```

---

### GET /admin/statistics/jobs/applications
**Mô tả:** Lấy thống kê tỷ lệ ứng tuyển

**Request Query Parameters:**
```json
{
  "period": "30d",
  "categoryId": "cat-001"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "date": "2026-03-01",
      "applications": 156
    },
    {
      "date": "2026-03-02",
      "applications": 189
    },
    {
      "date": "2026-03-03",
      "applications": 167
    }
  ],
  "period": "30d",
  "categoryId": "cat-001"
}
```

---

### GET /admin/statistics/jobs/hot-categories
**Mô tả:** Lấy danh sách ngành nghề hot nhất

**Request Query Parameters:**
```json
{
  "period": "30d",
  "limit": 10
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "cat-001",
      "name": "IT - Phần mềm",
      "jobCount": 234,
      "applicationCount": 5678
    },
    {
      "id": "cat-002",
      "name": "Kinh doanh",
      "jobCount": 189,
      "applicationCount": 4567
    },
    {
      "id": "cat-003",
      "name": "Marketing",
      "jobCount": 156,
      "applicationCount": 3456
    }
  ],
  "period": "30d"
}
```

---

### GET /admin/statistics/jobs/salary-trends
**Mô tả:** Lấy xu hướng lương

**Request Query Parameters:**
```json
{
  "categoryId": "cat-001",
  "period": "90d"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "month": "2026-01",
      "avgMinSalary": 14000000,
      "avgMaxSalary": 32000000
    },
    {
      "month": "2026-02",
      "avgMinSalary": 14500000,
      "avgMaxSalary": 33500000
    },
    {
      "month": "2026-03",
      "avgMinSalary": 15000000,
      "avgMaxSalary": 35000000
    }
  ],
  "categoryId": "cat-001",
  "period": "90d"
}
```

---

### 10.3 Revenue Reports

### GET /admin/reports/revenue/overview
**Mô tả:** Lấy tổng quan doanh thu

**Request Query Parameters:**
```json
{
  "period": "30d"
}
```

**Response 200:**
```json
{
  "totalRevenue": 1250000000,
  "transactionCount": 456,
  "averageTransaction": 2741228.07,
  "period": "30d"
}
```

---

### GET /admin/reports/revenue/by-package
**Mô tả:** Lấy doanh thu theo gói dịch vụ

**Request Query Parameters:**
```json
{
  "period": "30d"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "packageName": "Free",
      "revenue": 0,
      "count": 1234
    },
    {
      "packageName": "Basic",
      "revenue": 125000000,
      "count": 234
    },
    {
      "packageName": "Premium",
      "revenue": 875000000,
      "count": 156
    },
    {
      "packageName": "Enterprise",
      "revenue": 250000000,
      "count": 12
    }
  ],
  "period": "30d"
}
```

---

### GET /admin/reports/revenue/payment-methods
**Mô tả:** Lấy thống kê phương thức thanh toán

**Request Query Parameters:**
```json
{
  "period": "30d"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "method": "bank_transfer",
      "count": 234,
      "total": 625000000
    },
    {
      "method": "credit_card",
      "count": 156,
      "total": 437500000
    },
    {
      "method": "e_wallet",
      "count": 66,
      "total": 187500000
    }
  ],
  "period": "30d"
}
```

---

### GET /admin/reports/revenue/transactions
**Mô tả:** Lấy giao dịch gần đây

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 20,
  "status": "completed",
  "startDate": "2026-03-01",
  "endDate": "2026-03-24"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "payment-001",
      "amount": 990000,
      "status": "completed",
      "paymentMethod": "bank_transfer",
      "subscription": {
        "id": "sub-001",
        "user": {
          "id": "user-020",
          "email": "hr@techsolutions.vn",
          "firstName": "Trần",
          "lastName": "Văn B"
        }
      },
      "createdAt": "2026-03-23T10:00:00.000Z"
    }
  ],
  "total": 456,
  "page": 1,
  "limit": 20,
  "totalPages": 23
}
```

---

### GET /admin/reports/revenue/financial
**Mô tả:** Lấy báo cáo tài chính

**Request Query Parameters:**
```json
{
  "period": "monthly",
  "year": 2026
}
```

**Response 200:**
```json
{
  "year": 2026,
  "period": "monthly",
  "totalRevenue": 3750000000,
  "totalExpenses": 1250000000,
  "netProfit": 2500000000,
  "monthlyBreakdown": [
    {
      "month": "2026-01",
      "revenue": 1200000000,
      "expenses": 400000000,
      "profit": 800000000
    },
    {
      "month": "2026-02",
      "revenue": 1300000000,
      "expenses": 420000000,
      "profit": 880000000
    },
    {
      "month": "2026-03",
      "revenue": 1250000000,
      "expenses": 430000000,
      "profit": 820000000
    }
  ],
  "packageRevenue": [
    {
      "packageName": "Basic",
      "revenue": 750000000
    },
    {
      "packageName": "Premium",
      "revenue": 2500000000
    },
    {
      "packageName": "Enterprise",
      "revenue": 500000000
    }
  ],
  "paymentMethodBreakdown": [
    {
      "method": "bank_transfer",
      "total": 1875000000,
      "percentage": 50
    },
    {
      "method": "credit_card",
      "total": 1312500000,
      "percentage": 35
    },
    {
      "method": "e_wallet",
      "total": 562500000,
      "percentage": 15
    }
  ]
}
```

---

## 11. Service Package Management

### GET /admin/packages
**Mô tả:** Lấy danh sách tất cả gói dịch vụ

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "status": "active"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "pkg-001",
      "name": "Free",
      "description": "Gói miễn phí cho nhà tuyển dụng mới",
      "price": 0,
      "duration": 30,
      "features": [
        "5 tin tuyển dụng/tháng",
        "Hỗ trợ cơ bản",
        "Hiển thị tiêu chuẩn"
      ],
      "maxJobs": 5,
      "maxApplications": 50,
      "isFeatured": false,
      "status": "active"
    },
    {
      "id": "pkg-002",
      "name": "Basic",
      "description": "Gói cơ bản cho doanh nghiệp nhỏ",
      "price": 299000,
      "duration": 30,
      "features": [
        "20 tin tuyển dụng/tháng",
        "Hỗ trợ email",
        "Hiển thị ưu tiên",
        "Thống kê cơ bản"
      ],
      "maxJobs": 20,
      "maxApplications": 200,
      "isFeatured": false,
      "status": "active"
    },
    {
      "id": "pkg-003",
      "name": "Premium",
      "description": "Gói cao cấp cho doanh nghiệp vừa",
      "price": 999000,
      "duration": 30,
      "features": [
        "Không giới hạn tin tuyển dụng",
        "Hỗ trợ ưu tiên 24/7",
        "Hiển thị VIP",
        "Thống kê nâng cao",
        "Tin HOT miễn phí",
        "CV không giới hạn"
      ],
      "maxJobs": -1,
      "maxApplications": -1,
      "isFeatured": true,
      "status": "active"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### POST /admin/packages
**Mô tả:** Tạo gói dịch vụ mới

**Request Body:**
```json
{
  "name": "Enterprise",
  "description": "Gói doanh nghiệp lớn với đầy đủ tính năng",
  "price": 2999000,
  "duration": 365,
  "features": [
    "Không giới hạn tất cả",
    "Dedicated Account Manager",
    "API tích hợp",
    "Custom branding",
    "Báo cáo chi tiết",
    "Đào tạo nhân viên"
  ],
  "maxJobs": -1,
  "maxApplications": -1,
  "isFeatured": true
}
```

**Response 201:**
```json
{
  "message": "Package created successfully",
  "id": "pkg-006",
  "name": "Enterprise"
}
```

---

### PUT /admin/packages/:id
**Mô tả:** Cập nhật gói dịch vụ

**Request URL:**
```
PUT /admin/packages/pkg-002
```

**Request Body:**
```json
{
  "name": "Basic Plus",
  "description": "Gói cơ bản nâng cao",
  "price": 399000,
  "maxJobs": 30,
  "maxApplications": 300,
  "features": [
    "30 tin tuyển dụng/tháng",
    "Hỗ trợ email & chat",
    "Hiển thị ưu tiên cao",
    "Thống kê nâng cao",
    "5 tin HOT/tháng"
  ]
}
```

**Response 200:**
```json
{
  "message": "Package updated successfully",
  "id": "pkg-002",
  "name": "Basic Plus"
}
```

---

### DELETE /admin/packages/:id
**Mô tả:** Xóa gói dịch vụ

**Request URL:**
```
DELETE /admin/packages/pkg-006
```

**Response 204:** (No Content)

---

### GET /admin/packages/:id/subscribers
**Mô tả:** Lấy danh sách người đăng ký gói dịch vụ

**Request URL:**
```
GET /admin/packages/pkg-003/subscribers
```

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 10
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "sub-001",
      "userId": "user-020",
      "email": "hr@techsolutions.vn",
      "companyName": "Tech Solutions Việt Nam",
      "startDate": "2026-03-01",
      "endDate": "2026-03-31",
      "status": "active"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 10,
  "totalPages": 16
}
```

---

## 12. Violation Reports

### GET /admin/violations
**Mô tả:** Lấy danh sách tất cả báo cáo vi phạm

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 10,
  "type": "job",
  "status": "pending"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "viol-001",
      "type": "job",
      "status": "pending",
      "jobTitle": "Senior Developer",
      "companyName": "ABC Corp",
      "reporterEmail": "reporter@example.com",
      "description": "Tin đăng tuyển dụng có nội dung phân biệt đối xử",
      "violationType": "inappropriate",
      "createdAt": "2026-03-23T14:00:00.000Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

### GET /admin/violations/:id
**Mô tả:** Lấy chi tiết vi phạm

**Request URL:**
```
GET /admin/violations/viol-001
```

**Response 200:**
```json
{
  "id": "viol-001",
  "type": "job",
  "status": "pending",
  "jobId": "job-050",
  "jobTitle": "Senior Developer",
  "companyName": "ABC Corp",
  "companyId": "company-050",
  "reporterId": "user-100",
  "reporterEmail": "reporter@example.com",
  "violationType": "inappropriate",
  "description": "Tin đăng tuyển dụng có nội dung phân biệt đối xử về giới tính và độ tuổi",
  "evidence": [
    "https://example.com/screenshot1.jpg",
    "https://example.com/screenshot2.jpg"
  ],
  "reportedAt": "2026-03-23T14:00:00.000Z",
  "reviewedAt": null,
  "resolvedAt": null,
  "adminNotes": null
}
```

---

### PUT /admin/violations/:id/resolve
**Mô tả:** Xử lý vi phạm

**Request URL:**
```
PUT /admin/violations/viol-001/resolve
```

**Request Body:**
```json
{
  "action": "warning",
  "notes": "Đã cảnh báo nhà tuyển dụng và yêu cầu chỉnh sửa tin đăng"
}
```

**Response 200:**
```json
{
  "message": "Violation resolved successfully"
}
```

---

### GET /admin/reports/job-violations
**Mô tả:** Lấy danh sách báo cáo vi phạm tin tuyển dụng

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 20,
  "status": "pending",
  "type": "spam"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "viol-002",
      "type": "spam",
      "status": "pending",
      "jobTitle": "Làm giàu nhanh",
      "companyName": "XYZ Company",
      "reporterEmail": "user@example.com",
      "description": "Tin đăng tuyển dụng có dấu hiệu lừa đảo",
      "createdAt": "2026-03-22T10:00:00.000Z"
    }
  ],
  "total": 30,
  "page": 1,
  "limit": 20,
  "totalPages": 2
}
```

---

### GET /admin/reports/candidate-violations
**Mô tả:** Lấy danh sách báo cáo vi phạm ứng viên

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 20,
  "status": "pending"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "viol-010",
      "status": "pending",
      "candidateName": "Nguyễn Văn F",
      "candidateEmail": "candidate@example.com",
      "violationType": "fake_cv",
      "description": "Ứng viên sử dụng CV giả mạo",
      "createdAt": "2026-03-21T15:00:00.000Z"
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

---

### PUT /admin/reports/:id/resolve
**Mô tả:** Xử lý báo cáo vi phạm

**Request URL:**
```
PUT /admin/reports/viol-002/resolve
```

**Request Body:**
```json
{
  "action": "suspend_content",
  "notes": "Đã xóa tin đăng vi phạm và cảnh báo tài khoản",
  "notifyReporter": true,
  "notifyReported": true
}
```

**Response 200:**
```json
{
  "message": "Report resolved successfully",
  "reportId": "viol-002",
  "action": "suspend_content",
  "resolvedAt": "2026-03-24T04:30:00.000Z"
}
```

---

### GET /admin/reports/disputes
**Mô tả:** Lấy danh sách tranh chấp

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 20,
  "status": "investigating"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "dispute-001",
      "status": "investigating",
      "type": "payment",
      "employerName": "Company ABC",
      "candidateName": "Nguyễn Văn G",
      "description": "Tranh chấp về thanh toán lương",
      "createdAt": "2026-03-20T09:00:00.000Z"
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

---

## 13. User Role Management

### GET /admin/roles
**Mô tả:** Lấy danh sách tất cả vai trò

**Response 200:**
```json
[
  {
    "id": "role-001",
    "name": "admin",
    "description": "Quản trị viên hệ thống",
    "userCount": 5,
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "role-002",
    "name": "moderator",
    "description": "Điều hành viên",
    "userCount": 15,
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "role-003",
    "name": "employer",
    "description": "Nhà tuyển dụng",
    "userCount": 3456,
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "role-004",
    "name": "job_seeker",
    "description": "Ứng viên tìm việc",
    "userCount": 11234,
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "role-005",
    "name": "hr",
    "description": "Nhân sự",
    "userCount": 519,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

### POST /admin/roles
**Mô tả:** Tạo vai trò mới

**Request Body:**
```json
{
  "name": "content_manager",
  "description": "Quản lý nội dung blog và tin tức",
  "permissions": ["blog.create", "blog.edit", "blog.delete", "blog.publish"]
}
```

**Response 201:**
```json
{
  "id": "role-006",
  "name": "content_manager",
  "description": "Quản lý nội dung blog và tin tức",
  "userCount": 0,
  "createdAt": "2026-03-24T04:35:00.000Z"
}
```

**Response 409 (Conflict):**
```json
{
  "statusCode": 409,
  "message": "Role already exists",
  "error": "Conflict"
}
```

---

### PUT /admin/roles/:id
**Mô tả:** Cập nhật vai trò

**Request URL:**
```
PUT /admin/roles/role-006
```

**Request Body:**
```json
{
  "name": "content_manager_v2",
  "description": "Quản lý nội dung cấp cao"
}
```

**Response 200:**
```json
{
  "id": "role-006",
  "name": "content_manager_v2",
  "description": "Quản lý nội dung cấp cao",
  "updatedAt": "2026-03-24T04:40:00.000Z"
}
```

---

### DELETE /admin/roles/:id
**Mô tả:** Xóa vai trò

**Request URL:**
```
DELETE /admin/roles/role-006
```

**Response 204:** (No Content)

**Response 400 (Bad Request - Role has users):**
```json
{
  "statusCode": 400,
  "message": "Cannot delete role with assigned users",
  "error": "Bad Request"
}
```

---

### GET /admin/roles/:id/users
**Mô tả:** Lấy danh sách người dùng với vai trò cụ thể

**Request URL:**
```
GET /admin/roles/role-001/users
```

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 10
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "user-001",
      "email": "admin@jobcv.com",
      "firstName": "Admin",
      "lastName": "System",
      "isActive": true,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### PUT /admin/users/:id/assign-role
**Mô tả:** Gán vai trò cho người dùng

**Request URL:**
```
PUT /admin/users/user-050/assign-role
```

**Request Body:**
```json
{
  "roleId": "role-002"
}
```

**Response 200:**
```json
{
  "message": "Role assigned successfully"
}
```

**Response 409 (Conflict - User already has role):**
```json
{
  "statusCode": 409,
  "message": "User already has this role",
  "error": "Conflict"
}
```

---

### PUT /admin/users/:id/remove-role
**Mô tả:** Thu hồi vai trò từ người dùng

**Request URL:**
```
PUT /admin/users/user-050/remove-role
```

**Request Body:**
```json
{
  "roleId": "role-002"
}
```

**Response 200:**
```json
{
  "message": "Role removed successfully"
}
```

---

## 14. System Activity Monitoring

### GET /admin/system/activities
**Mô tả:** Lấy danh sách hoạt động hệ thống

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 50,
  "type": "user",
  "action": "login",
  "startDate": "2026-03-01",
  "endDate": "2026-03-24"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "activity-001",
      "type": "user",
      "action": "login",
      "userId": "user-010",
      "userEmail": "user@example.com",
      "details": "User logged in successfully",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "createdAt": "2026-03-24T02:15:00.000Z"
    },
    {
      "id": "activity-002",
      "type": "user",
      "action": "profile_update",
      "userId": "user-010",
      "userEmail": "user@example.com",
      "details": "User updated profile information",
      "ipAddress": "192.168.1.100",
      "createdAt": "2026-03-24T02:20:00.000Z"
    }
  ],
  "total": 5000,
  "page": 1,
  "limit": 50,
  "totalPages": 100
}
```

---

### GET /admin/system/activities/users/:userId
**Mô tả:** Lấy hoạt động của người dùng cụ thể

**Request URL:**
```
GET /admin/system/activities/users/user-010
```

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 50,
  "startDate": "2026-03-01",
  "endDate": "2026-03-24"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "activity-100",
      "type": "user",
      "action": "login",
      "details": "User logged in",
      "ipAddress": "192.168.1.100",
      "createdAt": "2026-03-24T02:15:00.000Z"
    },
    {
      "id": "activity-101",
      "type": "job",
      "action": "apply",
      "details": "Applied to job: Senior Frontend Developer",
      "createdAt": "2026-03-23T10:30:00.000Z"
    }
  ],
  "total": 156,
  "page": 1,
  "limit": 50,
  "totalPages": 4
}
```

---

### GET /admin/system/statistics
**Mô tả:** Lấy thống kê hệ thống

**Request Query Parameters:**
```json
{
  "period": "30d"
}
```

**Response 200:**
```json
{
  "period": "30d",
  "newUsers": 456,
  "newJobs": 234,
  "newApplications": 5678,
  "newCompanies": 89,
  "startDate": "2026-02-22T00:00:00.000Z",
  "endDate": "2026-03-24T00:00:00.000Z"
}
```

---

### GET /admin/system/logs
**Mô tả:** Lấy nhật ký hệ thống

**Request Query Parameters:**
```json
{
  "level": "error",
  "limit": 100
}
```

**Response 200:**
```json
{
  "data": [
    {
      "timestamp": "2026-03-24T03:00:00.000Z",
      "level": "error",
      "message": "Database connection timeout",
      "source": "database-service"
    },
    {
      "timestamp": "2026-03-24T02:45:00.000Z",
      "level": "error",
      "message": "Email service unavailable",
      "source": "notification-service"
    }
  ],
  "total": 25
}
```

---

## Authentication Note

Tất cả các API trên đều yêu cầu JWT Token trong header:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Và yêu cầu quyền **ADMIN** hoặc **MODERATOR**.

---

## Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}