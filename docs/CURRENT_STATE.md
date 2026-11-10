# Hiện trạng code — 11/11/2026

[Chỉ mục](README.md) · Đối chiếu tại branch `docs/align-mvp-agentic-flow`.

## Nền tảng và cấu trúc

| Thành phần | Hiện trạng từ code | Ý nghĩa khi tích hợp |
|---|---|---|
| Mobile | Expo SDK 58, React Native 0.88.1, React 19.3, TypeScript | App mobile; bản web phục vụ xem trước và kiểm tra phụ trợ |
| Runtime phát triển | `package.json` yêu cầu Node >=24.3 và <25 | Thống nhất Node trong máy dev và CI |
| Điều hướng | Expo Router; route mỏng re-export feature screen | Có thể giữ route khi đổi nguồn dữ liệu |
| UI chung | Page, Action, Surface, BottomNavigation, token màu | Giữ component; bổ sung trạng thái chờ/lỗi theo API |
| State | Zustand và AsyncStorage | Hiện vừa giữ UI vừa làm kho nghiệp vụ mock |
| Query | Có TanStack Query và provider | Chưa được áp dụng đồng nhất cho social/feed hiện tại |
| Camera/ảnh | Expo Camera, ImageManipulator, FileSystem | Có ảnh thực từ camera; chưa có upload thật |
| HTTP | `services/api/client.ts`: bearer tùy chọn, JSON, timeout mặc định 15 giây | Chưa refresh token, runtime DTO validation hoặc upload pipeline |
| Adapter | Interface exploration/feed/missions/capture | API adapter báo chưa tích hợp; không fallback mock âm thầm |
| Cấu hình | `EXPO_PUBLIC_DATA_SOURCE`, `EXPO_PUBLIC_API_BASE_URL` | Chuyển env chưa thay được những màn hình đang gọi store trực tiếp |
| Backend | FastAPI, Dockerfile, bốn module agent | Verification gọi Gemini; các luồng khác còn mẫu, chưa social/persistence thật |

Thư mục tham chiếu: `mobile/src/app`, `features`, `domain`, `services`, `state`, `shared`; Flutter cũ lưu trong `legacy/flutter`.

## Màn hình và luồng

| Khu vực | Đã có | Giới hạn hiện tại |
|---|---|---|
| Đăng nhập | Vào phiên mock `mock-user`, kết thúc phiên | Không xác thực email/mật khẩu thật |
| Đăng ký/quên mật khẩu | Route và scaffold | Chưa có form/luồng API hoàn chỉnh |
| Khám phá | Timeline 10 node cuộn ngang, chọn thời kỳ, tiến trình và CTA | Era/goal là fixture; tiến trình cộng từ records local |
| Tìm nhiệm vụ | GPS hoặc nhập tọa độ; bán kính 1/3/5 km; giữ era nếu chọn từ timeline; trạng thái tìm/trống/lỗi | Mock địa điểm quanh Huế; chưa Maps/Gemini |
| Chi tiết nhiệm vụ | Mật thư, tiêu chí ảnh, gợi ý lưu sẵn, đáp án, mở Maps, đổi nhiệm vụ | Mission và hint state trong local store |
| Camera | Quyền camera, chụp, đổi camera, đèn theo điều kiện hỗ trợ; ngừng camera khi mất focus/nền | Chưa kiểm tra đầy đủ trên điện thoại vật lý; camera web không đại diện camera native |
| Xử lý ảnh | Crop giữa thành ảnh vuông, resize tối đa 1080 cạnh, JPEG nén; native lưu file local | Chưa upload; file bị bỏ dở chưa có chính sách dọn đầy đủ |
| Preview/đánh giá | Hai mode; chọn scenario demo; retry lỗi; giữ ngữ cảnh ảnh bổ sung | Kết quả mock không phân tích ảnh; chưa gọi AI thật |
| Kết quả | Trạng thái thành công/chụp lại/chưa nhận diện/ngoài phạm vi/không khớp; XP và mảnh | Cấp thưởng và chống thưởng lặp local |
| Bộ sưu tập | Danh sách khám phá thành công và mở kết quả | Màn hình discovery detail riêng vẫn scaffold |
| Soạn chia sẻ | Caption tối đa 500; chọn nhiều bạn/nhóm; mặc định chưa chọn; chặn gửi trùng khám phá | Audience lưu local; chưa quyền đọc thật |
| Feed | Bài gửi của mình và một bài mẫu Minh An gửi riêng; caption đè ảnh; icon bạn bè/nhóm/cúp | Không phải luồng nhận bài từ thiết bị khác; bài mẫu dùng hình minh họa dựng trong app |
| Cảm xúc/bình luận | Một trong ❤️/👏/😮; đổi/gỡ; viết tối đa 300 ký tự; xóa bình luận bản thân | Local; chưa tổng hợp phản hồi nhiều người; không thông báo |
| Friends | Danh sách, tìm tên/username không dấu, lời mời đến/đi, chấp nhận/từ chối/hủy/xóa bạn, hồ sơ mẫu | Quan hệ giả lập; nút mô phỏng nhận lời; danh sách người dùng cố định |
| Groups | Tạo, đổi tên, thêm/xóa thành viên, rời/giải tán, feed nhóm, chia sẻ bài đã đăng | Role và membership local, nhiều thao tác gắn cứng `mock-user` |
| Leaderboard | Bản thân + bạn đã kết nối; XP giảm dần, đồng điểm cùng hạng; mở hồ sơ | XP mình từ local, bạn bè từ fixture |
| Hồ sơ | Tên mock và tổng XP, liên kết các trang | Edit profile còn scaffold |
| Post detail | Có route | Nội dung chi tiết riêng còn scaffold |

Thanh tab Khám phá/Máy ảnh/Bảng tin được dùng chung ở ba tab chính và trang danh sách Friends, Groups, Leaderboard. Camera là màn hình riêng. UI hiện dùng nền teal đậm, card teal, vàng ấm làm nhấn, font hệ thống không chân cho tiêu đề thời kỳ.

## Dữ liệu local

| Store | Key lưu trữ | Dữ liệu chính | Rủi ro cần xử lý |
|---|---|---|---|
| app-store | `lockulture-app-v1` | mockUser, selectedEraId, activeMission/hints | Không thay cho phiên đăng nhập hoặc nhiệm vụ authoritative |
| capture-store | `lockulture-captures-v1` | records, posts, audience | XP/fragment/post hiện do client quyết định; ảnh URI local |
| social-store | `lockulture-social-v1` | relations, groups, memberIds, postIds | Một tài khoản demo; không phân vùng nhiều account |
| feed-interaction-store | `lockulture-feed-interactions-v1` | reaction, comments theo account + post | Phản hồi trên một máy; ID bình luận sinh local |

Draft capture và continuation không phải toàn bộ đều được persist; mở lại app giữa một phiên không tương đương khôi phục phiên server. Root chờ hydrate app/capture/social; interaction store chưa có cổng hydrate riêng. Các store có thể lệch nhau nếu app dừng giữa nhiều lần ghi: ví dụ bài được lưu trong capture-store nhưng `postIds` nhóm chưa cập nhật.

## Giới hạn kiểm chứng

Đã chạy TypeScript/lint, smoke test tương tác trên browser với mock và export JS bundle Android/iOS ở các đợt trước. Chưa kiểm chứng toàn bộ trên thiết bị vật lý hoặc backend đa tài khoản. Export bundle không phải native binary build. Không có URL production đã được xác nhận. Xem [kế hoạch tích hợp](integration/PLAN.md).
