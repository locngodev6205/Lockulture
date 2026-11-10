import 'dart:typed_data';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lockulture/core/demo/demo_state.dart';
import 'package:lockulture/core/services/verification_service.dart';

void main() {
  Map<String, dynamic> valid() => {
    'is_valid': true,
    'is_screen_spoof': false,
    'confidence_score': .95,
    'detected_landmark': 'Cầu Rồng',
    'matched_era': 'ERA_MODERN',
    'reject_reason': null,
  };
  test(
    'Client sends multipart image and canonical target era without fake GPS',
    () async {
      final dio = Dio(BaseOptions(baseUrl: 'http://test.local/api/v1'));
      dio.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            expect(options.path, '/verification/verify-photo');
            final form = options.data as FormData;
            expect(Map.fromEntries(form.fields), {
              'target_era_id': 'ERA_MODERN',
              'target_landmark': 'Cầu Rồng',
            });
            expect(form.files.single.value.length, 3);
            handler.resolve(
              Response(requestOptions: options, data: valid(), statusCode: 200),
            );
          },
        ),
      );
      final service = VerificationService(dio: dio);
      expect(
        (await service.verify(
          Uint8List.fromList([1, 2, 3]),
          sites.first,
        )).valid,
        true,
      );
      service.close();
    },
  );
  test('A claimed success cannot bypass era, spoof and confidence checks', () {
    for (final changes in [
      {'matched_era': 'ERA_CHAMPA'},
      {'is_screen_spoof': true},
      {'confidence_score': .79},
    ]) {
      expect(
        PhotoAssessment.fromJson({...valid(), ...changes}, sites.first).valid,
        false,
      );
    }
  });
  test('Missing API key response stays an actionable error', () async {
    final dio = Dio(BaseOptions(baseUrl: 'http://test.local'));
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          handler.reject(
            DioException(
              requestOptions: options,
              response: Response(
                requestOptions: options,
                statusCode: 503,
                data: {'detail': 'Backend chưa cấu hình GEMINI_API_KEY.'},
              ),
            ),
          );
        },
      ),
    );
    final service = VerificationService(dio: dio);
    await expectLater(
      service.verify(Uint8List.fromList([1]), sites.first),
      throwsA(
        isA<VerificationFailure>().having(
          (e) => e.message,
          'message',
          contains('GEMINI_API_KEY'),
        ),
      ),
    );
    service.close();
  });
  test(
    'Bad response and empty image never become successful verification',
    () async {
      final dio = Dio(BaseOptions(baseUrl: 'http://test.local'));
      dio.interceptors.add(
        InterceptorsWrapper(
          onRequest: (options, handler) {
            handler.resolve(
              Response(
                requestOptions: options,
                data: {'is_valid': true},
                statusCode: 200,
              ),
            );
          },
        ),
      );
      final service = VerificationService(dio: dio);
      await expectLater(
        service.verify(Uint8List.fromList([1]), sites.first),
        throwsA(isA<VerificationFailure>()),
      );
      await expectLater(
        service.verify(Uint8List(0), sites.first),
        throwsA(isA<VerificationFailure>()),
      );
      service.close();
    },
  );
}
