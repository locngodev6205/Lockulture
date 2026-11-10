import 'package:flutter/material.dart';

class CameraScreen extends StatefulWidget {
  final String eraId;
  final String eraName;

  const CameraScreen({super.key, required this.eraId, required this.eraName});

  @override
  State<CameraScreen> createState() => _CameraScreenState();
}

class _CameraScreenState extends State<CameraScreen> {
  bool _isScanning = false;

  void _onCapture() {
    setState(() => _isScanning = true);

    // Giả lập luồng gọi Agent 2 xác thực ảnh trong 2.5s
    Future.delayed(const Duration(milliseconds: 2500), () {
      if (mounted) {
        setState(() => _isScanning = false);
        _showSuccessDialog();
      }
    });
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1E2C),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text("🎉 GIÁM ĐỊNH THÀNH CÔNG!", style: TextStyle(color: Colors.amber, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text("✅ Nhận diện: Bưu điện Trung tâm TP.HCM", style: TextStyle(color: Colors.white, fontSize: 15)),
            SizedBox(height: 8),
            Text("🛡️ Chống gian lận: Đạt chuẩn (Ảnh thực tế)", style: TextStyle(color: Colors.greenAccent, fontSize: 13)),
            SizedBox(height: 8),
            Text("⭐ Điểm thưởng: +150 XP", style: TextStyle(color: Colors.orangeAccent, fontSize: 14, fontWeight: FontWeight.bold)),
            Divider(color: Colors.white24, height: 24),
            Text(
              "🤖 Agent 3 (Persona) comment:\n\"Bác Bưu Tá Năm 1891: Kính chào tân lữ khách! Chiếc gương ma thuật này chụp ảnh nhanh quá!\"",
              style: TextStyle(color: Colors.white70, fontStyle: FontStyle.italic, fontSize: 12),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.amber, foregroundColor: Colors.black),
            onPressed: () {
              Navigator.pop(context); // Đóng dialog
              Navigator.pop(context); // Quay về Album
            },
            child: const Text("🚀 Bắn lên Locket Bạn Bè"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: Text(widget.eraName, style: const TextStyle(fontSize: 16)),
      ),
      body: Column(
        children: [
          const SizedBox(height: 20),
          // Khung ngắm 1:1 chuẩn Locket
          Center(
            child: Container(
              width: 320,
              height: 320,
              decoration: BoxDecoration(
                color: Colors.white10,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: Colors.amber, width: 2),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  const Icon(Icons.camera, size: 80, color: Colors.white24),
                  if (_isScanning)
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.amber.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(26),
                      ),
                      child: const Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            CircularProgressIndicator(color: Colors.amber),
                            SizedBox(height: 12),
                            Text("Agent 2 đang giám định di tích...", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
          const Spacer(),
          // Nút chụp ảnh
          Padding(
            padding: const EdgeInsets.only(bottom: 40.0),
            child: GestureDetector(
              onTap: _isScanning ? null : _onCapture,
              child: Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 4),
                  color: Colors.amber,
                ),
                child: const Icon(Icons.camera_alt, color: Colors.black, size: 36),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
