class ApiConstants {
  // Thay đổi sang IP máy tính của bạn khi chạy máy ảo Android (ví dụ 10.0.2.2:8080)
  // hoặc URL của Google Cloud Run khi deploy
  static const String baseUrl = 'http://10.0.2.2:8080/api/v1';

  static const String albumEras = '/album/eras';
  static const String cluesGenerate = '/clues/generate';
  static const String verifyPhoto = '/verification/verify-photo';
  static const String feedMoments = '/feed/moments';
  static const String enrichMoment = '/feed/moments/enrich-and-post';
  static const String mockLandmarks = '/mock/landmarks';
}
