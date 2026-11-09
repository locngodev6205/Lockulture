# ĐẶC TẢ YÊU CẦU & NGHIỆP VỤ HỆ THỐNG

## TIME TRAVELER’S LOCKET (CHRONOLOCKET) – KHÁM PHÁ LỊCH SỬ & VĂN HÓA QUA LĂNG KÍNH THỰC TẾ

- **Mã dự án:** CHRONO-LOCKET-GDG2026.
- **Phiên bản đặc tả:** 2.0 — ngày 05/11/2026.
- **Chủ đề cuộc thi:** Mini Hackathon GDG 2026 – DevFest *"Learn Beyond Limits"*.
- **Trạng thái:** Đặc tả nghiệp vụ chuẩn hóa phục vụ triển khai MVP trong kỳ thi Hackathon và định hướng mở rộng sản phẩm. Hệ thống áp dụng triết lý thiết kế **"Không gian dẫn lối – Thời gian ghi nhận" (Location-First, Timeline-Organized)** kết hợp kiến trúc **Multi-Agent trên Google Cloud Run & Gemini API**.

---

## 1. TỔNG QUAN VÀ PHẠM VI

### 1.1. Mục tiêu

Xây dựng ứng dụng di động kết hợp cơ chế chia sẻ ảnh tức thời kiểu Locket/BeReal với yếu tố trò chơi hóa (Gamification) và hệ sinh thái đa tác tử (Multi-Agent System). Ứng dụng biến việc tìm hiểu lịch sử, văn hóa Việt Nam từ những bài học lý thuyết khô khan thành hành trình khám phá, săn lùng di tích thực tế ngoài đời sống dành cho giới trẻ (Gen Z).

Các mục tiêu nghiệp vụ chính:
1. **Dòng thời gian & Bộ sưu tập Album Pokedex:** Cung cấp trục thời gian lịch sử Việt Nam dưới dạng một bộ sưu tập các mốc lịch sử/văn hóa. Cho phép mở khóa phi tuyến tính: người dùng ở bất kỳ đâu đều có thể khám phá di tích xung quanh mình để lấp đầy album.
2. **Quản trò dẫn đường & Mật thư AI:** Tự động định vị GPS, quét di tích quanh người dùng qua Google Maps Places API và dùng Gemini API sáng tác mật thư, câu đố dẫn đường phong cách cổ xưa.
3. **Giám định thị giác máy tính & Chống gian lận:** Xác thực ảnh chụp thực tế bằng Gemini Multimodal Vision kết hợp kiểm tra chống gian lận (anti-spoofing chụp lại màn hình), phân tích di tích và xuất kết quả chuẩn hóa JSON.
4. **Chia sẻ tức thời & Kể chuyện lịch sử:** Tự động tạo caption Gen Z bắt trend kèm sự thật lịch sử (fun fact) và phân vai nhân vật lịch sử (persona roleplay) tương tác bình luận đầu tiên dưới ảnh trước khi gửi lên Feed bạn bè.
5. **Thích ứng nhiệm vụ địa phương & Co-op:** Điều chỉnh linh hoạt yêu cầu mở khóa (chụp công trình ➔ chụp hiện vật/hoa văn bảo tàng) hoặc hỗ trợ mở khóa chéo giữa bạn bè ở các địa phương khác nhau.

### 1.2. Bối cảnh sử dụng

- **Đối tượng người dùng chính:** Giới trẻ, học sinh, sinh viên, nhóm bạn thân yêu thích chụp ảnh check-in (Locket lover), du khách nội địa và người đam mê văn hóa lịch sử.
- **Môi trường hoạt động:** Ứng dụng di động hoạt động ngoài trời hoặc tại các điểm di tích, bảo tàng, không gian văn hóa, đình chùa trên khắp các tỉnh thành Việt Nam.
- **Quy mô đội thi Hackathon:** Nhóm 2 – 3 thành viên, thời gian triển khai sản phẩm thực tế từ 24h – 48h.
- **Mốc nghiệm thu MVP Hackathon:** Bản build ứng dụng di động (Flutter/React Native) chạy mượt mà trên ít nhất một nền tảng (Android/iOS) kết nối với Backend điều phối Multi-Agent đóng gói Docker triển khai trên Google Cloud Run, hỗ trợ kịch bản kiểm thử trực tiếp (bao gồm chế độ Mock Location để demo tại hội trường).

### 1.3. Phân định phạm vi

| Trong phạm vi MVP Hackathon (Bắt buộc hoàn thiện) | Ngoài phạm vi MVP / Kế hoạch mở rộng (Roadmap) |
| :--- | :--- |
| Xác thực tài khoản cơ bản & Nhóm bạn thân (Friends Feed) | Đăng nhập SSO bên thứ 3 phức tạp (Apple, Facebook); tìm kiếm bạn bè toàn cầu |
| Album Pokedex lịch sử hiển thị trạng thái Khóa / Mở khóa | Cây tiến trình phân nhánh đa tuyến phức tạp theo dạng game nhập vai RPG |
| Quét GPS & Function Calling Google Places API tìm di tích quanh vị trí | Dẫn đường chỉ báo Turn-by-Turn thời gian thực kiểu Google Maps Navigation |
| Sáng tác mật thư câu đố bằng Gemini API theo độ khó thích ứng | Hệ thống giọng nói AI Voice tương tác 2 chiều liên tục |
| Chụp ảnh live camera & Kiểm tra chống chụp lại màn hình (Anti-spoofing) | Huấn luyện mô hình Computer Vision biên riêng biệt (Edge CV) chạy offline |
| Giám định công trình/hiện vật qua Gemini Vision xuất Structured JSON | Nhận diện tự động toàn bộ 100% cổ vật vi mô không có dữ liệu đối chiếu |
| Feed xã hội nội bộ nhóm bạn kèm caption & comment đóng vai nhân vật | Widget màn hình chính hệ điều hành (Native iOS WidgetKit / Android AppWidget) |
| Chế độ Mock Location phục vụ demo sân khấu không phụ thuộc GPS thật | Đồng bộ thực tế tăng cường 3D (AR Overlay) chiếu hình nhân vật tại di tích |

---

## 2. VAI TRÒ VÀ TRÁCH NHIỆM

| Vai trò | Trách nhiệm & Quyền hạn |
| :--- | :--- |
| **Người dùng (Lữ khách thời gian)** | Tạo tài khoản, tạo/tham gia nhóm bạn, nhận mật thư, đi đến thực địa, chụp ảnh mở khóa, thả cảm xúc và bình luận trên feed. |
| **Bạn bè trong nhóm (Cộng sự)** | Nhận ảnh mở khóa trên Feed, cùng đóng góp vào tiến độ hoàn thành Album thời gian của nhóm, hỗ trợ mở khóa Co-op. |
| **Ban giám khảo / Giám định viên** | Được cung cấp tài khoản thử nghiệm kèm tính năng Mock Location để chấm thi trực tiếp mọi kịch bản di tích mà không cần rời hội trường. |
| **Backend & Điều phối Multi-Agent** | Quản lý logic nghiệp vụ, phiên đăng nhập, điều phối lời gọi giữa các Agent, lưu trữ dữ liệu và đồng bộ Feed. |
| **Hệ thống AI Multi-Agent (4 Agents)** | • **Agent 1 (Quản trò):** Phân tích GPS, tìm Places, sáng tác mật thư.<br>• **Agent 2 (Giám định):** Phân tích Vision, phát hiện gian lận, xuất JSON mở khóa.<br>• **Agent 3 (Kể chuyện):** Tạo Gen Z caption, đóng vai nhân vật lịch sử tương tác.<br>• **Agent 4 (Nhiệm vụ):** Thích ứng điều kiện mở khóa theo đặc thù địa lý. |

### 2.1. Cấu trúc tổ chức dữ liệu nhóm bạn

- Cấu trúc: **Tài khoản cá nhân ➔ Nhóm bạn bè thân thiết (Locket Circle) ➔ Album Dòng Thời Gian của Nhóm/Cá nhân**.
- Feed bài đăng được chia sẻ riêng tư trong phạm vi nhóm bạn thân (mặc định 2 – 10 thành viên), đảm bảo tính riêng tư và gần gũi đúng tinh thần Locket.
- Dòng thời gian hiển thị tiến độ mở khóa chung của cả nhóm: Mỗi khi một thành viên mở khóa thành công một mốc lịch sử, ô tương ứng trong Album sẽ sáng đèn cho tất cả các thành viên trong nhóm.

---

## 3. KIẾN TRÚC VÀ PHÂN CHIA XỬ LÝ

```text
┌────────────────────────────────────────────────────────┐
│                   MOBILE CLIENT                        │
│          (Flutter / React Native UI)                   │
│  - Màn hình Album Pokedex Lịch Sử                      │
│  - Màn hình Cuộn Mật Thư (Clue Sheet)                  │
│  - Màn hình Live Camera 1:1 & Bộ lọc Anti-spoof        │
│  - Màn hình Locket Social Feed & Reaction              │
│  - Bảng điều khiển Mock Location (Demo Switch)         │
└───────────────┬────────────────────────▲───────────────┘
                │                        │
        HTTPS (Multipart/JSON)       JSON Streams
                │                        │
┌───────────────▼────────────────────────┴───────────────┐
│              BACKEND API GATEWAY                       │
│        (FastAPI / ExpressJS on Cloud Run)              │
│  - Auth & Nhóm bạn       - Quản lý trạng thái Album    │
│  - Điều phối Pipeline    - Image Upload & Storage      │
└───────────────────────┬────────────────────────────────┘
                        │
       Orchestration / Function Calling
                        │
┌───────────────────────▼────────────────────────────────┐
│             HỆ THỐNG MULTI-AGENT BACKEND               │
│                                                        │
│  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │ Agent 1: Quản Trò      │  │ Agent 2: Giám Định   │  │
│  │ - Google Places API    │  │ - Gemini 2.5 Flash   │  │
│  │ - Gemini Clue Prompt   │  │   Multimodal Vision  │  │
│  │ - Thích ứng độ khó     │  │ - Anti-screen check  │  │
│  └────────────────────────┘  │ - Structured Outputs │  │
│                              └──────────────────────┘  │
│  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │ Agent 3: Người Kể      │  │ Agent 4: Kiến Trúc   │  │
│  │ - Gen Z Caption Funfact│  │   Sư Nhiệm Vụ        │  │
│  │ - Persona Roleplay     │  │ - Thích ứng địa lý   │  │
│  │   Comment Generator    │  │ - Kích hoạt Co-op    │  │
│  └────────────────────────┘  └──────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

- **Backend Cloud Run:** Đóng vai trò là trung tâm điều phối không lưu trạng thái (Stateless), tự động mở rộng theo lưu lượng, xử lý nén ảnh trước khi gửi vào Gemini API để tối ưu thời gian phản hồi.
- **Tối ưu hóa độ trễ (Latency):** Agent 1 và Agent 2 được ưu tiên cấu hình `gemini-2.5-flash` hoặc `gemini-1.5-flash` để đảm bảo thời gian trả về mật thư và thẩm định ảnh dưới **3 giây**.
- **Kênh lưu trữ:** Hình ảnh được tải lên Google Cloud Storage (hoặc Firebase Storage), metadata được lưu trữ tại Firestore hoặc PostgreSQL.

---

## 4. ĐẶC TẢ NGHIỆP VỤ CHI TIẾT

### 4.0. Truy cập & Quản lý Nhóm bạn (Locket Circle)

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **ACC-01** | Khởi tạo & Đăng nhập | Hỗ trợ đăng nhập nhanh bằng Email/Mật khẩu hoặc Guest Mode cho ban giám khảo chấm thi. |
| **ACC-02** | Tạo / Tham gia Nhóm | Người dùng có thể tạo một nhóm mới (đặt tên nhóm, ví dụ: "Biệt Đội Săn Sử") hoặc nhập mã mời gồm 6 ký tự để tham gia nhóm có sẵn. |
| **ACC-03** | Chuyển đổi chế độ Mock Location | Cung cấp nút chuyển đổi (Toggle Switch) bí mật hoặc trong menu Cài đặt cho phép chọn tọa độ giả lập (Dinh Độc Lập, Bưu điện TP.HCM, Văn Miếu...) phục vụ demo chấm thi. |

---

### 4.1. Album Pokedex Lịch Sử (Non-linear Timeline Album)

Triết lý: **Không gian dẫn lối – Thời gian ghi nhận**.

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **ALB-01** | Hiển thị Album Lịch sử | Màn hình chính hiển thị danh sách các ô thời kỳ lịch sử Việt Nam (Cổ Đại, Lý - Trần, Hậu Lê, Triều Nguyễn, Cận Đại Pháp Thuộc, Đổi Mới/Hiện Đại). |
| **ALB-02** | Trạng thái Ô thời kỳ | Mỗi ô có 2 trạng thái: <br>• **Khóa (Locked):** Nền tối, icon ổ khóa, hiển thị số nhiệm vụ gợi ý có thể làm quanh khu vực.<br>• **Đã mở khóa (Unlocked):** Sáng đèn rực rỡ, hiển thị bức ảnh đẹp nhất do nhóm chụp, huy hiệu thời kỳ và điểm thưởng. |
| **ALB-03** | Khám phá phi tuyến tính | Người dùng có thể bấm vào **bất kỳ ô thời kỳ nào** để bắt đầu nhiệm vụ, không ép buộc phải mở khóa tuần tự từ thời Cổ Đại đến Hiện Đại. |
| **ALB-04** | Thanh tiến độ nhóm | Hiển thị tỷ lệ phần trăm hoàn thành Album thời gian của nhóm (ví dụ: `4/6 Thời kỳ đã giải mã - 66%`). |

---

### 4.2. Agent 1: Quản Trò Dẫn Đường & Sáng Tác Mật Thư (Location & Clues)

**Luồng nghiệp vụ:** Người dùng chọn ô thời kỳ ➔ Bấm `[ Nhận gợi ý ]` ➔ Gửi GPS ➔ Backend kích hoạt Agent 1 ➔ Quét Places ➔ Gemini sáng tác mật thư ➔ Hiển thị lên màn hình.

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **CLUE-01** | Quét di tích theo bán kính | Sử dụng Function Calling kết hợp Google Maps Places API quét các địa điểm loại `tourist_attraction`, `museum`, `place_of_worship` trong bán kính $1\text{ km} - 5\text{ km}$ khớp với thời kỳ đang chọn. |
| **CLUE-02** | Sáng tác mật thư cổ phong | Gemini đóng vai "Quản trò du hành thời gian", tạo câu đố ngắn gọn (dưới 60 từ) ẩn dụ về hướng đi, khoảng cách và đặc điểm kiến trúc đặc sắc của di tích. |
| **CLUE-03** | Thích ứng giảm độ khó | Hỗ trợ nút `[ Gợi ý dễ hơn ]`. Khi bấm, Agent 1 trả về manh mối trực diện hơn (tiết lộ tên đường hoặc chữ cái đầu của di tích). |
| **CLUE-04** | Chuyển tiếp Camera | Dưới mật thư có nút `[ Đã đến nơi - Mở Camera ]` dẫn thẳng sang màn hình chụp ảnh. |

---

### 4.3. Camera Chụp Ảnh Thực Tế & Chống Gian Lận (Smart Camera)

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **CAM-01** | Khung ngắm chuẩn Locket | Giao diện Camera tối giản tỉ lệ $1:1$ góc bo tròn, hiển thị mốc thời kỳ đang cần săn tìm ở cạnh trên. |
| **CAM-02** | Bắt buộc chụp trực tiếp | Chặn tính năng chọn ảnh từ thư viện ảnh (Photo Library) trên điện thoại nhằm ngăn người dùng lấy ảnh tải sẵn trên mạng. |
| **CAM-03** | Đính kèm siêu dữ liệu | Mỗi bức ảnh khi bấm chụp sẽ tự động đính kèm tọa độ GPS thực tế (hoặc Mock Location) và dấu thời gian (Timestamp). |
| **CAM-04** | Hiệu ứng quét kiểm duyệt | Sau khi bấm `[ Giám định & Mở khóa ]`, giao diện hiển thị hoạt ảnh tia quét laser (Scanner Effect) trong khi chờ Backend xử lý. |

---

### 4.4. Agent 2: Giám Định Viên Thị Giác & Mở Khóa (Vision Verification)

**Luồng xử lý 3 bước của Agent 2:**

```text
[Nhận Ảnh + GPS + Era]
         │
         ▼
[Bước 1: Anti-Spoofing Check] ──(Gian lận)──► Báo lỗi: "Ảnh chụp màn hình/sách báo!"
         │ (Hợp lệ)
         ▼
[Bước 2: Landmark Identification & Era Matching]
         │
         ▼
[Bước 3: Structured JSON Output] ───────────► Mở khóa Ô Thời Kỳ + Cộng điểm
```

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **VER-01** | Kiểm tra Anti-spoofing | Gemini Vision kiểm tra vân lưới màn hình (Moiré pattern), viền bezel của màn hình thiết bị khác hoặc ánh sáng chói phản chiếu từ mặt kính để từ chối ảnh chụp lại từ màn hình máy tính/điện thoại. |
| **VER-02** | Nhận diện & Đối chiếu | Nhận dạng công trình/hiện vật trong ảnh dựa trên kiến trúc, bảng tên hoặc đối chiếu GPS; xác nhận công trình có thuộc thời kỳ lịch sử yêu cầu hay không. |
| **VER-03** | Xuất kết quả Structured JSON | Bắt buộc sử dụng tính năng Structured Outputs của Gemini (`response_mime_type: "application/json"`) trả về định dạng chuẩn: |

```json
{
  "is_valid": true,
  "confidence_score": 0.95,
  "detected_landmark": "Bưu điện Trung tâm Sài Gòn",
  "matched_era": "ERA_FRENCH_COLONIAL",
  "reject_reason": null,
  "xp_reward": 150
}
```

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **VER-04** | Phản hồi từ chối rõ ràng | Nếu không hợp lệ (chụp sai đối tượng, sai thời kỳ hoặc nghi ngờ gian lận), trả về lý do dễ hiểu để người dùng chụp lại. |

---

### 4.5. Agent 3: Người Kể Chuyện Locket & Tương Tác Mạng Xã Hội (Social Storytelling)

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **SOC-01** | Tạo Caption Gen Z & Fun Fact | Ngay khi mở khóa thành công, Agent 3 nhận tên di tích và tự động tạo 1 caption dí dỏm, bắt trend giới trẻ nhưng lồng ghép 1 sự thật lịch sử thú vị (dưới 30 từ). |
| **SOC-02** | Đóng vai nhân vật bình luận | Agent 3 chọn một nhân vật lịch sử tiêu biểu của thời kỳ đó (ví dụ: Vua Quang Trung, Nam Phương Hoàng Hậu, Toàn quyền Paul Doumer...) để tự động để lại bình luận đầu tiên dưới bức ảnh. |
| **SOC-03** | Bắn ảnh lên Feed nhóm | Bức ảnh kèm caption và bình luận được đồng bộ ngay lập tức lên bảng tin Feed của tất cả bạn bè trong nhóm. |
| **SOC-04** | Thả cảm xúc & Tương tác | Bạn bè có thể thả reaction nhanh (🔥, ❤️, 😮, 👏) và để lại bình luận trò chuyện dưới bức ảnh. |

---

### 4.6. Agent 4: Kiến Trúc Sư Nhiệm Vụ & Thích Ứng Địa Lý (Adaptive Gamification)

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **ADAP-01** | Phát hiện khu vực thiếu di tích | Nếu vị trí hiện tại của người dùng không có công trình kiến trúc nào của thời kỳ đang chọn trong bán kính $10\text{ km}$, Agent 4 sẽ tự động can thiệp. |
| **ADAP-02** | Chuyển đổi chuẩn mở khóa | Đổi yêu cầu mở khóa sang dạng khả thi hơn: *"Chụp một hiện vật trong bảo tàng gần nhất"*, hoặc *"Chụp họa tiết hoa văn truyền thống / bìa sách lịch sử liên quan"*. |
| **ADAP-03** | Kích hoạt Co-op Quest | Cho phép gửi lời mời thử thách đến bạn bè trong nhóm đang sống ở thành phố có di tích đó để mở khóa chung cho cả nhóm. |

---

## 5. DỮ LIỆU VÀ ĐỒNG BỘ

### 5.1. Các đối tượng dữ liệu chính (Data Schema)

| Thực thể | Thuộc tính tối thiểu |
| :--- | :--- |
| **User** | `user_id`, `email`, `display_name`, `avatar_url`, `total_xp`, `group_id` |
| **LocketGroup** | `group_id`, `group_name`, `invite_code`, `created_at`, `members[]` |
| **HistoricalEra** | `era_id`, `era_name`, `time_range`, `description`, `badge_icon_url` |
| **AlbumProgress** | `progress_id`, `group_id`, `era_id`, `is_unlocked`, `unlocked_by_user_id`, `unlocked_at`, `photo_url`, `landmark_name` |
| **FeedMoment** | `moment_id`, `group_id`, `author_id`, `photo_url`, `caption`, `historical_fun_fact`, `ai_persona_comment`, `reactions[]`, `created_at` |

### 5.2. Luồng gọi API & Xử lý bất đồng bộ

1. **API Nhận gợi ý (`POST /api/v1/clues/generate`):**
   - Payload: `{ "latitude": float, "longitude": float, "era_id": string, "hint_level": int }`
   - Phản hồi: `{ "clue_text": string, "distance_estimate": string, "direction": string }`
2. **API Giám định ảnh (`POST /api/v1/verification/verify`):**
   - Payload: `multipart/form-data` gồm file ảnh, GPS, `era_id`.
   - Backend gọi pipeline Gemini Vision ➔ trả về JSON kết quả thẩm định.
3. **API Xuất bản Moment (`POST /api/v1/feed/moments`):**
   - Lưu trữ bài đăng và thông báo đến các client khác trong cùng nhóm.

---

## 6. YÊU CẦU PHI CHỨC NĂNG

### 6.1. Hiệu năng & Tốc độ phản hồi AI

- **Độ trễ thẩm định ảnh (Vision Latency):** Thời gian từ lúc người dùng bấm nút giám định đến khi nhận kết quả trên màn hình không vượt quá **$3.5\text{ giây}$** (trong điều kiện mạng 4G/WiFi thông thường).
- **Độ trễ sinh mật thư:** Thời gian gọi Function Calling Places API và sinh văn bản câu đố không vượt quá **$2.5\text{ giây}$**.
- **Kích thước ảnh:** Client tự động nén kích thước ảnh (độ phân giải tối đa $1080 \times 1080$, dung lượng dưới $800\text{ KB}$) trước khi gửi lên Backend nhằm tiết kiệm băng thông và tăng tốc độ xử lý của Gemini API.

### 6.2. Tính ổn định & Chế độ Demo Sân Khấu (Hackathon-ready)

- **Mock Location Switch:** Ứng dụng phải có cơ chế nạp sẵn danh sách 5 địa danh di tích nổi bật kèm tọa độ chuẩn (ví dụ: Dinh Độc Lập, Bưu điện Sài Gòn, Văn Miếu Quốc Tử Giám, Chùa Một Cột, Cố Đô Huế). Khi bật Mock Mode, toàn bộ hệ sinh thái Agent xử lý như thể thiết bị đang đứng tại địa danh đó.
- **Dự phòng lỗi (Fallback):** Nếu Google Places API bị nghẽn hoặc hết hạn ngạch (quota), Agent 1 tự động sử dụng danh mục di tích mẫu đã lưu trong database nội bộ để tiếp tục sinh mật thư.

### 6.3. Bảo mật & Bản quyền hình ảnh

- Ảnh của người dùng chỉ được lưu hành trong phạm vi nhóm bạn đã tham gia.
- Không thu thập thông tin vị trí chạy ngầm liên tục khi người dùng không mở màn hình tính năng tìm kiếm di tích.

---

## 7. KỊCH BẢN KIỂM THỬ & NGHIỆM THU NGHIỆP VỤ (ACCEPTANCE CRITERIA)

| Mã | Tình huống kiểm thử | Kết quả mong đợi |
| :--- | :--- | :--- |
| **AC-01** | Bấm vào một ô thời kỳ bất kỳ trong Album | Hộp thoại nhiệm vụ mở ra, hiển thị thông tin thời kỳ và nút xin gợi ý mà không bị chặn bởi thứ tự. |
| **AC-02** | Bấm xin gợi ý tại vị trí hợp lệ | Nhận được mật thư mang giọng điệu cổ xưa dẫn đường đến di tích gần nhất trong vòng dưới 3 giây. |
| **AC-03** | Bấm nút "Gợi ý dễ hơn" | Mật thư được cập nhật với nội dung gợi mở chi tiết hơn (tiết lộ đặc điểm rõ ràng hoặc tên đường). |
| **AC-04** | Chụp đúng di tích thực tế ngoài đời | Agent 2 xác thực thành công, trả về trạng thái `is_valid: true`, ô thời kỳ sáng đèn, nổ hiệu ứng confetti chúc mừng. |
| **AC-05** | Chụp màn hình máy tính/điện thoại khác để gian lận | Agent 2 phát hiện vân màn hình/viền thiết bị, từ chối mở khóa và hiển thị thông báo nhắc nhở chụp thực tế. |
| **AC-06** | Chụp sai địa danh hoặc sai thời kỳ | Agent 2 thông báo không khớp thời kỳ và giải thích ngắn gọn công trình trong ảnh thuộc giai đoạn nào. |
| **AC-07** | Đăng tải khoảnh khắc sau mở khóa | Bức ảnh tự động có caption Gen Z kèm fun fact và bình luận roleplay của nhân vật lịch sử, xuất hiện ngay trên Feed nhóm. |
| **AC-08** | Bạn bè trong nhóm mở Feed | Nhìn thấy bài đăng mới của bạn mình, có thể bấm thả tim/lửa và thấy tiến độ Album của nhóm được cập nhật. |
| **AC-09** | Kích hoạt Mock Location tại hội trường thi | App giả lập vị trí tại di tích chỉ định, toàn bộ luồng gợi ý và xác thực hoạt động trơn tru như đang ở thực địa. |

---

## 8. LỘ TRÌNH TRIỂN KHAI CHO ĐỘI THI (HACKATHON ROADMAP)

```text
┌─────────────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 1: THIẾT LẬP NỀN TẢNG & CORE AGENT PIPELINE      │
│ (Mốc 0h - 12h)                                              │
│ - Dựng khung UI Flutter (Timeline Album, Camera 1:1, Feed)  │
│ - Dựng FastAPI Backend trên Docker & deploy Cloud Run       │
│ - Viết Prompt & Structured Output cho Agent 1 & Agent 2     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ GIAI ĐOẠN 2: TÍCH HỢP TÍNH NĂNG & LUỒNG LOCKET HOÀN CHỈNH   │
│ (Mốc 12h - 28h)                                             │
│ - Kết nối Camera Mobile với Backend API thẩm định           │
│ - Tích hợp Agent 3 (Caption & Persona Comment) lên Feed     │
│ - Hoàn thiện cơ chế Album sáng đèn & đếm điểm XP            │
│ - Tích hợp Mock Location Selector phục vụ demo              │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ GIAI ĐOẠN 3: KIỂM THỬ, ĐÁNH GIÁ & CHUẨN BỊ PITCHING         │
│ (Mốc 28h - 36h)                                             │
│ - Test kịch bản Anti-spoofing và kiểm thử độ trễ API        │
│ - Chụp sẵn bộ ảnh test chất lượng cao của 5 di tích         │
│ - Quay video backup kịch bản Demo hoàn hảo (Golden Path)    │
│ - Hoàn thiện Slide thuyết trình bám sát 5 tiêu chí GDG      │
└─────────────────────────────────────────────────────────────┘
```

---
*Tài liệu đặc tả này là cơ sở kỹ thuật chính thức để phân chia công việc trong nhóm và đối chiếu tính năng trong suốt kỳ thi Mini Hackathon GDG 2026.*
