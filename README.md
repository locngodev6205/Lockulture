# Lockulture (Time Traveler’s Locket)

> **Trạng thái 10/11/2026:** UI Flutter có demo tương tác và luồng **Săn tìm → Camera thật + Gemini**. Agent xác thực ảnh đã gọi Google Gen AI SDK; cần `GEMINI_API_KEY` ở backend. GPS/geofence chưa tích hợp. Agent mật thư/kể chuyện, tiến độ nhóm và Feed vẫn dùng dữ liệu cục bộ/mẫu; chưa có Firebase realtime. Hướng dẫn camera và URL API theo thiết bị: [mobile/README.md](mobile/README.md).

Ứng dụng di động kết hợp cơ chế chia sẻ ảnh tức thời kiểu **Locket** với yếu tố trò chơi hóa **Album Pokedex Lịch Sử & Văn Hóa** và hệ thống **Đa tác tử (Multi-Agent System)** trên nền tảng **Google Gemini API** & **Google Cloud Run**.

- **Cuộc thi:** Mini Hackathon GDG 2026 – DevFest *"Learn Beyond Limits"*.
- **Đặc tả nghiệp vụ:** [docs/PROJECT_SPECIFICATION.md](docs/PROJECT_SPECIFICATION.md).
- **Kiến trúc hệ thống:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- **Hợp đồng API:** [docs/API_SPECIFICATION.md](docs/API_SPECIFICATION.md).

---

## 🚀 Khởi chạy Nhanh Hệ thống

### 1. Khởi chạy Backend bằng Docker Compose (Khuyên dùng)

```bash
# 1. Tạo file .env từ file mẫu và điền GEMINI_API_KEY
cp .env.example .env

# 2. Khởi chạy container backend
docker compose up --build -d

# 3. Kiểm tra nhật ký hoạt động
docker compose logs -f backend
```

- **API Documentation (Swagger UI):** http://localhost:8080/docs
- **Healthcheck Endpoint:** http://localhost:8080/health

---

### 2. Khởi chạy Ứng dụng Mobile (Flutter)

```bash
cd mobile

# 1. Cài đặt các gói phụ thuộc
flutter pub get

# 2. Khởi chạy trên máy ảo hoặc thiết bị thật (Android/iOS)
flutter run
```

> 💡 **Mẹo Demo Sân Khấu (Mock Location Switch):**  
> Trong ứng dụng mobile, người dùng có thể mở menu **"Chế độ Giám Khảo (Judge Mode)"** để chọn các tọa độ giả lập (Dinh Độc Lập, Bưu điện Sài Gòn, Văn Miếu Quốc Tử Giám...) giúp kiểm thử toàn bộ luồng gợi ý và xác thực di tích của AI mà không cần phải ra thực địa.

---

## 🏛️ Cấu trúc Thư mục Dự án

```text
Hackathon/
├── docs/                             # Tài liệu kỹ thuật chuẩn mực
│   ├── PROJECT_SPECIFICATION.md      # Đặc tả yêu cầu & nghiệp vụ chi tiết
│   ├── ARCHITECTURE.md               # Kiến trúc hệ thống & Multi-Agent flow
│   └── API_SPECIFICATION.md          # Hợp đồng REST API giữa Mobile & Backend
│
├── mobile/                           # Ứng dụng di động (Flutter Client)
│   ├── assets/                       # Biểu tượng, hình ảnh & huy hiệu thời kỳ
│   ├── lib/
│   │   ├── core/                     # Constants, Theme, Network (Dio), Mock Services
│   │   ├── features/
│   │   │   ├── album/                # Album Pokedex Dòng Thời Gian phi tuyến tính
│   │   │   ├── clues/                # Hộp thoại Mật thư câu đố dẫn đường (Agent 1)
│   │   │   ├── camera/               # Live Camera 1:1, Quét Anti-spoofing (Agent 2)
│   │   │   ├── feed/                 # Bảng tin Locket, Caption Gen Z & Persona (Agent 3)
│   │   │   └── mock_demo/            # Bộ điều khiển Mock Location phục vụ demo
│   │   └── main.dart                 # Điểm khởi động ứng dụng
│   └── pubspec.yaml                  # Khai báo thư viện (camera, riverpod, dio...)
│
├── backend/                          # Backend Gateway & Multi-Agent (FastAPI)
│   ├── src/
│   │   ├── agents/                   # 4 AI Agents chuyên biệt
│   │   │   ├── clue_agent.py         # Agent 1: Places API + Gemini Clues
│   │   │   ├── verification_agent.py # Agent 2: Gemini Vision + Anti-spoof + JSON
│   │   │   ├── storyteller_agent.py  # Agent 3: Caption Gen Z + Persona Roleplay
│   │   │   └── gamification_agent.py # Agent 4: Adaptive quest / Co-op
│   │   ├── api/                      # Routes & Endpoints API
│   │   ├── core/                     # Cấu hình Gemini Client & App Config
│   │   ├── models/                   # Pydantic Schemas & Data models
│   │   └── main.py                   # Điểm khởi động FastAPI
│   ├── Dockerfile                    # Đóng gói container chuẩn Google Cloud Run
│   └── requirements.txt              # Danh sách thư viện Python
│
├── compose.yaml                      # Docker Compose chạy môi trường phát triển
├── .env.example                      # Mẫu biến môi trường
└── .gitignore                        # Cấu hình loại trừ file nhạy cảm và cache
```

---

## 🤖 4 AI Agents Cốt Lõi Trên Google Cloud Run

1. **Agent 1: "Quản Trò Dẫn Đường" (Dynamic Clue & Location Agent):** Quét Google Maps Places API theo bán kính GPS và dùng Gemini tạo mật thư dẫn đường phong cách cổ phong.
2. **Agent 2: "Giám Định Viên Lịch Sử" (Multimodal Verification Agent):** Kiểm tra chống ảnh chụp lại màn hình (Anti-spoofing), nhận diện công trình bằng Gemini Multimodal Vision và xuất kết quả dạng **Structured JSON**.
3. **Agent 3: "Người Kể Chuyện Locket" (Social Storytelling Agent):** Tự động tạo caption Gen Z dí dỏm kèm sự thật lịch sử thú vị (Fun Fact), đóng vai nhân vật lịch sử bình luận tương tác đầu tiên dưới bài đăng.
4. **Agent 4: "Kiến Trúc Sư Nhiệm Vụ" (Adaptive Gamification Agent):** Thích ứng đổi nhiệm vụ sang hiện vật bảo tàng hoặc kích hoạt nhiệm vụ Co-op nếu khu vực người dùng ở xa di tích cổ.

---

## 📋 Triển khai lên Google Cloud Run

```bash
gcloud run deploy chronolocket-api \
    --source ./backend \
    --platform managed \
    --region asia-southeast1 \
    --allow-unauthenticated \
    --set-env-vars GEMINI_API_KEY="AIzaSy...",GOOGLE_MAPS_API_KEY="..."
```
