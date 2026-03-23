# CVKing API Documentation

## Overview

CVKing provides a comprehensive RESTful API for job portal functionality. This documentation covers all available endpoints, request/response formats, authentication, and usage examples.

## Base URL

```
https://api.cvking.com/api/v1
```

For development:
```
http://localhost:3000/api/v1
```

## Authentication

### JWT Authentication

All protected endpoints require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "gender": "male",
  "dateOfBirth": "1990-01-01",
  "role": "job_seeker"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "job_seeker"
    },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  },
  "message": "User registered successfully"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "job_seeker"
    },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  },
  "message": "Login successful"
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token",
    "refreshToken": "new-refresh-token"
  },
  "message": "Token refreshed successfully"
}
```

#### Get User Profile
```http
GET /auth/profile
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "gender": "male",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "avatar": "avatar-url",
    "status": "active",
    "emailVerifiedAt": null,
    "lastLoginAt": "2024-01-01T00:00:00.000Z",
    "isActive": true,
    "statusReason": null,
    "googleId": null,
    "linkedInId": null,
    "avatarUrl": "avatar-url",
    "preferredLocale": "en",
    "roles": [
      {
        "id": "uuid",
        "name": "job_seeker",
        "description": "Job seeker role"
      }
    ]
  }
}
```

## Jobs API

### List Jobs
```http
GET /jobs?search=developer&location=hanoi&jobType=full_time&experienceLevel=mid_level&page=1&limit=10&sortBy=publishedAt&sortOrder=desc
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `search`: Search term for title, description, requirements
- `location`: City or location filter
- `jobType`: full_time, part_time, contract, internship
- `experienceLevel`: entry_level, mid_level, senior_level, lead_level
- `salaryMin`, `salaryMax`: Salary range filters
- `remoteWork`: true/false for remote work
- `companyId`: Filter by company
- `categoryId`: Filter by job category
- `page`, `limit`: Pagination
- `sortBy`: publishedAt, salary, experienceLevel
- `sortOrder`: asc, desc

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "title": "Senior Frontend Developer",
        "description": "Job description",
        "requirements": "Job requirements",
        "benefits": "Job benefits",
        "jobType": "full_time",
        "experienceLevel": "senior_level",
        "status": "published",
        "salaryType": "range",
        "minSalary": 1000,
        "maxSalary": 2000,
        "currency": "USD",
        "city": "Hanoi",
        "state": "Hanoi",
        "country": "Vietnam",
        "remoteWork": true,
        "publishedAt": "2024-01-01T00:00:00.000Z",
        "expiresAt": "2024-02-01T00:00:00.000Z",
        "viewCount": 100,
        "applicationCount": 10,
        "company": {
          "id": "uuid",
          "name": "Tech Company",
          "logo": "logo-url",
          "industry": "Technology"
        },
        "category": {
          "id": "uuid",
          "name": "Technology"
        },
        "skills": [
          {
            "id": "uuid",
            "name": "JavaScript"
          }
        ],
        "tags": [
          {
            "id": "uuid",
            "name": "React"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### Get Job Details
```http
GET /jobs/{jobId}
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Senior Frontend Developer",
    "description": "Job description",
    "requirements": "Job requirements",
    "benefits": "Job benefits",
    "jobType": "full_time",
    "experienceLevel": "senior_level",
    "status": "published",
    "salaryType": "range",
    "minSalary": 1000,
    "maxSalary": 2000,
    "currency": "USD",
    "city": "Hanoi",
    "state": "Hanoi",
    "country": "Vietnam",
    "remoteWork": true,
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-02-01T00:00:00.000Z",
    "viewCount": 100,
    "applicationCount": 10,
    "company": {
      "id": "uuid",
      "name": "Tech Company",
      "logo": "logo-url",
      "industry": "Technology"
    },
    "category": {
      "id": "uuid",
      "name": "Technology"
    },
    "skills": [
      {
        "id": "uuid",
        "name": "JavaScript"
      }
    ],
    "tags": [
      {
        "id": "uuid",
        "name": "React"
      }
    ],
    "postedBy": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Create Job (Employer/HR)
```http
POST /jobs
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Senior Frontend Developer",
  "description": "Job description",
  "requirements": "Job requirements",
  "benefits": "Job benefits",
  "jobType": "full_time",
  "experienceLevel": "senior_level",
  "salaryType": "range",
  "minSalary": 1000,
  "maxSalary": 2000,
  "currency": "USD",
  "city": "Hanoi",
  "state": "Hanoi",
  "country": "Vietnam",
  "remoteWork": true,
  "expiresAt": "2024-02-01T00:00:00.000Z",
  "companyId": "uuid",
  "categoryId": "uuid",
  "skillIds": ["uuid1", "uuid2"],
  "tagIds": ["uuid1", "uuid2"]
}
```

### Update Job (Employer/HR)
```http
PUT /jobs/{jobId}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Job Title",
  "description": "Updated description"
}
```

### Delete Job (Employer/HR)
```http
DELETE /jobs/{jobId}
Authorization: Bearer <jwt-token>
```

### Publish Job (Employer/HR)
```http
POST /jobs/{jobId}/publish
Authorization: Bearer <jwt-token>
```

### Close Job (Employer/HR)
```http
POST /jobs/{jobId}/close
Authorization: Bearer <jwt-token>
```

### Get Company Jobs
```http
GET /jobs/company/{companyId}?status=published&page=1&limit=10
Authorization: Bearer <jwt-token>
```

## Applications API

### List User Applications
```http
GET /applications?status=submitted&page=1&limit=10&sortBy=submittedAt&sortOrder=desc
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `status`: submitted, under_review, accepted, rejected, withdrawn
- `jobId`: Filter by job
- `page`, `limit`: Pagination
- `sortBy`: submittedAt, status
- `sortOrder`: asc, desc

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "job": {
          "id": "uuid",
          "title": "Job Title",
          "company": {
            "id": "uuid",
            "name": "Company Name"
          }
        },
        "coverLetter": "Cover letter content",
        "resumeUrl": "resume-url",
        "status": "submitted",
        "source": "direct",
        "submittedAt": "2024-01-01T00:00:00.000Z",
        "reviewedAt": null,
        "viewCount": 1,
        "jobSeekerProfile": {
          "id": "uuid",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### Apply for Job
```http
POST /applications
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "jobId": "uuid",
  "coverLetter": "My cover letter",
  "resumeUrl": "resume-file-url"
}
```

### Get Application Details
```http
GET /applications/{applicationId}
Authorization: Bearer <jwt-token>
```

### Update Application
```http
PUT /applications/{applicationId}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "coverLetter": "Updated cover letter",
  "resumeUrl": "updated-resume-url"
}
```

### Delete Application
```http
DELETE /applications/{applicationId}
Authorization: Bearer <jwt-token>
```

### Get Job Applications (Employer/HR)
```http
GET /applications/job/{jobId}?status=submitted&page=1&limit=10
Authorization: Bearer <jwt-token>
```

### Update Application Status (Employer/HR)
```http
PUT /applications/{applicationId}/status
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "status": "under_review",
  "reviewedBy": "uuid"
}
```

## Users API

### List Users (Admin)
```http
GET /users?role=job_seeker&status=active&page=1&limit=10
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `role`: admin, employer, hr, job_seeker
- `status`: active, inactive, pending, suspended
- `search`: Search by name or email
- `page`, `limit`: Pagination

### Get User Details
```http
GET /users/{userId}
Authorization: Bearer <jwt-token>
```

### Update User (Admin)
```http
PUT /users/{userId}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "Updated Name",
  "email": "newemail@example.com",
  "status": "active"
}
```

### Delete User (Admin)
```http
DELETE /users/{userId}
Authorization: Bearer <jwt-token>
```

### Update Own Profile
```http
PUT /users/profile/me
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "Updated Name",
  "lastName": "Updated Last Name",
  "phone": "+1234567890",
  "gender": "male",
  "dateOfBirth": "1990-01-01"
}
```

### Upload Avatar
```http
POST /users/profile/me/avatar
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

file: [binary data]
```

## Companies API

### List Companies
```http
GET /companies?search=tech&industry=technology&page=1&limit=10
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `search`: Search by name or description
- `industry`: Filter by industry
- `verified`: true/false
- `page`, `limit`: Pagination

### Get Company Details
```http
GET /companies/{companyId}
Authorization: Bearer <jwt-token>
```

### Create Company (Employer)
```http
POST /companies
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Tech Company",
  "description": "Company description",
  "industry": "Technology",
  "website": "https://techcompany.com",
  "email": "contact@techcompany.com",
  "phone": "+1234567890",
  "address": "123 Tech Street",
  "size": "50-100",
  "logo": "logo-url"
}
```

### Update Company (Employer)
```http
PUT /companies/{companyId}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Updated Company Name",
  "description": "Updated description"
}
```

### Delete Company (Employer)
```http
DELETE /companies/{companyId}
Authorization: Bearer <jwt-token>
```

### Get Company Jobs
```http
GET /companies/{companyId}/jobs?page=1&limit=10
Authorization: Bearer <jwt-token>
```

### Get Company HR Users
```http
GET /companies/{companyId}/hr-users
Authorization: Bearer <jwt-token>
```

### Assign HR User (Employer)
```http
POST /companies/{companyId}/hr-users
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "userId": "uuid"
}
```

### Remove HR User (Employer)
```http
DELETE /companies/{companyId}/hr-users/{userId}
Authorization: Bearer <jwt-token>
```

## CV API

### List User CVs
```http
GET /cvs?isPublic=true&page=1&limit=10
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `isPublic`: true/false
- `page`, `limit`: Pagination

### Create CV
```http
POST /cvs
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "My Resume",
  "content": "CV content in JSON format",
  "template": "modern",
  "isPublic": true
}
```

### Get CV Details
```http
GET /cvs/{cvId}
Authorization: Bearer <jwt-token>
```

### Update CV
```http
PUT /cvs/{cvId}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Resume Title",
  "content": "Updated CV content",
  "template": "classic",
  "isPublic": false
}
```

### Delete CV
```http
DELETE /cvs/{cvId}
Authorization: Bearer <jwt-token>
```

### Get Public CV
```http
GET /cvs/public/{cvId}
```

## Messaging API

### List Message Threads
```http
GET /messages/threads?page=1&limit=10
Authorization: Bearer <jwt-token>
```

### Get Thread Messages
```http
GET /messages/threads/{threadId}?page=1&limit=20
Authorization: Bearer <jwt-token>
```

### Send Message
```http
POST /messages
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "threadId": "uuid",
  "content": "Hello, how are you?",
  "type": "text"
}
```

### Create Thread
```http
POST /messages/threads
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "participantIds": ["uuid1", "uuid2"],
  "subject": "Job Application Discussion"
}
```

### Mark Messages as Read
```http
POST /messages/threads/{threadId}/read
Authorization: Bearer <jwt-token>
```

## Notifications API

### List Notifications
```http
GET /notifications?isRead=false&page=1&limit=20
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `isRead`: true/false
- `type`: job_application, message, system
- `page`, `limit`: Pagination

### Mark Notification as Read
```http
PUT /notifications/{notificationId}/read
Authorization: Bearer <jwt-token>
```

### Mark All Notifications as Read
```http
PUT /notifications/read-all
Authorization: Bearer <jwt-token>
```

### Delete Notification
```http
DELETE /notifications/{notificationId}
Authorization: Bearer <jwt-token>
```

## Blog API

### List Blog Posts
```http
GET /blog?category=career-advice&search=job&page=1&limit=10
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `category`: Filter by category
- `search`: Search by title or content
- `page`, `limit`: Pagination

### Get Blog Post
```http
GET /blog/{postId}
Authorization: Bearer <jwt-token>
```

### Create Blog Post (Admin)
```http
POST /blog
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Blog Title",
  "content": "Blog content",
  "excerpt": "Blog excerpt",
  "categoryId": "uuid",
  "tags": ["tag1", "tag2"],
  "isPublished": true
}
```

### Update Blog Post (Admin)
```http
PUT /blog/{postId}
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### Delete Blog Post (Admin)
```http
DELETE /blog/{postId}
Authorization: Bearer <jwt-token>
```

### Get Blog Comments
```http
GET /blog/{postId}/comments?page=1&limit=10
Authorization: Bearer <jwt-token>
```

### Add Comment
```http
POST /blog/{postId}/comments
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "content": "Great article!"
}
```

## Error Responses

### Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Authentication Error
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Authorization Error
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Not Found Error
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Authentication endpoints**: 5 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **File upload endpoints**: 10 requests per minute per user

When rate limits are exceeded, the API returns:
```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640995200
```

## SDKs and Libraries

### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.cvking.com/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usage
api.get('/jobs')
  .then(response => console.log(response.data))
  .catch(error => console.error(error.response.data));
```

### Python
```python
import requests

class CVKingAPI:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.headers = {'Content-Type': 'application/json'}
        if token:
            self.headers['Authorization'] = f'Bearer {token}'
    
    def get_jobs(self, **params):
        response = requests.get(
            f'{self.base_url}/jobs',
            headers=self.headers,
            params=params
        )
        return response.json()

# Usage
api = CVKingAPI('https://api.cvking.com/api/v1', 'your-token')
jobs = api.get_jobs(search='developer', location='hanoi')
```

This API documentation provides comprehensive coverage of all available endpoints, request/response formats, and usage examples for the CVKing job portal application.