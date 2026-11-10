# Sản phẩm và quyết định đã chốt

Cập nhật 11/11/2026 · Nhóm 3 người · [Chỉ mục](README.md).

## Mục tiêu

Lockulture giúp khám phá lịch sử/văn hóa bằng ảnh, tích lũy XP và mảnh ghép trên timeline, chia sẻ với những bạn bè/nhóm được chọn. Mobile chính là React Native/Expo; backend mục tiêu là Docker trên Google Cloud Run. Trạng thái đã triển khai nằm ở [CURRENT_STATE](CURRENT_STATE.md).

## Hai chế độ và timeline

| Quy tắc | Tự do | Nhiệm vụ |
|---|---|---|
| Đối tượng | Biển tên đường, món ăn, đồ vật có liên hệ văn hóa/lịch sử | Bằng chứng tại một địa điểm cụ thể được Maps trả về |
| Mục tiêu trước khi chụp | Không bắt buộc | Tiêu chí đã tạo cùng nhiệm vụ |
| Kết quả thành công | accepted | completed |
| Thưởng | Ít hơn nhiệm vụ | Nhiều hơn tự do |

- Chọn được mọi node timeline. Tìm từ node giữ thời kỳ đã chọn; tìm quanh đây độc lập xét mọi thời kỳ phù hợp.
- Mỗi nhiệm vụ thuộc một thời kỳ có liên hệ phù hợp; không gán ngẫu nhiên để lấp node.
- Không ép mọi món ăn/đồ vật vào một triều đại. Chỉ cộng mảnh khi có liên hệ thời kỳ phù hợp; không có liên hệ thì vẫn có thể nhận kiến thức/XP.
- Tiến trình là của cá nhân; nhóm không mở khóa hộ. Một đối tượng không thêm mảnh lặp cho cùng thời kỳ.
- Cùng lượt nộp không cộng cả thưởng free và mission. Retry hoặc mở lại kết quả không cộng thưởng lại; mission hoàn thành không thưởng lần nữa.

## Tìm nhiệm vụ và ảnh

- Cho chọn GPS hoặc nhập tọa độ. Tọa độ hợp lệ được dùng trực tiếp; không có nút áp dụng riêng. Giữ draft nhập tay khi đổi qua GPS.
- Maps là nguồn ứng viên với truy vấn như `attractions`/`điểm mốc lịch sử`. Không bắt buộc là di tích, không lọc >50 review, không cần chứng minh “được chụp nhiều lần”.
- Chọn nơi tên rõ, có bằng chứng cụ thể để chụp. Tránh bia độc lập/mộ nhỏ/đối tượng khó phân biệt; không loại toàn bộ quần thể lăng tẩm theo từ khóa.
- Tạo mật thư, tiêu chí ảnh, các mức gợi ý và đáp án cùng nhiệm vụ. Mở gợi ý đã sinh không gọi AI thêm.
- Agent được đổi chiến lược truy vấn trong ngân sách; không tự đổi thời kỳ hoặc mở rộng bán kính. Đổi mission chỉ thay cái cũ sau khi tìm thành công.
- Bỏ chống ảnh màn hình/ảnh in. Tờ tiền có hình di tích không thay thế bằng chứng cần chụp.
- Tạm tin suy luận/kiến thức Gemini; chưa kiểm chứng độc lập, bỏ kiểm tra giờ mở cửa/vé/điều kiện tham quan trong MVP.
- Ảnh mờ/thiếu chi tiết cần hướng dẫn chụp lại; không kết luận “không có giá trị lịch sử” chỉ vì không nhận diện được. Giữ ngữ cảnh khi xin ảnh bổ sung.

## Chia sẻ và xã hội

- Khám phá hợp lệ có kiến thức ngắn. Caption tùy chọn, người dùng tự viết; không bắt buộc một agent caption riêng.
- Không tự đăng. Người dùng chọn từng bạn, tất cả bạn hiện tại hoặc nhiều nhóm trước khi gửi; mặc định không chọn ai.
- Một bài có nhiều đích nhận; người trùng nhiều đích không nhận bản bài trùng. Không chọn người nhận thì không gửi.
- Thành viên nhóm tại thời điểm gửi thuộc danh sách nhận; người tham gia sau không tự xem bài cũ.
- Không chia sẻ hoặc chia sẻ lỗi không mất XP. Chia sẻ không cộng XP.
- Friends/Groups có quản lý quan hệ/thành viên; cảm xúc và bình luận trên bài; leaderboard gồm bản thân và bạn đã kết nối.
- Caption tối đa 500, bình luận 300 ký tự theo UI hiện tại. Có thể đổi cấu hình khi thống nhất lại.
- Không có chat, widget, roleplay bình luận AI bắt buộc, Co-op hoặc phục dựng ảnh trong MVP.

## Cấu hình mock, không phải giới hạn sản phẩm đã kiểm nghiệm

| Cấu hình hiện tại | Giá trị |
|---|---|
| XP free / mission | 20 / 100 |
| Mục tiêu mỗi node | 3 đối tượng khác nhau |
| Nhiệm vụ active | 1/người |
| Bán kính UI | 1 / 3 / 5 km |
| Ảnh bổ sung local | Giữ tối đa 3 ảnh trước |

Giới hạn Maps 2 lượt/phiên là đề xuất trước đây, chưa phải quota backend thật. Luật giảm thưởng/cooldown free cùng đối tượng chưa chốt; mock hiện có thể cộng XP cho lần nộp mới dù không thêm mảnh.
