# Lockulture

Ứng dụng khám phá lịch sử và văn hóa qua hai chế độ: **chụp tự do** và **nhiệm vụ địa điểm**. Người chơi thu thập mảnh ghép trên timeline, nhận XP và chủ động chia sẻ với bạn bè/nhóm.

Dự án của nhóm **3 thành viên**, tham gia Mini Hackathon GDG miền Trung 2026, chủ đề DevFest “Learn Beyond Limits”.

## Tài liệu hiện hành

Bắt đầu tại [docs/README.md](docs/README.md). Bộ tài liệu đã được tổ chức lại ngày 11/11/2026, phân biệt quyết định sản phẩm, hiện trạng code, luồng UI và đề xuất tích hợp.

- [Luật sản phẩm đã chốt](docs/PROJECT_SPECIFICATION.md)
- [Hiện trạng frontend/backend](docs/CURRENT_STATE.md)
- [Kế hoạch tích hợp](docs/integration/PLAN.md)
- [Hướng dẫn chạy mobile](mobile/README.md)

Frontend React Native/Expo đã có Missions, Capture, Friends/Groups, chia sẻ chọn người nhận, cảm xúc/bình luận và leaderboard bằng mock local. Một số trang auth/chi tiết vẫn scaffold. Backend FastAPI còn routes cũ và agent trả mẫu; chưa Maps/Gemini thật, auth hay đồng bộ nhiều tài khoản. Nhập API key không tự hoàn thiện tích hợp.

## Chạy scaffold hiện tại

Từ thư mục gốc repo:

```bash
cp .env.example .env
docker compose up --build -d
docker compose logs -f backend
```

`.env` là cấu hình cục bộ, không commit khóa API. Backend local: [Swagger](http://localhost:8080/docs), [health](http://localhost:8080/health). Swagger mô tả route đang chạy, chưa phải API mục tiêu trong tài liệu.

```bash
cd mobile
nvm use
npm ci
npm run start:go
```

Cần Node 24 LTS và Expo Go tương thích SDK 58 hoặc development build; web preview dùng `npm run web`. Bản frontend có camera live, Missions và đánh giá/thưởng Capture bằng mock; chưa nối AI thật hoặc hoàn thiện toàn bộ nghiệp vụ. Camera/GPS cần kiểm tra trên thiết bị thật; mock không chứng minh agent hoạt động thật.

## Cấu trúc hiện có

```text
Lockulture/
├── docs/                 # Đặc tả, luồng UI, kiến trúc và API
├── mobile/src/           # React Native/Expo, routes, features, services và mock
├── legacy/flutter/       # Scaffold Flutter cũ để tham khảo
├── backend/src/          # FastAPI, schemas và bốn vai trò agent mẫu
├── backend/Dockerfile
├── backend/requirements.txt
├── compose.yaml
└── .env.example
```

Đích triển khai backend vẫn là Docker trên **Google Cloud Run**. Model, kho lưu dữ liệu/ảnh và cấu hình triển khai thật cần chốt khi tích hợp; chưa có URL production được xác nhận.
