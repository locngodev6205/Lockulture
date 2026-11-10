# Lockulture — tài liệu hiện hành

Cập nhật 11/11/2026. Điểm bắt đầu cho thành viên nhóm và AI agents.

## Thứ tự đọc

1. [Sản phẩm và quyết định đã chốt](PROJECT_SPECIFICATION.md).
2. [Hiện trạng code](CURRENT_STATE.md): phân biệt local mock, scaffold và backend thật.
3. Luồng cần làm: [Khám phá/Missions](flows/DISCOVERY.md), [Camera/Kết quả](flows/CAPTURE.md), [Chia sẻ/Xã hội](flows/SOCIAL.md).
4. [Chuẩn giao diện](DESIGN_SYSTEM.md) khi sửa UI; [Kiến trúc](ARCHITECTURE.md) khi sửa dữ liệu/service.
5. [API đang có](api/CURRENT.md) và [hợp đồng mục tiêu đề xuất](api/TARGET.md).
6. [Kế hoạch tích hợp](integration/PLAN.md), cùng các điểm cần xử lý: [nền tảng/AI](integration/CORE.md), [xã hội/quyền](integration/SOCIAL.md), [độ tin cậy/triển khai](integration/RELIABILITY.md).

## Quy tắc cho người đọc và AI agents

- PROJECT_SPECIFICATION là nguồn quyết định sản phẩm; flows mô tả thao tác UI hiện tại. CURRENT_STATE mô tả code đã làm. api/TARGET và integration là đề xuất kỹ thuật, chưa phải backend đã triển khai.
- Không diễn giải “đã chạy mock” thành “đã nối backend”, “đã kiểm chứng AI” hay “đã đồng bộ nhiều người dùng”.
- Nếu code khác quyết định, ghi rõ sai lệch; không tự đổi quyết định cho khớp code.
- Hướng dẫn AGENTS.md/agents.md và yêu cầu trực tiếp của người dùng vẫn áp dụng; bộ docs này không ghi đè cấp ưu tiên chỉ dẫn của AI.
- Mỗi quy tắc có một nơi chính. Khi thay đổi, sửa nội dung ở nơi đó và link từ các file khác; không nối thêm phụ lục mâu thuẫn với phần đầu.
- Các file mô tả hệ thống sớm bên ngoài docs hoặc legacy/flutter chỉ là tư liệu lịch sử, không dùng để khôi phục luồng cũ.

## Cập nhật sau merge main

[Ghi chú merge](integration/UPSTREAM_MERGE.md): backend mới có Gemini verification, bản Flutter mới giữ ở legacy; policy/API vẫn cần đồng bộ với React Native.

## Những điểm chưa chốt

Chọn provider auth/DB/kho ảnh; hạn mức/cooldown AI; luật thưởng free cho cùng đối tượng ở lần nộp mới; quyền xem bài cũ sau khi rời nhóm/xóa bạn; cơ chế mời nhóm thật; chính sách moderation và lưu/xóa ảnh. Xem đề xuất trong integration trước khi triển khai.

## Tài liệu đã thay thế

- USER_FLOW.md → ba file trong flows/.
- API_SPECIFICATION.md → api/CURRENT.md và api/TARGET.md.
- FRONTEND_BACKEND_INTEGRATION_REVIEW.md → CURRENT_STATE.md và integration/.

Các bản cũ đã được xóa để tránh đọc nhầm. PROJECT_SPECIFICATION, ARCHITECTURE, DESIGN_SYSTEM đã được biên tập lại tại chỗ. Không thay đổi code ứng dụng trong đợt tổ chức tài liệu này.
