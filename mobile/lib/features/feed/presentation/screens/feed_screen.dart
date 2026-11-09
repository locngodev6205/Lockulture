import 'package:flutter/material.dart';

class FeedScreen extends StatelessWidget {
  const FeedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF12121E),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text("Bảng Tin Locket Bạn Bè", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildMomentCard(
            author: "Nam",
            time: "10 phút trước",
            landmark: "Bưu điện Trung tâm Sài Gòn",
            photoUrl: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=500",
            caption: "Sống chậm lại 130 năm... Bưu điện mở từ 1891 mà trần vòm sắt nhìn vẫn đỉnh chóp! 📮",
            personaName: "Bác Bưu Tá 1891",
            personaComment: "Ngày xưa gửi một lá thư mất cả tháng ròng, nay các cháu truyền ảnh qua chiếc gương ma thuật nhanh quá!",
          ),
        ],
      ),
    );
  }

  Widget _buildMomentCard({
    required String author,
    required String time,
    required String landmark,
    required String photoUrl,
    required String caption,
    required String personaName,
    required String personaComment,
  }) {
    return Card(
      color: const Color(0xFF1E1E2C),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      margin: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ListTile(
            leading: CircleAvatar(backgroundColor: Colors.amber, child: Text(author[0], style: const TextStyle(color: Colors.black))),
            title: Text(author, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            subtitle: Text("$landmark • $time", style: const TextStyle(color: Colors.white54, fontSize: 12)),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: Image.network(photoUrl, height: 280, width: double.infinity, fit: BoxFit.cover),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(caption, style: const TextStyle(color: Colors.white, fontSize: 14)),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.black26,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.amber.withOpacity(0.2)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("🏛️ ", style: TextStyle(fontSize: 16)),
                      Expanded(
                        child: RichText(
                          text: TextSpan(
                            children: [
                              TextSpan(text: "$personaName: ", style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 12)),
                              TextSpan(text: personaComment, style: const TextStyle(color: Colors.white70, fontSize: 12)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
