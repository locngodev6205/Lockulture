# Lockulture Mobile — React Native / Expo

Nền frontend **Expo SDK 58 + React Native + TypeScript**, thay cho Flutter. Code Flutter cũ ở [../legacy/flutter](../legacy/flutter). Dùng **Node 24 LTS** và npm; phiên bản theo `.nvmrc`. Không cần backend hoặc khóa Gemini/Maps để xem bộ khung.

## Bắt đầu

```bash
cd mobile
nvm use
npm ci
cp .env.example .env
npm run start:go
```

Nếu không dùng nvm, cài/chọn Node 24 bằng công cụ quản lý Node đang dùng. Biến môi trường mặc định là mock nên không bắt buộc tạo `.env` để xem khung.

- Quét QR bằng **Expo Go tương thích SDK 58**; nếu Expo Go trên thiết bị chưa hỗ trợ SDK này, dùng development build.
- `npm run web`: xem nhanh UI trên web.
- `npm run start:tunnel`: kết nối qua tunnel; có thể yêu cầu tải thành phần tunnel của Expo khi chạy lần đầu, không đảm bảo hoạt động nếu mạng chặn.
- `npm run android` / `npm run ios`: tạo/chạy development build cục bộ; cần Android SDK hoặc Xcode tương ứng. Không cần chạy hai lệnh này chỉ để xem UI trong Expo Go/web.
- Có sẵn `eas.json`; build cloud bằng `npx eas-cli@latest build --profile development --platform android` khi nhóm đã liên kết dự án/tài khoản EAS. Chưa tạo dự án EAS hoặc build cloud trong lần setup này.

`expo-dev-client` đã cài. `npm start` có thể ưu tiên development client; dùng `npm run start:go` nếu muốn Expo Go. Camera/GPS và quyền phải được kiểm tra trên điện thoại thật.

## Kiểm tra

```bash
npm run typecheck
npm run lint
npm run format:check
npx expo install --check
npx expo-doctor
```

Dùng `npx expo install <package>` khi thêm module native để chọn phiên bản tương thích SDK. Commit `package-lock.json`; dùng `npm ci` trên máy đồng đội.

## Cấu trúc

```text
mobile/
├── src/
│   ├── app/                    # Expo Router; file route mỏng, chỉ nối màn hình
│   │   ├── (auth)/             # Welcome/login/register/forgot password
│   │   ├── (main)/
│   │   │   ├── (tabs)/         # Khám phá / Máy ảnh / Bảng tin
│   │   │   ├── missions/       # Tìm và chi tiết nhiệm vụ
│   │   │   ├── capture/        # Camera, preview, result
│   │   │   ├── collection/     # Bộ sưu tập, chi tiết khám phá
│   │   │   ├── posts/          # Soạn bài, chi tiết bài
│   │   │   ├── friends/
│   │   │   ├── groups/
│   │   │   ├── leaderboard.tsx
│   │   │   └── profile/
│   │   └── _layout.tsx         # Providers và protected navigation
│   ├── features/               # auth, exploration, missions, capture, collection,
│   │                           # feed, friends, groups, profile, leaderboard
│   │   └── <feature>/          # screens/, components/, hooks/
│   ├── shared/                 # Component dùng chung và theme tokens
│   ├── domain/                 # Types nghiệp vụ; không phụ thuộc UI
│   ├── services/               # Contracts, mock adapter, API client, secure session
│   ├── mocks/                  # Fixture xác định, dễ thêm scenario
│   ├── state/                  # Zustand + local persistence
│   ├── providers/              # QueryClient, safe area, gesture root
│   └── config/                 # Parse/validate EXPO_PUBLIC_* bằng Zod
├── assets/
├── app.json                    # App identity, native permissions/plugins
├── eas.json                    # Profile build dự kiến
└── package-lock.json
```

Không đặt component thường, fixture hoặc service trong `src/app/`; Expo Router coi chúng là routes. Alias `@/` trỏ `src/`.

## Thư viện

| Nhu cầu                      | Thư viện                                                        |
| ---------------------------- | --------------------------------------------------------------- |
| Routing, tabs, stack         | expo-router, react-native-screens, safe-area-context            |
| Animation, gesture           | react-native-reanimated, react-native-worklets, gesture-handler |
| Camera, vị trí               | expo-camera, expo-location                                      |
| Ảnh và file                  | expo-image, expo-image-manipulator, expo-file-system            |
| State UI/phiên mock          | zustand, AsyncStorage                                           |
| Trạng thái tải/cache dữ liệu | @tanstack/react-query                                           |
| Form/validation              | react-hook-form, zod, @hookform/resolvers                       |
| Token khi nối auth thật      | expo-secure-store                                               |
| Icon                         | @expo/vector-icons                                              |
| Dev/build                    | expo-dev-client, TypeScript, ESLint, Prettier                   |

Chưa cài Gemini SDK, Maps SDK hoặc Firebase/Supabase ở frontend: AI/Places thuộc backend; kho dữ liệu chưa chốt. Chưa cần NativeWind/UI kit để bạn tự xây thiết kế.

## Bắt đầu chỉnh UI ở đâu?

- Timeline/trang chủ: `src/features/exploration/screens/explore-screen.tsx`.
- Tab chọn cách chụp: `src/features/capture/screens/capture-choice-screen.tsx`.
- Màu/spacing: `src/shared/theme/tokens.ts`.
- Component chung: `src/shared/components/`.
- Dữ liệu mẫu: `src/mocks/fixtures.ts`; thêm hành vi mock qua `src/services/mock/`.
- Từng feature đã có vị trí `components/` và `hooks/`; chỉ thêm abstraction khi thật sự cần.

## Dependency audit khi setup

Ngày 10/11/2026, `npm audit` còn **10 cảnh báo moderate** liên quan `glob/minimatch` trong toolchain Expo/ESLint, không có high/critical ở lần kiểm tra này. Đã chạy bản vá tương thích; không dùng `npm audit fix --force` vì npm đề xuất hạ Expo từ SDK 58 xuống SDK 52. Cần theo dõi bản vá upstream trước khi phát hành; đây không phải xác nhận ứng dụng đã được audit bảo mật đầy đủ.

## Tài liệu và hiện trạng

- [Chỉ mục hệ thống](../docs/README.md)
- [Hiện trạng code và giới hạn mock](../docs/CURRENT_STATE.md)
- [Luồng Missions](../docs/flows/DISCOVERY.md), [Capture](../docs/flows/CAPTURE.md), [Social](../docs/flows/SOCIAL.md)
- [Chuẩn UI](../docs/DESIGN_SYSTEM.md), [kế hoạch nối backend](../docs/integration/PLAN.md)

`EXPO_PUBLIC_DATA_SOURCE=mock` dùng dữ liệu local. Đặt `api` chưa làm toàn bộ app nối backend: adapter API chưa triển khai và social vẫn gọi store trực tiếp. Không tự dùng fixture khi API lỗi.

`EXPO_PUBLIC_*` được đóng gói công khai vào app, không chứa Gemini/Maps key hoặc database admin key. `EXPO_PUBLIC_API_BASE_URL` phải truy cập được từ thiết bị; localhost trên điện thoại không phải máy tính chạy backend. Auth chưa thật; không lưu mật khẩu vào AsyncStorage.

Camera/GPS cần kiểm tra trên native. Web URI ảnh có thể hết hiệu lực; Expo export chỉ kiểm tra JS bundle, không thay native build/device test. Chưa tạo dự án EAS hay xác nhận URL backend production trong quá trình dựng UI.
