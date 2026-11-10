# Lockulture — UI demo

Ứng dụng Flutter cổ phong hiện đại với 6 thời kỳ và 12 địa danh Đà Nẵng.

## Chạy thử

Yêu cầu Flutter 3.44 trở lên (Dart 3.12), Android SDK nếu chạy Android.

```sh
flutter pub get
flutter run -d chrome
# Hoặc kết nối thiết bị/emulator Android rồi chạy flutter run
```

Phục vụ bản web đã build:

```sh
flutter build web --release
python3 -m http.server 8090 --directory build/web --bind 0.0.0.0
```

Mở http://localhost:8090. Bản web tải Flutter renderer ở lần mở đầu; font và minh họa của app được đóng gói cục bộ.

## Trải nghiệm

1. Album → nhiệm vụ Cầu Rồng → mật thư → thử gợi ý dễ hơn.
2. Bắt đầu săn tìm → chạm nút chụp → mở khóa và nhận 150 XP.
3. Kể câu chuyện → chỉnh cảm nghĩ → đăng lên nhóm bạn.
4. Nút điều chỉnh trên đầu màn hình cho phép chọn địa danh, thử từ chối ảnh màn hình hoặc đặt lại demo.

Tiến độ và bài đăng chỉ lưu trong phiên. Mỗi thời kỳ nhận thưởng một lần; hủy đăng vẫn giữ mở khóa. Feed khởi đầu trống.

Nút chụp tròn vẫn chạy demo. Nút **Camera thật + Gemini** mở camera thiết bị và gọi backend thật; hai luồng được tách rõ. Feed, XP và Album vẫn chỉ lưu cục bộ trong phiên, chưa đồng bộ Firebase. Tranh vector chỉ dùng cho bài demo. Android dùng application ID mẫu và debug signing, chưa chuẩn bị phát hành.

## Camera thật + Gemini

1. Tại thư mục gốc Lockulture, sao chép `.env.example` thành `.env`, điền `GEMINI_API_KEY` và model khả dụng trong tài khoản vào `GEMINI_MODEL`. Không đặt key trong Flutter hoặc gửi key lên Git.
2. Chạy backend bằng `docker compose up --build -d`, hoặc cài `backend/requirements.txt` vào virtualenv rồi chạy `python -m uvicorn src.main:app --host 0.0.0.0 --port 8080` từ thư mục `backend/`. Backend tự đọc `.env` ở thư mục gốc.
3. Chọn URL API khi chạy Flutter:

```sh
# Web trên cùng máy
flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:8080/api/v1
# Android emulator
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080/api/v1
# Điện thoại Android thật: thay bằng IP LAN của máy chạy backend
flutter run --dart-define=API_BASE_URL=http://192.168.1.10:8080/api/v1
```

4. Săn tìm → Camera thật + Gemini → Mở camera → Chụp ảnh → Gửi giám định. Ảnh chỉ được truyền tới backend/Gemini sau nút gửi; không có nút nhập ảnh thư viện. Nếu hợp lệ, chọn Lưu dấu vào album rồi soạn bài với chính ảnh đã chụp.

Web cần HTTPS hoặc localhost để camera hoạt động. Android debug cho phép HTTP cục bộ; release cần API HTTPS. iOS chưa được cấu hình trong dự án.

API chấp nhận JPEG/PNG/WebP tối đa 8 MB, 20 megapixel; backend thu nhỏ tối đa 1080 px và xóa EXIF trước khi gửi Gemini. Ngưỡng điểm tin cậy 0.8 là quy tắc ban đầu, chưa được hiệu chỉnh bằng tập ảnh thực tế. Gemini chỉ đánh giá dấu hiệu ảnh màn hình, không bảo đảm phát hiện mọi gian lận. Chưa kiểm tra GPS, chưa chứng minh có mặt tại địa danh. Nếu thiếu key, hết quota hoặc lỗi AI thì hiển thị lỗi, không thay bằng thành công mô phỏng.

Kiểm tra trên thiết bị thật vẫn cần: cho phép/từ chối camera, rời app rồi quay lại, chụp trực tiếp địa danh, chụp lại màn hình, sai địa danh, mất mạng và thử gửi lại. Kiểm thử tự động dùng SDK giả lập, không chứng minh chất lượng nhận diện hay hoạt động phần cứng.

Nếu cổng 8080 bận, chạy uvicorn với `--port 8081` và đặt `API_BASE_URL` tương ứng. Bản preview trong phiên phát triển này dùng backend 8081, web 8090. SDK tích hợp theo [tài liệu Google Gen AI](https://googleapis.github.io/python-genai/).

Kiểm thử backend từ thư mục `backend/`:

```sh
python -m pip install -r requirements-dev.txt
python -m pytest -q
```

## Kiểm tra

```sh
flutter analyze
flutter test
# Xuất ảnh màn hình test vào /tmp/lockulture-*.png
UI_SCREENSHOTS=1 flutter test
```

State demo: `lib/core/demo/demo_state.dart`; theme: `lib/core/theme/app_theme.dart`; UI: `lib/features/demo_shell.dart`.

Font Be Vietnam Pro và Noto Serif được phân phối kèm giấy phép SIL Open Font License trong `assets/fonts/`.
