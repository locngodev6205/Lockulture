class MockLocationService {
  static bool isMockEnabled = true;

  // Tọa độ Bưu điện Trung tâm Sài Gòn (Default mock)
  static double currentLat = 10.779785;
  static double currentLng = 106.699018;
  static String currentSiteName = "Bưu điện Trung tâm TP.HCM";

  static void setMockLocation(double lat, double lng, String name) {
    currentLat = lat;
    currentLng = lng;
    currentSiteName = name;
  }
}
