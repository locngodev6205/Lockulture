# ĐẶC TẢ THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX SPECIFICATION)
## DỰ ÁN LOCKULTURE – THÀNH PHỐ ĐÀ NẴNG

- **Mã tài liệu:** UI-SPEC-LOCKULTURE-2026.
- **Phiên bản:** 1.0 — ngày 09/11/2026.
- **Trạng thái:** Bản phác thảo nền tảng phục vụ thảo luận chi tiết giữa Mobile Dev, Designer và Product Lead.

---

## 1. TRIẾT LÝ THIẾT KẾ & ĐỊNH HƯỚNG THỊ GIÁC

### 1.1. Phong cách chủ đạo: "Cổ Phong Đương Đại" (Modern Heritage)
* Kết hợp giữa **tính tối giản, thời thượng của mạng xã hội Gen Z (Locket/BeReal)** với **nét huyền bí, uy nghiêm của di sản lịch sử Việt Nam**.
* Sử dụng tông nền tối thời thượng (Dark Mode First) để làm nổi bật hình ảnh màu sắc của các di tích và các hiệu ứng phát sáng (Glow Effects) khi mở khóa thành công.

### 1.2. Bảng Màu Hệ Thống (Color Palette)

| Màu sắc | Mã Hex | Ý nghĩa & Vị trí sử dụng |
| :--- | :--- | :--- |
| **Obsidian Dark** | `#0B0F19` | Màu nền chính toàn ứng dụng (Background chính). |
| **Surface Dark** | `#1E293B` | Nền thẻ bài, Bottom Sheet Modal, thanh điều hướng. |
| **Imperial Gold** | `#F59E0B` | Màu nhấn thương hiệu (Châu bản, viền thẻ bài đã mở, icon mở khóa, nút Camera). |
| **Crimson Heritage** | `#E11D48` | Màu cảnh báo gian lận Anti-Spoofing, icon lửa reaction. |
| **Jade Green** | `#10B981` | Trạng thái xác thực thành công, điểm kinh nghiệm XP. |
| **Text Primary** | `#F8FAFC` | Chữ chính trên nền tối (độ tương phản cao). |
| **Text Muted** | `#94A3B8` | Chữ phụ, ngày giờ, thông tin mô tả chi tiết. |

### 1.3. Kiểu chữ (Typography)
* **Font chính:** `Be Vietnam Pro` hoặc `Plus Jakarta Sans` (Hỗ trợ tiếng Việt 100%, nét chữ hiện đại, hình học bo tròn trẻ trung).

---

## 2. KIẾN TRÚC MÀN HÌNH & BỐ CỤC CHÍNH (UI WIREFRAMES)

```text
┌─────────────────────────────────────────────────────────────┐
│                    ĐIỀU HƯỚNG CHÍNH (3 TABS)                │
│                                                             │
│  [ 📜 Album Sử Việt ]    [ 📸 Camera Săn Tìm ]   [ 👥 Feed Bạn Bè ]  │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.1. Màn hình 1: Album Pokedex Dòng Thời Gian Lịch Sử Việt Nam (Showcase Đà Nẵng)
* **Mục tiêu:** Cho phép người dùng theo dõi tiến trình mở khóa toàn bộ các thời kỳ lịch sử của Việt Nam (với dữ liệu địa phương hóa sâu sắc tại Đà Nẵng khi thi Hackathon).
* **Bố cục:**
  - *Phần đầu (Header):* 
    - Bộ lọc/Nhãn khu vực: `📍 Khu vực: Đà Nẵng (Đang kích hoạt)`.
    - Thanh tiến độ: `Đã mở khóa: 4/6 Kỷ nguyên Lịch Sử (66%)`.
    - Danh hiệu hiện tại: `Lữ Khách Sông Hàn ⭐⭐⭐`.
    - Nút `[ 🧭 Bản đồ / Danh sách ]`: Chuyển đổi giữa chế độ xem Thẻ bài và Bản đồ kho báu.
    - Nút `[ ⚙️ Mock Mode ]`: Nút bí mật mở menu chọn vị trí giả lập cho giám khảo.
  - *Phần thân (Body):*
    - Danh sách cuộn dọc 6 Kỷ nguyên lớn của Lịch Sử Việt Nam:
      - **Thẻ Đang Khóa (Locked Card):** Nền tối, icon ổ khóa vàng, nhãn mờ `? - Chưa khám phá`. Bấm vào sẽ mở **Modal Mật Thư (Agent 1)** hướng dẫn di tích quanh vị trí người dùng.
      - **Thẻ Đã Mở Khóa (Unlocked Card):** Viền sáng màu vàng hoàng kim, hiển thị bức ảnh đẹp nhất do nhóm chụp, tên di tích (ví dụ: *Cầu Rồng Đà Nẵng*), huy hiệu thời kỳ và điểm thưởng XP.

---

### 2.2. Màn hình 2: Hộp Thoại Cuộn Mật Thư (Agent 1 Clue Modal)
* **Hiệu ứng:** Trượt từ dưới lên (Bottom Sheet Modal) với kết cấu giấy cuộn cổ phong cách điệu.
* **Các thành phần:**
  - Tiêu đề: `📜 Mật Thư Từ Quản Trò Thời Gian`.
  - Hộp văn bản cổ: Chứa câu đố gợi ý (ví dụ: *"Tìm về nơi con rồng thép vươn mình qua dòng nước biếc..."*).
  - Ước tính khoảng cách: `📍 Cách bạn khoảng 200m`.
  - Hàng nút hành động:
    - Nút `[ 💡 Gợi ý dễ hơn ]`: Agent 1 tiết lộ tên đường hoặc đặc điểm chi tiết hơn.
    - Nút `[ 📸 Đã tới nơi - Mở Camera ]`: Chuyển thẳng sang khung ngắm chụp ảnh.

---

### 2.3. Màn hình 3: Smart Camera 1:1 & Hoạt Ảnh Giám Định (Agent 2)
* **Khung ngắm:** Tỉ lệ $1:1$ vuông góc bo tròn ở chính giữa màn hình (chuẩn phong cách Locket Widget).
* **Nút chụp:** Vòng tròn lớn màu vàng hoàng kim ở giữa cạnh đáy.
* **Hoạt ảnh quét Laser (Scanning Animation):**
  - Khi người dùng bấm chụp, bức ảnh dừng lại.
  - Một đường quét laser màu vàng xanh (Green/Gold Laser) quét dọc lên xuống qua bức ảnh kèm dòng chữ: *"Agent 2 đang giám định cổ vật & kiểm tra chống gian lận..."*.
* **Kết quả mở khóa:**
  - *Nếu hợp lệ:* Nổ pháo hoa Confetti, biểu tượng ổ khóa vỡ tung, hiện điểm thưởng `+150 XP`.
  - *Nếu gian lận (chụp màn hình):* Viền khung ảnh đổi sang màu đỏ Crimson, rung nhẹ haptic feedback, hiện thông báo: *"Phát hiện vân sọc màn hình! Hãy chụp ngoài đời thực nhé!"*.

---

### 2.4. Màn hình 4: Bảng Tin Locket Bạn Bè (Social Feed Screen)
* **Bố cục cuộn dọc:** Mỗi bài đăng là một khung ảnh vuông bo góc tròn lớn.
* **Chi tiết một bài đăng:**
  - *Header:* Avatar người chụp + Tên (ví dụ: Nam) + Tên di tích (Cầu Rồng) + Thời gian chụp.
  - *Khung ảnh 1:1:* Bức ảnh do chính bạn bè chụp thực tế tại di tích.
  - *Caption Bar (Kép):*
    - Dòng chữ bắt trend Gen Z kèm sự thật lịch sử (do Agent 3 tạo hoặc do người dùng tự sửa).
  - *Persona Comment Box (Điểm nhấn):*
    - Khung bình luận ghim đầu tiên với icon đền đài `🏛️`:  
      **Thần Rồng Sông Hàn:** *"Khá khen cho lữ khách trẻ! Hãy mang khí thế rồng vàng bay cao trên con đường tri thức!"*
  - *Tương tác nhóm:* Hàng nút reaction nhanh `[ 🔥 ] [ ❤️ ] [ 👑 ] [ 👏 ]` để thả cảm xúc tức thì.

---

### 2.5. Màn hình 5: Bảng Điều Khiển Mock Location (Dành Cho Ban Giám Khảo)
* Nút ẩn trên thanh công cụ cho phép mở một danh sách xổ xuống:
  - `🔘 1. Cầu Rồng Đà Nẵng (Thời kỳ Đổi Mới - Trọng tâm Demo)`
  - `🔘 2. Thành Điện Hải (Thời kỳ Triều Nguyễn & Kháng Pháp)`
  - `🔘 3. Bảo tàng Điêu khắc Chăm (Thời kỳ Cổ đại Chăm Pa)`
  - `🔘 4. Nhà thờ Con Gà (Thời kỳ Pháp thuộc)`
  - `🔘 5. Danh thắng Ngũ Hành Sơn (Thời kỳ Mở cõi)`
* Khi bấm chọn một địa điểm, toàn bộ GPS trên máy lập tức trỏ về địa điểm đó, cho phép giám khảo trải nghiệm trọn vẹn luồng app tại chỗ.

---

## 3. CÁC CÂU HỎI & VẤN ĐỀ MỞ ĐỂ THẢO LUẬN TIẾP THEO

Tài liệu này mở ra các hướng để nhóm tiếp tục trao đổi chi tiết:
1. **Lựa chọn Bản đồ:** Trong chế độ xem bản đồ kho báu, nhóm muốn dùng Google Maps SDK chính thức hay dùng bản đồ minh họa vector tĩnh của Đà Nẵng để giảm dung lượng app?
2. **Hiệu ứng âm thanh:** Có nên tích hợp âm thanh xúc giác (Sound FX) như tiếng "Ting" mở khóa, tiếng pháo giấy nổ và tiếng nước chảy/rồng gầm khi mở khóa Cầu Rồng không?
3. **Màu sắc thẻ bài từng thời kỳ:** Mỗi thời kỳ trong 5 thời kỳ có nên có một dải màu riêng biệt (ví dụ: Chăm Pa màu đất nung sa thạch, Triều Nguyễn màu vàng đồng, Kháng chiến màu xanh quân phục, Đổi mới màu xanh neon) để dễ phân biệt không?
