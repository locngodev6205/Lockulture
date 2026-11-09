class MockLocationService {
  static bool isMockEnabled = true;

  // Tọa độ Cầu Rồng Đà Nẵng (Default mock demo)
  static double currentLat = 16.0611;
  static double currentLng = 108.2274;
  static String currentSiteName = "Cầu Rồng Đà Nẵng";

  static void setMockLocation(double lat, double lng, String name) {
    currentLat = lat;
    currentLng = lng;
    currentSiteName = name;
  }
}
