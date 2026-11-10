# Lockulture — Chuẩn giao diện mobile

Chốt theo giao diện Khám phá và phản hồi người dùng đến 11/11/2026. Nền tảng chính là React Native/Expo cho Android/iOS; web chỉ là bản kiểm tra phụ.

## Palette

| Token | Màu | Vai trò |
|---|---|---|
| background | #0B302E | Nền teal đậm hơi thiên xanh lục, chiếm diện tích lớn nhất |
| surface | #174E4B | Thẻ/bounding box |
| surfaceRaised | #1E5960 | Icon container và bề mặt nổi |
| accent / yellow | #F4C568 | Vàng ấm hơi cam, giảm saturation; CTA, node đang chọn, icon và thưởng |
| text | #F5F3EB | Chữ chính |
| muted | #BBCDCF | Nội dung phụ |
| subtle | #A0BCC1 | Chữ chú thích |
| border | #356268 | Viền teal dịu |
| rewardSurface | #30271A | Nền tối ấm cho nhãn XP |
| accentSurface | #362D1D | Nền tối ấm cho mảnh ghép đã nhận |
| danger | #EF8B8B | Thông báo lỗi |

Vàng ấm thay vàng chanh cũ; giảm sắc blue của hai màu nền/thẻ để gần tông teal hơi xanh lục trong ảnh Neumorphic-design-ui-elements.png, tăng nhẹ độ bão hòa và độ sáng của teal, giữ thứ bậc nền đậm/thẻ sáng hơn. Dùng token chung, không hardcode màu riêng trong component. Nền splash/adaptive icon đồng bộ background. Không dùng teal sáng làm điểm nhấn; không tự thêm gradient hoặc bóng đổ lớn. Token đầy đủ nằm tại `mobile/src/shared/theme/tokens.ts`.

## Chữ và bố cục

- Chữ phụ tối thiểu 14, body và nút 16, section 18, tiêu đề trang khoảng 26–30.
- Body line-height khoảng 25. Giữ font scaling mặc định của React Native.
- Tên thời kỳ dùng sans-serif hệ thống cỡ 32 weight 400. Mật thư có thể giữ serif hiện tại; điều khiển/nội dung dùng sans-serif.
- Padding ngang trang 22, card 20–22; gap 12–20, bo card 20, nút 14.
- Nút cao tối thiểu 52; điều khiển chạm tối thiểu khoảng 44.
- Safe area trên/dưới, cuộn dọc khi nội dung dài, không ép text vào chiều cao cố định.
- Timeline cuộn ngang, node rộng 120 và chọn được khi chưa giải mã.
- Không thêm lại lời chào dài, headline landing page, nhãn “Bản xem trước” ở trang chủ hoặc các dòng phụ đã được người dùng yêu cầu bỏ.

## Component chung

- `Page`: trang con có nút quay lại, tiêu đề, safe area và scroll.
- `Action`: nút vàng/secondary, trạng thái disabled/busy, điều hướng hoặc callback.
- `Surface`: thẻ nền teal, border và padding thống nhất.
- `Note`: chữ giải thích hoặc lỗi có hướng khắc phục.
- `ConfirmSheet`: sheet xác nhận đổi nhiệm vụ, hỗ trợ nút Back Android và đóng qua nền.
- Component timeline/thẻ thời kỳ vẫn thuộc feature exploration.

Trạng thái loading, empty và lỗi là phần của giao diện chính. Chỉ hiển thị tiến trình tác vụ thật hoặc được mô phỏng rõ trong chế độ mock; không tự thêm phần trăm suy luận.

## Ô nhập tọa độ trên Missions

Giữ cùng palette và typography: nhãn tối thiểu 14, nội dung nhập 16, nền surface, border trung tính; focus vàng, lỗi màu danger. Ô nhập một dòng có nhãn rõ vĩ độ trước/kinh độ sau, hỗ trợ số âm, dấu chấm và dấu phẩy; không dựa vào placeholder làm nhãn duy nhất. Không dùng chiều cao cố định cắt chữ khi font scale lớn. Lỗi đặt ngay dưới ô; tự kiểm tra tọa độ, không có nút Sử dụng tọa độ riêng. Tọa độ hợp lệ cho phép bấm Tìm nhiệm vụ tại đây trực tiếp; giữ dữ liệu GPS và nhập tay riêng khi chuyển chế độ. Hai nguồn GPS/Nhập tọa độ có trạng thái chọn rõ, vùng chạm tối thiểu 44. Cuộn được khi bàn phím mở; bàn phím không che ô, lỗi hoặc nút tìm nhiệm vụ.

## Thanh tab và social

BottomNavigation dùng chung cho ba tab chính và danh sách Friends, Groups, Leaderboard; cố định ngoài vùng cuộn, chừa safe area. Các trang social thuộc ngữ cảnh Bảng tin. Icon có nhãn accessibility và vùng chạm tối thiểu 44. Caption ảnh và điều khiển bình luận tuân theo [luồng social](flows/SOCIAL.md).
