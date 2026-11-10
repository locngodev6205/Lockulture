# API đang có trong code

Đối chiếu 11/11/2026 · [Chỉ mục](../README.md) · Nguồn: `backend/src/api/routes.py`, `models/schemas.py`, `main.py`.

Base local `http://localhost:8080`; prefix router `/api/v1`. Swagger runtime tại `/docs`. Chưa có URL production được xác minh.

| Method | Route | Dữ liệu/hành vi hiện tại |
|---|---|---|
| GET | `/health` | status/service/environment/model cấu hình |
| GET | `/api/v1/album/eras` | Fixture album nhóm, completion_rate và eras boolean unlock |
| POST | `/api/v1/clues/generate` | latitude/longitude/era_id/hint_level → clue mẫu |
| POST | `/api/v1/verification/verify-photo` | multipart photo, latitude, longitude, target_era_id → kết quả mẫu |
| POST | `/api/v1/feed/moments/enrich-and-post` | photo_url/landmark_name/era_id → moment mẫu |
| GET | `/api/v1/mock/landmarks` | Fixture địa điểm |

VerificationResult cũ gồm is_valid, confidence_score, detected_landmark, matched_era, is_screen_spoof, reject_reason, xp_reward. Chưa đủ biểu diễn verdict free/mission và bổ sung ảnh. MomentResponse cũ có caption/persona comment; không phải API chọn người nhận hiện tại.

Không có xác thực bearer thực thi, auth thật, friends/groups/comments/leaderboard API, feed nhận bài theo quyền hay kho thưởng/tiến trình bền vững. Verification agent trả kết quả cố định; nhập Gemini key không tự tạo tích hợp AI.

Không dùng những route cũ này để khẳng định hợp đồng mục tiêu đã chạy. Xem [TARGET](TARGET.md); khi migrate nên version/deprecate rõ nếu cần giữ client cũ, không âm thầm đổi shape.
