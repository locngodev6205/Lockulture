# Luồng camera, kết quả và tiến trình

Cập nhật 11/11/2026 · [Chỉ mục](../README.md).

## Chọn và chụp

- Tab Máy ảnh cho chụp tự do hoặc tìm/tiếp tục nhiệm vụ. Nút tìm nhiệm vụ nền vàng chữ đen.
- Camera chỉ xin quyền khi người dùng bấm cho phép; bị từ chối vĩnh viễn có mở cài đặt. Không xin micro/GPS ở màn hình này.
- Camera chỉ hoạt động khi trang có focus và app foreground. Chặn chụp khi chưa ready/đang lưu; lỗi mở camera có retry.
- Ba điều khiển cùng hàng: flash, shutter ở giữa, hai mũi tên đổi camera. Hai icon bên đặt gần shutter hơn mép ngoài. Đèn không hỗ trợ bị xám/disabled; không cam kết phát hiện mọi phần cứng thiếu torch.
- Yêu cầu nhiệm vụ và “Xem nhiệm vụ” ở cuối, dưới shutter. Free có hướng dẫn biển đường/món ăn/đồ vật.
- Ảnh crop giữa vuông, resize cạnh tối đa 1080, JPEG 0.75 sau bước chụp. Native sao chép vào thư mục app; không tự lưu gallery.

## Preview và đánh giá

Preview ảnh → Chụp lại hoặc Gửi đánh giá. Mission kiểm tra active/owner/missionId. Free không cần mission. Mock ghi rõ không phân tích ảnh; menu development chọn scenario.

| Kết quả | Áp dụng | Hành động |
|---|---|---|
| accepted | Free | Kiến thức, lưu discovery và thưởng |
| completed | Mission | Như trên, bỏ mission khỏi active |
| retake_required | Cả hai | Hướng dẫn ảnh rõ hơn, Chụp lại cùng ngữ cảnh |
| unidentified | Cả hai | Xin chi tiết khác/bổ sung, chưa kết luận ngoài phạm vi |
| out_of_scope | Free | Giải thích phạm vi, Chụp lại đối tượng khác |
| not_matched | Mission | Giải thích không khớp tiêu chí, tìm đúng đối tượng |

Lỗi mạng/dịch vụ riêng với verdict: giữ ảnh để retry, không cộng XP. Khi bổ sung bằng chứng, giữ session và tối đa 3 ảnh trước; sai đối tượng/ngoài phạm vi bắt đầu ngữ cảnh mới. Rời trang hủy chờ local, không đồng nghĩa hủy job server tương lai.

## Kết quả và lưu trữ

- Thành công: ảnh, kiến thức, XP, mảnh nếu phù hợp; đi Chia sẻ, Bộ sưu tập, chụp tiếp/tìm nhiệm vụ hoặc về Khám phá.
- Retry cùng submission không thưởng lại. Mission đã hoàn thành không cấp lại. Cùng subject/era không thêm mảnh; rule free nộp mới nhận XP vẫn là điểm cần chốt.
- Records cập nhật timeline, bộ sưu tập, hồ sơ và leaderboard. Danh sách bộ sưu tập mở kết quả; discovery detail riêng còn scaffold.
- Draft chưa persist toàn bộ qua restart. Native file bền hơn cache nhưng chưa có cleanup đủ; web URI/blob có thể mất sau reload/thu hồi.
- Bài chỉ được đăng sau khi người dùng chọn audience và xác nhận trong [luồng social](SOCIAL.md). Bỏ chia sẻ không mất kết quả/thưởng.
