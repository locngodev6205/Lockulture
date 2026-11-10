# Kế hoạch tích hợp và quyết định còn mở

Cập nhật 11/11/2026 · [Chỉ mục](../README.md).

Frontend có thể giữ phần lớn UI. Cần thay nguồn dữ liệu, bổ sung API và chuyển quyền quyết định nghiệp vụ sang server. Chi tiết từng điểm: [CORE](CORE.md), [SOCIAL](SOCIAL.md), [RELIABILITY](RELIABILITY.md). Mỗi điểm gồm hiện trạng, đề xuất và nghiệm thu.

## Các quyết định cần chốt trước khi code backend

| Điểm mở | Đề xuất của tài liệu, chưa được duyệt như luật sản phẩm |
|---|---|
| Auth/DB/storage | Chọn một stack nhất quán; PostgreSQL phù hợp quan hệ và transaction, không bắt buộc |
| Free cùng subject nộp mới | Cân nhắc hạn mức theo ngày; hiện mock vẫn nhận XP lại |
| Rời/bị xóa nhóm | Thu hồi nguồn quyền từ nhóm đó, giữ nếu còn nguồn trực tiếp/nhóm khác |
| Xóa bạn | Giữ lịch sử bài đã gửi; nếu cần thu hồi phải có hành động riêng |
| Thêm thành viên | MVP thêm ngay bạn đã kết nối như mock; invitations/accept có thể bổ sung sau |
| Ngân sách AI | Đo latency/chi phí rồi cấu hình quota và retries; 2 lượt Maps là đề xuất, chưa triển khai |
| Dữ liệu ảnh/moderation | Chốt retention, giới hạn dung lượng, xóa nội dung/quyền moderation trước phát hành |

## Thứ tự bàn giao

1. Chốt OpenAPI/schema, era IDs, verdict, audience và các điểm mở liên quan luồng đang tích hợp.
2. Frontend tách service/hooks cho social/post/interaction/progress; mock và HTTP cùng interface, DTO validation và lỗi chuẩn.
3. Backend xây identity/storage/DB, một luồng hai account: upload → đánh giá → discovery/XP → chọn bạn → nhận bài/ảnh. Có thể dùng model mock trên server để test plumbing nhưng phải ghi rõ.
4. Nối Maps/Gemini với search/evaluation sessions, budget và retry.
5. Nối nhiều nhóm, cảm xúc, bình luận, leaderboard; phân trang và refresh.
6. Test thiết bị thật, gửi song song/lặp, mất mạng, restart và người ngoài không có quyền.

Nhóm 3 người có thể chia frontend adapter/UI, backend identity/data/social, backend AI/deploy. Đây là gợi ý phân công, không phải yêu cầu tách ba service. Không tạo bốn container chỉ vì có bốn vai trò agent.

## Mô hình dữ liệu logic đề xuất

| Miền | Thực thể |
|---|---|
| Identity/social | users, friend_requests, friendships, groups, group_members |
| AI | mission_searches, missions, evaluation_sessions, submissions, assets |
| Kết quả | discoveries, reward_ledger, era_progress |
| Chia sẻ | posts, post_shares, share_recipients |
| Tương tác | reactions, comments |

Unique constraints và transaction nêu trong các file tích hợp. Đây chưa phải migration DB. Không giữ một mảng postIds local làm nguồn chuẩn feed nhóm khi đã có quan hệ DB.

## Các vị trí code cần đổi

`mobile/src/services`, `domain/models.ts`, `state/*-store.ts`, feature hooks/screens; `backend/src/api/routes.py`, `models/schemas.py`, `agents/*`. Khi thực hiện một điểm, cập nhật CURRENT_STATE thay vì tiếp tục gọi nó là đề xuất. Test bundle/browser không thay thế kiểm tra native và API đa tài khoản.
