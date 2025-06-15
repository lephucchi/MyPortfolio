# Portfolio Project

## Giới thiệu

Đây là dự án Portfolio cá nhân, bao gồm hệ thống quản lý bài viết, dự án, và chức năng gửi biểu cảm (react) lấy ý tưởng từ Facebook. Dự án được xây dựng với kiến trúc tách biệt back-end (NestJS) và front-end (ReactJS).

---

## Mục lục

- [Tính năng](#tính-năng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Chạy dự án](#chạy-dự-án)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

---

## Tính năng

- Quản lý bài viết, dự án cá nhân.
- Đăng nhập, đăng ký người dùng.
- Gửi biểu cảm (react) cho bài viết và dự án.
- Quản lý và hiển thị số lượng từng loại react.
- Giao diện hiện đại, thân thiện với người dùng.
- API RESTful, bảo mật với JWT.

---

## Cấu trúc dự án

```
portfolio/
│
├── back-end/         # Source code back-end (NestJS)
│   ├── src/
│   ├── package.json
│   └── ...
│
├── front-end/        # Source code front-end (ReactJS)
│   ├── src/
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
└── README.md
```

---

## Yêu cầu hệ thống

- Node.js >= 18.x
- npm >= 9.x
- Docker & Docker Compose (nếu sử dụng container)
- Hệ quản trị cơ sở dữ liệu (PostgreSQL/MySQL/MongoDB, tùy cấu hình)

---

## Cài đặt

### 1. Clone dự án

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

### 2. Cài đặt back-end

```bash
cd back-end
npm install
```

### 3. Cài đặt front-end

```bash
cd ../front-end
npm install
```

---

## Chạy dự án

### 1. Chạy bằng Docker Compose

```bash
docker-compose up --build
```

### 2. Chạy thủ công

#### Back-end

```bash
cd back-end
npm run start:dev
```

#### Front-end

```bash
cd front-end
npm start
```

---

## Cấu hình môi trường

### Back-end

Tạo file `.env` trong thư mục `back-end` với nội dung ví dụ:

```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
JWT_SECRET=your_jwt_secret
```

### Front-end

Tạo file `.env` trong thư mục `front-end` với nội dung ví dụ:

```
REACT_APP_API_URL=http://localhost:5000
```

---

## Hướng dẫn sử dụng

1. Truy cập giao diện người dùng tại `http://localhost:3000`.
2. Đăng ký tài khoản và đăng nhập.
3. Tạo bài viết hoặc dự án mới.
4. Gửi biểu cảm (react) cho bài viết hoặc dự án.
5. Xem thống kê các loại biểu cảm.

---

## Đóng góp

Chào mừng mọi đóng góp cho dự án! Vui lòng tạo pull request hoặc issue để thảo luận thêm.

---

## Giấy phép

Dự án được phát hành theo giấy phép MIT. Vui lòng xem file [LICENSE](./LICENSE) để biết thêm chi tiết.
