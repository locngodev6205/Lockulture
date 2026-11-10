import 'dart:typed_data';
import 'package:camera/camera.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../../core/demo/demo_state.dart';
import '../../core/services/verification_service.dart';
import '../../core/theme/app_theme.dart';

class LiveCaptureScreen extends StatefulWidget {
  final Site site;
  const LiveCaptureScreen({super.key, required this.site});
  @override
  State<LiveCaptureScreen> createState() => _LiveCaptureScreenState();
}

class _LiveCaptureScreenState extends State<LiveCaptureScreen>
    with WidgetsBindingObserver {
  CameraController? _camera;
  final _service = VerificationService();
  CancelToken? _request;
  Uint8List? _photo;
  PhotoAssessment? _assessment;
  String? _error;
  bool _initializing = false, _busy = false, _foreground = true;
  int _generation = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _generation++;
    _request?.cancel();
    _service.close();
    _camera?.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.inactive ||
        state == AppLifecycleState.paused) {
      _foreground = false;
      // Permission prompts can temporarily make the app inactive; do not invalidate initialization.
      if (!_initializing && _camera != null) {
        final old = _camera;
        _camera = null;
        _generation++;
        old?.dispose();
        if (mounted) setState(() {});
      }
    } else if (state == AppLifecycleState.resumed) {
      _foreground = true;
      // Reopening is explicit so the user can control camera access after returning.
      if (mounted) setState(() {});
    }
  }

  Future<void> _openCamera() async {
    if (_initializing || _busy) return;
    final generation = ++_generation;
    setState(() {
      _initializing = true;
      _error = null;
    });
    CameraController? next;
    try {
      final available = await availableCameras();
      if (available.isEmpty) {
        throw CameraException('NoCamera', 'Không tìm thấy camera.');
      }
      final device = available.firstWhere(
        (c) => c.lensDirection == CameraLensDirection.back,
        orElse: () => available.first,
      );
      next = CameraController(
        device,
        ResolutionPreset.medium,
        enableAudio: false,
      );
      await next.initialize();
      if (!mounted || generation != _generation || !_foreground) {
        await next.dispose();
        return;
      }
      final old = _camera;
      setState(() {
        _camera = next;
      });
      await old?.dispose();
    } on CameraException catch (error) {
      await next?.dispose();
      if (mounted && generation == _generation) {
        setState(() {
          _error =
              'Không mở được camera (${error.code}). Cho phép camera trong trình duyệt/cài đặt thiết bị rồi thử lại. Web cần HTTPS hoặc localhost.';
        });
      }
    } catch (_) {
      await next?.dispose();
      if (mounted && generation == _generation) {
        setState(() {
          _error =
              'Camera chưa sẵn sàng. Kiểm tra thiết bị và quyền truy cập rồi thử lại.';
        });
      }
    } finally {
      if (mounted && generation == _generation) {
        setState(() => _initializing = false);
      }
    }
  }

  Future<void> _takePhoto() async {
    final camera = _camera;
    if (_busy || camera == null || !camera.value.isInitialized) return;
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final file = await camera.takePicture();
      final bytes = await file.readAsBytes();
      if (!mounted) return;
      setState(() {
        _photo = bytes;
        _assessment = null;
      });
    } catch (_) {
      if (mounted) {
        setState(
          () =>
              _error = 'Chưa chụp được ảnh. Hãy mở lại camera và thử lần nữa.',
        );
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _verify() async {
    if (_photo == null || _busy) return;
    setState(() {
      _busy = true;
      _error = null;
      _assessment = null;
    });
    _request = CancelToken();
    try {
      final result = await _service.verify(
        _photo!,
        widget.site,
        cancelToken: _request,
      );
      if (mounted) setState(() => _assessment = result);
    } on VerificationFailure catch (error) {
      if (mounted) setState(() => _error = error.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final result = _assessment;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Camera thật', style: TextStyle(fontSize: 18)),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 640),
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              Text(widget.site.name, style: heritage(30)),
              const SizedBox(height: 8),
              const Text(
                'Chụp trực tiếp bằng camera. Ảnh chỉ được gửi tới backend và Google Gemini khi bạn bấm “Gửi giám định”.',
                style: TextStyle(color: muted, fontSize: 12),
              ),
              const SizedBox(height: 20),
              AspectRatio(
                aspectRatio: 1,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(24),
                  child: ColoredBox(
                    color: surface,
                    child: _photo != null
                        ? Image.memory(_photo!, fit: BoxFit.cover)
                        : _camera?.value.isInitialized == true
                        ? Center(child: CameraPreview(_camera!))
                        : Center(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.camera_alt_outlined,
                                  size: 54,
                                  color: gold,
                                ),
                                const SizedBox(height: 16),
                                if (_initializing)
                                  const CircularProgressIndicator()
                                else
                                  FilledButton(
                                    onPressed: _openCamera,
                                    child: const Text('Mở camera'),
                                  ),
                              ],
                            ),
                          ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Giám định hình ảnh bằng AI; chưa kiểm tra GPS hay chứng minh có mặt tại địa danh. Kết quả có thể sai.',
                style: TextStyle(color: muted, fontSize: 11),
              ),
              if (_error != null)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  child: Text(
                    _error!,
                    style: const TextStyle(color: Color(0xFFFF9AA9)),
                  ),
                ),
              if (result != null)
                Container(
                  margin: const EdgeInsets.symmetric(vertical: 16),
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: surface,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(
                        result.valid
                            ? Icons.verified_outlined
                            : Icons.error_outline,
                        color: result.valid ? jade : gold,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        result.valid
                            ? 'Ảnh khớp địa danh'
                            : 'Ảnh chưa được chấp nhận',
                        style: heritage(24),
                      ),
                      const SizedBox(height: 8),
                      Text('Nhận diện: ${result.landmark}'),
                      Text(
                        'Điểm tin cậy AI: ${(result.confidence * 100).round()}%',
                      ),
                      if (!result.valid)
                        Text(
                          result.reason ??
                              'Hãy chụp rõ địa danh đang chọn rồi thử lại.',
                        ),
                    ],
                  ),
                ),
              const SizedBox(height: 16),
              if (_busy)
                const Center(
                  child: Column(
                    children: [
                      CircularProgressIndicator(),
                      SizedBox(height: 12),
                      Text('Đang xử lý ảnh…'),
                    ],
                  ),
                ),
              if (!_busy &&
                  _photo == null &&
                  _camera?.value.isInitialized == true)
                FilledButton.icon(
                  onPressed: _takePhoto,
                  icon: const Icon(Icons.camera_alt),
                  label: const Text('Chụp ảnh'),
                ),
              if (!_busy && _photo != null && result?.valid != true)
                FilledButton.icon(
                  onPressed: _verify,
                  icon: const Icon(Icons.document_scanner_outlined),
                  label: Text(
                    _error == null ? 'Gửi giám định' : 'Thử gửi lại ảnh',
                  ),
                ),
              if (!_busy && result?.valid == true)
                FilledButton.icon(
                  onPressed: () =>
                      Navigator.pop(context, VerifiedPhoto(_photo!, result!)),
                  icon: const Icon(Icons.auto_stories_outlined),
                  label: const Text('Lưu dấu vào album'),
                ),
              if (_photo != null && !_busy)
                TextButton(
                  onPressed: () {
                    setState(() {
                      _photo = null;
                      _assessment = null;
                      _error = null;
                    });
                    if (_camera == null) _openCamera();
                  },
                  child: const Text('Chụp lại'),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
