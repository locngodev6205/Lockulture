# HỢP ĐỒNG GIAO TIẾP API (API SPECIFICATION)

- **Dự án:** TIME TRAVELER’S LOCKET (CHRONOLOCKET).
- **Mã tài liệu:** API-SPEC-CHRONO-2026.
- **Phiên bản:** 2.0 — ngày 05/11/2026.
- **Base URL:** `https://api.chronolocket.run.app/api/v1` (hoặc `http://localhost:8080/api/v1` khi chạy cục bộ).
- **Định dạng dữ liệu:** `application/json` (trừ API upload ảnh dùng `multipart/form-data`).

---

## 1. XÁC THỰC & NHÓM BẠN (AUTH & CIRCLES)

### 1.1. Đăng nhập / Chế độ Khách (Guest / Judge Mode)
* **Endpoint:** `POST /auth/guest-login`
* **Mô tả:** Đăng nhập tức thì cho Ban giám khảo hoặc người dùng thử nghiệm mà không cần điền form phức tạp.
* **Request:**
  ```json
  {
    "device_id": "device_pixel7_demo_01",
    "display_name": "Lữ Khách Hackathon"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "access_token": "jwt_token_sample_string",
    "token_type": "bearer",
    "user": {
      "user_id": "usr_9981",
      "display_name": "Lữ Khách Hackathon",
      "group_id": "grp_devfest_01",
      "group_name": "Biệt Đội Săn Sử Sài Gòn"
    }
  }
  ```

---

## 2. ALBUM POKEDEX & TIẾN ĐỘ THỜI KỲ (ALBUM & ERAS)

### 2.1. Lấy danh sách các Thời kỳ Lịch sử trong Album
* **Endpoint:** `GET /album/eras`
* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):**
  ```json
  {
    "group_id": "grp_devfest_01",
    "completion_rate": 0.5,
    "eras": [
      {
        "era_id": "ERA_ANCIENT",
        "era_name": "Thời Cổ Đại & Dựng Nước",
        "time_range": "Trước thế kỷ X",
        "is_unlocked": true,
        "unlocked_by": "Nam",
        "photo_url": "https://storage.googleapis.com/chrono-bucket/photos/den_hung.jpg",
        "landmark_name": "Đền Hùng",
        "xp_earned": 100
      },
      {
        "era_id": "ERA_FRENCH_COLONIAL",
        "era_name": "Thời Kỳ Cận Đại & Giao Thoa Văn Hóa",
        "time_range": "Cuối thế kỷ XIX - Đầu thế kỷ XX",
        "is_unlocked": false,
        "unlocked_by": null,
        "photo_url": null,
        "landmark_name": null,
        "xp_earned": 0
      }
    ]
  }
  ```

---

## 3. AGENT 1: QUẢN TRÒ DẪN ĐƯỜNG & MẬT THƯ (CLUES)

### 3.1. Tạo Mật Thư Dẫn Đường Thông Minh
* **Endpoint:** `POST /clues/generate`
* **Headers:** `Authorization: Bearer <token>`
* **Request:**
  ```json
  {
    "latitude": 10.779785,
    "longitude": 106.699018,
    "era_id": "ERA_FRENCH_COLONIAL",
    "hint_level": 1
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "SUCCESS",
    "target_landmark_type": "Bưu điện cổ / Công trình Gothic",
    "estimated_distance_meters": 150,
    "clue_text": "Từ nơi ngươi đứng, hãy hướng mắt về phía vầng đông. Có một mái nhà lưu giữ hàng triệu lá thư xuyên thế kỷ, nơi chiếc đồng hồ khổng lồ vẫn lặng ngắm dòng người hơn 130 năm qua.",
    "hint_level": 1,
    "is_easier_available": true
  }
  ```

### 3.2. Xin Mật Thư Dễ Hơn (Độ khó thích ứng)
* **Endpoint:** `POST /clues/generate` (với `hint_level: 2`)
* **Response (200 OK):**
  ```json
  {
    "status": "SUCCESS",
    "clue_text": "Hãy đi bộ 100 bước sang đường Công xã Paris. Tìm tòa nhà màu vàng có mái vòm sắt uốn lượn do ngài Gustave Eiffel thiết kế!",
    "hint_level": 2,
    "is_easier_available": false
  }
  ```

---

## 4. AGENT 2: GIÁM ĐỊNH THỊ GIÁC & MỞ KHÓA (VERIFICATION)

### 4.1. Tải ảnh & Giám định bằng Gemini Vision
* **Endpoint:** `POST /verification/verify-photo`
* **Headers:** `Authorization: Bearer <token>`
* **Content-Type:** `multipart/form-data`
* **Form Data:**
  - `photo`: File ảnh JPEG (tối đa $1080 \times 1080$, $< 1\text{ MB}$).
  - `latitude`: `10.7798` (float).
  - `longitude`: `106.6990` (float).
  - `target_era_id`: `"ERA_FRENCH_COLONIAL"` (string).
* **Response Thành công (200 OK):**
  ```json
  {
    "is_valid": true,
    "confidence_score": 0.96,
    "detected_landmark": "Bưu điện Trung tâm Sài Gòn",
    "matched_era": "ERA_FRENCH_COLONIAL",
    "is_screen_spoof": false,
    "reject_reason": null,
    "xp_reward": 150,
    "badge_unlocked": "Nhà Thám Hiểm Sài Gòn Cổ",
    "photo_storage_url": "https://storage.googleapis.com/chrono-bucket/photos/postoffice_01.jpg"
  }
  ```
* **Response Từ chối (422 Unprocessable / 200 with is_valid=false):**
  ```json
  {
    "is_valid": false,
    "confidence_score": 0.35,
    "detected_landmark": "Màn hình hiển thị ảnh Bưu điện",
    "matched_era": null,
    "is_screen_spoof": true,
    "reject_reason": "Phát hiện vân sọc màn hình điện tử! Vui lòng chụp ảnh cảnh quan thực tế ngoài đời sống.",
    "xp_reward": 0
  }
  ```

---

## 5. AGENT 3: BẢNG TIN LOCKET & TƯƠNG TÁC (SOCIAL FEED)

### 5.1. Tự động sinh Caption & Bình luận Roleplay
* **Endpoint:** `POST /feed/moments/enrich-and-post`
* **Headers:** `Authorization: Bearer <token>`
* **Request:**
  ```json
  {
    "photo_url": "https://storage.googleapis.com/chrono-bucket/photos/postoffice_01.jpg",
    "landmark_name": "Bưu điện Trung tâm Sài Gòn",
    "era_id": "ERA_FRENCH_COLONIAL"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "moment_id": "mom_8832",
    "group_id": "grp_devfest_01",
    "author_name": "Nam",
    "photo_url": "https://storage.googleapis.com/chrono-bucket/photos/postoffice_01.jpg",
    "gen_z_caption": "Sống chậm lại 130 năm... Bưu điện mở từ 1891 mà trần nhà vẫn đỉnh nóc kịch trần! 📮",
    "historical_fun_fact": "Hệ thống vòm sắt bên trong Bưu điện do kiến trúc sư Gustave Eiffel thiết kế.",
    "ai_persona_comment": {
      "persona_name": "Bác Bưu Tá Năm 1891",
      "avatar_url": "https://storage.googleapis.com/chrono-bucket/avatars/postman.png",
      "content": "Kính chào các tân lữ khách! Ngày xưa gửi một bức thư mất cả tháng ròng, nay các cháu truyền ảnh qua chiếc gương ma thuật nhanh quá!"
    },
    "created_at": "2026-11-05T15:30:00Z"
  }
  ```

### 5.2. Lấy Bảng tin Nhóm bạn (Locket Feed)
* **Endpoint:** `GET /feed/moments?group_id=grp_devfest_01&limit=10`
* **Response (200 OK):**
  ```json
  {
    "moments": [
      {
        "moment_id": "mom_8832",
        "author_name": "Nam",
        "photo_url": "https://storage.googleapis.com/chrono-bucket/photos/postoffice_01.jpg",
        "caption": "Sống chậm lại 130 năm... Bưu điện mở từ 1891 mà trần nhà vẫn đỉnh nóc kịch trần! 📮",
        "ai_persona_comment": {
          "persona_name": "Bác Bưu Tá Năm 1891",
          "content": "Kính chào các tân lữ khách!..."
        },
        "reactions": {
          "heart": 3,
          "fire": 5
        }
      }
    ]
  }
  ```

---

## 6. MOCK CONTROLLER (DEMO HACKATHON)

### 6.1. Lấy danh sách tọa độ giả lập nổi bật
* **Endpoint:** `GET /mock/landmarks`
* **Response (200 OK):**
  ```json
  {
    "mock_sites": [
      {
        "site_id": "HCM_POST_OFFICE",
        "site_name": "Bưu điện Trung tâm TP.HCM",
        "latitude": 10.779785,
        "longitude": 106.699018,
        "era_id": "ERA_FRENCH_COLONIAL"
      },
      {
        "site_id": "HCM_INDEPENDENCE_PALACE",
        "site_name": "Dinh Độc Lập",
        "latitude": 10.776889,
        "longitude": 106.695346,
        "era_id": "ERA_MODERN"
      },
      {
        "site_id": "HN_TEMPLE_OF_LITERATURE",
        "site_name": "Văn Miếu - Quốc Tử Giám",
        "latitude": 21.028511,
        "longitude": 105.835526,
        "era_id": "ERA_LY_TRAN"
      }
    ]
  }
  ```
