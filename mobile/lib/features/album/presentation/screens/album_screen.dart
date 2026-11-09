import 'package:flutter/material.dart';
import 'package:lockulture/core/services/mock_location_service.dart';
import 'package:lockulture/features/camera/presentation/screens/camera_screen.dart';

class AlbumScreen extends StatefulWidget {
  const AlbumScreen({super.key});

  @override
  State<AlbumScreen> createState() => _AlbumScreenState();
}

class _AlbumScreenState extends State<AlbumScreen> {
  // Mock dữ liệu các mốc thời kỳ
  final List<Map<String, dynamic>> eras = [
    {
      "era_id": "ERA_ANCIENT",
      "era_name": "Thời Cổ Đại & Dựng Nước",
      "time_range": "Trước thế kỷ X",
      "is_unlocked": true,
      "photo_url": "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=500",
      "landmark": "Đền Hùng",
      "xp": 100,
    },
    {
      "era_id": "ERA_LY_TRAN",
      "era_name": "Thời Lý - Trần",
      "time_range": "Thế kỷ XI - XIV",
      "is_unlocked": false,
      "photo_url": null,
      "landmark": null,
      "xp": 0,
    },
    {
      "era_id": "ERA_FRENCH_COLONIAL",
      "era_name": "Thời Kỳ Cận Đại Pháp Thuộc",
      "time_range": "Cuối XIX - Đầu XX",
      "is_unlocked": false,
      "photo_url": null,
      "landmark": null,
      "xp": 0,
    },
    {
      "era_id": "ERA_MODERN",
      "era_name": "Thời Kỳ Kháng Chiến & Độc Lập",
      "time_range": "1945 - 1975",
      "is_unlocked": true,
      "photo_url": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500",
      "landmark": "Dinh Độc Lập",
      "xp": 150,
    },
  ];

  void _showClueModal(Map<String, dynamic> era) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF1E1E2C),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "📜 Mật Thư Từ Quản Trò (Agent 1)",
                style: const TextStyle(color: Colors.amber, fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.black26,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.amber.withOpacity(0.3)),
                ),
                child: const Text(
                  "\"Từ nơi ngươi đứng, hãy hướng mắt về phía vầng đông. Có một mái nhà lưu giữ hàng triệu lá thư xuyên thế kỷ...\"",
                  style: TextStyle(color: Colors.white, fontStyle: FontStyle.italic, fontSize: 15),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {},
                      style: OutlinedButton.styleFrom(foregroundColor: Colors.white70),
                      child: const Text("💡 Gợi ý dễ hơn"),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.amber, foregroundColor: Colors.black),
                      icon: const Icon(Icons.camera_alt),
                      label: const Text("Mở Camera"),
                      onPressed: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => CameraScreen(eraId: era["era_id"], eraName: era["era_name"]),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              )
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF12121E),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text("ChronoLocket Pokedex", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune, color: Colors.amber),
            tooltip: "Mock Location Controller",
            onPressed: () {},
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: eras.length,
        itemBuilder: (context, index) {
          final era = eras[index];
          final bool isUnlocked = era["is_unlocked"];

          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            color: isUnlocked ? const Color(0xFF222831) : const Color(0xFF1A1A24),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
              side: BorderSide(
                color: isUnlocked ? Colors.amber : Colors.white12,
                width: isUnlocked ? 2 : 1,
              ),
            ),
            child: InkWell(
              onTap: () => _showClueModal(era),
              borderRadius: BorderRadius.circular(20),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      width: 70,
                      height: 70,
                      decoration: BoxDecoration(
                        color: Colors.black38,
                        borderRadius: BorderRadius.circular(16),
                        image: isUnlocked && era["photo_url"] != null
                            ? DecorationImage(image: NetworkImage(era["photo_url"]), fit: BoxFit.cover)
                            : null,
                      ),
                      child: !isUnlocked ? const Icon(Icons.lock, color: Colors.white30, size: 30) : null,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            era["era_name"],
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            isUnlocked ? "✅ Đã mở: ${era["landmark"]}" : "🔒 Nhấn để nhận mật thư săn tìm",
                            style: TextStyle(color: isUnlocked ? Colors.greenAccent : Colors.white54, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.chevron_right, color: Colors.white38),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
