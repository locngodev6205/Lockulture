# Nền tảng, AI và thưởng

Cập nhật 11/11/2026 · [Kế hoạch](PLAN.md). Các đề xuất dưới đây chưa phải tính năng backend đã có. P0: chặn tích hợp an toàn; P1: cần để hoàn thiện luồng tương ứng.

## Hợp đồng API chưa bao phủ UI mới — P0

**Hiện trạng:** Backend cũ chưa có hợp đồng nhiều bạn/nhóm; UI đã chọn nhiều đích nhận. Đề xuất hiện hành ở [api/TARGET](../api/TARGET.md). `FeedPost` trong domain/service chỉ có vài field, không đủ cho ảnh, audience, reactions, comments và phân trang.

**Đề xuất:** chốt OpenAPI/Pydantic schema mới trước khi nối. Transport dùng snake_case, mapper chuyển sang model TypeScript camelCase. Dùng một kiểu Post thống nhất thay các type inline rải rác. Định nghĩa rõ null/optional, enum verdict, ID thời kỳ, thời gian ISO UTC, page cursor và error code. Parse DTO bằng Zod hoặc validator tương đương; type generic `requestJson<T>` không tự kiểm chứng response runtime.

**Nghiệm thu:** mock và API adapter cùng pass bộ contract cases; response thiếu/trái schema tạo lỗi có thể retry, không làm UI crash hoặc cộng thưởng.

## Social chưa qua service — P0

**Hiện trạng:** màn hình thao tác trực tiếp Zustand; `social-store` còn gọi `capture-store` khi chia sẻ vào nhóm. Đổi env không chuyển toàn bộ social sang API.

**Đề xuất:** thêm AuthService, SocialService, PostService, InteractionService, ProgressService. UI gọi hooks/query/mutation; mock adapter dùng store hiện có, API adapter dùng HTTP. Cache invalidation phải bao gồm các view liên quan: chấp nhận bạn → Friends và Leaderboard; đánh giá thành công → Collection, Timeline, Profile, Leaderboard; gửi bài → Feed và các nhóm nhận.

**Nghiệm thu:** cùng màn hình chạy với adapter mock/API; API lỗi không báo thành công local; trạng thái pending ngăn thao tác lặp.

## Identity và đăng nhập — P0

**Hiện trạng:** một ID mock, không có đăng nhập thật; UI đăng ký/quên mật khẩu còn scaffold.

**Đề xuất:** chọn một nhà cung cấp identity; backend xác thực token, lấy actor từ token. Hoàn thiện form, hết hạn phiên, đăng xuất và refresh theo provider. SecureStore cho dữ liệu phiên phù hợp trên native; không lưu mật khẩu trong AsyncStorage. Không nhận `authorId`, `ownerId`, quyền admin từ client như sự thật. Thay mọi điều kiện `mock-user` bằng identity hiện tại.

**Nghiệm thu:** hai account trên hai thiết bị không thấy cache riêng của nhau; token hết hạn được xử lý; đổi ID trong request không thể thao tác thay người khác.

## Camera và lưu ảnh — P0

**Hiện trạng:** ảnh có URI cục bộ; recipient không thể đọc file của người gửi. Camera thực hoạt động nhưng đánh giá vẫn mock.

**Đề xuất:** MVP dùng multipart upload tới backend hoặc upload URL có hạn tới object storage. Trả `asset_id`, lưu metadata owner/mime/size; submission dùng asset_id. Server kiểm tra file/giới hạn dung lượng và quyền sở hữu. Truy cập ảnh phải theo quyền bài/discovery, dùng URL có hạn hoặc endpoint kiểm soát quyền. Theo dõi upload pending/failed để retry cùng asset, tránh gửi lại ảnh nhiều lần.

**Nghiệm thu:** chụp trên máy A, người nhận máy B xem được; người ngoài không lấy được ảnh qua URL/API không có quyền; file lỗi trả lỗi rõ; không mất ảnh đang chờ khi retry.

## Mission search và Maps — P0

**Hiện trạng:** tọa độ manual/GPS, era và radius đã có UI; mock không phản ánh độ trễ và độ phủ Maps thật.

**Đề xuất:** request gồm coordinates, source, radius_meters, era_id tùy chọn, exclude_place_id khi đổi. Server kiểm tra phạm vi, giữ era đã chọn, xác nhận Place ID thuộc kết quả tool. Lưu search_id, mission_id và version; trả trạng thái searching/ready/no_result/failed. Gợi ý và tiêu chí ảnh được sinh một lần rồi lưu. Đếm ngân sách tool/model ở backend.

**Nghiệm thu:** không tự đổi thời kỳ hoặc bán kính; không có kết quả có đường quay lại; tìm thay thế thất bại vẫn giữ mission cũ; GPS/manual đều dùng được.

## Đánh giá AI và bổ sung ảnh — P0

**Hiện trạng:** free và mission có verdict riêng; ảnh bổ sung được giữ local; mock lỗi khác kết quả không hợp lệ.

**Đề xuất:** tạo evaluation_session_id và submission_id server. Mission mode đọc tiêu chí/version từ DB; free cho street sign/food/object. Kết quả dùng enum: accepted/completed, retake_required, unidentified, out_of_scope, not_matched theo mode. Lỗi upload/model không giả thành verdict từ chối. Lưu ảnh trước, yêu cầu bổ sung và giới hạn phiên. Caption/kiến thức không tự tạo bài xã hội.

**Nghiệm thu:** retry lấy lại cùng kết quả; mở lại app khôi phục phiên; ảnh bổ sung được đối chiếu cùng mục tiêu; mission hết hiệu lực có lỗi riêng.

## XP, mảnh ghép và chống lặp — P0

**Hiện trạng:** capture-store cấp XP free 20/mission 100 trong mock, chống trùng cục bộ, mục tiêu era từ fixture. Leaderboard tính tổng local.

**Đề xuất:** server lưu reward ledger và áp dụng transaction cùng discovery/progress. Unique reward theo submission hoặc completion phù hợp; unique mission completion theo user + mission. Giữ quy tắc cùng subject không thêm mảnh lặp; cần định nghĩa subject_key chuẩn từ backend. Các lần free cùng subject có được nhận XP tiếp không phải là quy tắc riêng: mock hiện có thể nhận XP lại, dù không thêm mảnh. Đề xuất MVP giới hạn thưởng free theo user + subject + ngày để leaderboard có ý nghĩa, nhưng cần nhóm xác nhận trước khi đổi sản phẩm.

**Nghiệm thu:** retry, gửi song song, mở kết quả lại không nhân đôi thưởng; XP Profile/Timeline/Leaderboard nhất quán. App không gửi số XP đề nghị để server tin trực tiếp.
