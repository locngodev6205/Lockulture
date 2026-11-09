# ĐẶC TẢ YÊU CẦU & NGHIỆP VỤ HỆ THỐNG

## LOCKULTURE (TIME TRAVELER’S LOCKET) – KHÁM PHÁ LỊCH SỬ & VĂN HÓA QUA LĂNG KÍNH THỰC TẾ
### ĐỊA BÀN TRỌNG TÂM: THÀNH PHỐ ĐÀ NẴNG (PILOT CITY)

- **Mã dự án:** LOCKULTURE-GDG2026.
- **Phiên bản đặc tả:** 2.1 — ngày 09/11/2026.
- **Chủ đề cuộc thi:** Mini Hackathon GDG 2026 – DevFest *"Learn Beyond Limits"*.
- **Trạng thái:** Đặc tả nghiệp vụ chuẩn hóa phục vụ triển khai MVP trong kỳ thi Hackathon và định hướng mở rộng sản phẩm. Hệ thống áp dụng triết lý thiết kế **"Không gian dẫn lối – Thời gian ghi nhận" (Location-First, Timeline-Organized)** kết hợp kiến trúc **Multi-Agent trên Google Cloud Run & Gemini API** và **Đồng bộ thời gian thực qua Firebase**.

---

## 1. TỔNG QUAN VÀ PHẠM VI

### 1.1. Mục tiêu

Xây dựng ứng dụng di động kết hợp cơ chế chia sẻ ảnh tức thời kiểu Locket/BeReal với yếu tố trò chơi hóa (Gamification) và hệ sinh thái đa tác tử (Multi-Agent System). Ứng dụng biến việc tìm hiểu lịch sử, văn hóa từ những bài học lý thuyết khô khan thành hành trình khám phá, săn lùng di tích thực tế ngoài đời sống dành cho giới trẻ (Gen Z).

Các mục tiêu nghiệp vụ chính:
1. **Dòng thời gian & Bộ sưu tập Album Pokedex (Địa bàn Đà Nẵng):** Cung cấp bộ sưu tập các mốc lịch sử/văn hóa đa dạng của Đà Nẵng (từ Cổ đại Chăm Pa, Triều Nguyễn chống Pháp, Thời Cận đại Pháp thuộc đến Đổi mới - Cầu Rồng). Cho phép mở khóa phi tuyến tính: người dùng ở bất kỳ đâu đều có thể khám phá di tích xung quanh mình để lấp đầy album.
2. **Quản trò dẫn đường & Mật thư AI (Agent 1):** Tự động định vị GPS, quét di tích quanh người dùng qua Google Maps Places API và dùng Gemini API sáng tác mật thư, câu đố dẫn đường phong cách cổ xưa (hỗ trợ nhiều nấc gợi ý giảm độ khó).
3. **Giám định thị giác máy tính & Chống gian lận 3 lớp (Agent 2):** Xác thực ảnh chụp thực tế bằng Gemini Multimodal Vision kết hợp 3 lớp bảo vệ: Bắt buộc Live Camera + Bán kính GPS quanh di tích Đà Nẵng + Phân tích vân màn hình/viền thiết bị (Anti-spoofing), xuất kết quả chuẩn hóa JSON.
4. **Chia sẻ tức thời & Persona Kể chuyện (Agent 3):** Tự động hóa tạo caption Gen Z bắt trend kèm sự thật lịch sử (fun fact) và phân vai nhân vật lịch sử Đà Nẵng tương tác bình luận đầu tiên dưới ảnh; đồng thời hỗ trợ chế độ cho phép người dùng tùy chỉnh/tự viết cảm nghĩ cá nhân trước khi bắn lên Feed bạn bè.
5. **Đồng bộ Thời Gian Thực (Firebase Realtime):** Sử dụng Firebase Firestore & Cloud Storage để đồng bộ ảnh và bài đăng tức thời giữa các thành viên trong nhóm bạn.
6. **Thích ứng nhiệm vụ địa phương & Co-op (Agent 4):** Điều chỉnh linh hoạt yêu cầu mở khóa (chụp công trình ➔ chụp hiện vật bảo tàng/hoa văn truyền thống) hoặc hỗ trợ mở khóa chéo giữa bạn bè ở các khu vực khác nhau.

### 1.2. Bối cảnh sử dụng & Địa bàn trọng tâm

- **Thành phố trọng tâm (Pilot City):** **Thành phố Đà Nẵng** – vùng đất giao thoa văn hóa Chăm Pa cổ đại, phòng tuyến kháng chiến triều Nguyễn (Thành Điện Hải), dấu ấn đô thị cận đại và biểu tượng đổi mới năng động (Cầu Rồng, Cầu Sông Hàn).
- **Điểm nhấn kịch bản Demo (The Golden Path):** Trọng tâm vào **Cầu Rồng (Biểu tượng thời kỳ Đổi Mới)**:
  - *Màn 1:* Mở khóa thành công Cầu Rồng + Nổ pháo hoa + Thần Rồng Sông Hàn bình luận.
  - *Màn 2:* Cố tình chụp lại ảnh Cầu Rồng qua màn hình điện thoại khác để biểu diễn tính năng Anti-Spoofing từ chối gian lận.
- **Đối tượng người dùng chính:** Giới trẻ, học sinh, sinh viên, nhóm bạn thân yêu thích chụp ảnh check-in (Locket lover), du khách đến Đà Nẵng.
- **Quy mô đội thi Hackathon:** Nhóm 3 thành viên (Mobile Lead – AI/Backend Lead – Product/Pitch Lead).

### 1.3. Phân định phạm vi

| Trong phạm vi MVP Hackathon (Bắt buộc hoàn thiện) | Ngoài phạm vi MVP / Kế hoạch mở rộng (Roadmap) |
| :--- | :--- |
| Nền tảng ứng dụng di động Flutter (Android/iOS) | Ứng dụng web đa nền tảng PWA; desktop app |
| Bộ dữ liệu mẫu phong phú các di tích lịch sử - văn hóa tại Đà Nẵng | Mở rộng tự động toàn bộ 63 tỉnh thành cả nước |
| Chế độ Mock Location Switch hỗ trợ demo sân khấu tại hội trường | Dẫn đường chỉ báo Turn-by-Turn GPS kiểu Google Maps Navigation |
| Sáng tác mật thư câu đố bằng Gemini API theo độ khó thích ứng | Hệ thống giọng nói AI Voice tương tác 2 chiều liên tục |
| Chống gian lận 3 lớp (Live Camera + GPS Proximity + Gemini Moiré Detection) | Huấn luyện mô hình Computer Vision biên riêng biệt (Edge CV) chạy offline |
| Cơ chế đăng bài kép: Tự động hóa hoàn toàn HOẶC người dùng tự viết caption | Công cụ chỉnh sửa ảnh chuyên nghiệp (bộ lọc màu Lightroom phức tạp) |
| Đồng bộ bài đăng Locket Feed theo thời gian thực qua Firebase | Widget màn hình chính hệ điều hành (Native iOS WidgetKit / Android AppWidget) |

---

## 2. VAI TRÒ VÀ TRÁCH NHIỆM

| Vai trò | Trách nhiệm & Quyền hạn |
| :--- | :--- |
| **Người dùng (Lữ khách thời gian)** | Tạo tài khoản, tạo/tham gia nhóm bạn, nhận mật thư, đi đến thực địa, chụp ảnh mở khóa, chọn tự động hoặc tự viết bài đăng, thả cảm xúc và bình luận trên feed. |
| **Bạn bè trong nhóm (Cộng sự)** | Nhận ảnh mở khóa trên Feed theo thời gian thực, cùng đóng góp vào tiến độ hoàn thành Album thời gian của nhóm, hỗ trợ mở khóa Co-op. |
| **Ban giám khảo / Giám định viên** | Được cung cấp tài khoản thử nghiệm kèm tính năng Mock Location để chấm thi trực tiếp mọi kịch bản di tích Đà Nẵng mà không cần rời hội trường. |
| **Backend & Điều phối Multi-Agent (FastAPI on Cloud Run)** | Quản lý logic nghiệp vụ, điều phối 4 Agents, gọi Gemini API và Google Maps Places API. |
| **Hạ tầng Dữ liệu Realtime (Firebase Firestore & Storage)** | Lưu trữ ảnh chứng tích, đồng bộ stream bài đăng và tiến độ Album Pokedex thời gian thực đến toàn bộ thiết bị trong nhóm. |

---

## 3. BỘ DỮ LIỆU DI TÍCH ĐÀ NẴNG (DANANG HISTORICAL DATASET)

Hệ thống xây dựng sẵn danh mục di tích phong phú đại diện cho các thời kỳ lịch sử - văn hóa tại Đà Nẵng:

| STT | Mốc Thời Kỳ | Di Tích / Địa Danh Tiêu Biểu | Tọa Độ Mẫu (GPS Mock) | Nhân Vật Persona (Agent 3) |
| :---: | :--- | :--- | :---: | :--- |
| 1 | **Thời Cổ Đại & Chăm Pa** *(TK II - XV)* | **Bảo tàng Điêu khắc Chăm Đà Nẵng** | `16.0607, 108.2236` | Nữ thần Ánh sáng Chăm Pa / Nhà khảo cổ Henri Parmentier |
| 2 | **Thời Cổ Đại & Chăm Pa** *(TK II - XV)* | Phế tích Tháp Chăm Phong Lệ | `15.9982, 108.2045` | Cư dân Chăm Pa cổ |
| 3 | **Thời Mở Cõi & Tín Ngưỡng** *(TK XV - XVIII)* | **Danh thắng Ngũ Hành Sơn & Chùa Linh Ứng** | `16.0044, 108.2635` | Thiền sư Vạn Hạnh / Vua Minh Mạng |
| 4 | **Thời Mở Cõi & Tín Ngưỡng** *(TK XV - XVIII)* | Đình Làng Hải Châu | `16.0652, 108.2198` | Tiền hiền khai khẩn làng Hải Châu |
| 5 | **Triều Nguyễn & Kháng Pháp** *(TK XIX)* | **Thành Điện Hải (Phòng tuyến 1858)** | `16.0754, 108.2235` | Danh tướng Nguyễn Tri Phương |
| 6 | **Triều Nguyễn & Kháng Pháp** *(TK XIX)* | Hải Vân Quan ("Thiên hạ đệ nhất hùng quan") | `16.1972, 108.1317` | Quân tuần trấn đèo Hải Vân |
| 7 | **Thời Cận Đại & Pháp Thuộc** *(1888 - 1945)* | **Nhà thờ Chính tòa Đà Nẵng (Nhà thờ Con Gà)** | `16.0667, 108.2239` | Linh mục Louis Vallet (Khởi công 1923) |
| 8 | **Thời Cận Đại & Pháp Thuộc** *(1888 - 1945)* | Chợ Hàn & Thương cảng Tourane | `16.0683, 108.2244` | Tiểu thương Chợ Hàn xưa |
| 9 | **Kháng Chiến & Thống Nhất** *(1945 - 1975)* | **Bảo tàng Quân Khu 5 & Nhà sàn Bác Hồ** | `16.0494, 108.2177` | Chiến sĩ Giải phóng quân Đà Nẵng |
| 10 | **Kháng Chiến & Thống Nhất** *(1945 - 1975)* | Căn cứ Biệt động thành K20 | `16.0315, 108.2483` | Nữ biệt động thành K20 |
| 11 | **Đổi Mới & Hiện Đại** *(1997 - Nay)* | **CẦU RỒNG ĐÀ NẴNG (TRỌNG TÂM DEMO)** | `16.0611, 108.2274` | Thần Rồng Vàng Sông Hàn |
| 12 | **Đổi Mới & Hiện Đại** *(1997 - Nay)* | Cầu Quay Sông Hàn | `16.0722, 108.2275` | Kỹ sư trưởng Cầu Sông Hàn năm 2000 |

---

## 4. ĐẶC TẢ NGHIỆP VỤ CHI TIẾT

### 4.0. Quản lý Nhóm bạn (Locket Circle) & Chế độ Giám khảo (Judge Mode)

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **ACC-01** | Khởi tạo tài khoản & Nhóm | Hỗ trợ Guest Mode đăng nhập 1 chạm cho ban giám khảo và mã mời 6 ký tự để kết nối nhóm bạn thân. |
| **ACC-02** | Bảng điều khiển Mock Location Đà Nẵng | Cho phép giám khảo/người test chọn nhanh 1 trong 12 tọa độ di tích Đà Nẵng ở Bảng 3 để thử nghiệm trực tiếp tại chỗ. |

---

### 4.1. Album Pokedex Lịch Sử Đà Nẵng (Non-linear Timeline Album)

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **ALB-01** | Hiển thị Album Đà Nẵng | Màn hình chính hiển thị các ô thời kỳ lịch sử của Đà Nẵng. Ô chưa mở có icon ổ khóa và nền mờ; ô đã mở sáng đèn rực rỡ kèm ảnh chụp thực tế của nhóm. |
| **ALB-02** | Mở khóa Phi tuyến tính | Người chơi đến Cầu Rồng có thể mở khóa ngay mốc Hiện Đại mà không bắt buộc phải mở mốc Cổ đại Chăm Pa trước. |
| **ALB-03** | Thanh tiến độ nhóm | Hiển thị % hoàn thành Album Đà Nẵng của nhóm và danh hiệu thám hiểm (ví dụ: *Tập sự ➔ Nhà Khảo Cổ Sông Hàn ➔ Bậc Thầy Di Sản Đà Nẵng*). |

---

### 4.2. Agent 1: Quản Trò Dẫn Đường & Sáng Tác Mật Thư (Location & Clues)

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **CLUE-01** | Quét di tích Đà Nẵng theo GPS | Gọi Google Maps Places API tìm di tích quanh vị trí người dùng trong bán kính $1\text{ km} - 5\text{ km}$. |
| **CLUE-02** | Sáng tác Mật thư Cầu Rồng | Ví dụ với Cầu Rồng: *"Hỡi lữ khách! Hãy tìm về nơi con rồng thép khổng lồ vươn mình qua dòng nước biếc, nơi ngậm vầng dương và hướng mặt ra biển Đông..."*. |
| **CLUE-03** | Thích ứng giảm độ khó | Hỗ trợ nút `[ 💡 Gợi ý dễ hơn ]`. Khi bấm, Agent 1 trả về manh mối trực diện: *"Hãy đến đường Nguyễn Văn Linh nối dài, cây cầu phun lửa vào tối cuối tuần!"*. |

---

### 4.3. Camera Chụp Ảnh Thực Tế & Chống Gian Lận (Smart Camera)

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **CAM-01** | Khung ngắm 1:1 chuẩn Locket | Camera tỷ lệ $1:1$ góc tròn tối giản, chặn chọn ảnh từ thư viện thiết bị. |
| **CAM-02** | Đính kèm tọa độ cảm biến | Đính kèm tọa độ GPS thực tế hoặc Mock GPS và timestamp ngay khi bấm nút chụp. |
| **CAM-03** | Hiệu ứng quét kiểm duyệt | Hoạt ảnh tia laser quét dọc bức ảnh trong khi gửi sang Agent 2. |

---

### 4.4. Agent 2: Giám Định Thị Giác & Phòng Vệ 3 Lớp (Vision Verification)

**Cơ chế phòng vệ 3 lớp (3-layer Anti-spoofing Defense):**
1. **Lớp 1 (Client):** Bắt buộc chụp Live Camera, khóa nút nạp ảnh từ thư viện ảnh máy.
2. **Lớp 2 (Geofence):** Kiểm tra khoảng cách tọa độ GPS tới di tích mục tiêu (khoảng cách $\le 500\text{ m}$ hoặc bật Mock Mode).
3. **Lớp 3 (Vision AI):** Gemini 2.5 Flash phân tích ảnh chụp, kiểm tra vân Moiré (sọc màn hình LCD/OLED), viền màn hình thiết bị khác hoặc độ phản quang mặt kính.

**Hợp đồng Structured Outputs của Agent 2:**
```json
{
  "is_valid": true,
  "confidence_score": 0.98,
  "detected_landmark": "Cầu Rồng Đà Nẵng",
  "matched_era": "ERA_MODERN",
  "is_screen_spoof": false,
  "reject_reason": null,
  "xp_reward": 150
}
```

*Nếu phát hiện gian lận chụp lại qua màn hình điện thoại khác:*
```json
{
  "is_valid": false,
  "confidence_score": 0.25,
  "detected_landmark": "Hình ảnh Cầu Rồng hiển thị trên màn hình",
  "matched_era": null,
  "is_screen_spoof": true,
  "reject_reason": "Phát hiện vân sọc màn hình điện tử! Hãy ra bờ sông Hàn chụp Cầu Rồng thực tế nhé lữ khách!",
  "xp_reward": 0
}
```

---

### 4.5. Agent 3: Người Kể Chuyện & Tương Tác Kép (Social Storytelling)

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **SOC-01** | Tạo Caption Gen Z & Fun Fact | Ví dụ Cầu Rồng: *"Check-in Cầu Rồng phun lửa 🐉 Bạn có biết: Cầu Rồng nặng gần 9.000 tấn thép và có thể phun cả lửa lẫn nước trong 15 phút không?"*. |
| **SOC-02** | Persona Đà Nẵng bình luận | Persona "Thần Rồng Vàng Sông Hàn" tự động để lại bình luận đầu tiên: *"Khá khen cho lữ khách đã ghi lại khoảnh khắc ta vươn mình ra biển lớn!"*. |
| **SOC-03** | **Cơ chế Đăng bài kép (Dual-Mode Posting):** | • **Chế độ Tự động (Mặc định):** Bấm 1 nút đăng ngay lập tức với Caption và Persona do AI tạo.<br>• **Chế độ Tùy chỉnh:** Cho phép người dùng bấm `[ ✏️ Tự viết cảm nghĩ ]` để sửa lại caption theo phong cách riêng của mình hoặc chọn 1 trong 3 gợi ý khác của AI trước khi gửi. |
| **SOC-04** | Đồng bộ Feed Realtime qua Firebase | Bức ảnh ngay lập tức xuất hiện trên Feed của bạn bè mà không cần reload trang. |

---

### 4.6. Agent 4: Thích Ứng Nhiệm Vụ & Co-op (Adaptive Gamification)

| Mã | Tên yêu cầu | Mô tả chi tiết |
| :--- | :--- | :--- |
| **ADAP-01** | Thích ứng khi xa di tích | Nếu người dùng ở xa trung tâm Đà Nẵng, chuyển nhiệm vụ sang: *"Chụp chiếc cầu gần bạn nhất"* hoặc *"Chụp họa tiết chim thần Garuda/Chăm Pa trên sách/vật phẩm lưu niệm"*. |
| **ADAP-02** | Nhiệm vụ Co-op | Bạn bè tại Đà Nẵng chụp mở khóa Cầu Rồng thì bạn bè ở Hà Nội/Sài Gòn trong cùng nhóm cũng được sáng đèn trên Album chung. |

---

## 5. KỊCH BẢN DEMO "VÀNG" TRÊN SÂN KHẤU (THE GOLDEN PATH DEMO)

Kịch bản 3 phút được thiết kế chuẩn xác để gây ấn tượng mạnh với Ban Giám Khảo:

1. **Phút 0:00 - 0:45 (Mở đầu & Bài toán):** Trình bày vấn đề giới trẻ lười học lịch sử nhưng nghiện Locket check-in. Giới thiệu Lockulture.
2. **Phút 0:45 - 1:45 (Màn 1 – Mở khóa Cầu Rồng thành công):**
   - Mở app Flutter ➔ Vào Album Đà Nẵng ➔ Chọn ô "Thời Kỳ Đổi Mới".
   - Bật Mock Location "Cầu Rồng Đà Nẵng" ➔ Nhận mật thư từ Agent 1.
   - Bật Camera ➔ Chụp ảnh Cầu Rồng ➔ Tia laser quét ảnh (Agent 2 thẩm định).
   - Âm thanh Ting Ting, nổ Confetti ➔ Mở khóa thành công!
   - Hiện bài đăng với caption Gen Z + Bình luận của Thần Rồng Sông Hàn. Đẩy tức thì lên máy thứ 2 qua Firebase Realtime.
3. **Phút 1:45 - 2:30 (Màn 2 – Biểu diễn tính năng Anti-Spoofing):**
   - Giám khảo thường nghi ngờ: *"Nếu lấy điện thoại khác mở ảnh mạng rồi chụp lại thì sao?"*.
   - Người thuyết trình giơ một điện thoại phụ có ảnh Cầu Rồng tải trên Google, lấy app Lockulture chụp lại màn hình đó.
   - Tia laser quét ➔ Màn hình rung nhẹ, hiện thông báo đỏ:  
     👉 *"Phát hiện vân sọc màn hình điện tử! Hãy ra bờ sông Hàn chụp Cầu Rồng thực tế nhé lữ khách!"*.
   - **Ghi điểm tuyệt đối về tính bảo mật và kỹ thuật thực tế.**
4. **Phút 2:30 - 3:00 (Kiến trúc & Tương lai):** Chiếu slide kiến trúc Google Cloud Run + Multi-Agent Gemini 2.5 Flash. Kết thúc bài thi.
