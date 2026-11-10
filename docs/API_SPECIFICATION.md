# HỢP ĐỒNG GIAO TIẾP API (API SPECIFICATION)

> Cập nhật triển khai 10/11/2026 — `POST /verification/verify-photo` gọi Gemini thật, không còn trả thành công cố định. Multipart gồm `photo`, `target_era_id` và `target_landmark` (tên chính xác theo danh mục Đà Nẵng trong `backend/src/core/landmarks.py`). Latitude/longitude là tùy chọn, chưa dùng để geofence. Caller cũ chỉ gửi thời kỳ sẽ được chọn địa danh đầu tiên của thời kỳ đó. Ảnh tối đa 8 MB, 20 megapixel, định dạng JPEG/PNG/WebP; backend chuẩn hóa về JPEG tối đa 1080 px. Response theo `VerificationResult`, chưa có `badge_unlocked`. Chỉ cấp `xp_reward=150` khi khớp mục tiêu/thời kỳ, không phát hiện màn hình và điểm tin cậy ≥0.8; các kết quả bị từ chối có XP 0. Đây là đánh giá hình ảnh AI, chưa phải bằng chứng có mặt tại địa danh.
>
> Lỗi: 400 ảnh rỗng/hỏng; 413 quá dung lượng/kích thước; 415 định dạng không hỗ trợ; 422 địa danh/thời kỳ không hợp lệ; 429 quota Gemini; 503 chưa cấu hình key; 504 hết thời gian giám định; 502 lỗi dịch vụ hoặc response AI không hợp lệ. Khi lỗi dịch vụ không trả `is_valid=true`. Các mục draft/publish bên dưới vẫn là thiết kế, chưa triển khai.
### DỰ ÁN LOCKULTURE – ĐỊA BÀN ĐÀ NẴNG

- **Mã tài liệu:** API-SPEC-LOCKULTURE-DANANG-2026.
- **Phiên bản:** 2.1 — ngày 09/11/2026.
- **Base URL:** `https://api.lockulture.run.app/api/v1` (hoặc `http://localhost:8080/api/v1` khi chạy cục bộ).
- **Định dạng dữ liệu:** `application/json` (API upload ảnh dùng `multipart/form-data`).

---

## 1. MOCK LANDMARKS ĐÀ NẴNG (DEMO SÂN KHẤU)

### 1.1. Lấy danh sách di tích mẫu Đà Nẵng
* **Endpoint:** `GET /mock/landmarks`
* **Response (200 OK):**
  ```json
  {
    "city": "Đà Nẵng",
    "mock_sites": [
      {
        "site_id": "DN_DRAGON_BRIDGE",
        "site_name": "Cầu Rồng Đà Nẵng",
        "latitude": 16.0611,
        "longitude": 108.2274,
        "era_id": "ERA_MODERN",
        "era_name": "Thời Kỳ Đổi Mới & Hiện Đại",
        "persona_name": "Thần Rồng Vàng Sông Hàn"
      },
      {
        "site_id": "DN_DIEN_HAI_CITADEL",
        "site_name": "Thành Điện Hải (Phòng tuyến 1858)",
        "latitude": 16.0754,
        "longitude": 108.2235,
        "era_id": "ERA_NGUYEN",
        "era_name": "Thời Triều Nguyễn & Kháng Pháp",
        "persona_name": "Danh tướng Nguyễn Tri Phương"
      },
      {
        "site_id": "DN_CHAM_MUSEUM",
        "site_name": "Bảo tàng Điêu khắc Chăm Đà Nẵng",
        "latitude": 16.0607,
        "longitude": 108.2236,
        "era_id": "ERA_CHAMPA",
        "era_name": "Thời Cổ Đại & Chăm Pa",
        "persona_name": "Nữ thần Ánh sáng Chăm Pa"
      },
      {
        "site_id": "DN_ROOSTER_CHURCH",
        "site_name": "Nhà thờ Chính tòa Đà Nẵng (Nhà thờ Con Gà)",
        "latitude": 16.0667,
        "longitude": 108.2239,
        "era_id": "ERA_FRENCH_COLONIAL",
        "era_name": "Thời Cận Đại & Pháp Thuộc",
        "persona_name": "Linh mục Louis Vallet (1923)"
      }
    ]
  }
  ```

---

## 2. AGENT 1: MẬT THƯ CÂU ĐỐ (CLUE GENERATION)

### 2.1. Sinh mật thư dẫn đường đến di tích Đà Nẵng
* **Endpoint:** `POST /clues/generate`
* **Request:**
  ```json
  {
    "latitude": 16.0611,
    "longitude": 108.2274,
    "era_id": "ERA_MODERN",
    "hint_level": 1
  }
  ```
* **Response Thành công (200 OK):**
  ```json
  {
    "status": "SUCCESS",
    "target_landmark_type": "Cây cầu biểu tượng hiện đại",
    "estimated_distance_meters": 200,
    "clue_text": "Từ nơi ngươi đứng, hãy hướng mắt về phía dòng sông biếc. Có một con rồng vàng khổng lồ uốn lượn qua làn nước, ngậm vầng dương và hướng mặt ra biển Đông. Hãy đến đó!",
    "hint_level": 1,
    "is_easier_available": true
  }
  ```

### 2.2. Gợi ý dễ hơn (Hint Level 2)
* **Request:** `{ "latitude": 16.0611, "longitude": 108.2274, "era_id": "ERA_MODERN", "hint_level": 2 }`
* **Response (200 OK):**
  ```json
  {
    "status": "SUCCESS",
    "target_landmark_type": "Cầu Rồng Đà Nẵng",
    "estimated_distance_meters": 200,
    "clue_text": "Hãy tiến về đường Nguyễn Văn Linh nối dài qua sông Hàn. Đó chính là Cầu Rồng – cây cầu nặng gần 9.000 tấn thép có khả năng phun lửa!",
    "hint_level": 2,
    "is_easier_available": false
  }
  ```

---

## 3. AGENT 2: GIÁM ĐỊNH THỊ GIÁC & ANTI-SPOOFING (VERIFICATION)

### 3.1. Thẩm định ảnh chụp thực tế
* **Endpoint:** `POST /verification/verify-photo`
* **Content-Type:** `multipart/form-data`
* **Form Data:**
  - `photo`: File ảnh JPEG ($1080 \times 1080$, $< 800\text{ KB}$).
  - `latitude`: `16.0611` (float).
  - `longitude`: `108.2274` (float).
  - `target_era_id`: `"ERA_MODERN"` (string).

* **Kịch bản A: Chụp thực tế Cầu Rồng thành công (200 OK):**
  ```json
  {
    "is_valid": true,
    "confidence_score": 0.98,
    "detected_landmark": "Cầu Rồng Đà Nẵng",
    "matched_era": "ERA_MODERN",
    "is_screen_spoof": false,
    "reject_reason": null,
    "xp_reward": 150,
    "badge_unlocked": "Thám Hiểm Rồng Sông Hàn"
  }
  ```

* **Kịch bản B: Cố tình chụp qua màn hình iPad/điện thoại khác (Bị từ chối Anti-Spoofing):**
  ```json
  {
    "is_valid": false,
    "confidence_score": 0.32,
    "detected_landmark": "Màn hình hiển thị hình ảnh Cầu Rồng",
    "matched_era": null,
    "is_screen_spoof": true,
    "reject_reason": "Phát hiện vân sọc màn hình điện tử! Hãy ra bờ sông Hàn chụp Cầu Rồng thực tế nhé lữ khách!",
    "xp_reward": 0,
    "badge_unlocked": null
  }
  ```

---

## 4. AGENT 3: XUẤT BẢN KHOẢNH KHẮC & TƯƠNG TÁC KÉP

### 4.1. Tạo bản nháp nội dung (Enrich Draft)
* **Endpoint:** `POST /feed/moments/draft`
* **Request:**
  ```json
  {
    "photo_url": "https://firebasestorage.googleapis.com/.../dragon_bridge.jpg",
    "landmark_name": "Cầu Rồng Đà Nẵng",
    "era_id": "ERA_MODERN"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "suggested_caption": "Check-in Cầu Rồng vươn mình ra biển lớn! 🐉 Đẹp đỉnh nóc kịch trần luôn cả nhà ơi! ✨",
    "historical_fun_fact": "Cầu Rồng được khánh thành năm 2013, có hệ thống phun lửa và nước với tổng kinh phí gần 1.500 tỷ đồng.",
    "ai_persona": {
      "persona_name": "Thần Rồng Vàng Sông Hàn",
      "avatar_url": "https://api.dicebear.com/7.x/bottts/svg?seed=dragon",
      "first_comment": "Khá khen cho lữ khách trẻ! Hãy mang khí thế rồng vàng bay cao trên con đường tri thức!"
    }
  }
  ```

### 4.2. Xuất bản bài đăng lên Feed nhóm bạn (Publish Moment)
* **Endpoint:** `POST /feed/moments/publish`
* **Request:**
  ```json
  {
    "group_id": "grp_danang_01",
    "author_name": "Nam",
    "photo_url": "https://firebasestorage.googleapis.com/.../dragon_bridge.jpg",
    "landmark_name": "Cầu Rồng Đà Nẵng",
    "era_id": "ERA_MODERN",
    "final_caption": "Cuối tuần cùng lũ bạn săn lùng Cầu Rồng 🐉✨",
    "is_customized_by_user": true,
    "ai_persona_comment": {
      "persona_name": "Thần Rồng Vàng Sông Hàn",
      "comment": "Khá khen cho lữ khách trẻ! Hãy mang khí thế rồng vàng bay cao trên con đường tri thức!"
    }
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "status": "PUBLISHED",
    "moment_id": "mom_dn_9918",
    "sync_via": "FIREBASE_FIRESTORE_TRIGGERED"
  }
  ```
