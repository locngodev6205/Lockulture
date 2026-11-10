# Luồng chia sẻ, bạn bè, nhóm và xếp hạng

Cập nhật 11/11/2026 · [Chỉ mục](../README.md) · Hiện chạy mock trên một thiết bị.

## Chia sẻ

1. Kết quả hợp lệ → Chia sẻ khám phá. Xem ảnh, caption tùy chọn tối đa 500 ký tự.
2. “Gửi đến” mặc định rỗng. “Chọn người nhận” mở phần chọn Bạn bè/Nhóm; có tìm tên, chọn từng bạn hoặc tất cả bạn hiện tại, chọn nhiều nhóm đang tham gia.
3. “Xong” thu gọn; hiển thị số bạn/nhóm và tên đã chọn. Nút Gửi khám phá chỉ bật khi có người nhận hợp lệ.
4. Xác nhận lưu một bài, friendIds và snapshot nhóm; chuyển Bảng tin. Một người trùng nguồn nhận chỉ đếm một lần. Không tự gửi cho bạn chưa chọn.
5. Mở composer cùng discovery đã gửi báo đã gửi, không clone bài. Có thể thêm phạm vi nhóm từ chi tiết nhóm.

## Bảng tin và tương tác

- Đầu trang: tiêu đề cùng các icon cúp, một người, nhóm người → Leaderboard, Friends, Groups. Cuối trang có Quay lên đầu, không còn CTA chụp.
- Hiển thị bài đã gửi của mình và một bài Minh An gửi riêng được dựng sẵn trong chế độ mock. Ảnh biển đường minh họa bằng UI; không phải bài thực từ máy khác.
- Caption ở giữa phía dưới ảnh, hộp xám bán trong suốt bo góc, chữ đen; tối đa 6 dòng ở thẻ.
- Cảm xúc ❤️/👏/😮: mỗi người một loại, bấm lại bỏ, loại khác thay thế. Chưa có tổng phản hồi nhiều người.
- Bình luận mở vùng nhập trước danh sách. Ô nhập và nút máy bay giấy cùng hàng, gửi bên phải; rỗng/whitespace không gửi, tối đa 300 ký tự. Gửi xong xóa draft.
- Bình luận có tên, nội dung; tác giả thấy icon thùng rác bên phải tên để xóa. Bài trong nhóm dùng chung component và tương tác theo post ID/account.
- Chưa có chat, push notification, moderation hay roleplay AI tự bình luận. Post detail route riêng còn scaffold.

## Bạn bè

Ba tab Bạn bè / Lời mời / Tìm bạn. Tìm tên/username hỗ trợ bỏ dấu. Hồ sơ có tên, avatar chữ cái, bio, XP mẫu và thao tác theo quan hệ.

- Người gửi: gửi/hủy lời mời. Người nhận: chấp nhận/từ chối. Đã kết bạn: xóa bạn có xác nhận; không tự xóa nhóm chung.
- Hồ sơ đang chờ có nút mô phỏng người kia chấp nhận để demo; không phải chức năng gửi mạng.
- Fixture có hai bạn, một lời mời đến, một lời mời đi. Các thao tác được lưu local.

## Nhóm

- Danh sách tìm nhóm và tạo nhóm. Tên bắt buộc tối đa 50 ký tự; chọn bạn bè hoặc tạo trước với bản thân.
- Chi tiết có Bảng tin / Thành viên. Owner đổi tên, thêm bạn, xóa thành viên, giải tán. Member thường rời nhóm. Xóa/rời/giải tán cần xác nhận.
- Demo thêm bạn vào nhóm có hiệu lực ngay; cơ chế invitation thật chưa chốt. Có hai nhóm mẫu cho role owner/member.
- Chia sẻ vào nhóm: chọn bài đã đăng của mình, thêm phạm vi nhóm vào bài gốc, không nhân bản hoặc thưởng thêm. Bài đã có trong nhóm không còn trong danh sách chọn.
- Nhóm mới chưa có bài có empty state. Giải tán không xóa bài/discovery gốc. Route mất quyền/không tồn tại có đường về danh sách.
- Member mới không nhận bài trước lúc tham gia. Quyền sau khi rời/bị xóa nhóm cần backend chốt, xem [tích hợp social](../integration/SOCIAL.md).

## Leaderboard và hồ sơ

Icon cúp mở bảng XP tích lũy: bản thân + bạn accepted, không gồm lời mời. XP giảm dần; đồng điểm cùng hạng; tên là thứ tự phụ. Hàng mình viền vàng; đầu trang có hạng/XP. Bấm hàng mở hồ sơ. Không có bạn vẫn có bản thân và CTA tìm bạn.

XP mình lấy records local, bạn bè fixture; chưa bảng tuần/global. Trang này và danh sách Friends/Groups có tab dưới cùng. Hồ sơ mình hiển thị tổng XP, liên kết collection/friends/groups, kết thúc phiên; edit profile còn scaffold.
