import 'dart:typed_data';
import 'package:dio/dio.dart';
import '../constants/api_constants.dart';
import '../demo/demo_state.dart';

const eraApiIds = {
  'champa': 'ERA_CHAMPA',
  'expansion': 'ERA_EXPANSION',
  'nguyen': 'ERA_NGUYEN',
  'french': 'ERA_FRENCH_COLONIAL',
  'revolution': 'ERA_REVOLUTION',
  'modern': 'ERA_MODERN',
};

class PhotoAssessment {
  final bool valid, screenSpoof;
  final double confidence;
  final String landmark;
  final String? reason, era;
  const PhotoAssessment({
    required this.valid,
    required this.screenSpoof,
    required this.confidence,
    required this.landmark,
    this.reason,
    this.era,
  });
  factory PhotoAssessment.fromJson(Map<String, dynamic> json, Site site) {
    final confidence = (json['confidence_score'] as num).toDouble();
    if (!confidence.isFinite || confidence < 0 || confidence > 1) {
      throw const FormatException('Invalid confidence');
    }
    final screenSpoof = json['is_screen_spoof'] as bool;
    final valid =
        json['is_valid'] as bool &&
        !screenSpoof &&
        confidence >= .8 &&
        json['matched_era'] == eraApiIds[site.era];
    return PhotoAssessment(
      valid: valid,
      screenSpoof: screenSpoof,
      confidence: confidence,
      landmark: json['detected_landmark'] as String,
      reason: json['reject_reason'] as String?,
      era: json['matched_era'] as String?,
    );
  }
}

class VerificationFailure implements Exception {
  final String message;
  const VerificationFailure(this.message);
}

class VerifiedPhoto {
  final Uint8List bytes;
  final PhotoAssessment assessment;
  const VerifiedPhoto(this.bytes, this.assessment);
}

class VerificationService {
  final Dio _dio;
  VerificationService({Dio? dio})
    : _dio =
          dio ??
          Dio(
            BaseOptions(
              baseUrl: ApiConstants.baseUrl,
              connectTimeout: const Duration(seconds: 10),
              sendTimeout: const Duration(seconds: 30),
              receiveTimeout: const Duration(seconds: 60),
            ),
          );
  Future<PhotoAssessment> verify(
    Uint8List bytes,
    Site site, {
    CancelToken? cancelToken,
  }) async {
    if (bytes.isEmpty || bytes.length > 8 * 1024 * 1024) {
      throw const VerificationFailure(
        'Ảnh phải có dung lượng từ 1 byte đến 8 MB. Hãy chụp lại.',
      );
    }
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        ApiConstants.verifyPhoto,
        data: FormData.fromMap({
          'photo': MultipartFile.fromBytes(bytes, filename: 'capture.jpg'),
          'target_era_id': eraApiIds[site.era],
          'target_landmark': site.name,
        }),
        cancelToken: cancelToken,
      );
      return PhotoAssessment.fromJson(response.data!, site);
    } on DioException catch (error) {
      final detail = error.response?.data;
      if (detail is Map && detail['detail'] is String) {
        throw VerificationFailure(detail['detail'] as String);
      }
      if (error.type == DioExceptionType.cancel) {
        throw const VerificationFailure('Đã hủy giám định.');
      }
      if (error.response?.statusCode == 422) {
        throw const VerificationFailure(
          'Địa danh hoặc dữ liệu gửi lên chưa hợp lệ.',
        );
      }
      throw const VerificationFailure(
        'Chưa kết nối được backend hoặc đã hết thời gian chờ. Kiểm tra mạng và URL API rồi thử lại.',
      );
    } catch (_) {
      throw const VerificationFailure(
        'Backend trả kết quả không hợp lệ. Hãy thử lại.',
      );
    }
  }

  void close() => _dio.close(force: true);
}
