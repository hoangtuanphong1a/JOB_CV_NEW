# Job Seeker API - Swagger Test Examples

## Mục lục
1. [Profile Management - Quản lý hồ sơ cá nhân](#1-profile-management)
2. [CV Management - Quản lý CV](#2-cv-management)
3. [Job Search - Tìm kiếm việc làm](#3-job-search)
4. [Job Application - Ứng tuyển công việc](#4-job-application)
5. [Saved Jobs - Việc làm đã lưu](#5-saved-jobs)
6. [Notifications - Thông báo](#6-notifications)
7. [Messaging - Tin nhắn](#7-messaging)

---

## 1. Profile Management

### POST /jobseeker/profile
**Mô tả:** Tạo hồ sơ ứng viên mới

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**
```json
{
  "dateOfBirth": "1995-05-15",
  "gender": "male",
  "phone": "0901234567",
  "address": "123 Nguyễn Huệ, Quận 1",
  "city": "Ho Chi Minh",
  "country": "Vietnam",
  "objective": "Tìm kiếm vị trí Senior Frontend Developer tại công ty công nghệ hàng đầu, nơi tôi có thể phát triển kỹ năng và đóng góp vào các dự án đổi mới.",
  "currentPosition": "Frontend Developer",
  "yearsOfExperience": 5,
  "expectedSalaryMin": 25000000,
  "expectedSalaryMax": 40000000,
  "expectedJobType": "full-time",
  "preferredWorkingMethod": "remote",
  "willingToRelocate": false,
  "linkedinUrl": "https://linkedin.com/in/nguyenvana",
  "githubUrl": "https://github.com/nguyenvana",
  "portfolioUrl": "https://nguyenvana.dev"
}
```

**Response 201:**
```json
{
  "id": "profile-001",
  "userId": "user-010",
  "dateOfBirth": "1995-05-15T00:00:00.000Z",
  "gender": "male",
  "phone": "0901234567",
  "address": "123 Nguyễn Huệ, Quận 1",
  "city": "Ho Chi Minh",
  "country": "Vietnam",
  "objective": "Tìm kiếm vị trí Senior Frontend Developer...",
  "currentPosition": "Frontend Developer",
  "yearsOfExperience": 5,
  "expectedSalaryMin": 25000000,
  "expectedSalaryMax": 40000000,
  "expectedJobType": "full-time",
  "preferredWorkingMethod": "remote",
  "willingToRelocate": false,
  "linkedinUrl": "https://linkedin.com/in/nguyenvana",
  "githubUrl": "https://github.com/nguyenvana",
  "portfolioUrl": "https://nguyenvana.dev",
  "profileCompletion": 75,
  "createdAt": "2026-03-24T06:00:00.000Z",
  "updatedAt": "2026-03-24T06:00:00.000Z"
}
```

---

### GET /jobseeker/profile
**Mô tả:** Lấy hồ sơ ứng viên hiện tại

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "id": "profile-001",
  "userId": "user-010",
  "dateOfBirth": "1995-05-15T00:00:00.000Z",
  "gender": "male",
  "phone": "0901234567",
  "address": "123 Nguyễn Huệ, Quận 1",
  "city": "Ho Chi Minh",
  "country": "Vietnam",
  "avatar": "https://example.com/avatar.jpg",
  "objective": "Tìm kiếm vị trí Senior Frontend Developer...",
  "currentPosition": "Frontend Developer",
  "yearsOfExperience": 5,
  "expectedSalaryMin": 25000000,
  "expectedSalaryMax": 40000000,
  "expectedJobType": "full-time",
  "preferredWorkingMethod": "remote",
  "willingToRelocate": false,
  "linkedinUrl": "https://linkedin.com/in/nguyenvana",
  "githubUrl": "https://github.com/nguyenvana",
  "portfolioUrl": "https://nguyenvana.dev",
  "profileCompletion": 85,
  "user": {
    "id": "user-010",
    "email": "nguyenvana@example.com",
    "firstName": "Nguyễn",
    "lastName": "Văn A"
  },
  "educations": [
    {
      "id": "edu-001",
      "school": "Đại học Bách Khoa Hà Nội",
      "degree": "Cử nhân",
      "fieldOfStudy": "Khoa học máy tính",
      "startYear": 2013,
      "endYear": 2017,
      "gpa": 3.5
    }
  ],
  "experiences": [
    {
      "id": "exp-001",
      "company": "Tech Corp",
      "position": "Frontend Developer",
      "startDate": "2020-01-01",
      "endDate": null,
      "isCurrent": true,
      "description": "Phát triển ứng dụng web sử dụng React"
    }
  ],
  "skills": [
    {
      "id": "skill-001",
      "name": "React",
      "level": "expert"
    },
    {
      "id": "skill-002",
      "name": "TypeScript",
      "level": "advanced"
    }
  ],
  "certifications": [
    {
      "id": "cert-001",
      "name": "AWS Certified Developer",
      "issuer": "Amazon Web Services",
      "issueDate": "2023-06-15",
      "expiryDate": "2026-06-15"
    }
  ],
  "createdAt": "2026-01-10T08:00:00.000Z",
  "updatedAt": "2026-03-20T15:30:00.000Z"
}
```

---

### PUT /jobseeker/profile
**Mô tả:** Cập nhật hồ sơ ứng viên

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**
```json
{
  "phone": "0987654321",
  "address": "456 Lý Thường Kiệt, Quận 10",
  "objective": "Updated career objective with more specific goals...",
  "expectedSalaryMin": 30000000,
  "expectedSalaryMax": 50000000,
  "yearsOfExperience": 6
}
```

**Response 200:**
```json
{
  "id": "profile-001",
  "phone": "0987654321",
  "address": "456 Lý Thường Kiệt, Quận 10",
  "objective": "Updated career objective with more specific goals...",
  "expectedSalaryMin": 30000000,
  "expectedSalaryMax": 50000000,
  "yearsOfExperience": 6,
  "profileCompletion": 90,
  "updatedAt": "2026-03-24T06:15:00.000Z",
  "message": "Profile updated successfully"
}
```

---

### DELETE /jobseeker/profile
**Mô tả:** Xóa hồ sơ ứng viên

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** No Content

---

## 2. CV Management

### POST /cvs
**Mô tả:** Tạo CV mới

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**
```json
{
  "title": "Senior Frontend Developer CV",
  "templateId": "modern-001",
  "primaryColor": "#2563eb",
  "fontFamily": "Roboto",
  "sections": {
    "includeObjective": true,
    "includeExperience": true,
    "includeEducation": true,
    "includeSkills": true,
    "includeCertifications": true,
    "includeLanguages": true
  },
  "visibility": "private"
}
```

**Response 201:**
```json
{
  "id": "cv-001",
  "userId": "user-010",
  "title": "Senior Frontend Developer CV",
  "templateId": "modern-001",
  "primaryColor": "#2563eb",
  "fontFamily": "Roboto",
  "sections": {
    "includeObjective": true,
    "includeExperience": true,
    "includeEducation": true,
    "includeSkills": true,
    "includeCertifications": true,
    "includeLanguages": true
  },
  "visibility": "private",
  "status": "draft",
  "publicUrl": null,
  "downloadCount": 0,
  "viewCount": 0,
  "isPrimary": false,
  "createdAt": "2026-03-24T06:20:00.000Z",
  "updatedAt": "2026-03-24T06:20:00.000Z"
}
```

---

### GET /cvs/user/my-cvs
**Mô tả:** Lấy danh sách CV của người dùng hiện tại

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
      "id": "cv-001",
      "title": "Senior Frontend Developer CV",
      "templateId": "modern-001",
      "status": "published",
      "visibility": "public",
      "publicUrl": "https://jobcv.com/cv/abc123xyz",
      "downloadCount": 15,
      "viewCount": 120,
      "isPrimary": true,
      "createdAt": "2026-03-01T10:00:00.000Z",
      "updatedAt": "2026-03-20T15:30:00.000Z"
    },
    {
      "id": "cv-002",
      "title": "Backend Developer CV",
      "templateId": "classic-001",
      "status": "draft",
      "visibility": "private",
      "publicUrl": null,
      "downloadCount": 0,
      "viewCount": 0,
      "isPrimary": false,
      "createdAt": "2026-03-15T14:00:00.000Z",
      "updatedAt": "2026-03-15T14:00:00.000Z"
    }
  ],
  "total": 2
}
```

---

### GET /cvs/:id
**Mô tả:** Lấy chi tiết CV theo ID

**Request URL:**
```
GET /cvs/cv-001
```

**Response 200:**
```json
{
  "id": "cv-001",
  "userId": "user-010",
  "title": "Senior Frontend Developer CV",
  "templateId": "modern-001",
  "primaryColor": "#2563eb",
  "fontFamily": "Roboto",
  "sections": {
    "includeObjective": true,
    "includeExperience": true,
    "includeEducation": true,
    "includeSkills": true,
    "includeCertifications": true,
    "includeLanguages": true
  },
  "visibility": "public",
  "status": "published",
  "publicUrl": "https://jobcv.com/cv/abc123xyz",
  "downloadCount": 15,
  "viewCount": 120,
  "isPrimary": true,
  "user": {
    "id": "user-010",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "nguyenvana@example.com"
  },
  "profile": {
    "phone": "0901234567",
    "city": "Ho Chi Minh",
    "currentPosition": "Frontend Developer",
    "yearsOfExperience": 5,
    "objective": "Tìm kiếm vị trí Senior Frontend Developer..."
  },
  "createdAt": "2026-03-01T10:00:00.000Z",
  "updatedAt": "2026-03-20T15:30:00.000Z"
}
```

---

### PUT /cvs/:id
**Mô tả:** Cập nhật CV

**Request URL:**
```
PUT /cvs/cv-001
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
  "title": "Senior Frontend Developer CV - Updated",
  "primaryColor": "#10b981",
  "sections": {
    "includeObjective": true,
    "includeExperience": true,
    "includeEducation": true,
    "includeSkills": true,
    "includeCertifications": true,
    "includeLanguages": false
  }
}
```

**Response 200:**
```json
{
  "id": "cv-001",
  "title": "Senior Frontend Developer CV - Updated",
  "primaryColor": "#10b981",
  "updatedAt": "2026-03-24T06:25:00.000Z",
  "message": "CV updated successfully"
}
```

---

### DELETE /cvs/:id
**Mô tả:** Xóa CV

**Request URL:**
```
DELETE /cvs/cv-002
```

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** No Content

---

### POST /cvs/:id/publish
**Mô tả:** Xuất bản CV

**Request URL:**
```
POST /cvs/cv-001/publish
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
  "id": "cv-001",
  "status": "published",
  "publicUrl": "https://jobcv.com/cv/abc123xyz",
  "publishedAt": "2026-03-24T06:30:00.000Z",
  "message": "CV published successfully"
}
```

---

### POST /cvs/:id/archive
**Mô tả:** Lưu trữ CV

**Request URL:**
```
POST /cvs/cv-001/archive
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
  "id": "cv-001",
  "status": "archived",
  "archivedAt": "2026-03-24T06:35:00.000Z",
  "message": "CV archived successfully"
}
```

---

### POST /cvs/:id/share
**Mô tả:** Tạo link chia sẻ CV

**Request URL:**
```
POST /cvs/cv-001/share
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
  "publicUrl": "https://jobcv.com/cv/abc123xyz",
  "shareLink": "https://jobcv.com/cv/abc123xyz",
  "expiresAt": "2026-04-24T06:40:00.000Z",
  "message": "Share link generated successfully"
}
```

---

### POST /cvs/:id/set-primary
**Mô tả:** Đặt CV làm CV chính

**Request URL:**
```
POST /cvs/cv-001/set-primary
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
  "id": "cv-001",
  "isPrimary": true,
  "message": "CV set as primary successfully"
}
```

---

### POST /cvs/:id/unset-primary
**Mô tả:** Bỏ đặt CV chính

**Request URL:**
```
POST /cvs/cv-001/unset-primary
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
  "id": "cv-001",
  "isPrimary": false,
  "message": "CV unset as primary successfully"
}
```

---

### GET /cvs/user/primary-cv
**Mô tả:** Lấy CV chính của người dùng

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "id": "cv-001",
  "title": "Senior Frontend Developer CV",
  "status": "published",
  "isPrimary": true,
  "publicUrl": "https://jobcv.com/cv/abc123xyz"
}
```

---

### GET /cvs/user/primary-cv-or-first
**Mô tả:** Lấy CV chính hoặc CV đầu tiên để ứng tuyển

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "id": "cv-001",
  "title": "Senior Frontend Developer CV",
  "status": "published",
  "isPrimary": true,
  "publicUrl": "https://jobcv.com/cv/abc123xyz"
}
```

---

### GET /cvs/user/my-stats
**Mô tả:** Lấy thống kê CV

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "totalCvs": 3,
  "publishedCvs": 2,
  "draftCvs": 1,
  "archivedCvs": 0,
  "totalViews": 350,
  "totalDownloads": 45,
  "primaryCvId": "cv-001"
}
```

---

### GET /cvs/public/:publicUrl
**Mô tả:** Lấy CV công khai qua URL

**Request URL:**
```
GET /cvs/public/abc123xyz
```

**Response 200:**
```json
{
  "id": "cv-001",
  "title": "Senior Frontend Developer CV",
  "user": {
    "firstName": "Nguyễn",
    "lastName": "Văn A"
  },
  "profile": {
    "phone": "0901234567",
    "city": "Ho Chi Minh",
    "currentPosition": "Frontend Developer",
    "yearsOfExperience": 5,
    "objective": "Tìm kiếm vị trí Senior Frontend Developer..."
  },
  "educations": [...],
  "experiences": [...],
  "skills": [...],
  "certifications": [...]
}
```

---

## 3. Job Search

### GET /jobs
**Mô tả:** Tìm kiếm việc làm với bộ lọc

**Request Query Parameters:**
```json
{
  "page": 1,
  "limit": 20,
  "search": "Frontend Developer",
  "categoryId": "cat-001",
  "city": "Ho Chi Minh",
  "jobType": "full-time",
  "experienceLevel": "mid",
  "minSalary": 20000000,
  "maxSalary": 50000000,
  "remoteWork": true,
  "sortBy": "createdAt",
  "sortOrder": "DESC"
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
        "logo": "https://example.com/logo.png",
        "isVerified": true
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
      "remoteWork": false,
      "viewCount": 1234,
      "applicationCount": 45,
      "isVip": true,
      "isHot": true,
      "createdAt": "2026-03-20T10:00:00.000Z",
      "expiresAt": "2026-04-20T10:00:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

---

### GET /jobs/:id
**Mô tả:** Xem chi tiết công việc

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
    "industry": "Technology",
    "isVerified": true
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

---

## 4. Job Posting (Free for Job Seekers)

### POST /jobs
**Mô tả:** Đăng tin tuyển dụng miễn phí (Job seeker không cần gói dịch vụ)

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**
```json
{
  "title": "Tuyển Frontend Developer",
  "description": "Công ty đang tìm kiếm Frontend Developer có kinh nghiệm...",
  "companyId": "company-001",
  "categoryId": "cat-001",
  "jobType": "full-time",
  "experienceLevel": "mid",
  "minSalary": 15000000,
  "maxSalary": 25000000,
  "city": "Ho Chi Minh",
  "country": "Vietnam",
  "remoteWork": false,
  "skillIds": ["skill-001", "skill-002"],
  "tagIds": ["tag-001"],
  "expiresAt": "2026-04-30"
}
```

**Response 201:**
```json
{
  "id": "job-100",
  "title": "Tuyển Frontend Developer",
  "status": "published",
  "companyId": "company-001",
  "publishedAt": "2026-03-24T07:00:00.000Z",
  "message": "Job created successfully"
}
```

**Lưu ý:** Job seeker có thể đăng tin miễn phí mà không cần kiểm tra gói dịch vụ. Hệ thống tự động bỏ qua kiểm tra subscription cho tài khoản job seeker.

---

## 5. Job Application

### POST /applications
**Mô tả:** Ứng tuyển công việc

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**
```json
{
  "jobId": "job-001",
  "cvId": "cv-001",
  "coverLetter": "Kính gửi Nhà tuyển dụng,\n\nTôi viết thư này để bày tỏ sự quan tâm đến vị trí Senior Frontend Developer tại công ty của quý vị. Với 5 năm kinh nghiệm trong lĩnh vực phát triển phần mềm...\n\nTrân trọng,\nNguyễn Văn A"
}
```

**Response 201:**
```json
{
  "id": "app-001",
  "jobId": "job-001",
  "cvId": "cv-001",
  "status": "pending",
  "coverLetter": "Kính gửi Nhà tuyển dụng...",
  "viewedByEmployer": false,
  "viewedAt": null,
  "createdAt": "2026-03-24T06:45:00.000Z",
  "message": "Application submitted successfully"
}
```

---

### GET /applications/user/my-applications
**Mô tả:** Lấy danh sách đơn ứng tuyển của người dùng

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
  "status": "pending"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "app-001",
      "status": "pending",
      "viewedByEmployer": true,
      "viewedAt": "2026-03-23T10:00:00.000Z",
      "job": {
        "id": "job-001",
        "title": "Senior Frontend Developer",
        "company": {
          "id": "company-001",
          "name": "Tech Solutions Việt Nam",
          "logo": "https://example.com/logo.png"
        },
        "city": "Ho Chi Minh",
        "minSalary": 25000000,
        "maxSalary": 45000000
      },
      "cv": {
        "id": "cv-001",
        "title": "Senior Frontend Developer CV"
      },
      "createdAt": "2026-03-22T14:00:00.000Z"
    }
  ],
  "total": 15,
  "pending": 8,
  "reviewing": 3,
  "shortlisted": 2,
  "rejected": 2,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

---

### GET /applications/:id
**Mô tả:** Xem chi tiết đơn ứng tuyển

**Request URL:**
```
GET /applications/app-001
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
  "status": "reviewing",
  "coverLetter": "Kính gửi Nhà tuyển dụng...",
  "viewedByEmployer": true,
  "viewedAt": "2026-03-23T10:00:00.000Z",
  "notes": "Ứng viên có profile tốt",
  "job": {
    "id": "job-001",
    "title": "Senior Frontend Developer",
    "company": {
      "id": "company-001",
      "name": "Tech Solutions Việt Nam"
    }
  },
  "cv": {
    "id": "cv-001",
    "title": "Senior Frontend Developer CV",
    "publicUrl": "https://jobcv.com/cv/abc123xyz"
  },
  "interviews": [],
  "createdAt": "2026-03-22T14:00:00.000Z",
  "updatedAt": "2026-03-23T10:00:00.000Z"
}
```

---

### GET /applications/user/my-stats
**Mô tả:** Lấy thống kê ứng tuyển

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "totalApplications": 25,
  "pending": 10,
  "reviewing": 5,
  "shortlisted": 3,
  "interviewed": 4,
  "offered": 2,
  "hired": 1,
  "rejected": 5,
  "responseRate": 68.5,
  "averageResponseTime": 3.2
}
```

---

## 6. Saved Jobs

### POST /saved-jobs/:jobId
**Mô tả:** Lưu công việc

**Request URL:**
```
POST /saved-jobs/job-001
```

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 201:**
```json
{
  "id": "sj-001",
  "userId": "user-010",
  "jobId": "job-001",
  "createdAt": "2026-03-24T07:00:00.000Z",
  "message": "Job saved successfully"
}
```

---

### DELETE /saved-jobs/:jobId
**Mô tả:** Bỏ lưu công việc

**Request URL:**
```
DELETE /saved-jobs/job-001
```

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** No Content

---

### POST /saved-jobs/toggle/:jobId
**Mô tả:** Toggle trạng thái lưu/bỏ lưu

**Request URL:**
```
POST /saved-jobs/toggle/job-001
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
  "message": "Job saved successfully"
}
```

---

### GET /saved-jobs
**Mô tả:** Lấy danh sách việc làm đã lưu

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
      "id": "sj-001",
      "job": {
        "id": "job-001",
        "title": "Senior Frontend Developer",
        "company": {
          "id": "company-001",
          "name": "Tech Solutions Việt Nam",
          "logo": "https://example.com/logo.png"
        },
        "minSalary": 25000000,
        "maxSalary": 45000000,
        "city": "Ho Chi Minh",
        "status": "published",
        "expiresAt": "2026-04-20T10:00:00.000Z"
      },
      "createdAt": "2026-03-20T10:00:00.000Z"
    }
  ],
  "total": 12
}
```

---

### GET /saved-jobs/check/:jobId
**Mô tả:** Kiểm tra việc làm đã lưu chưa

**Request URL:**
```
GET /saved-jobs/check/job-001
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
  "savedJobId": "sj-001"
}
```

---

### GET /saved-jobs/stats
**Mô tả:** Lấy thống kê việc làm đã lưu

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
  "activeSaved": 12,
  "expiredSaved": 3,
  "appliedFromSaved": 8
}
```

---

## 4. Job Application

### POST /applications
**Mô tả:** Ứng tuyển vào vị trí

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**
```json
{
  "jobId": "job-001",
  "cvId": "cv-001",
  "coverLetter": "Kính gửi Nhà tuyển dụng,\n\nTôi xin ứng tuyển vào vị trí Senior Frontend Developer tại công ty của quý vị. Với 5 năm kinh nghiệm trong lĩnh vực phát triển web, tôi tin rằng tôi có đủ kỹ năng và kinh nghiệm để đóng góp vào sự phát triển của công ty.\n\nTrân trọng,\nNguyễn Văn A"
}
```

**Response 201:**
```json
{
  "id": "app-001",
  "jobId": "job-001",
  "jobSeekerProfileId": "profile-001",
  "cvId": "cv-001",
  "coverLetter": "Kính gửi Nhà tuyển dụng...",
  "status": "pending",
  "viewedByEmployer": false,
  "viewedAt": null,
  "createdAt": "2026-03-24T07:00:00.000Z",
  "job": {
    "id": "job-001",
    "title": "Senior Frontend Developer",
    "company": {
      "name": "Tech Solutions Việt Nam"
    }
  }
}
```

---

### GET /applications/user/my-applications
**Mô tả:** Lấy danh sách đơn ứng tuyển của người dùng

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
  "status": "pending"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "app-001",
      "status": "pending",
      "viewedByEmployer": true,
      "viewedAt": "2026-03-23T10:00:00.000Z",
      "job": {
        "id": "job-001",
        "title": "Senior Frontend Developer",
        "company": {
          "id": "company-001",
          "name": "Tech Solutions Việt Nam",
          "logo": "https://example.com/logo.png"
        },
        "city": "Ho Chi Minh",
        "jobType": "full-time"
      },
      "createdAt": "2026-03-20T14:00:00.000Z"
    },
    {
      "id": "app-002",
      "status": "shortlisted",
      "viewedByEmployer": true,
      "viewedAt": "2026-03-22T09:00:00.000Z",
      "job": {
        "id": "job-002",
        "title": "Frontend Team Lead",
        "company": {
          "id": "company-002",
          "name": "Digital Agency",
          "logo": "https://example.com/logo2.png"
        },
        "city": "Hà Nội",
        "jobType": "full-time"
      },
      "createdAt": "2026-03-18T11:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

---

### GET /applications/:id
**Mô tả:** Lấy chi tiết đơn ứng tuyển

**Request URL:**
```
GET /applications/app-001
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
  "status": "pending",
  "coverLetter": "Kính gửi Nhà tuyển dụng...",
  "viewedByEmployer": true,
  "viewedAt": "2026-03-23T10:00:00.000Z",
  "notes": null,
  "job": {
    "id": "job-001",
    "title": "Senior Frontend Developer",
    "description": "We are looking for...",
    "company": {
      "id": "company-001",
      "name": "Tech Solutions Việt Nam",
      "logo": "https://example.com/logo.png"
    },
    "city": "Ho Chi Minh",
    "minSalary": 25000000,
    "maxSalary": 45000000
  },
  "cv": {
    "id": "cv-001",
    "title": "Senior Frontend Developer CV"
  },
  "interviews": [],
  "createdAt": "2026-03-20T14:00:00.000Z",
  "updatedAt": "2026-03-23T10:00:00.000Z"
}
```

---

### GET /applications/user/my-stats
**Mô tả:** Lấy thống kê ứng tuyển

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "totalApplications": 25,
  "pending": 10,
  "reviewing": 5,
  "shortlisted": 4,
  "interviewed": 3,
  "offered": 2,
  "hired": 1,
  "rejected": 0,
  "responseRate": 60,
  "interviewRate": 12
}
```

---

## 5. Saved Jobs

### POST /saved-jobs/:jobId
**Mô tả:** Lưu việc làm

**Request URL:**
```
POST /saved-jobs/job-001
```

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 201:**
```json
{
  "id": "sj-001",
  "userId": "user-010",
  "jobId": "job-001",
  "createdAt": "2026-03-24T07:10:00.000Z",
  "job": {
    "id": "job-001",
    "title": "Senior Frontend Developer",
    "company": {
      "name": "Tech Solutions Việt Nam"
    }
  }
}
```

---

### DELETE /saved-jobs/:jobId
**Mô tả:** Bỏ lưu việc làm

**Request URL:**
```
DELETE /saved-jobs/job-001
```

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 204:** No Content

---

### POST /saved-jobs/toggle/:jobId
**Mô tả:** Toggle lưu/bỏ lưu

**Request URL:**
```
POST /saved-jobs/toggle/job-001
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
  "message": "Đã lưu việc làm",
  "savedJob": {
    "id": "sj-001",
    "jobId": "job-001"
  }
}
```

**Response 200 (khi bỏ lưu):**
```json
{
  "saved": false,
  "message": "Đã bỏ lưu việc làm"
}
```

---

### GET /saved-jobs
**Mô tả:** Lấy danh sách việc làm đã lưu

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
      "id": "sj-001",
      "createdAt": "2026-03-20T10:00:00.000Z",
      "job": {
        "id": "job-001",
        "title": "Senior Frontend Developer",
        "company": {
          "id": "company-001",
          "name": "Tech Solutions Việt Nam",
          "logo": "https://example.com/logo.png",
          "isVerified": true
        },
        "city": "Ho Chi Minh",
        "minSalary": 25000000,
        "maxSalary": 45000000,
        "jobType": "full-time",
        "status": "published",
        "expiresAt": "2026-04-20T10:00:00.000Z"
      }
    },
    {
      "id": "sj-002",
      "createdAt": "2026-03-18T14:00:00.000Z",
      "job": {
        "id": "job-005",
        "title": "Full Stack Developer",
        "company": {
          "id": "company-003",
          "name": "StartUp Inc",
          "logo": "https://example.com/logo3.png",
          "isVerified": false
        },
        "city": "Đà Nẵng",
        "minSalary": 20000000,
        "maxSalary": 35000000,
        "jobType": "full-time",
        "status": "published",
        "expiresAt": "2026-04-15T14:00:00.000Z"
      }
    }
  ],
  "total": 15
}
```

---

### GET /saved-jobs/check/:jobId
**Mô tả:** Kiểm tra việc làm đã lưu chưa

**Request URL:**
```
GET /saved-jobs/check/job-001
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
  "savedJobId": "sj-001"
}
```

---

## 7. Notifications

### GET /notifications
**Mô tả:** Lấy danh sách thông báo

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
  "limit": 20,
  "isRead": false,
  "type": "application_status_changed"
}
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "notif-001",
      "type": "application_status_changed",
      "title": "Đơn ứng tuyển được xem xét",
      "message": "Đơn ứng tuyển của bạn cho vị trí Senior Frontend Developer đã được nhà tuyển dụng xem xét.",
      "isRead": false,
      "metadata": {
        "applicationId": "app-001",
        "jobId": "job-001",
        "status": "reviewing"
      },
      "createdAt": "2026-03-24T02:00:00.000Z"
    },
    {
      "id": "notif-002",
      "type": "interview_scheduled",
      "title": "Lịch phỏng vấn mới",
      "message": "Bạn có lịch phỏng vấn vào ngày 28/03/2026 cho vị trí Frontend Team Lead.",
      "isRead": false,
      "metadata": {
        "applicationId": "app-002",
        "interviewDate": "2026-03-28T09:00:00.000Z"
      },
      "createdAt": "2026-03-23T15:00:00.000Z"
    },
    {
      "id": "notif-003",
      "type": "job_recommendation",
      "title": "Việc làm phù hợp",
      "message": "Chúng tôi tìm thấy 5 việc làm phù hợp với hồ sơ của bạn.",
      "isRead": true,
      "readAt": "2026-03-22T10:00:00.000Z",
      "metadata": {
        "jobCount": 5
      },
      "createdAt": "2026-03-22T08:00:00.000Z"
    }
  ],
  "total": 30,
  "unreadCount": 8,
  "page": 1,
  "limit": 20,
  "totalPages": 2
}
```

---

### PUT /notifications/:id/read
**Mô tả:** Đánh dấu thông báo đã đọc

**Request URL:**
```
PUT /notifications/notif-001/read
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
  "id": "notif-001",
  "isRead": true,
  "readAt": "2026-03-24T07:15:00.000Z",
  "message": "Notification marked as read"
}
```

---

### PUT /notifications/mark-all-read
**Mô tả:** Đánh dấu tất cả thông báo đã đọc

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "message": "All notifications marked as read",
  "markedCount": 8
}
```

---

### GET /notifications/unread/count
**Mô tả:** Lấy số thông báo chưa đọc

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200:**
```json
{
  "unreadCount": 8
}
```

---

## 8. Messaging

### POST /messaging/conversations/:userId
**Mô tả:** Tạo cuộc trò chuyện với nhà tuyển dụng

**Request URL:**
```
POST /messaging/conversations/user-020
```

**Request Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 201:**
```json
{
  "id": "conv-001",
  "participants": [
    {
      "id": "user-010",
      "name": "Nguyễn Văn A",
      "role": "job_seeker"
    },
    {
      "id": "user-020",
      "name": "Trần Văn B",
      "role": "employer"
    }
  ],
  "createdAt": "2026-03-24T07:20:00.000Z"
}
```

---

### GET /messaging/conversations
**Mô tả:** Lấy danh sách cuộc trò chuyện

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
      "id": "conv-001",
      "participants": [
        {
          "id": "user-010",
          "name": "Nguyễn Văn A"
        },
        {
          "id": "user-020",
          "name": "Trần Văn B",
          "avatar": "https://example.com/avatar-020.jpg"
        }
      ],
      "lastMessage": {
        "id": "msg-005",
        "content": "Cảm ơn bạn đã quan tâm",
        "senderId": "user-020",
        "createdAt": "2026-03-24T04:30:00.000Z"
      },
      "unreadCount": 1,
      "updatedAt": "2026-03-24T04:30:00.000Z"
    }
  ],
  "total": 3,
  "unreadTotal": 2
}
```

---

### POST /messaging/conversations/:id/messages
**Mô tả:** Gửi tin nhắn

**Request URL:**
```
POST /messaging/conversations/conv-001/messages
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
  "content": "Chào anh/chị, tôi rất quan tâm đến vị trí Senior Frontend Developer. Anh/chị có thể cho tôi biết thêm về yêu cầu công việc không?",
  "messageType": "text"
}
```

**Response 201:**
```json
{
  "id": "msg-010",
  "conversationId": "conv-001",
  "senderId": "user-010",
  "content": "Chào anh/chị, tôi rất quan tâm đến vị trí Senior Frontend Developer...",
  "messageType": "text",
  "isRead": false,
  "createdAt": "2026-03-24T07:25:00.000Z"
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
- **offered**: Đã nhận offer
- **hired**: Đã được tuyển
- **rejected**: Đã bị từ chối