# Hợp đồng API mục tiêu — đề xuất chưa triển khai

Cập nhật 11/11/2026 · [API đang có](CURRENT.md) · [Chỉ mục](../README.md).

Mục đích chốt hợp đồng FE/BE cho luồng hiện tại. Đây là thiết kế đề xuất; endpoint/status/schema cuối cùng phải được xác nhận trong OpenAPI trước khi tích hợp. Không thêm lại anti-spoof, auto-post hoặc một audience duy nhất theo scaffold cũ.

## Quy ước chung đề xuất

- Prefix `/api/v1`; JSON snake_case → mapper TypeScript camelCase. Thời gian ISO UTC; ID opaque do server cấp; client request key ổn định cho retries.
- Bearer xác định actor; không tin owner_id/author_name/XP/membership từ client. Error `{code,message,retryable,request_id}`.
- Danh sách trả `{items,next_cursor}`; sort ổn định. Client validate runtime DTO.
- POST tạo tài nguyên dùng Idempotency-Key; key cũ trả kết quả cũ, khác payload trả conflict. GET trạng thái không chạy AI lại.
- Tác vụ dài trả 202 + ID, frontend polling; hủy fetch chỉ ngừng chờ, không mặc định hủy job.

## Identity, tiến trình và social

| Method | Route đề xuất | Hành vi |
|---|---|---|
| GET / PATCH | `/me` | Hồ sơ actor, sửa tên |
| GET | `/timeline` | Era catalog + tiến trình cá nhân |
| GET | `/discoveries`, `/discoveries/{id}` | Bộ sưu tập/chi tiết theo quyền |
| GET | `/users?query=...`, `/users/{id}` | Tìm bạn và hồ sơ trong phạm vi cho phép |
| GET | `/friends`, `/friend-requests?direction=...` | Bạn accepted, lời mời đến/đi |
| POST / PATCH | `/friend-requests`, `/friend-requests/{id}` | Gửi, accept/reject/cancel theo quyền |
| DELETE | `/friends/{user_id}` | Xóa quan hệ bạn bè |
| GET / POST | `/groups` | Nhóm đang tham gia/tạo nhóm |
| GET / PATCH / DELETE | `/groups/{id}` | Chi tiết/đổi tên/giải tán theo role |
| POST / DELETE | `/groups/{id}/members`, `/groups/{id}/members/{user_id}` | Thêm/xóa; tự rời theo quyền; invitation thật còn mở |
| GET | `/leaderboard?scope=friends` | Actor + bạn accepted, tổng XP và hạng server |

Auth register/login/reset/logout dùng provider đã chọn hoặc endpoint backend tương ứng; chưa chốt provider nên chưa cam kết bộ route auth. Token refresh và phiên phải thiết kế đồng bộ FE/BE.

## Mission search

`POST /mission-searches`: `{latitude,longitude,location_source,radius_meters,era_id?,exclude_place_id?}`; `GET /mission-searches/{id}` lấy stage/kết quả/lý do dừng. Source gps/manual không chứng minh hiện diện.

`GET /missions/active`, `GET /missions/{id}` để khôi phục; thao tác mở hint/answer cần API mutation nếu lưu trạng thái server. Mission tối thiểu: id, version, era_id/name, place_id/name, address, location, clue, hints, photo_requirements, distance_meters, xp, revealed_hints, answer_revealed.

Không tự đổi era/radius; Place ID phải thuộc kết quả Maps. Đổi mission chỉ commit active mới khi tìm thành công. Hints và tiêu chí sinh sẵn; không gọi Gemini khi mở hint. Budget và cooldown kiểm tra server.

## Upload và đánh giá

Chọn một trong multipart trực tiếp hoặc upload asset trước bằng URL có hạn. Không dùng URI file local như ảnh gửi tới người khác.

`POST /submissions`: mode, asset_id (hoặc multipart), mission_id/version khi mission, evaluation_session_id nếu bổ sung; không nhận tiêu chí tự khai làm nguồn chuẩn. `GET /submissions/{id}` đọc lại kết quả/trạng thái.

| Verdict | Mode | Diễn giải |
|---|---|---|
| accepted | free | Nhận diện hợp lệ |
| completed | mission | Hoàn thành theo tiêu chí |
| retake_required | cả hai | Ảnh chưa đủ rõ/bằng chứng thiếu |
| unidentified | cả hai | Chưa nhận diện; có thể bổ sung |
| out_of_scope | free | Không thuộc phạm vi |
| not_matched | mission | Không khớp nhiệm vụ |

Response cần submission/session IDs, verdict, knowledge, instruction, subject/era nếu có; thành công có discovery_id và reward/progress server. Lỗi upload/model là error, không ép thành verdict. Thưởng và discovery áp dụng transaction/idempotency. Session có giới hạn ảnh/lượt; response hướng dẫn bước tiếp rõ.

## Bài đăng nhiều người nhận

`POST /posts` với bearer và idempotency key:

```json
{
  "discovery_id": "discovery_123",
  "caption": "Một khám phá mới hôm nay",
  "friend_ids": ["user_an"],
  "group_ids": ["group_hue"]
}
```

Server xác minh ownership/friendship/membership, tự snapshot thành viên nhóm và hợp nhất người nhận trong transaction. Không nhận snapshot client làm quyền. Một post/discovery theo hành vi mock hiện tại; `POST /posts/{id}/shares` bổ sung nhóm vào bài gốc, không clone Post.

Post DTO cần id, author, asset/ảnh truy cập có quyền, subject, caption, created_at, my_reaction, reaction_counts, comment_count. Audience chi tiết chỉ trả theo quyền; không lộ danh sách recipient riêng tư cho mọi viewer.

| Method | Route đề xuất | Hành vi |
|---|---|---|
| GET | `/posts` | Feed đã gửi/được nhận, phân trang và dedupe post_id |
| GET | `/posts?group_id=...` | Bài nhóm mà actor được đọc |
| GET | `/posts/{id}` | Chi tiết bài theo quyền |
| PUT / DELETE | `/posts/{id}/reaction` | Đặt/đổi hoặc bỏ reaction của actor |
| GET / POST | `/posts/{id}/comments` | Danh sách/thêm bình luận |
| DELETE | `/comments/{id}` | Xóa theo quyền tác giả |

Caption tối đa 500, comment 300 ký tự và không trắng; một reaction/user/post. Comment author/time/ID từ server. Bài, ảnh, cảm xúc và bình luận dùng cùng quyền truy cập. Quyền sau khi rời nhóm/xóa bạn là điểm chưa chốt trong [SOCIAL](../integration/SOCIAL.md).

## Đồng bộ tài liệu khi triển khai

Sau khi chốt OpenAPI, sinh/kiểm tra DTO, cập nhật api/CURRENT khi route thực sự có. Các schema ví dụ trong tài liệu này không thay thế contract test hoặc phân quyền server. Xem [PLAN](../integration/PLAN.md) để biết thứ tự làm.
