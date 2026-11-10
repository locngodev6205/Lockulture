# Merge main — 11/11/2026

[Chỉ mục](../README.md) · Tích hợp origin/main d39330f vào nhánh React Native.

## Đã giữ

- Toàn bộ cập nhật backend, requirements, tests và compose từ main.
- Frontend React Native và bộ docs hiện hành của nhánh này.
- Bản Flutter mới từ main được lưu đầy đủ trong legacy/flutter; tài liệu đi kèm ở legacy/flutter/docs chỉ để tham khảo.

## Thay đổi backend thực tế

Verification agent đã có lời gọi Gemini thật, chuẩn hóa ảnh, giới hạn upload, timeout và xử lý lỗi. Không còn đúng khi mô tả toàn bộ agent chỉ trả mẫu. Chưa xác nhận chạy Gemini live trong đợt merge này. Clue/album/moment vẫn chủ yếu fixture và không có hệ thống social/auth/persistence mới.

## Sai lệch chưa sửa nghiệp vụ

- Backend verification còn anti-spoof và confidence threshold 0.8, thưởng 150, whitelist địa danh Đà Nẵng. Những điều này chưa khớp quyết định React Native: bỏ anti-spoof, free/mission, thưởng cấu hình, tìm ứng viên Maps.
- Route vẫn trả boolean is_valid, không phải các verdict/session của frontend.
- Bản Flutter đi kèm có luồng riêng, không thay thế app React Native.
- Backend chưa tự được nối vào frontend khi merge: adapter API mobile vẫn chưa triển khai.

Đề xuất bước tiếp: chốt schema free/mission, thay policy verification cho khớp sản phẩm và nối upload/API qua service. Không bỏ kết quả backend mới hoặc tự khôi phục anti-spoof/Co-op thành yêu cầu sản phẩm chỉ để hết conflict.
