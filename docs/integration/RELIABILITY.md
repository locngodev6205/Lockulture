# Độ tin cậy, triển khai và kiểm chứng

Cập nhật 11/11/2026 · [Kế hoạch](PLAN.md). Các đề xuất dưới đây chưa phải tính năng backend đã có. P0: chặn tích hợp an toàn; P1: cần để hoàn thiện luồng tương ứng.

## ID, giao dịch và thao tác lặp — P0

**Hiện trạng:** ID client dùng thời gian/random; create/send có khóa local nhưng chưa đảm bảo hai thiết bị hoặc retry mạng. Group postIds và post audience nằm ở hai store.

**Đề xuất:** server cấp ID; client tạo request key ổn định cho một ý định. POST trả lại tài nguyên cũ khi key đã xử lý. Cùng key khác payload trả conflict. Transaction cho publish + audience, accept request + friendship, completion + reward/progress. Không dùng postIds ở client như nguồn chuẩn feed nhóm; query từ quan hệ server.

**Nghiệm thu:** response mất sau khi server đã ghi, app retry không tạo bài/XP/bình luận/nhóm thứ hai.

## Độ trễ, lỗi và việc hủy — P0 cho AI

**Hiện trạng:** mock có delay nhưng không đại diện AI/network; HTTP helper timeout mặc định 15 giây khi không truyền signal. Nếu truyền signal thì helper không đặt timer riêng.

**Đề xuất:** CRUD ngắn dùng request thường; AI lâu dùng POST trả 202 + job ID, GET polling có giới hạn/backoff. Job phải lưu trạng thái bền vững, không dựa vào biến RAM hoặc background task không bảo đảm hoàn tất. Hủy fetch trên app chỉ dừng chờ; hủy job thực phải có API/quy tắc riêng. Lỗi chuẩn `{code,message,retryable,request_id}`; phân biệt unauthorized/forbidden/conflict/rate_limited/no_result/model_failed.

**Nghiệm thu:** rời màn hình không ghi kết quả vào phiên mới; app quay lại lấy được job; thử lại không chạy model/cấp thưởng lặp; có trạng thái hết thời gian và đường thoát.

## Triển khai và vận hành — P0 cho demo online

**Hiện trạng:** có Docker/FastAPI nhưng chưa xác minh triển khai production trong đợt đối chiếu này; localhost là URL mặc định frontend.

**Đề xuất:** Cloud Run chứa API/orchestrator; DB và object storage lưu dữ liệu bền vững bên ngoài container. Chốt một stack lưu trữ để tránh hai nguồn chuẩn; nếu nhóm chưa có lựa chọn, PostgreSQL phù hợp với quan hệ user/friend/group/post/audience và transaction thưởng. Quản lý key Maps/Gemini ở backend; EXPO_PUBLIC chỉ chứa cấu hình công khai. Điện thoại thật phải dùng URL backend truy cập được, không coi localhost máy tính là localhost điện thoại. Log request/job ID, số lượt tool, latency và lỗi; không log ảnh/token tùy tiện.

**Nghiệm thu:** deploy/restart không mất dữ liệu; hai điện thoại truy cập được API; quota/rate limit có phản hồi; AI timeout không làm treo toàn bộ luồng.

## Phạm vi kiểm chứng hiện có — P1

**Hiện trạng:** đã chạy TypeScript/lint, các kịch bản browser mock và từng lần export JS bundle Android/iOS. Chưa chứng minh mọi màn hình trên thiết bị thật, backend đa người dùng hoặc quyền truy cập bằng các kiểm tra đó.

**Đề xuất:** giữ smoke tests mock; thêm contract tests, API integration test và kịch bản hai tài khoản trên hai thiết bị. Kiểm tra camera/torch, keyboard, safe area, mạng chậm/ngắt, resume và ảnh trên Android/iOS. Tránh đánh đồng export bundle với native build cài đặt thành công.
