# Luồng Khám phá và Missions

Cập nhật 11/11/2026 · [Chỉ mục](../README.md) · Mô tả UI local hiện tại.

## Mở app và điều hướng

- Root chờ hydrate app/capture/social. Chưa có session mock thì vào login; bấm “Vào bản xem trước bằng dữ liệu mock” để vào app.
- Ba tab: Khám phá, Máy ảnh, Bảng tin. Danh sách Friends, Groups và Leaderboard cũng có thanh tab dưới cùng; thuộc ngữ cảnh Bảng tin.
- Camera là màn hình riêng không có thanh tab. Trang con có Back; khi không có history thì quay về gốc.
- Đăng ký/quên mật khẩu, sửa hồ sơ và các trang chi tiết riêng còn scaffold; xem CURRENT_STATE, không giả định auth thật.

## Khám phá

- Timeline 10 node cuộn ngang; chọn node cập nhật thẻ thời kỳ, tiến trình, XP và nút tìm nhiệm vụ thời kỳ này.
- Node đã/chưa giải mã đều chọn được. Tổng mảnh lấy từ records local cùng account, giới hạn theo goal.
- CTA tìm quanh đây không khóa theo node đang chọn. Nếu còn active mission có đường tiếp tục.
- Không thêm lại intro “Khám phá”, “Chọn thời kỳ…”, nhãn “Bản xem trước”, tổng “0/10…” và câu giải thích thưởng đã được bỏ.

## Tìm nhiệm vụ

1. Đọc eraId nếu đi từ timeline; giữ mục tiêu này trong lượt tìm.
2. Chọn GPS hiện tại hoặc Nhập tọa độ. Một ô `vĩ độ, kinh độ`, ví dụ `16.4692, 107.5778`; nút điền mẫu Huế chỉ điền draft.
3. Validate số hữu hạn: latitude [-90,90], longitude [-180,180]; cho phép 0/âm; dấu chấm thập phân. Không tự đảo tọa độ. Sai/thiếu thì không tìm.
4. Không có nút “Sử dụng tọa độ”: nhập hợp lệ cho bấm “Tìm nhiệm vụ tại đây”. Chuyển mode giữ draft và GPS riêng, bỏ qua kết quả GPS trả muộn từ mode cũ. Nhập tay không cần xin quyền GPS.
5. Chọn 1/3/5 km rồi tìm. Loading theo bước, khóa gửi lặp. Thành công mở nhiệm vụ; không có kết quả cho đổi điều kiện/chơi tự do; lỗi cho thử lại.
6. Tìm mới không xóa mission cũ trước khi có cái thay thế. Mở rộng bán kính hoặc đổi era là lựa chọn chủ động.

## Chi tiết nhiệm vụ

Mật thư → tiêu chí ảnh → mở lần lượt gợi ý lưu sẵn → xem đáp án/địa chỉ khi cần → mở Maps hoặc “Chụp hoàn thành”. Chụp mang mode=mission + missionId. Đổi nhiệm vụ có xác nhận; giữ era và loại địa điểm cũ trong lượt tìm thay thế.

## Mock và giới hạn

Fixture quanh Huế: Ngọ Môn, Hiển Lâm Các, Quốc Học. Ngoài vùng/era có thể rỗng. Development có scenario thành công/rỗng/lỗi. Có GPS thật nhưng tìm địa điểm vẫn mock; tọa độ manual không chứng minh đã đến nơi và không tự cấp XP. Quota/cooldown/tool calls thật chưa có.
