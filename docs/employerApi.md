# Employer API - Swagger Test Examples

## Mục lục

1. [Dashboard Overview](#1-dashboard-overview)
2. [Job Management - Quản lý tin tuyển dụng](#2-job-management)
3. [Company Management - Quản lý công ty](#3-company-management)
4. [Application Management - Quản lý đơn ứng tuyển](#4-application-management)
5. [Branch Management - Quản lý chi nhánh](#5-branch-management)
6. [Company Users - Quản lý người dùng công ty](#6-company-users)
7. [Saved Candidates - Lưu hồ sơ ứng viên](#7-saved-candidates)
8. [Subscription Plans - Quản lý gói dịch vụ](#8-subscription-plans)
9. [Notifications - Quản lý thông báo](#9-notifications)
10. [Messaging - Tin nhắn](#10-messaging)

---

## 1. Dashboard Overview

### GET /employer/dashboard/stats

**Mô tả:** Lấy thống kê tổng quan dashboard nhà tuyển dụng

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "activeJobs": 12,
  "totalApplications": 456,
  "totalViews": 15234,
  "hiredCount": 23,
  "responseRate": 85,
  "avgHiringTime": 14,
  "qualityApplicants": 75
}
```

---

### GET /employer/dashboard/jobs

**Mô tả:** Lấy danh sách tin tuyển dụng đang hoạt động

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Query Parameters:**

```json
{
  "limit": 5
}
```

**Response 200:**

```json
[
  {
    "id": "job-001",
    "title": "Senior Frontend Developer",
    "postedDate": "20/03/2026",
    "views": 1234,
    "applications": 45,
    "status": "published",
    "tags": ["React", "TypeScript", "JavaScript"]
  },
  {
    "id": "job-002",
    "title": "Backend Developer",
    "postedDate": "18/03/2026",
    "views": 856,
    "applications": 32,
    "status": "published",
    "tags": ["Node.js", "Python", "MongoDB"]
  },
  {
    "id": "job-003",
    "title": "UI/UX Designer",
    "postedDate": "15/03/2026",
    "views": 567,
    "applications": 28,
    "status": "published",
    "tags": ["Figma", "Adobe XD", "Sketch"]
  }
]
```

---

### GET /employer/dashboard/applicants

**Mô tả:** Lấy danh sách ứng viên gần đây

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Query Parameters:**

```json
{
  "limit": 10
}
```

**Response 200:**

```json
[
  {
    "id": "user-010",
    "name": "Nguyễn Văn A",
    "jobTitle": "Senior Frontend Developer",
    "appliedDate": "24/03/2026",
    "avatar": "https://example.com/avatar-010.jpg"
  },
  {
    "id": "user-011",
    "name": "Trần Thị B",
    "jobTitle": "Backend Developer",
    "appliedDate": "23/03/2026",
    "avatar": "https://example.com/avatar-011.jpg"
  },
  {
    "id": "user-012",
    "name": "Lê Văn C",
    "jobTitle": "UI/UX Designer",
    "appliedDate": "22/03/2026",
    "avatar": "https://example.com/avatar-012.jpg"
  }
]
```

---

## 2. Job Management

### POST /jobs

**Mô tả:** Tạo tin tuyển dụng mới

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "title": "Senior Fullstack Developer",
  "description": "We are looking for an experienced Fullstack Developer to join our team...",
  "requirements": "- 5+ years of experience\n- Strong knowledge of React and Node.js\n- Experience with databases",
  "benefits": "- Competitive salary\n- Health insurance\n- Remote work options",
  "companyId": "company-001",
  "categoryId": "cat-001",
  "jobType": "full-time",
  "experienceLevel": "senior",
  "minSalary": 25000000,
  "maxSalary": 45000000,
  "currency": "VND",
  "city": "Ho Chi Minh",
  "country": "Vietnam",
  "address": "123 Nguyen Hue, District 1",
  "remoteWork": false,
  "expiresAt": "2026-04-30",
  "skillIds": ["skill-001", "skill-002", "skill-003"],
  "tags": ["Fullstack", "Senior", "React", "Node.js"]
}
```

**Response 201:**

```json
{
  "id": "job-050",
  "title": "Senior Fullstack Developer",
  "status": "draft",
  "companyId": "company-001",
  "createdAt": "2026-03-24T04:00:00.000Z",
  "message": "Job created successfully"
}
```

**Response 403:**

```json
{
  "statusCode": 403,
  "message": "Forbidden - insufficient permissions",
  "error": "Forbidden"
}
```

**Response 404:**

```json
{
  "statusCode": 404,
  "message": "Company not found",
  "error": "Not Found"
}
```

---

### GET /jobs

**Mô tả:** Lấy danh sách tất cả công việc với bộ lọc

**Request Query Parameters:**

```json
{
  "page": 1,
  "limit": 10,
  "search": "developer",
  "jobType": "full-time",
  "experienceLevel": "senior",
  "city": "Ho Chi Minh",
  "country": "Vietnam",
  "remoteWork": false,
  "minSalary": 20000000,
  "maxSalary": 50000000,
  "companyId": "company-001"
}
```

**Response 200:**

```json
{
  "data": [
    {
      "id": "job-001",
      "title": "Senior Frontend Developer",
      "description": "We are looking for an experienced Frontend Developer...",
      "company": {
        "id": "company-001",
        "name": "Tech Solutions Việt Nam",
        "logo": "https://example.com/logo.png"
      },
      "category": {
        "id": "cat-001",
        "name": "IT - Phần mềm"
      },
      "jobType": "full-time",
      "experienceLevel": "senior",
      "minSalary": 25000000,
      "maxSalary": 45000000,
      "city": "Ho Chi Minh",
      "country": "Vietnam",
      "remoteWork": false,
      "viewCount": 1234,
      "applicationCount": 45,
      "status": "published",
      "createdAt": "2026-03-20T10:00:00.000Z",
      "expiresAt": "2026-04-20T10:00:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
```

---

### GET /jobs/:id

**Mô tả:** Lấy chi tiết công việc theo ID

**Request URL:**

```
GET /jobs/job-001
```

**Response 200:**

```json
{
  "id": "job-001",
  "title": "Senior Frontend Developer",
  "description": "We are looking for an experienced Frontend Developer to join our dynamic team...",
  "requirements": "- 5+ years of experience with React\n- Strong TypeScript skills\n- Experience with state management",
  "benefits": "- Competitive salary: 25-45M VND\n- Health insurance\n- 13th month salary\n- Annual leave: 15 days",
  "company": {
    "id": "company-001",
    "name": "Tech Solutions Việt Nam",
    "logo": "https://example.com/logo.png",
    "website": "https://techsolutions.vn",
    "employeeCount": "100-500",
    "industry": "Technology"
  },
  "category": {
    "id": "cat-001",
    "name": "IT - Phần mềm"
  },
  "skills": [
    {
      "id": "skill-001",
      "name": "React",
      "level": "Expert"
    },
    {
      "id": "skill-002",
      "name": "TypeScript",
      "level": "Advanced"
    }
  ],
  "jobType": "full-time",
  "experienceLevel": "senior",
  "educationLevel": "bachelor",
  "minSalary": 25000000,
  "maxSalary": 45000000,
  "currency": "VND",
  "city": "Ho Chi Minh",
  "country": "Vietnam",
  "address": "123 Nguyen Hue, District 1",
  "remoteWork": false,
  "status": "published",
  "viewCount": 1234,
  "applicationCount": 45,
  "isSaved": false,
  "hasApplied": false,
  "createdAt": "2026-03-20T10:00:00.000Z",
  "updatedAt": "2026-03-22T15:30:00.000Z",
  "expiresAt": "2026-04-20T10:00:00.000Z"
}
```

**Response 404:**

```json
{
  "statusCode": 404,
  "message": "Job not found",
  "error": "Not Found"
}
```

---

### PUT /jobs/:id

**Mô tả:** Cập nhật tin tuyển dụng

**Request URL:**

```
PUT /jobs/job-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**

```json
{
  "title": "Senior Frontend Developer (Updated)",
  "description": "Updated job description with more details...",
  "minSalary": 30000000,
  "maxSalary": 50000000,
  "requirements": "- 5+ years of experience with React\n- Strong TypeScript skills\n- Experience with Next.js is a plus"
}
```

**Response 200:**

```json
{
  "id": "job-001",
  "title": "Senior Frontend Developer (Updated)",
  "status": "published",
  "updatedAt": "2026-03-24T04:15:00.000Z",
  "message": "Job updated successfully"
}
```

**Response 403:**

```json
{
  "statusCode": 403,
  "message": "Forbidden - not company owner",
  "error": "Forbidden"
}
```

---

### DELETE /jobs/:id

**Mô tả:** Xóa tin tuyển dụng

**Request URL:**

```
DELETE /jobs/job-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** (No Content)

**Response 403:**

```json
{
  "statusCode": 403,
  "message": "Forbidden - not company owner",
  "error": "Forbidden"
}
```

---

### POST /jobs/:id/publish

**Mô tả:** Đăng tin tuyển dụng từ trạng thái nháp

**Request URL:**

```
POST /jobs/job-050/publish
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "job-050",
  "title": "Senior Fullstack Developer",
  "status": "published",
  "publishedAt": "2026-03-24T04:20:00.000Z",
  "message": "Job published successfully"
}
```

**Response 400:**

```json
{
  "statusCode": 400,
  "message": "Job is not in draft status",
  "error": "Bad Request"
}
```

**Response 403:**

```json
{
  "statusCode": 403,
  "message": "Forbidden - not company owner",
  "error": "Forbidden"
}
```

---

### POST /jobs/:id/close

**Mô tả:** Đóng tin tuyển dụng đã đăng

**Request URL:**

```
POST /jobs/job-001/close
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "job-001",
  "title": "Senior Frontend Developer",
  "status": "closed",
  "closedAt": "2026-03-24T04:25:00.000Z",
  "message": "Job closed successfully"
}
```

**Response 403:**

```json
{
  "statusCode": 403,
  "message": "Forbidden - not company owner",
  "error": "Forbidden"
}
```

---

### GET /jobs/company/:companyId

**Mô tả:** Lấy tất cả tin tuyển dụng của một công ty

**Request URL:**

```
GET /jobs/company/company-001
```

**Response 200:**

```json
{
  "data": [
    {
      "id": "job-001",
      "title": "Senior Frontend Developer",
      "status": "published",
      "viewCount": 1234,
      "applicationCount": 45,
      "createdAt": "2026-03-20T10:00:00.000Z",
      "expiresAt": "2026-04-20T10:00:00.000Z"
    },
    {
      "id": "job-002",
      "title": "Backend Developer",
      "status": "published",
      "viewCount": 856,
      "applicationCount": 32,
      "createdAt": "2026-03-18T14:00:00.000Z",
      "expiresAt": "2026-04-18T14:00:00.000Z"
    },
    {
      "id": "job-003",
      "title": "UI/UX Designer",
      "status": "closed",
      "viewCount": 567,
      "applicationCount": 28,
      "createdAt": "2026-03-15T09:00:00.000Z",
      "closedAt": "2026-03-22T16:00:00.000Z"
    }
  ],
  "total": 3
}
```

---

### GET /jobs/user/my-jobs

**Mô tả:** Lấy thống kê tin tuyển dụng của người dùng hiện tại

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "totalJobs": 15,
  "activeJobs": 12,
  "draftJobs": 2,
  "closedJobs": 1,
  "totalApplications": 456,
  "totalViews": 15234,
  "jobs": [
    {
      "id": "job-001",
      "title": "Senior Frontend Developer",
      "status": "published",
      "applications": 45,
      "views": 1234
    },
    {
      "id": "job-002",
      "title": "Backend Developer",
      "status": "published",
      "applications": 32,
      "views": 856
    }
  ]
}
```

---

## 3. Company Management

### POST /companies

**Mô tả:** Tạo công ty mới

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "name": "Tech Startup Vietnam",
  "description": "We are a leading technology company specializing in software development...",
  "website": "https://techstartup.vn",
  "email": "contact@techstartup.vn",
  "phone": "028-1234-5678",
  "address": "456 Le Loi, District 1, Ho Chi Minh City",
  "city": "Ho Chi Minh",
  "country": "Vietnam",
  "industry": "Technology",
  "employeeCount": "50-100",
  "foundedYear": 2020,
  "logo": "https://example.com/logo.png",
  "coverImage": "https://example.com/cover.jpg"
}
```

**Response 201:**

```json
{
  "id": "company-050",
  "name": "Tech Startup Vietnam",
  "status": "active",
  "isVerified": false,
  "createdAt": "2026-03-24T04:30:00.000Z",
  "message": "Company created successfully"
}
```

**Response 409:**

```json
{
  "statusCode": 409,
  "message": "Company name already exists",
  "error": "Conflict"
}
```

---

### GET /companies

**Mô tả:** Lấy danh sách tất cả công ty với phân trang và bộ lọc

**Request Query Parameters:**

```json
{
  "page": 1,
  "limit": 10,
  "search": "Tech",
  "industry": "Technology"
}
```

**Response 200:**

```json
{
  "data": [
    {
      "id": "company-001",
      "name": "Tech Solutions Việt Nam",
      "description": "Leading technology company in Vietnam",
      "logo": "https://example.com/logo.png",
      "website": "https://techsolutions.vn",
      "industry": "Technology",
      "employeeCount": "100-500",
      "city": "Ho Chi Minh",
      "country": "Vietnam",
      "isVerified": true,
      "jobCount": 12,
      "createdAt": "2026-01-10T08:00:00.000Z"
    }
  ],
  "total": 200,
  "page": 1,
  "limit": 10,
  "totalPages": 20
}
```

---

### GET /companies/:id

**Mô tả:** Lấy thông tin chi tiết công ty theo ID

**Request URL:**

```
GET /companies/company-001
```

**Response 200:**

```json
{
  "id": "company-001",
  "name": "Tech Solutions Việt Nam",
  "description": "We are a leading technology company specializing in software development, cloud solutions, and digital transformation...",
  "logo": "https://example.com/logo.png",
  "coverImage": "https://example.com/cover.jpg",
  "website": "https://techsolutions.vn",
  "email": "contact@techsolutions.vn",
  "phone": "028-1234-5678",
  "address": "123 Nguyen Hue, District 1, Ho Chi Minh City",
  "city": "Ho Chi Minh",
  "country": "Vietnam",
  "industry": "Technology",
  "employeeCount": "100-500",
  "foundedYear": 2015,
  "isVerified": true,
  "verifiedAt": "2026-02-15T10:00:00.000Z",
  "owner": {
    "id": "user-001",
    "name": "Nguyen Van Owner"
  },
  "jobCount": 12,
  "activeJobCount": 8,
  "socialLinks": {
    "linkedin": "https://linkedin.com/company/techsolutions",
    "facebook": "https://facebook.com/techsolutions",
    "twitter": "https://twitter.com/techsolutions"
  },
  "createdAt": "2026-01-10T08:00:00.000Z",
  "updatedAt": "2026-03-20T15:30:00.000Z"
}
```

**Response 404:**

```json
{
  "statusCode": 404,
  "message": "Company not found",
  "error": "Not Found"
}
```

---

### PUT /companies/:id

**Mô tả:** Cập nhật thông tin công ty

**Request URL:**

```
PUT /companies/company-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**

```json
{
  "name": "Tech Solutions Vietnam (Updated)",
  "description": "Updated company description with more details about our mission and vision...",
  "website": "https://techsolutions.vn",
  "employeeCount": "200-500",
  "logo": "https://example.com/new-logo.png"
}
```

**Response 200:**

```json
{
  "id": "company-001",
  "name": "Tech Solutions Vietnam (Updated)",
  "updatedAt": "2026-03-24T04:35:00.000Z",
  "message": "Company updated successfully"
}
```

**Response 403:**

```json
{
  "statusCode": 403,
  "message": "Forbidden - not the owner",
  "error": "Forbidden"
}
```

---

### DELETE /companies/:id

**Mô tả:** Xóa công ty

**Request URL:**

```
DELETE /companies/company-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** (No Content)

**Response 403:**

```json
{
  "statusCode": 403,
  "message": "Forbidden - not the owner",
  "error": "Forbidden"
}
```

---

### GET /companies/user/my-companies

**Mô tả:** Lấy danh sách công ty thuộc sở hữu của người dùng hiện tại

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "data": [
    {
      "id": "company-001",
      "name": "Tech Solutions Việt Nam",
      "logo": "https://example.com/logo.png",
      "isVerified": true,
      "status": "active",
      "jobCount": 12,
      "activeJobCount": 8,
      "createdAt": "2026-01-10T08:00:00.000Z"
    },
    {
      "id": "company-002",
      "name": "Digital Marketing Agency",
      "logo": "https://example.com/logo2.png",
      "isVerified": false,
      "status": "active",
      "jobCount": 5,
      "activeJobCount": 3,
      "createdAt": "2026-02-15T10:00:00.000Z"
    }
  ],
  "total": 2
}
```

---

## 4. Application Management

### GET /applications/job/:jobId

**Mô tả:** Lấy danh sách đơn ứng tuyển cho một tin tuyển dụng cụ thể

**Request URL:**

```
GET /applications/job/job-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "data": [
    {
      "id": "app-001",
      "status": "pending",
      "coverLetter": "I am writing to express my interest in the Senior Frontend Developer position...",
      "resumeUrl": "https://example.com/resume-001.pdf",
      "viewedByEmployer": false,
      "viewedAt": null,
      "applicant": {
        "id": "user-010",
        "firstName": "Nguyễn",
        "lastName": "Văn A",
        "email": "nguyenvana@example.com",
        "avatar": "https://example.com/avatar-010.jpg",
        "currentPosition": "Frontend Developer",
        "yearsOfExperience": 5
      },
      "job": {
        "id": "job-001",
        "title": "Senior Frontend Developer"
      },
      "createdAt": "2026-03-23T10:00:00.000Z"
    },
    {
      "id": "app-002",
      "status": "shortlisted",
      "coverLetter": "With 6 years of experience in frontend development...",
      "resumeUrl": "https://example.com/resume-002.pdf",
      "viewedByEmployer": true,
      "viewedAt": "2026-03-23T14:30:00.000Z",
      "applicant": {
        "id": "user-011",
        "firstName": "Trần",
        "lastName": "Thị B",
        "email": "tranthib@example.com",
        "avatar": "https://example.com/avatar-011.jpg",
        "currentPosition": "Senior Frontend Developer",
        "yearsOfExperience": 6
      },
      "job": {
        "id": "job-001",
        "title": "Senior Frontend Developer"
      },
      "createdAt": "2026-03-22T15:00:00.000Z"
    }
  ],
  "total": 45,
  "pending": 25,
  "shortlisted": 12,
  "rejected": 5,
  "hired": 3
}
```

---

### GET /applications/:id

**Mô tả:** Lấy chi tiết đơn ứng tuyển theo ID

**Request URL:**

```
GET /applications/app-001
```

**Response 200:**

```json
{
  "id": "app-001",
  "status": "pending",
  "coverLetter": "I am writing to express my interest in the Senior Frontend Developer position. With 5 years of experience in React and TypeScript, I believe I am a strong candidate for this role...",
  "resumeUrl": "https://example.com/resume-001.pdf",
  "viewedByEmployer": false,
  "viewedAt": null,
  "notes": null,
  "applicant": {
    "id": "user-010",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "nguyenvana@example.com",
    "phone": "0901234567",
    "avatar": "https://example.com/avatar-010.jpg",
    "currentPosition": "Frontend Developer",
    "yearsOfExperience": 5,
    "skills": [
      {
        "name": "React",
        "level": "Expert"
      },
      {
        "name": "TypeScript",
        "level": "Advanced"
      },
      {
        "name": "JavaScript",
        "level": "Expert"
      }
    ],
    "education": [
      {
        "school": "Đại học Bách Khoa Hà Nội",
        "degree": "Cử nhân",
        "fieldOfStudy": "Khoa học máy tính",
        "endYear": 2021
      }
    ]
  },
  "job": {
    "id": "job-001",
    "title": "Senior Frontend Developer",
    "company": {
      "id": "company-001",
      "name": "Tech Solutions Việt Nam"
    }
  },
  "interviews": [],
  "createdAt": "2026-03-23T10:00:00.000Z",
  "updatedAt": "2026-03-23T10:00:00.000Z"
}
```

**Response 404:**

```json
{
  "statusCode": 404,
  "message": "Application not found",
  "error": "Not Found"
}
```

---

### POST /applications/:id/status

**Mô tả:** Cập nhật trạng thái đơn ứng tuyển (dành cho nhà tuyển dụng)

**Request URL:**

```
POST /applications/app-001/status
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**

```json
{
  "status": "shortlisted",
  "notes": "Ứng viên có kinh nghiệm tốt, mời phỏng vấn vòng 1"
}
```

**Response 200:**

```json
{
  "id": "app-001",
  "status": "shortlisted",
  "notes": "Ứng viên có kinh nghiệm tốt, mời phỏng vấn vòng 1",
  "updatedAt": "2026-03-24T04:40:00.000Z",
  "message": "Application status updated successfully"
}
```

**Các trạng thái hợp lệ:**

- `pending` - Chờ xử lý
- `reviewing` - Đang xem xét
- `shortlisted` - Đã chọn vào vòng trong
- `interviewed` - Đã phỏng vấn
- `offered` - Đã gửi offer
- `hired` - Đã tuyển
- `rejected` - Đã từ chối

**Response 403:**

```json
{
  "statusCode": 403,
  "message": "Forbidden - not job employer",
  "error": "Forbidden"
}
```

---

### POST /applications/:id/interview

**Mô tả:** Lên lịch phỏng vấn (dành cho nhà tuyển dụng)

**Request URL:**

```
POST /applications/app-002/interview
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**

```json
{
  "interviewDate": "2026-03-28T09:00:00.000Z",
  "notes": "Phỏng vấn vòng 1 với Tech Lead. Vui lòng chuẩn bị portfolio và demo project."
}
```

**Response 200:**

```json
{
  "id": "interview-001",
  "applicationId": "app-002",
  "interviewDate": "2026-03-28T09:00:00.000Z",
  "notes": "Phỏng vấn vòng 1 với Tech Lead. Vui lòng chuẩn bị portfolio và demo project.",
  "status": "scheduled",
  "createdAt": "2026-03-24T04:45:00.000Z",
  "message": "Interview scheduled successfully"
}
```

**Response 400:**

```json
{
  "statusCode": 400,
  "message": "Can only schedule interviews for shortlisted applications",
  "error": "Bad Request"
}
```

**Response 403:**

```json
{
  "statusCode": 403,
  "message": "Forbidden - not job employer",
  "error": "Forbidden"
}
```

---

### POST /applications/:id/view

**Mô tả:** Tăng số lần xem đơn ứng tuyển (dành cho nhà tuyển dụng)

**Request URL:**

```
POST /applications/app-001/view
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "app-001",
  "viewedByEmployer": true,
  "viewedAt": "2026-03-24T04:50:00.000Z",
  "viewCount": 1,
  "message": "View count incremented"
}
```

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
  "message": "Forbidden - insufficient permissions",
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

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Resource already exists",
  "error": "Conflict"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
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

Và yêu cầu quyền **EMPLOYER** hoặc **HR**.

---

## 8. Branch Management - Quản lý chi nhánh

### POST /branches

**Mô tả:** Tạo chi nhánh mới

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "name": "Chi nhánh Hà Nội",
  "address": "123 Nguyễn Huệ, Quận Hoàn Kiếm",
  "city": "Hà Nội",
  "country": "Việt Nam",
  "phone": "024-1234-5678",
  "email": "hanoi@company.com",
  "isHeadquarter": false,
  "employeeCount": 50,
  "latitude": 21.028511,
  "longitude": 105.804817,
  "companyId": "company-001"
}
```

**Response 201:**

```json
{
  "id": "branch-001",
  "name": "Chi nhánh Hà Nội",
  "address": "123 Nguyễn Huệ, Quận Hoàn Kiếm",
  "city": "Hà Nội",
  "country": "Việt Nam",
  "phone": "024-1234-5678",
  "email": "hanoi@company.com",
  "isActive": true,
  "isHeadquarter": false,
  "employeeCount": 50,
  "latitude": 21.028511,
  "longitude": 105.804817,
  "companyId": "company-001",
  "createdAt": "2026-03-24T05:10:00.000Z",
  "updatedAt": "2026-03-24T05:10:00.000Z"
}
```

**Response 403:**

```json
{
  "statusCode": 403,
  "message": "Bạn không có quyền thêm chi nhánh cho công ty này",
  "error": "Forbidden"
}
```

---

### GET /branches/company/:companyId

**Mô tả:** Lấy danh sách chi nhánh theo công ty

**Request URL:**

```
GET /branches/company/company-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Query Parameters:**

```json
{
  "page": 1,
  "limit": 10,
  "isActive": true
}
```

**Response 200:**

```json
{
  "data": [
    {
      "id": "branch-001",
      "name": "Trụ sở chính",
      "address": "456 Lê Lợi, Quận 1",
      "city": "Hồ Chí Minh",
      "country": "Việt Nam",
      "phone": "028-1234-5678",
      "email": "hcm@company.com",
      "isActive": true,
      "isHeadquarter": true,
      "employeeCount": 200,
      "latitude": 10.7769,
      "longitude": 106.7009,
      "companyId": "company-001",
      "createdAt": "2026-01-10T08:00:00.000Z",
      "updatedAt": "2026-03-20T15:30:00.000Z"
    },
    {
      "id": "branch-002",
      "name": "Chi nhánh Hà Nội",
      "address": "123 Nguyễn Huệ, Quận Hoàn Kiếm",
      "city": "Hà Nội",
      "country": "Việt Nam",
      "phone": "024-1234-5678",
      "email": "hanoi@company.com",
      "isActive": true,
      "isHeadquarter": false,
      "employeeCount": 50,
      "latitude": 21.028511,
      "longitude": 105.804817,
      "companyId": "company-001",
      "createdAt": "2026-02-15T10:00:00.000Z",
      "updatedAt": "2026-03-18T14:20:00.000Z"
    },
    {
      "id": "branch-003",
      "name": "Chi nhánh Đà Nẵng",
      "address": "789 Bạch Đằng, Quận Hải Châu",
      "city": "Đà Nẵng",
      "country": "Việt Nam",
      "phone": "0236-1234-5678",
      "email": "danang@company.com",
      "isActive": true,
      "isHeadquarter": false,
      "employeeCount": 30,
      "latitude": 16.0544,
      "longitude": 108.2022,
      "companyId": "company-001",
      "createdAt": "2026-03-01T09:00:00.000Z",
      "updatedAt": "2026-03-22T11:15:00.000Z"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### GET /branches/:id

**Mô tả:** Lấy thông tin chi nhánh theo ID

**Request URL:**

```
GET /branches/branch-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "branch-001",
  "name": "Trụ sở chính",
  "address": "456 Lê Lợi, Quận 1",
  "city": "Hồ Chí Minh",
  "country": "Việt Nam",
  "phone": "028-1234-5678",
  "email": "hcm@company.com",
  "isActive": true,
  "isHeadquarter": true,
  "employeeCount": 200,
  "latitude": 10.7769,
  "longitude": 106.7009,
  "companyId": "company-001",
  "company": {
    "id": "company-001",
    "name": "Tech Solutions Việt Nam"
  },
  "createdAt": "2026-01-10T08:00:00.000Z",
  "updatedAt": "2026-03-20T15:30:00.000Z"
}
```

**Response 404:**

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy chi nhánh",
  "error": "Not Found"
}
```

---

### PUT /branches/:id

**Mô tả:** Cập nhật thông tin chi nhánh

**Request URL:**

```
PUT /branches/branch-002
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**

```json
{
  "name": "Chi nhánh Hà Nội (Updated)",
  "address": "456 Trần Hưng Đạo, Quận Hai Bà Trưng",
  "phone": "024-8765-4321",
  "employeeCount": 75
}
```

**Response 200:**

```json
{
  "id": "branch-002",
  "name": "Chi nhánh Hà Nội (Updated)",
  "address": "456 Trần Hưng Đạo, Quận Hai Bà Trưng",
  "city": "Hà Nội",
  "country": "Việt Nam",
  "phone": "024-8765-4321",
  "email": "hanoi@company.com",
  "isActive": true,
  "isHeadquarter": false,
  "employeeCount": 75,
  "latitude": 21.028511,
  "longitude": 105.804817,
  "companyId": "company-001",
  "createdAt": "2026-02-15T10:00:00.000Z",
  "updatedAt": "2026-03-24T05:15:00.000Z"
}
```

---

### DELETE /branches/:id

**Mô tả:** Xóa chi nhánh

**Request URL:**

```
DELETE /branches/branch-003
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** (No Content)

**Response 400:**

```json
{
  "statusCode": 400,
  "message": "Không thể xóa trụ sở chính",
  "error": "Bad Request"
}
```

---

### PUT /branches/:id/set-headquarter

**Mô tả:** Đặt chi nhánh làm trụ sở chính

**Request URL:**

```
PUT /branches/branch-002/set-headquarter
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "branch-002",
  "name": "Chi nhánh Hà Nội (Updated)",
  "isHeadquarter": true,
  "updatedAt": "2026-03-24T05:20:00.000Z",
  "message": "Đặt trụ sở chính thành công"
}
```

---

### PUT /branches/:id/toggle-status

**Mô tả:** Bật/tắt trạng thái hoạt động của chi nhánh

**Request URL:**

```
PUT /branches/branch-002/toggle-status
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "branch-002",
  "name": "Chi nhánh Hà Nội (Updated)",
  "isActive": false,
  "updatedAt": "2026-03-24T05:25:00.000Z",
  "message": "Cập nhật trạng thái thành công"
}
```

---

### GET /branches/company/:companyId/statistics

**Mô tả:** Lấy thống kê chi nhánh theo công ty

**Request URL:**

```
GET /branches/company/company-001/statistics
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "totalBranches": 3,
  "activeBranches": 3,
  "inactiveBranches": 0,
  "headquarters": {
    "id": "branch-002",
    "name": "Chi nhánh Hà Nội (Updated)",
    "city": "Hà Nội"
  }
}
```

---

## 6. Company Users - Quản lý người dùng công ty

### POST /company-users/invite

**Mô tả:** Mời thành viên vào công ty

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "email": "hr@company.com",
  "companyId": "company-001",
  "role": "hr",
  "permissions": ["manage_jobs", "view_applications", "schedule_interviews"]
}
```

**Response 201:**

```json
{
  "id": "cu-001",
  "companyId": "company-001",
  "userId": "user-050",
  "role": "hr",
  "permissions": ["manage_jobs", "view_applications", "schedule_interviews"],
  "isActive": true,
  "invitedAt": "2026-03-24T05:30:00.000Z",
  "acceptedAt": null,
  "invitedBy": "user-001",
  "createdAt": "2026-03-24T05:30:00.000Z",
  "updatedAt": "2026-03-24T05:30:00.000Z",
  "user": {
    "id": "user-050",
    "email": "hr@company.com",
    "firstName": "Nguyễn",
    "lastName": "Thị HR"
  }
}
```

**Response 403:**

```json
{
  "statusCode": 403,
  "message": "Bạn không có quyền mời thành viên cho công ty này",
  "error": "Forbidden"
}
```

**Response 409:**

```json
{
  "statusCode": 409,
  "message": "Người dùng đã là thành viên của công ty",
  "error": "Conflict"
}
```

---

### GET /company-users/company/:companyId

**Mô tả:** Lấy danh sách thành viên công ty

**Request URL:**

```
GET /company-users/company/company-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Query Parameters:**

```json
{
  "page": 1,
  "limit": 10,
  "role": "hr"
}
```

**Response 200:**

```json
{
  "data": [
    {
      "id": "cu-001",
      "companyId": "company-001",
      "userId": "user-050",
      "role": "hr",
      "permissions": [
        "manage_jobs",
        "view_applications",
        "schedule_interviews"
      ],
      "isActive": true,
      "invitedAt": "2026-03-20T10:00:00.000Z",
      "acceptedAt": "2026-03-20T10:30:00.000Z",
      "invitedBy": "user-001",
      "createdAt": "2026-03-20T10:00:00.000Z",
      "updatedAt": "2026-03-20T10:30:00.000Z",
      "user": {
        "id": "user-050",
        "email": "hr@company.com",
        "firstName": "Nguyễn",
        "lastName": "Thị HR",
        "avatar": "https://example.com/avatar-hr.jpg"
      }
    },
    {
      "id": "cu-002",
      "companyId": "company-001",
      "userId": "user-051",
      "role": "manager",
      "permissions": ["view_applications", "schedule_interviews"],
      "isActive": true,
      "invitedAt": "2026-03-18T14:00:00.000Z",
      "acceptedAt": "2026-03-18T14:15:00.000Z",
      "invitedBy": "user-001",
      "createdAt": "2026-03-18T14:00:00.000Z",
      "updatedAt": "2026-03-18T14:15:00.000Z",
      "user": {
        "id": "user-051",
        "email": "manager@company.com",
        "firstName": "Trần",
        "lastName": "Văn Manager",
        "avatar": "https://example.com/avatar-manager.jpg"
      }
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### GET /company-users/:id

**Mô tả:** Lấy thông tin thành viên

**Request URL:**

```
GET /company-users/cu-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "cu-001",
  "companyId": "company-001",
  "userId": "user-050",
  "role": "hr",
  "permissions": ["manage_jobs", "view_applications", "schedule_interviews"],
  "isActive": true,
  "invitedAt": "2026-03-20T10:00:00.000Z",
  "acceptedAt": "2026-03-20T10:30:00.000Z",
  "invitedBy": "user-001",
  "createdAt": "2026-03-20T10:00:00.000Z",
  "updatedAt": "2026-03-20T10:30:00.000Z",
  "company": {
    "id": "company-001",
    "name": "Tech Solutions Việt Nam"
  },
  "user": {
    "id": "user-050",
    "email": "hr@company.com",
    "firstName": "Nguyễn",
    "lastName": "Thị HR",
    "avatar": "https://example.com/avatar-hr.jpg",
    "phone": "0901234567"
  }
}
```

---

### PUT /company-users/:id/role

**Mô tả:** Cập nhật vai trò thành viên

**Request URL:**

```
PUT /company-users/cu-002/role
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**

```json
{
  "role": "admin"
}
```

**Response 200:**

```json
{
  "id": "cu-002",
  "companyId": "company-001",
  "userId": "user-051",
  "role": "admin",
  "permissions": ["view_applications", "schedule_interviews"],
  "isActive": true,
  "updatedAt": "2026-03-24T05:35:00.000Z",
  "message": "Cập nhật vai trò thành công"
}
```

---

### PUT /company-users/:id/permissions

**Mô tả:** Cập nhật quyền truy cập

**Request URL:**

```
PUT /company-users/cu-002/permissions
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**

```json
{
  "permissions": [
    "manage_jobs",
    "view_applications",
    "schedule_interviews",
    "manage_company"
  ]
}
```

**Response 200:**

```json
{
  "id": "cu-002",
  "companyId": "company-001",
  "userId": "user-051",
  "role": "admin",
  "permissions": [
    "manage_jobs",
    "view_applications",
    "schedule_interviews",
    "manage_company"
  ],
  "isActive": true,
  "updatedAt": "2026-03-24T05:40:00.000Z",
  "message": "Cập nhật quyền thành công"
}
```

---

### DELETE /company-users/:id

**Mô tả:** Xóa thành viên khỏi công ty

**Request URL:**

```
DELETE /company-users/cu-002
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** (No Content)

---

### PUT /company-users/:id/deactivate

**Mô tả:** Vô hiệu hóa thành viên

**Request URL:**

```
PUT /company-users/cu-001/deactivate
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "cu-001",
  "companyId": "company-001",
  "userId": "user-050",
  "role": "hr",
  "isActive": false,
  "updatedAt": "2026-03-24T05:45:00.000Z",
  "message": "Vô hiệu hóa thành công"
}
```

---

### PUT /company-users/:id/activate

**Mô tả:** Kích hoạt lại thành viên

**Request URL:**

```
PUT /company-users/cu-001/activate
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "cu-001",
  "companyId": "company-001",
  "userId": "user-050",
  "role": "hr",
  "isActive": true,
  "acceptedAt": "2026-03-24T05:50:00.000Z",
  "updatedAt": "2026-03-24T05:50:00.000Z",
  "message": "Kích hoạt thành công"
}
```

---

### GET /company-users/company/:companyId/statistics

**Mô tả:** Lấy thống kê thành viên công ty

**Request URL:**

```
GET /company-users/company/company-001/statistics
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "totalMembers": 8,
  "activeMembers": 7,
  "inactiveMembers": 1,
  "membersByRole": [
    {
      "role": "owner",
      "count": 1
    },
    {
      "role": "admin",
      "count": 2
    },
    {
      "role": "hr",
      "count": 3
    },
    {
      "role": "manager",
      "count": 2
    }
  ]
}
```

---

## 7. Saved Candidates - Lưu hồ sơ ứng viên

### POST /saved-candidates

**Mô tả:** Lưu hồ sơ ứng viên

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "candidateId": "user-010",
  "companyId": "company-001",
  "notes": "Ứng viên tiềm năng cho vị trí Senior Developer",
  "label": "Tiềm năng",
  "isFavorite": true
}
```

**Response 201:**

```json
{
  "id": "sc-001",
  "employerId": "user-001",
  "candidateId": "user-010",
  "companyId": "company-001",
  "notes": "Ứng viên tiềm năng cho vị trí Senior Developer",
  "label": "Tiềm năng",
  "isFavorite": true,
  "createdAt": "2026-03-24T06:00:00.000Z",
  "candidate": {
    "id": "user-010",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "nguyenvana@example.com",
    "avatar": "https://example.com/avatar-010.jpg",
    "currentPosition": "Senior Frontend Developer"
  }
}
```

**Response 409:**

```json
{
  "statusCode": 409,
  "message": "Đã lưu hồ sơ này rồi",
  "error": "Conflict"
}
```

---

### GET /saved-candidates

**Mô tả:** Lấy danh sách ứng viên đã lưu

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Query Parameters:**

```json
{
  "page": 1,
  "limit": 10,
  "label": "Tiềm năng",
  "isFavorite": true
}
```

**Response 200:**

```json
{
  "data": [
    {
      "id": "sc-001",
      "employerId": "user-001",
      "candidateId": "user-010",
      "companyId": "company-001",
      "notes": "Ứng viên tiềm năng cho vị trí Senior Developer",
      "label": "Tiềm năng",
      "isFavorite": true,
      "createdAt": "2026-03-20T10:00:00.000Z",
      "candidate": {
        "id": "user-010",
        "firstName": "Nguyễn",
        "lastName": "Văn A",
        "email": "nguyenvana@example.com",
        "avatar": "https://example.com/avatar-010.jpg",
        "currentPosition": "Senior Frontend Developer",
        "yearsOfExperience": 5,
        "skills": ["React", "TypeScript", "JavaScript"]
      }
    },
    {
      "id": "sc-002",
      "employerId": "user-001",
      "candidateId": "user-011",
      "companyId": "company-001",
      "notes": "Có kinh nghiệm với Node.js",
      "label": "Phù hợp",
      "isFavorite": false,
      "createdAt": "2026-03-18T14:00:00.000Z",
      "candidate": {
        "id": "user-011",
        "firstName": "Trần",
        "lastName": "Thị B",
        "email": "tranthib@example.com",
        "avatar": "https://example.com/avatar-011.jpg",
        "currentPosition": "Backend Developer",
        "yearsOfExperience": 6,
        "skills": ["Node.js", "Python", "MongoDB"]
      }
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

---

### GET /saved-candidates/:id

**Mô tả:** Lấy thông tin ứng viên đã lưu

**Request URL:**

```
GET /saved-candidates/sc-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "sc-001",
  "employerId": "user-001",
  "candidateId": "user-010",
  "companyId": "company-001",
  "notes": "Ứng viên tiềm năng cho vị trí Senior Developer",
  "label": "Tiềm năng",
  "isFavorite": true,
  "createdAt": "2026-03-20T10:00:00.000Z",
  "candidate": {
    "id": "user-010",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "nguyenvana@example.com",
    "phone": "0901234567",
    "avatar": "https://example.com/avatar-010.jpg",
    "currentPosition": "Senior Frontend Developer",
    "yearsOfExperience": 5,
    "skills": [
      {
        "name": "React",
        "level": "Expert"
      },
      {
        "name": "TypeScript",
        "level": "Advanced"
      }
    ],
    "education": [
      {
        "school": "Đại học Bách Khoa Hà Nội",
        "degree": "Cử nhân",
        "fieldOfStudy": "Khoa học máy tính"
      }
    ]
  }
}
```

---

### DELETE /saved-candidates/:id

**Mô tả:** Bỏ lưu ứng viên

**Request URL:**

```
DELETE /saved-candidates/sc-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** (No Content)

---

### DELETE /saved-candidates/candidate/:candidateId

**Mô tả:** Bỏ lưu ứng viên theo candidate ID

**Request URL:**

```
DELETE /saved-candidates/candidate/user-010
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** (No Content)

---

### POST /saved-candidates/toggle/:candidateId

**Mô tả:** Toggle lưu/bỏ lưu ứng viên

**Request URL:**

```
POST /saved-candidates/toggle/user-012
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "saved": true,
  "message": "Đã lưu",
  "savedCandidate": {
    "id": "sc-003",
    "employerId": "user-001",
    "candidateId": "user-012",
    "createdAt": "2026-03-24T06:05:00.000Z"
  }
}
```

Hoặc nếu đã lưu trước đó:

```json
{
  "saved": false,
  "message": "Đã bỏ lưu"
}
```

---

### POST /saved-candidates/:id/favorite

**Mô tả:** Đánh dấu yêu thích

**Request URL:**

```
POST /saved-candidates/sc-002/favorite
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "sc-002",
  "isFavorite": true,
  "updatedAt": "2026-03-24T06:10:00.000Z",
  "message": "Đánh dấu thành công"
}
```

---

### POST /saved-candidates/:id/label

**Mô tả:** Gắn nhãn phân loại

**Request URL:**

```
POST /saved-candidates/sc-002/label
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**

```json
{
  "label": "Phỏng vấn vòng 2"
}
```

**Response 200:**

```json
{
  "id": "sc-002",
  "label": "Phỏng vấn vòng 2",
  "updatedAt": "2026-03-24T06:15:00.000Z",
  "message": "Gắn nhãn thành công"
}
```

---

### POST /saved-candidates/:id/notes

**Mô tả:** Cập nhật ghi chú

**Request URL:**

```
POST /saved-candidates/sc-002/notes
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**

```json
{
  "notes": "Ứng viên có kinh nghiệm tốt với Node.js. Đã phỏng vấn vòng 1, kết quả tốt."
}
```

**Response 200:**

```json
{
  "id": "sc-002",
  "notes": "Ứng viên có kinh nghiệm tốt với Node.js. Đã phỏng vấn vòng 1, kết quả tốt.",
  "updatedAt": "2026-03-24T06:20:00.000Z",
  "message": "Cập nhật ghi chú thành công"
}
```

---

### GET /saved-candidates/check/:candidateId

**Mô tả:** Kiểm tra ứng viên đã lưu chưa

**Request URL:**

```
GET /saved-candidates/check/user-010
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "isSaved": true,
  "savedId": "sc-001"
}
```

Hoặc nếu chưa lưu:

```json
{
  "isSaved": false,
  "savedId": null
}
```

---

### GET /saved-candidates/statistics/overview

**Mô tả:** Lấy thống kê ứng viên đã lưu

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "totalSaved": 15,
  "favorites": 5,
  "byLabel": [
    {
      "label": "Tiềm năng",
      "count": 8
    },
    {
      "label": "Phù hợp",
      "count": 4
    },
    {
      "label": "Phỏng vấn vòng 2",
      "count": 3
    }
  ]
}
```

---

## 8. Branch Management - Quản lý chi nhánh

### POST /branches

**Mô tả:** Tạo chi nhánh mới

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "name": "Chi nhánh Hà Nội",
  "address": "123 Nguyễn Huệ, Quận Hoàn Kiếm",
  "city": "Hà Nội",
  "country": "Việt Nam",
  "phone": "024-1234-5678",
  "email": "hanoi@company.com",
  "isHeadquarter": false,
  "employeeCount": 50,
  "latitude": 21.028511,
  "longitude": 105.804817,
  "companyId": "company-001"
}
```

**Response 201:**

```json
{
  "id": "branch-001",
  "name": "Chi nhánh Hà Nội",
  "address": "123 Nguyễn Huệ, Quận Hoàn Kiếm",
  "city": "Hà Nội",
  "country": "Việt Nam",
  "phone": "024-1234-5678",
  "email": "hanoi@company.com",
  "isActive": true,
  "isHeadquarter": false,
  "employeeCount": 50,
  "latitude": 21.028511,
  "longitude": 105.804817,
  "companyId": "company-001",
  "createdAt": "2026-03-24T05:10:00.000Z",
  "updatedAt": "2026-03-24T05:10:00.000Z"
}
```

**Response 403:**

```json
{
  "statusCode": 403,
  "message": "Bạn không có quyền thêm chi nhánh cho công ty này",
  "error": "Forbidden"
}
```

---

### GET /branches/company/:companyId

**Mô tả:** Lấy danh sách chi nhánh theo công ty

**Request URL:**

```
GET /branches/company/company-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Query Parameters:**

```json
{
  "page": 1,
  "limit": 10,
  "isActive": true
}
```

**Response 200:**

```json
{
  "data": [
    {
      "id": "branch-001",
      "name": "Chi nhánh Hà Nội",
      "address": "123 Nguyễn Huệ, Quận Hoàn Kiếm",
      "city": "Hà Nội",
      "country": "Việt Nam",
      "phone": "024-1234-5678",
      "email": "hanoi@company.com",
      "isActive": true,
      "isHeadquarter": false,
      "employeeCount": 50,
      "companyId": "company-001",
      "createdAt": "2026-03-24T05:10:00.000Z"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### GET /branches/:id

**Mô tả:** Lấy thông tin chi tiết chi nhánh

**Request URL:**

```
GET /branches/branch-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "branch-001",
  "name": "Chi nhánh Hà Nội",
  "address": "123 Nguyễn Huệ, Quận Hoàn Kiếm",
  "city": "Hà Nội",
  "country": "Việt Nam",
  "phone": "024-1234-5678",
  "email": "hanoi@company.com",
  "isActive": true,
  "isHeadquarter": false,
  "employeeCount": 50,
  "latitude": 21.028511,
  "longitude": 105.804817,
  "companyId": "company-001",
  "company": {
    "id": "company-001",
    "name": "Tech Solutions Việt Nam"
  },
  "createdAt": "2026-03-24T05:10:00.000Z",
  "updatedAt": "2026-03-24T05:10:00.000Z"
}
```

**Response 404:**

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy chi nhánh",
  "error": "Not Found"
}
```

---

### PUT /branches/:id

**Mô tả:** Cập nhật thông tin chi nhánh

**Request URL:**

```
PUT /branches/branch-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "name": "Chi nhánh Hà Nội - Cập nhật",
  "address": "456 Lý Thường Kiệt, Quận Hai Bà Trưng",
  "phone": "024-8765-4321",
  "employeeCount": 75
}
```

**Response 200:**

```json
{
  "id": "branch-001",
  "name": "Chi nhánh Hà Nội - Cập nhật",
  "address": "456 Lý Thường Kiệt, Quận Hai Bà Trưng",
  "city": "Hà Nội",
  "country": "Việt Nam",
  "phone": "024-8765-4321",
  "email": "hanoi@company.com",
  "isActive": true,
  "isHeadquarter": false,
  "employeeCount": 75,
  "companyId": "company-001",
  "updatedAt": "2026-03-24T05:20:00.000Z"
}
```

---

### DELETE /branches/:id

**Mô tả:** Xóa chi nhánh

**Request URL:**

```
DELETE /branches/branch-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** No Content

**Response 400:**

```json
{
  "statusCode": 400,
  "message": "Không thể xóa trụ sở chính",
  "error": "Bad Request"
}
```

---

### PUT /branches/:id/set-headquarter

**Mô tả:** Đặt chi nhánh làm trụ sở chính

**Request URL:**

```
PUT /branches/branch-001/set-headquarter
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "branch-001",
  "name": "Chi nhánh Hà Nội",
  "isHeadquarter": true,
  "message": "Đã đặt làm trụ sở chính"
}
```

---

### PUT /branches/:id/toggle-status

**Mô tả:** Bật/tắt trạng thái hoạt động

**Request URL:**

```
PUT /branches/branch-001/toggle-status
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "branch-001",
  "name": "Chi nhánh Hà Nội",
  "isActive": false,
  "message": "Đã vô hiệu hóa chi nhánh"
}
```

---

### GET /branches/company/:companyId/statistics

**Mô tả:** Thống kê chi nhánh công ty

**Request URL:**

```
GET /branches/company/company-001/statistics
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "totalBranches": 5,
  "activeBranches": 4,
  "inactiveBranches": 1,
  "headquarter": {
    "id": "branch-001",
    "name": "Trụ sở chính TP.HCM"
  },
  "branchesByCity": [
    {
      "city": "Hồ Chí Minh",
      "count": 2
    },
    {
      "city": "Hà Nội",
      "count": 2
    },
    {
      "city": "Đà Nẵng",
      "count": 1
    }
  ]
}
```

---

## 9. Company Users - Quản lý người dùng công ty

### POST /company-users/invite

**Mô tả:** Mời thành viên vào công ty

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "email": "hr@company.com",
  "companyId": "company-001",
  "role": "hr",
  "permissions": ["manage_jobs", "view_applications", "schedule_interviews"]
}
```

**Response 201:**

```json
{
  "id": "cu-001",
  "companyId": "company-001",
  "userId": "user-050",
  "role": "hr",
  "permissions": ["manage_jobs", "view_applications", "schedule_interviews"],
  "isActive": true,
  "invitedAt": "2026-03-24T05:30:00.000Z",
  "acceptedAt": null,
  "invitedBy": "user-001",
  "createdAt": "2026-03-24T05:30:00.000Z",
  "updatedAt": "2026-03-24T05:30:00.000Z",
  "user": {
    "id": "user-050",
    "email": "hr@company.com",
    "firstName": "Nguyễn",
    "lastName": "Thị HR"
  }
}
```

**Response 409:**

```json
{
  "statusCode": 409,
  "message": "Người dùng đã là thành viên của công ty",
  "error": "Conflict"
}
```

---

### GET /company-users/company/:companyId

**Mô tả:** Lấy danh sách thành viên công ty

**Request URL:**

```
GET /company-users/company/company-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Query Parameters:**

```json
{
  "page": 1,
  "limit": 10,
  "role": "hr"
}
```

**Response 200:**

```json
{
  "data": [
    {
      "id": "cu-001",
      "companyId": "company-001",
      "userId": "user-050",
      "role": "hr",
      "permissions": ["manage_jobs", "view_applications"],
      "isActive": true,
      "invitedAt": "2026-03-24T05:30:00.000Z",
      "acceptedAt": "2026-03-24T05:35:00.000Z",
      "user": {
        "id": "user-050",
        "email": "hr@company.com",
        "firstName": "Nguyễn",
        "lastName": "Thị HR",
        "avatar": "https://example.com/avatar.jpg"
      }
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### GET /company-users/:id

**Mô tả:** Lấy thông tin thành viên

**Request URL:**

```
GET /company-users/cu-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "cu-001",
  "companyId": "company-001",
  "userId": "user-050",
  "role": "hr",
  "permissions": ["manage_jobs", "view_applications", "schedule_interviews"],
  "isActive": true,
  "invitedAt": "2026-03-24T05:30:00.000Z",
  "acceptedAt": "2026-03-24T05:35:00.000Z",
  "user": {
    "id": "user-050",
    "email": "hr@company.com",
    "firstName": "Nguyễn",
    "lastName": "Thị HR",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "0901234567"
  },
  "company": {
    "id": "company-001",
    "name": "Tech Solutions Việt Nam"
  }
}
```

---

### PUT /company-users/:id/role

**Mô tả:** Cập nhật vai trò thành viên

**Request URL:**

```
PUT /company-users/cu-001/role
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "role": "manager"
}
```

**Response 200:**

```json
{
  "id": "cu-001",
  "companyId": "company-001",
  "userId": "user-050",
  "role": "manager",
  "message": "Đã cập nhật vai trò"
}
```

---

### PUT /company-users/:id/permissions

**Mô tả:** Cập nhật quyền truy cập

**Request URL:**

```
PUT /company-users/cu-001/permissions
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "permissions": [
    "manage_jobs",
    "view_applications",
    "schedule_interviews",
    "manage_company_users"
  ]
}
```

**Response 200:**

```json
{
  "id": "cu-001",
  "companyId": "company-001",
  "userId": "user-050",
  "permissions": [
    "manage_jobs",
    "view_applications",
    "schedule_interviews",
    "manage_company_users"
  ],
  "message": "Đã cập nhật quyền truy cập"
}
```

---

### DELETE /company-users/:id

**Mô tả:** Xóa thành viên khỏi công ty

**Request URL:**

```
DELETE /company-users/cu-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** No Content

---

### PUT /company-users/:id/deactivate

**Mô tả:** Vô hiệu hóa thành viên

**Request URL:**

```
PUT /company-users/cu-001/deactivate
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "cu-001",
  "companyId": "company-001",
  "userId": "user-050",
  "isActive": false,
  "message": "Đã vô hiệu hóa thành viên"
}
```

---

### PUT /company-users/:id/activate

**Mô tả:** Kích hoạt lại thành viên

**Request URL:**

```
PUT /company-users/cu-001/activate
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "cu-001",
  "companyId": "company-001",
  "userId": "user-050",
  "isActive": true,
  "message": "Đã kích hoạt thành viên"
}
```

---

### GET /company-users/company/:companyId/statistics

**Mô tả:** Thống kê thành viên công ty

**Request URL:**

```
GET /company-users/company/company-001/statistics
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "totalMembers": 12,
  "activeMembers": 10,
  "inactiveMembers": 2,
  "membersByRole": [
    {
      "role": "owner",
      "count": 1
    },
    {
      "role": "admin",
      "count": 2
    },
    {
      "role": "hr",
      "count": 5
    },
    {
      "role": "manager",
      "count": 4
    }
  ]
}
```

---

## 10. Saved Candidates - Lưu hồ sơ ứng viên

### POST /saved-candidates

**Mô tả:** Lưu hồ sơ ứng viên

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "candidateId": "user-010",
  "companyId": "company-001",
  "notes": "Ứng viên tiềm năng cho vị trí Senior Developer",
  "label": "Tiềm năng",
  "isFavorite": true
}
```

**Response 201:**

```json
{
  "id": "sc-001",
  "employerId": "user-001",
  "candidateId": "user-010",
  "companyId": "company-001",
  "notes": "Ứng viên tiềm năng cho vị trí Senior Developer",
  "label": "Tiềm năng",
  "isFavorite": true,
  "createdAt": "2026-03-24T05:45:00.000Z",
  "candidate": {
    "id": "user-010",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "nguyenvana@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "currentPosition": "Senior Frontend Developer"
  }
}
```

**Response 409:**

```json
{
  "statusCode": 409,
  "message": "Đã lưu hồ sơ này rồi",
  "error": "Conflict"
}
```

---

### GET /saved-candidates

**Mô tả:** Lấy danh sách ứng viên đã lưu

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Query Parameters:**

```json
{
  "page": 1,
  "limit": 10,
  "label": "Tiềm năng",
  "isFavorite": true
}
```

**Response 200:**

```json
{
  "data": [
    {
      "id": "sc-001",
      "employerId": "user-001",
      "candidateId": "user-010",
      "companyId": "company-001",
      "notes": "Ứng viên tiềm năng cho vị trí Senior Developer",
      "label": "Tiềm năng",
      "isFavorite": true,
      "createdAt": "2026-03-24T05:45:00.000Z",
      "candidate": {
        "id": "user-010",
        "firstName": "Nguyễn",
        "lastName": "Văn A",
        "email": "nguyenvana@example.com",
        "avatar": "https://example.com/avatar.jpg",
        "currentPosition": "Senior Frontend Developer",
        "yearsOfExperience": 5,
        "skills": ["React", "TypeScript", "Node.js"]
      }
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

### GET /saved-candidates/:id

**Mô tả:** Lấy chi tiết ứng viên đã lưu

**Request URL:**

```
GET /saved-candidates/sc-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "sc-001",
  "employerId": "user-001",
  "candidateId": "user-010",
  "companyId": "company-001",
  "notes": "Ứng viên tiềm năng cho vị trí Senior Developer",
  "label": "Tiềm năng",
  "isFavorite": true,
  "createdAt": "2026-03-24T05:45:00.000Z",
  "candidate": {
    "id": "user-010",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "nguyenvana@example.com",
    "phone": "0901234567",
    "avatar": "https://example.com/avatar.jpg",
    "currentPosition": "Senior Frontend Developer",
    "yearsOfExperience": 5,
    "skills": [
      {
        "id": "skill-001",
        "name": "React",
        "level": "Expert"
      },
      {
        "id": "skill-002",
        "name": "TypeScript",
        "level": "Advanced"
      }
    ],
    "education": [
      {
        "school": "Đại học Bách Khoa",
        "degree": "Cử nhân",
        "fieldOfStudy": "Khoa học máy tính",
        "startYear": 2016,
        "endYear": 2020
      }
    ]
  }
}
```

---

### DELETE /saved-candidates/:id

**Mô tả:** Bỏ lưu ứng viên

**Request URL:**

```
DELETE /saved-candidates/sc-001
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** No Content

---

### POST /saved-candidates/toggle/:candidateId

**Mô tả:** Toggle lưu/bỏ lưu

**Request URL:**

```
POST /saved-candidates/toggle/user-010
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200 (khi lưu):**

```json
{
  "saved": true,
  "message": "Đã lưu ứng viên",
  "data": {
    "id": "sc-002",
    "candidateId": "user-010",
    "createdAt": "2026-03-24T05:50:00.000Z"
  }
}
```

**Response 200 (khi bỏ lưu):**

```json
{
  "saved": false,
  "message": "Đã bỏ lưu ứng viên"
}
```

---

### POST /saved-candidates/:id/favorite

**Mô tả:** Đánh dấu yêu thích

**Request URL:**

```
POST /saved-candidates/sc-001/favorite
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "id": "sc-001",
  "isFavorite": true,
  "message": "Đã đánh dấu yêu thích"
}
```

---

### POST /saved-candidates/:id/label

**Mô tả:** Gắn nhãn phân loại

**Request URL:**

```
POST /saved-candidates/sc-001/label
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "label": "Phù hợp"
}
```

**Response 200:**

```json
{
  "id": "sc-001",
  "label": "Phù hợp",
  "message": "Đã cập nhật nhãn"
}
```

---

### POST /saved-candidates/:id/notes

**Mô tả:** Cập nhật ghi chú

**Request URL:**

```
POST /saved-candidates/sc-001/notes
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "notes": "Ứng viên có kinh nghiệm tốt, đã phỏng vấn vòng 1"
}
```

**Response 200:**

```json
{
  "id": "sc-001",
  "notes": "Ứng viên có kinh nghiệm tốt, đã phỏng vấn vòng 1",
  "message": "Đã cập nhật ghi chú"
}
```

---

### GET /saved-candidates/check/:candidateId

**Mô tả:** Kiểm tra đã lưu ứng viên chưa

**Request URL:**

```
GET /saved-candidates/check/user-010
```

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200 (đã lưu):**

```json
{
  "isSaved": true,
  "savedId": "sc-001"
}
```

**Response 200 (chưa lưu):**

```json
{
  "isSaved": false,
  "savedId": null
}
```

---

### GET /saved-candidates/statistics/overview

**Mô tả:** Thống kê ứng viên đã lưu

**Request Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**

```json
{
  "totalSaved": 45,
  "favorites": 12,
  "byLabel": [
    {
      "label": "Tiềm năng",
      "count": 20
    },
    {
      "label": "Phù hợp",
      "count": 15
    },
    {
      "label": "Phỏng vấn",
      "count": 10
    }
  ],
  "recentlySaved": [
    {
      "id": "sc-001",
      "candidateName": "Nguyễn Văn A",
      "savedAt": "2026-03-24T05:45:00.000Z"
    }
  ]
}
```

---

## Application Status Flow

```
pending → reviewing → shortlisted → interviewed → offered → hired
    ↓         ↓           ↓
rejected  rejected    rejected
```

**Mô tả các trạng thái:**

- **pending**: Đơn mới nộp, chờ nhà tuyển dụng xem
- **reviewing**: Nhà tuyển dụng đang xem xét
- **shortlisted**: Đã chọn vào vòng trong
- **interviewed**: Đã phỏng vấn
- **offered**: Đã gửi offer
- **hired**: Đã tuyển thành công
- **rejected**: Đã từ chối
