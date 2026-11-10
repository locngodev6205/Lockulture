import type { Coordinates, Mission } from '@/domain/models';
export const demoLocation: Coordinates = { latitude: 16.4692, longitude: 107.5778 };
export const missionFixtures: Omit<
  Mission,
  'id' | 'version' | 'distanceMeters' | 'revealedHints' | 'answerRevealed'
>[] = [
  {
    eraId: 'ERA_NGUYEN',
    eraName: 'Triều Nguyễn',
    placeId: 'demo-ngo-mon',
    placeName: 'Ngọ Môn',
    address: 'Đại Nội, phường Phú Xuân, Huế',
    location: { latitude: 16.4694, longitude: 107.5783 },
    xp: 100,
    clue: 'Tìm cánh cổng mở lối vào Hoàng thành. Phía trên là những tầng mái nối nhau, phía dưới là những lối đi xuyên qua nền đài.',
    hints: [
      'Địa điểm nằm ở phía nam Hoàng thành Huế.',
      'Hãy tìm Ngọ Môn. Chụp mặt chính của cổng hoặc biển ghi tên địa điểm.',
    ],
    photoRequirements: [
      'Chụp mặt chính của cổng, thấy rõ phần nền đài và mái phía trên.',
      'Hoặc chụp biển tên Ngọ Môn rõ chữ.',
    ],
  },
  {
    eraId: 'ERA_NGUYEN',
    eraName: 'Triều Nguyễn',
    placeId: 'demo-hien-lam-cac',
    placeName: 'Hiển Lâm Các',
    address: 'Khu vực Thế Miếu, Đại Nội, Huế',
    location: { latitude: 16.4678, longitude: 107.5773 },
    xp: 100,
    clue: 'Trong khuôn viên Đại Nội, tìm công trình vươn cao với các tầng mái xếp chồng. Một tấm biển tên sẽ giúp bạn xác nhận mảnh ghép này.',
    hints: [
      'Tìm đến khu vực Thế Miếu trong Đại Nội.',
      'Mục tiêu là Hiển Lâm Các. Hãy chụp toàn cảnh công trình hoặc biển tên.',
    ],
    photoRequirements: [
      'Chụp công trình với các tầng mái nhìn rõ.',
      'Có thể thay bằng ảnh biển tên Hiển Lâm Các đọc được chữ.',
    ],
  },
  {
    eraId: 'ERA_MODERN',
    eraName: 'Thời cận – hiện đại',
    placeId: 'demo-quoc-hoc',
    placeName: 'Trường Quốc Học Huế',
    address: '12 Lê Lợi, Huế',
    location: { latitude: 16.4582, longitude: 107.5908 },
    xp: 100,
    clue: 'Dọc bờ sông Hương, tìm một ngôi trường nổi bật với sắc đỏ. Mảnh ghép nằm ở cổng trường, nơi tên gọi được viết rõ phía trên.',
    hints: [
      'Tìm trên đường Lê Lợi, gần bờ sông Hương.',
      'Địa điểm là Trường Quốc Học Huế. Chụp cổng trường có tên.',
    ],
    photoRequirements: [
      'Chụp cổng trường, thấy rõ chữ Quốc Học.',
      'Không cần vào bên trong trường.',
    ],
  },
];
