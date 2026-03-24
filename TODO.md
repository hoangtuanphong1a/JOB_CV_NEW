# TODO: Triển khai Google OAuth Authentication theo AUTHENTICATION_PROCESS.md

## Trạng thái: ✅ Đã hiểu task & plan | ⏳ Chờ implement

### 1. [⏳] Setup Environment Variables (Quan trọng nhất)

- Tạo `backend/.env`: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
- Tạo `frontend/.env.local`: NEXT_PUBLIC_BACKEND_URL

### 2. [⏳] Backend - Cài đặt Dependencies

- `yarn add @nestjs/passport passport-google-oauth20 @types/passport-google-oauth20`
- Restart backend server

### 3. [⏳] Backend - Tạo GoogleStrategy (NEW FILE)

- `backend/src/modules/auth/google.strategy.ts`

### 4. [⏳] Backend - Update AuthController

- Thêm `GET /auth/google` (redirect)
- Thêm `GET /auth/google/callback` (xử lý + redirect frontend với token)

### 5. [⏳] Backend - Update AuthModule

- Import GoogleStrategy & Passport config

### 6. [⏳] Backend - Update AuthService

- Tích hợp strategy

### 7. [⏳] Frontend - Tạo Callback Page (NEW FILE)

- `frontend/src/app/auth/google-callback/page.tsx` (lưu token từ query)

### 8. [⏳] Frontend - Fix LoginForm.tsx

- Đổi nút Google thành redirect link

### 9. [⏳] Frontend - Update authService.ts

- Xóa method googleAuth() không dùng

### 10. [✅] Test Flow

    - Click Google button → Login Google → Callback → Dashboard theo role

### 11. [⏳] Production Setup

    - Update callback URLs (HTTPS)
    - Update docs

**Tiến độ hiện tại: 0/11**  
**Ưu tiên: Bước 1-2 (Env + Deps) → Backend → Frontend → Test**
