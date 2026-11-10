# Xã hội, quyền truy cập và leaderboard

Cập nhật 11/11/2026 · [Kế hoạch](PLAN.md). Các đề xuất dưới đây chưa phải tính năng backend đã có. P0: chặn tích hợp an toàn; P1: cần để hoàn thiện luồng tương ứng.

## Chọn người nhận và quyền xem bài — P0

**Hiện trạng:** một bài lưu friendIds và snapshot các nhóm. Frontend tính snapshot; chưa có kiểm tra quyền đọc thật.

**Đề xuất:** client chỉ gửi discovery_id, caption, friend_ids, group_ids. Server xác minh discovery thuộc actor, bạn bè hợp lệ, nhóm còn tham gia; tự chụp snapshot membership trong transaction. Lưu một Post, các nguồn chia sẻ và tập recipient hợp nhất; cùng người xuất hiện nhiều nguồn chỉ có một bài trong feed. Thêm nhóm về sau là một lần mở rộng audience riêng, có idempotency, không clone Post.

**Quy tắc đề xuất cần chốt:** thành viên mới không được xem bài trước lúc tham gia (đã thống nhất ở UI); khi rời/bị xóa khỏi nhóm, thu hồi quyền dựa riêng trên nhóm đó. Nếu người đó còn là recipient trực tiếp hoặc qua nhóm khác vẫn xem được. Vì vậy phải lưu nguồn cấp quyền, không chỉ một mảng recipient gộp. Xóa bạn không tự xóa lịch sử bài trực tiếp; nếu muốn thu hồi cần hành động riêng, chưa triển khai.

**Nghiệm thu:** thử bạn trực tiếp, thành viên nhóm, người ngoài, thành viên mới, người đã rời và recipient qua nhiều nguồn; cả bài, ảnh, bình luận đều áp dụng cùng quyền.

## Bạn bè và nhóm — P1, cần trước chia sẻ nhiều tài khoản

**Hiện trạng:** mock có gửi/nhận lời mời, quản trị nhóm và thành viên; không có race condition mạng.

**Đề xuất:** friendship có ID và trạng thái pending/accepted/rejected/cancelled; unique cặp người dùng, chặn tự kết bạn. Server kiểm tra người nhận mới được accept và người gửi mới được cancel. Với nhóm, role owner/member; chỉ owner đổi tên/xóa thành viên/giải tán. Để bám MVP hiện tại, đề xuất owner thêm ngay bạn đã kết nối; cơ chế mời nhóm và accept riêng có thể bổ sung sau, không cần dựng ngầm hai mô hình cùng lúc.

**Nghiệm thu:** gửi lời mời chéo không tạo hai friendship; member không gọi được API admin; remove/leave xong cập nhật các view liên quan; yêu cầu cũ tới nhóm đã xóa trả lỗi có nghĩa.

## Feed, bình luận, cảm xúc — P1

**Hiện trạng:** một bài nhận mẫu cố định; bài còn lại từ local; comments/reaction thuộc từng account trên máy. Trang post detail riêng chưa hoàn chỉnh.

**Đề xuất:** GET feed trả bài mình gửi và bài mình được nhận, phân trang cursor, sắp created_at + ID ổn định, dedupe post_id. Groups filter theo group và quyền. Reaction dùng PUT để đặt một loại hoặc DELETE để bỏ; unique user + post. Bình luận POST với idempotency key, author/time từ server; giới hạn 300 ký tự, không khoảng trắng; DELETE chỉ tác giả (quyền moderation nếu có phải chốt riêng). Response có reaction_counts, my_reaction, comment_count. Hiển thị optimistic update chỉ khi có rollback/error.

**Nghiệm thu:** hai thiết bị nhìn thấy bình luận và cảm xúc sau refresh; lỗi không tăng count ảo; người ngoài không đọc/gửi phản hồi; bài bị thu hồi quyền không còn truy cập comment API. MVP có thể refresh khi focus/pull-to-refresh; chưa cần realtime/push.

## Leaderboard — P1

**Hiện trạng:** tổng XP local của mình, fixture XP bạn bè, đồng điểm cùng hạng.

**Đề xuất:** GET leaderboard scope=friends lấy actor + friendship accepted, tổng XP từ ledger hoặc aggregate server. Quy tắc hạng `1 + số người có XP lớn hơn`; sắp thứ tự phụ ổn định theo tên/ID. Không nhận danh sách user tùy ý hoặc XP do frontend cung cấp. Bổ sung fetched_at để biết độ mới; chỉ cần tổng tích lũy trong MVP.

**Nghiệm thu:** cùng XP cùng hạng; accept/unfriend đổi phạm vi; thêm XP cập nhật hạng; không lộ điểm người không nằm trong phạm vi.
