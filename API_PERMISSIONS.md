# API Permissions Documentation

## User Roles
- **admin**: Quản trị viên hệ thống
- **giangvien**: Giảng viên
- **hocsinh**: Học sinh

---

## Users API (`/api/users`)

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| POST | `/register` | Public | Đăng ký tài khoản mới |
| POST | `/login` | Public | Đăng nhập |
| GET | `/profile` | Authenticated | Lấy thông tin profile của user đang đăng nhập |
| GET | `/` | **admin** | Lấy danh sách tất cả users |
| GET | `/:id` | **admin** | Lấy thông tin user theo ID |
| PUT | `/:id` | **admin** | Cập nhật thông tin user |
| DELETE | `/:id` | **admin** | Xóa user |

---

## Categories API (`/api/categories`)

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/` | Public | Lấy danh sách tất cả categories |
| GET | `/:id` | Public | Lấy category theo ID |
| POST | `/` | **admin** | Tạo category mới |
| PUT | `/:id` | **admin** | Cập nhật category |
| DELETE | `/:id` | **admin** | Xóa category |

---

## Courses API (`/api/courses`)

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/` | Public | Lấy danh sách tất cả courses |
| GET | `/category/:id` | Public | Lấy courses theo category |
| GET | `/:id` | Public | Lấy course theo ID |
| POST | `/` | **admin, giangvien** | ✅ Thêm khóa học mới |
| PUT | `/:id` | **admin, giangvien** | ✅ Sửa khóa học |
| DELETE | `/:id` | **admin** | Xóa course |

### Request Body - Tạo/Sửa Course
```json
{
  "title": "Tên khóa học",
  "price": 500000,
  "category": "category_id"
}
```

---

## Lessons API (`/api/lessons`)

| Method | Endpoint | Permission | Description |
|--------|----------|------------|-------------|
| GET | `/` | Public | Lấy danh sách tất cả lessons |
| GET | `/:id` | Public | Lấy lesson theo ID |
| POST | `/` | **admin, giangvien** | Tạo lesson mới |
| PATCH | `/:id` | **admin, giangvien** | Cập nhật lesson |
| DELETE | `/:id` | **admin** | Xóa lesson |
| PATCH | `/reorder` | **admin, giangvien** | Sắp xếp lại thứ tự lessons |

---

## Authentication

Để sử dụng các API cần phân quyền, thêm header:
```
Authorization: Bearer <token>
```

Token nhận được sau khi đăng nhập qua `/api/users/login`
