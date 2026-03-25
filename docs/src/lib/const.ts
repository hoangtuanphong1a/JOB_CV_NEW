// src/lib/const.ts  (hoặc src/constants/index.ts)

export const envConfig = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL,
  IMAGE_URL: process.env.NEXT_PUBLIC_IMAGE_URL,
  TOOL_URL: process.env.NEXT_PUBLIC_TOOL_URL,
  NODE_ENV: process.env.NODE_ENV,
};

// ==================== DATE FORMATS ====================
export const DATE_FORMAT = 'DD/MM/YYYY';                    // Chỉ ngày (dùng cho bảng)
export const DATE_HOUR_FORMAT = 'DD/MM/YYYY HH:mm';         // Ngày + giờ ngắn
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';      // Ngày + giờ đầy đủ (chi tiết)
export const ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';           // Dùng khi gửi API nếu cần

// ==================== STATUS LABELS cho BÀI VIẾT ====================
export const STATUS_LABELS = {
  // Cho các bảng chung (user, category, setting, v.v…)
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Không hoạt động',

  // Riêng cho bài viết (Blog Post)
  PUBLISHED: 'Đã xuất bản',
  DRAFT: 'Bản nháp',
  ARCHIVED: 'Đã lưu trữ',
} as const;

// ==================== POST STATUS ENUM (dùng trong type nếu cần) ====================
export const POST_STATUS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  ARCHIVED: 'archived',
} as const;

// ==================== PAGINATION & TABLE ====================
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZES = [10, 20, 50, 100] as const;

// ==================== TOAST MESSAGES ====================
export const TOAST_MESSAGES = {
  CREATE_SUCCESS: 'Tạo mới thành công!',
  UPDATE_SUCCESS: 'Cập nhật thành công!',
  DELETE_SUCCESS: 'Xóa thành công!',
  ERROR: 'Có lỗi xảy ra, vui lòng thử lại!',
  CONFIRM_DELETE: 'Bạn có chắc chắn muốn xóa?',
} as const;

// ==================== TABLE EMPTY STATES ====================
export const TABLE_EMPTY = {
  TITLE: 'Không có dữ liệu',
  DESCRIPTION: 'Hiện tại chưa có bản ghi nào phù hợp.',
};

// ==================== ROLE LABELS (nếu bạn có quản lý user/role) ====================
export const ROLE_LABELS = {
  ADMIN: 'Quản trị viên',
  EDITOR: 'Biên tập viên',
  AUTHOR: 'Tác giả',
  USER: 'Người dùng',
} as const;

// ==================== INTERACTION TYPES ====================
export const INTERACTION_TYPES = {
  POST: 'post',
  COMMENT: 'comment',
  LIKE: 'like',
} as const satisfies Record<string, string>;

export const INTERACTION_LABELS = {
  POST: 'Bài viết',
  COMMENT: 'Bình luận',
  LIKE: 'Lượt thích',
} as const;

// ==================== COMMENT STATUS LABELS ====================
export const COMMENT_STATUS_LABELS = {
  APPROVED: 'Đã duyệt',
  PENDING: 'Chờ duyệt',
  REJECTED: 'Từ chối',
  HIDDEN: 'Ẩn',
} as const;