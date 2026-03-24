# 🔐 Hướng dẫn Authentication & Routing System

## 📋 Tổng quan

Website CVKing hỗ trợ **4 loại tài khoản** với quyền truy cập và tính năng riêng biệt:

1. **👤 Job Seeker (Ứng viên)** - Tìm việc và ứng tuyển
2. **🏢 Employer (Nhà tuyển dụng)** - Đăng tin và quản lý tuyển dụng  
3. **👔 HR Manager** - Quản lý tuyển dụng nâng cao
4. **⚙️ Admin** - Quản trị toàn hệ thống

---

## 🎯 Cách hoạt động

### 1. Authentication Context (`/contexts/AuthContext.tsx`)

Context quản lý trạng thái đăng nhập toàn ứng dụng:

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

**Các function chính:**
- `login(email, password, role)` - Đăng nhập với email/password
- `loginWithGoogle(role)` - Đăng nhập với Google OAuth
- `logout()` - Đăng xuất
- `updateUser(userData)` - Cập nhật thông tin user

**User object structure:**
```typescript
{
  id: string;
  name: string;
  email: string;
  role: "admin" | "hr" | "job-seeker" | "employer";
  avatar?: string;
  companyName?: string; // Cho employer/hr
}
```

---

### 2. Routing System (`/utils/routing.ts`)

#### 2.1 Phân quyền truy cập

```typescript
// Public routes - Ai cũng truy cập được
home, jobs, companies, blog, login, register

// Job Seeker only
candidate-dashboard, my-applications, saved-jobs

// Employer & HR
employer-dashboard, post-job, manage-jobs, applicants

// HR only
hr-dashboard

// Admin only
admin-dashboard, manage-users, manage-companies

// Authenticated (bất kỳ role nào đã đăng nhập)
cv-builder, profile
```

#### 2.2 Auto-redirect logic

Hệ thống tự động chuyển hướng dựa trên:

- **Nếu chưa đăng nhập** + truy cập trang protected → Redirect to Login
- **Nếu đã đăng nhập** + truy cập Login/Register → Redirect to Dashboard
- **Nếu không có quyền** → Redirect to Dashboard của role đó

---

### 3. Navigation (`window.navigateTo()`)

**Cách sử dụng trong components:**

```typescript
// Navigate to any page
window.navigateTo("jobs");
window.navigateTo("candidate-dashboard");
window.navigateTo("login");

// Hệ thống tự động check permission và redirect nếu cần
```

**Example:**
```typescript
<Button onClick={() => window.navigateTo("post-job")}>
  Đăng tin
</Button>
```

---

## 🚀 Hướng dẫn sử dụng

### A. Đăng nhập

1. Mở trang Login (`/pages/LoginPage.tsx`)
2. **Chọn vai trò** (Job Seeker / Employer / HR / Admin)
3. Nhập email/password (bất kỳ - đây là demo)
4. Click "Đăng nhập"
5. Hệ thống tự động redirect về dashboard tương ứng

**Auto-redirect sau login:**
- Job Seeker → `/candidate-dashboard`
- Employer → `/employer-dashboard`
- HR Manager → `/hr-dashboard`
- Admin → `/admin-dashboard`

### B. Navigation trong ứng dụng

**Header navigation tự động thay đổi theo role:**

**Job Seeker thấy:**
- Trang chủ
- Tìm việc làm
- Công ty
- Blog
- Dashboard (dropdown menu)

**Employer/HR thấy:**
- Trang chủ
- Tìm việc làm
- Công ty
- Blog
- Dashboard
- **Đăng tin tuyển dụng** (button nổi bật)

**Admin thấy:**
- Dashboard
- Quản lý users
- Quản lý công ty
- Quản lý tin
- Xem website

---

## 📊 Dashboard Features theo Role

### 👤 Job Seeker Dashboard
- ✅ Thống kê đơn ứng tuyển
- ✅ Lượt xem CV
- ✅ Việc làm đã lưu
- ✅ Đơn ứng tuyển gần đây
- ✅ Việc làm phù hợp (recommendations)
- ✅ Profile completion progress

### 🏢 Employer Dashboard
- ✅ Tin tuyển dụng đang hoạt động
- ✅ Ứng viên mới
- ✅ Lượt xem tin
- ✅ Số lượng đã tuyển
- ✅ Danh sách ứng viên
- ✅ Hiệu suất tuyển dụng

### 👔 HR Manager Dashboard
- ✅ Tất cả tính năng Employer
- ✅ **Recruitment Pipeline** (xét duyệt → phỏng vấn → offer)
- ✅ **KPIs tracking** (mục tiêu tuyển dụng, time-to-hire, offer acceptance)
- ✅ **Interview schedule** (lịch phỏng vấn hôm nay)
- ✅ **Department statistics** (tuyển dụng theo phòng ban)
- ✅ Monthly reports

### ⚙️ Admin Dashboard
- ✅ **System health** monitoring
- ✅ Tổng số users, companies, jobs
- ✅ Doanh thu
- ✅ **Pending approvals** (công ty mới, tin chờ duyệt, báo cáo vi phạm)
- ✅ **User statistics** (breakdown theo role)
- ✅ **Traffic stats** (pageviews)
- ✅ Recent activities log
- ✅ Quick access to all management pages

---

## 🔒 Permission System

### canAccessRoute()
Kiểm tra xem user có quyền truy cập route không:

```typescript
if (canAccessRoute("post-job", user?.role)) {
  // Cho phép truy cập
} else {
  // Redirect
}
```

### getDefaultDashboard()
Lấy dashboard mặc định cho mỗi role:

```typescript
admin → "admin-dashboard"
hr → "hr-dashboard"
employer → "employer-dashboard"
job-seeker → "candidate-dashboard"
```

---

## 💾 Data Persistence

User data được lưu trong **localStorage**:

```typescript
// Auto-save on login
localStorage.setItem("user", JSON.stringify(userData));

// Auto-load on app start
const savedUser = localStorage.getItem("user");
```

→ User vẫn đăng nhập sau khi refresh page

---

## 🎨 UI Components với Auth

### Header Component
- Tự động hiển thị menu phù hợp với role
- User dropdown với avatar, name, email, role
- Logout button

### Protected Routes
Tự động check permission và redirect nếu cần:

```typescript
// Trong App.tsx
useEffect(() => {
  if (!canAccessRoute(currentPage, user?.role)) {
    const redirectTo = getRedirectRoute(user?.role, currentPage);
    setCurrentPage(redirectTo);
  }
}, [currentPage, user]);
```

---

## 🧪 Demo Accounts

**Tất cả demo accounts đều chấp nhận bất kỳ email/password**

Chỉ cần chọn đúng role khi đăng nhập:

1. **Job Seeker** → Xem dashboard ứng viên, tìm việc, tạo CV
2. **Employer** → Đăng tin, quản lý ứng viên
3. **HR Manager** → Quản lý tuyển dụng nâng cao, KPIs, pipeline
4. **Admin** → Quản trị toàn hệ thống

---

## 📝 Code Examples

### 1. Sử dụng Auth trong Component

```typescript
import { useAuth } from "../contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Conditional Rendering theo Role

```typescript
{user?.role === "employer" && (
  <Button onClick={() => window.navigateTo("post-job")}>
    Đăng tin tuyển dụng
  </Button>
)}

{user?.role === "admin" && (
  <AdminPanel />
)}
```

### 3. Navigation

```typescript
// Navigate to any page
<Button onClick={() => window.navigateTo("jobs")}>
  Tìm việc
</Button>

// Get navigation items for current role
const navItems = getNavigationItems(user?.role);
```

---

## 🔄 Flow Diagram

```
User mở website
    ↓
Có saved session? 
    ├─ YES → Auto login → Redirect to Dashboard
    └─ NO  → Show public pages
    
User click Login
    ↓
Chọn Role (Job Seeker/Employer/HR/Admin)
    ↓
Nhập credentials
    ↓
Login success → Save to localStorage
    ↓
Auto redirect based on role:
    ├─ Job Seeker → Candidate Dashboard
    ├─ Employer → Employer Dashboard
    ├─ HR → HR Dashboard
    └─ Admin → Admin Dashboard

User navigate to any page
    ↓
Check permission
    ├─ Has permission → Show page
    └─ No permission → Redirect to appropriate dashboard
```

---

## 🎯 Next Steps (TODO khi tích hợp backend)

1. **Replace mock login** với API call thật
2. **Add JWT token** management
3. **Add refresh token** logic
4. **API interceptors** với token
5. **Protected API routes** validation
6. **Password reset** flow
7. **Email verification**
8. **OAuth integration** (Google, Facebook)
9. **Role-based API permissions**
10. **Session timeout** handling

---

## 📚 Files Structure

```
/contexts/
  └─ AuthContext.tsx          # Authentication state management

/utils/
  └─ routing.ts               # Routing logic & permissions

/pages/
  ├─ LoginPage.tsx            # Login với role selection
  ├─ RegisterPage.tsx         # Register (job-seeker/employer)
  ├─ CandidateDashboard.tsx   # Job seeker dashboard
  ├─ EmployerDashboard.tsx    # Employer dashboard
  ├─ HRDashboard.tsx          # HR manager dashboard
  └─ AdminDashboard.tsx       # Admin dashboard

/components/
  └─ Header.tsx               # Navigation với auth state
```

---

## ✅ Checklist Test

- [ ] Login với mỗi role (Job Seeker, Employer, HR, Admin)
- [ ] Auto-redirect sau login đúng dashboard
- [ ] Header hiển thị menu phù hợp với role
- [ ] Logout và auto-redirect về home
- [ ] Refresh page vẫn giữ session
- [ ] Truy cập route không có quyền → auto-redirect
- [ ] Navigation giữa các trang hoạt động tốt
- [ ] User dropdown hiển thị đúng thông tin

---

**🎉 Hệ thống authentication và routing đã hoàn chỉnh và sẵn sàng sử dụng!**
