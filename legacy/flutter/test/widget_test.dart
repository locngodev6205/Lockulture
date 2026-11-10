import 'dart:io';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lockulture/main.dart';
import 'package:lockulture/core/demo/demo_state.dart';

void main() {
  test('Rewards are granted once and reset restores the session', () {
    final state = DemoState();
    expect(state.xp, 100);
    expect(state.unlock(sites.first), true);
    expect(state.unlock(sites.first), false);
    expect(state.xp, 250);
    state.publish(sites.first, 'Ký ức sông Hàn');
    state.react(state.moments.first, '❤️');
    expect(state.moments.first.reactions, {'❤️'});
    state.react(state.moments.first, '❤️');
    expect(state.moments.first.reactions, isEmpty);
    state.reset();
    expect(state.unlocked, {'champa'});
    expect(state.moments, isEmpty);
    expect(state.xp, 100);
  });

  Future<void> launch(
    WidgetTester tester, {
    double width = 390,
    double height = 844,
  }) async {
    tester.view.physicalSize = Size(width, height);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final vietnam = FontLoader('Vietnam')
      ..addFont(rootBundle.load('assets/fonts/BeVietnamPro-Regular.ttf'));
    final heritage = FontLoader('Heritage')
      ..addFont(rootBundle.load('assets/fonts/NotoSerif.ttf'));
    await vietnam.load();
    await heritage.load();
    final icons = FontLoader('MaterialIcons')
      ..addFont(rootBundle.load('fonts/MaterialIcons-Regular.otf'));
    await icons.load();
    await tester.pumpWidget(
      const ProviderScope(
        child: RepaintBoundary(
          key: ValueKey('capture'),
          child: LockultureApp(),
        ),
      ),
    );
    await tester.pumpAndSettle();
  }

  Future<void> screenshot(WidgetTester tester, String name) async {
    if (Platform.environment['UI_SCREENSHOTS'] != '1') return;
    await tester.runAsync(() async {
      final boundary = tester.renderObject<RenderRepaintBoundary>(
        find.byKey(const ValueKey('capture')),
      );
      final image = await boundary.toImage(pixelRatio: 2);
      final data = await image.toByteData(format: ui.ImageByteFormat.png);
      await File(
        '/tmp/lockulture-$name.png',
      ).writeAsBytes(data!.buffer.asUint8List());
    });
  }

  testWidgets('Golden path opens an era and publishes an edited caption', (
    tester,
  ) async {
    await launch(tester);
    await screenshot(tester, 'album');
    await tester.tap(find.byTooltip('Khám phá Cầu Rồng'));
    await tester.pumpAndSettle();
    await screenshot(tester, 'clue');
    await tester.tap(find.text('Gợi ý dễ hơn'));
    await tester.pumpAndSettle();
    expect(find.text('Đã hiển thị gợi ý cuối'), findsOneWidget);
    await tester.tap(find.text('Bắt đầu săn tìm'));
    await tester.pumpAndSettle();
    await screenshot(tester, 'camera');
    await tester.ensureVisible(find.byKey(const ValueKey('capture-button')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('capture-button')));
    await tester.pump();
    await tester.pump(const Duration(seconds: 2));
    await tester.pumpAndSettle();
    expect(find.text('Một dấu ấn mới\ntrong hành trình!'), findsOneWidget);
    await screenshot(tester, 'success');
    await tester.tap(find.text('Kể câu chuyện của bạn'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextField), 'Một chiều bên Cầu Rồng.');
    await tester.ensureVisible(find.text('Đăng lên nhóm bạn'));
    await tester.tap(find.text('Đăng lên nhóm bạn'));
    await tester.pumpAndSettle();
    expect(find.text('Một chiều bên Cầu Rồng.'), findsOneWidget);
    await tester.pump(const Duration(seconds: 5));
    await tester.pumpAndSettle();
    await screenshot(tester, 'feed');
    expect(tester.takeException(), isNull);
  });
  testWidgets('Judge mode rejects screen photos without granting rewards', (
    tester,
  ) async {
    await launch(tester);
    await tester.tap(find.byTooltip('Chế độ giám khảo').first);
    await tester.pumpAndSettle();
    await tester.tap(find.byType(Switch));
    await tester.tap(find.text('Hoàn tất'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Săn tìm').last);
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.byKey(const ValueKey('capture-button')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('capture-button')));
    await tester.pump();
    await tester.pump(const Duration(seconds: 2));
    await tester.pumpAndSettle();
    expect(find.text('Khoảnh khắc cần\nmột lần thử nữa'), findsOneWidget);
    final container = ProviderScope.containerOf(
      tester.element(find.byType(LockultureApp)),
    );
    expect(container.read(demoProvider).xp, 100);
    await tester.tap(find.text('Quay lại thử'));
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
  });
  for (final size in [const Size(360, 740), const Size(430, 932)]) {
    testWidgets('Layout fits ${size.width}', (tester) async {
      await launch(tester, width: size.width, height: size.height);
      expect(tester.takeException(), isNull);
      await tester.tap(find.text('Săn tìm').last);
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
      await tester.tap(find.text('Bạn bè').last);
      await tester.pumpAndSettle();
      expect(find.text('Đi săn tìm ngay'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  }
  testWidgets(
    'Real camera entry does not grant XP or request camera before opt-in',
    (tester) async {
      await launch(tester);
      final state = ProviderScope.containerOf(
        tester.element(find.byType(LockultureApp)),
      ).read(demoProvider);
      await tester.tap(find.text('Săn tìm').last);
      await tester.pumpAndSettle();
      await tester.ensureVisible(
        find.byKey(const ValueKey('real-camera-button')),
      );
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('real-camera-button')));
      await tester.pumpAndSettle();
      expect(find.text('Mở camera'), findsOneWidget);
      await screenshot(tester, 'live-camera');
      expect(find.textContaining('chỉ được gửi tới backend'), findsOneWidget);
      expect(state.xp, 100);
      await tester.pageBack();
      await tester.pumpAndSettle();
      expect(state.xp, 100);
      expect(tester.takeException(), isNull);
    },
  );
  testWidgets('Large text remains usable and judge reset restores progress', (
    tester,
  ) async {
    tester.platformDispatcher.textScaleFactorTestValue = 1.3;
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
    await launch(tester, width: 360, height: 740);
    expect(tester.takeException(), isNull);
    final state = ProviderScope.containerOf(
      tester.element(find.byType(LockultureApp)),
    ).read(demoProvider);
    state.unlock(sites.first);
    state.publish(sites.first, 'Một khoảnh khắc mới');
    await tester.pumpAndSettle();
    await tester.tap(find.byTooltip('Chế độ giám khảo').first);
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    await tester.tap(find.text('Đặt lại demo'));
    await tester.pumpAndSettle();
    expect(state.xp, 100);
    expect(state.moments, isEmpty);
    await tester.tap(find.text('Săn tìm').last);
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
  });
}
