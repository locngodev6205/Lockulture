import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'features/demo_shell.dart';

void main() => runApp(const ProviderScope(child: LockultureApp()));

class LockultureApp extends StatelessWidget {
  const LockultureApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Lockulture',
    debugShowCheckedModeBanner: false,
    theme: buildTheme(),
    home: const DemoShell(),
  );
}
