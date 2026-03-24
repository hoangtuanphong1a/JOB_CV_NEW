# 🚀 Quick Start Guide - CVKing Authentication

## ⚡ Test ngay trong 2 phút!

### 1️⃣ Đăng nhập Job Seeker (Ứng viên)

```
1. Click "Đăng nhập" ở header
2. Chọn role: "Ứng viên"
3. Nhập bất kỳ email/password
4. Click "Đăng nhập"
```

**Kết quả:** Tự động chuyển đến **Candidate Dashboard**

**Xem được:**
- ✅ Thống kê đơn ứng tuyển (24 đơn)
- ✅ Lượt xem CV (156)
- ✅ Việc làm đã lưu (12)
- ✅ Đơn ứng tuyển gần đây
- ✅ Việc làm phù hợp
- ✅ Profile completion (75%)

---

### 2️⃣ Đăng nhập Employer (Nhà tuyển dụng)

```
1. Logout (click avatar → Đăng xuất)
2. Click "Đăng nhập"
3. Chọn role: "Nhà tuyển dụng"
4. Nhập bất kỳ email/password
5. Click "Đăng nhập"
```

**Kết quả:** Tự động chuyển đến **Employer Dashboard**

**Xem được:**
- ✅ 12 tin tuyển dụng đang hoạt động
- ✅ 284 ứng viên mới
- ✅ 2,456 lượt xem tin
- ✅ 18 đã tuyển
- ✅ Button "Đăng tin tuyển dụng" nổi bật ở header
- ✅ Danh sách ứng viên mới nhất

---

### 3️⃣ Đăng nhập HR Manager

```
1. Logout
2. Click "Đăng nhập"
3. Chọn role: "HR Manager"
4. Nhập bất kỳ email/password
5. Click "Đăng nhập"
```

**Kết quả:** Tự động chuyển đến **HR Dashboard**

**Xem được:**
- ✅ **Recruitment Pipeline** (124 đang xét duyệt → 45 chờ PV → 18 đang offer → 12 accepted)
- ✅ **KPIs tracking** (32/40 target, 18 ngày time-to-hire, 85% offer accepted)
- ✅ **Lịch phỏng vấn hôm nay** (09:00, 10:30, 14:00)
- ✅ **Tuyển dụng theo phòng ban** (Engineering: 12, Sales: 8, Marketing: 4)
- ✅ Tất cả tính năng Employer + thêm HR features

---

### 4️⃣ Đăng nhập Admin

```
1. Logout
2. Click "Đăng nhập"
3. Chọn role: "Quản trị viên"
4. Nhập bất kỳ email/password
5. Click "Đăng nhập"
```

**Kết quả:** Tự động chuyển đến **Admin Dashboard**

**Xem được:**
- ✅ **Tổng quan hệ thống:** 15,234 users, 1,245 công ty, 8,456 tin tuyển dụng
- ✅ **System Health:** Database, API Server, Email Service status
- ✅ **Pending Approvals:** 12 công ty mới, 8 tin chờ duyệt, 4 báo cáo vi phạm
- ✅ **User Statistics:** Breakdown theo từng role
- ✅ **Traffic Stats:** 12,345 pageviews hôm nay
- ✅ **Recent Activities:** Log các hoạt động mới nhất

---

## 🎯 Test Navigation System

### Test 1: Auto-redirect khi không có quyền

```
1. Đăng nhập với role "Job Seeker"
2. Thử navigate đến "Đăng tin tuyển dụng"
3. Kết quả: Tự động redirect về Candidate Dashboard
```

### Test 2: Auto-redirect khi đã đăng nhập

```
1. Đang đăng nhập (bất kỳ role nào)
2. Thử truy cập /login hoặc /register
3. Kết quả: Tự động redirect về Dashboard của role đó
```

### Test 3: Navigation menu thay đổi theo role

```
Job Seeker:
- Header menu: Trang chủ | Tìm việc | Công ty | Blog | Dashboard

Employer/HR:
- Header menu: Trang chủ | Tìm việc | Công ty | Blog | Dashboard
- Extra button: "Đăng tin tuyển dụng" (màu cam nổi bật)

Admin:
- Header menu: Dashboard | Quản lý users | Quản lý công ty | Quản lý tin | Xem website
```

### Test 4: User dropdown menu

```
1. Click vào avatar/tên user ở header
2. Xem:
   - Tên user
   - Email
   - Role (màu cam)
   - Button "Dashboard"
   - Button "Hồ sơ cá nhân"
   - Button "Đăng xuất" (màu đỏ)
```

---

## 🔍 Test Persistence

### Test localStorage

```
1. Đăng nhập với bất kỳ role
2. Refresh page (F5)
3. Kết quả: Vẫn đăng nhập, vẫn ở đúng dashboard
4. Mở DevTools → Application → Local Storage
5. Xem key "user" với data đầy đủ
```

---

## 📱 Test Responsive

### Mobile Menu
```
1. Thu nhỏ browser (< 768px)
2. Click hamburger menu icon
3. Xem:
   - Navigation items theo role
   - User info
   - Logout button
```

---

## 🎨 Test UI States

### Loading State
```
1. Click "Đăng nhập"
2. Xem loading spinner: "Đang đăng nhập..."
3. Button disabled trong khi loading
```

### Error State
```
(Hiện tại mock nên không có lỗi, nhưng UI đã chuẩn bị sẵn Alert component)
```

---

## 🔄 Test Complete Flow

### Flow đầy đủ cho Job Seeker:

```
1. Mở website → Thấy homepage
2. Click "Đăng nhập"
3. Chọn "Ứng viên" → Nhập email/password → Login
4. Auto-redirect to Candidate Dashboard
5. Click "Tìm việc" ở header → Xem job search page
6. Click vào 1 job → Xem job detail
7. Click "Tạo CV" ở header → Vào CV Builder
8. Click avatar → Click "Đăng xuất"
9. Auto-redirect về homepage
```

### Flow đầy đủ cho Employer:

```
1. Mở website → Click "Đăng tin tuyển dụng" (chưa login)
2. Auto-redirect to Login page
3. Chọn "Nhà tuyển dụng" → Login
4. Auto-redirect to Employer Dashboard
5. Click "Đăng tin tuyển dụng" ở header
6. Điền form → Post job
7. Quay lại Dashboard → Xem tin vừa đăng
8. Click "Ứng viên" → Xem danh sách applicants
9. Logout
```

### Flow đầy đủ cho Admin:

```
1. Login với role "Admin"
2. Auto-redirect to Admin Dashboard
3. Xem System Health (tất cả green/healthy)
4. Click "Quản lý users" → Xem user management
5. Click "Quản lý công ty" → Xem company management
6. Click "Xem website" → Về homepage (vẫn login)
7. Click "Dashboard" → Quay lại Admin Dashboard
8. Logout
```

---

## ✅ Expected Results Checklist

**Authentication:**
- [x] Login với 4 roles hoạt động
- [x] Auto-redirect đúng dashboard
- [x] Logout thành công
- [x] LocalStorage save/load user data
- [x] Refresh page giữ session

**Authorization:**
- [x] Job Seeker không thấy "Đăng tin" button
- [x] Employer/HR thấy "Đăng tin" button
- [x] Admin thấy menu riêng
- [x] Auto-redirect khi truy cập trang không có quyền

**Navigation:**
- [x] window.navigateTo() hoạt động
- [x] Header menu thay đổi theo role
- [x] User dropdown hiển thị đúng
- [x] Mobile menu responsive

**UI/UX:**
- [x] Loading states
- [x] Error states (UI ready)
- [x] Toast notifications (ready)
- [x] Smooth transitions

---

## 🐛 Common Issues & Solutions

### Issue 1: "window.navigateTo is not a function"
**Solution:** Refresh page, function được define trong useEffect của App.tsx

### Issue 2: Auto-redirect không hoạt động
**Solution:** Check console, đảm bảo AuthProvider wrap toàn bộ app

### Issue 3: LocalStorage không lưu
**Solution:** Check browser privacy settings, clear cache

### Issue 4: Header không update sau login
**Solution:** useAuth hook tự động trigger re-render

---

## 📊 Demo Data

**All demo accounts accept ANY email/password**

Chỉ cần chọn đúng role:
- 👤 Job Seeker → Candidate features
- 🏢 Employer → Employer features  
- 👔 HR Manager → HR features
- ⚙️ Admin → Admin features

**Mock data included:**
- 24 job applications
- 284 applicants
- 12 active job posts
- 15,234 total users
- 1,245 companies
- 8,456 job listings

---

## 🎉 You're Ready!

Bây giờ anh có thể:
1. ✅ Test đầy đủ 4 roles
2. ✅ Xem auto-redirect logic
3. ✅ Test navigation system
4. ✅ Verify permissions
5. ✅ Test persistence
6. ✅ Check responsive

**Next steps:**
- Tích hợp backend API
- Add real authentication
- Implement JWT tokens
- Add email verification
- Setup OAuth (Google, Facebook)

---

**💡 Pro Tips:**

1. Mở DevTools → Console để xem navigation logs
2. Check Application → Local Storage để xem user data
3. Test ở nhiều screen sizes
4. Try navigate between pages với mỗi role
5. Test logout và login lại với role khác

**Enjoy testing! 🚀**
