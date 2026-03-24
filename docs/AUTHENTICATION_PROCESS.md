# Tài liệu quy trình Authentication

## Tổng quan hệ thống

Hệ thống authentication của website tuyển dụng CVKing hỗ trợ các phương thức đăng nhập:
1. Đăng ký/đăng nhập bằng email + password
2. Đăng nhập bằng Google OAuth 2.0
3. Quên mật khẩu / Đặt lại mật khẩu
4. Xác minh email

## Luồng hoạt động

### 1. Đăng ký tài khoản mới

```
User nhập thông tin → Frontend validate → Gọi API /auth/register
→ Backend tạo user → Gửi email xác minh → User xác minh email
→ Tài khoản active → Có thể đăng nhập
```

### 2. Đăng nhập bằng email

```
User nhập email/password → Frontend validate → Gọi API /auth/login
→ Backend verify credentials → Trả JWT token → Frontend lưu token
→ Redirect theo role
```

### 3. Đăng nhập bằng Google OAuth

```
User click "Login with Google" → Redirect đến Google
→ User đăng nhập Google → Google redirect về /auth/google/callback
→ Backend lấy profile → Tạo user (nếu chưa có) → Trả JWT
→ Redirect về frontend với token
```

### 4. Quên mật khẩu

```
User nhập email → Gọi API /auth/forgot-password
→ Backend tạo reset token → Gửi email với reset link
→ User click link → Nhập mật khẩu mới → Gọi API /auth/reset-password
→ Backend verify token → Cập nhật mật khẩu
```

## API Endpoints

### Authentication APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Đăng ký tài khoản mới |
| POST | /auth/login | Đăng nhập bằng email |
| GET | /auth/google | Bắt đầu Google OAuth |
| GET | /auth/google/callback | Callback từ Google |
| POST | /auth/forgot-password | Yêu cầu đặt lại mật khẩu |
| POST | /auth/reset-password | Đặt lại mật khẩu với token |
| POST | /auth/verify-email | Xác minh email |
| POST | /auth/resend-verification | Gửi lại email xác minh |
| POST | /auth/refresh | Refresh access token |
| GET | /auth/me | Lấy thông tin user hiện tại |

## Database Schema

### Users Table
- id: UUID (Primary Key)
- email: String (Unique)
- password: String (Nullable - null for OAuth users)
- firstName: String
- lastName: String
- phone: String
- avatar: String
- status: Enum (active, inactive, suspended)
- emailVerifiedAt: DateTime
- googleId: String (Unique)
- createdAt: DateTime
- updatedAt: DateTime

### Roles Table
- id: UUID
- name: Enum (job_seeker, employer, hr, admin)
- description: String

### User Roles Table (Many-to-Many)
- userId: UUID (FK)
- roleId: UUID (FK)

## Security

### JWT Token
- Access Token: 15 phút
- Refresh Token: 7 ngày
- Secret: JWT_SECRET trong .env

### Password
- Hash với bcrypt (12 salt rounds)
- Validate: Ít nhất 6 ký tự

### Google OAuth
- Client ID và Secret trong .env
- Callback URL phải khớp với Google Console

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=cvking_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend
FRONTEND_URL=http://localhost:3000
```

## Error Handling

### Common Errors

1. **401 Unauthorized**
   - Invalid credentials
   - Token expired
   - Account not active

2. **409 Conflict**
   - Email already exists
   - Google account already linked

3. **400 Bad Request**
   - Invalid email format
   - Password too short
   - Invalid reset token

4. **404 Not Found**
   - User not found
   - Reset token not found

## Testing Checklist

- [ ] Đăng ký với email mới
- [ ] Đăng ký với email đã tồn tại
- [ ] Đăng nhập đúng credentials
- [ ] Đăng nhập sai password
- [ ] Google OAuth flow hoàn chỉnh
- [ ] Quên mật khẩu với email hợp lệ
- [ ] Quên mật khẩu với email không tồn tại
- [ ] Reset password với token hợp lệ
- [ ] Reset password với token hết hạn
- [ ] Xác minh email với token hợp lệ
- [ ] Gửi lại email xác minh
- [ ] Refresh token
- [ ] Logout