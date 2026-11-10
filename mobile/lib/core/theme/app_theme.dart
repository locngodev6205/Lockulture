import 'package:flutter/material.dart';

const ink = Color(0xFF0B0F19);
const surface = Color(0xFF182130);
const gold = Color(0xFFF4B75C);
const muted = Color(0xFF9AA9BC);
const jade = Color(0xFF67CDB1);
TextStyle heritage(double size, {Color color = Colors.white}) => TextStyle(
  fontFamily: 'Heritage',
  fontSize: size,
  height: 1.25,
  color: color,
);
ThemeData buildTheme() => ThemeData(
  useMaterial3: true,
  brightness: Brightness.dark,
  fontFamily: 'Vietnam',
  scaffoldBackgroundColor: ink,
  colorScheme: const ColorScheme.dark(
    primary: gold,
    secondary: jade,
    surface: surface,
  ),
  textTheme: const TextTheme(
    bodyMedium: TextStyle(height: 1.6),
    bodySmall: TextStyle(color: muted, height: 1.5),
  ),
  filledButtonTheme: FilledButtonThemeData(
    style: FilledButton.styleFrom(
      minimumSize: const Size(48, 54),
      backgroundColor: gold,
      foregroundColor: ink,
      textStyle: const TextStyle(
        fontFamily: 'Vietnam',
        fontWeight: FontWeight.w600,
      ),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
  ),
  outlinedButtonTheme: OutlinedButtonThemeData(
    style: OutlinedButton.styleFrom(
      minimumSize: const Size(48, 50),
      foregroundColor: gold,
      side: const BorderSide(color: Color(0xFF5B4B34)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
  ),
  appBarTheme: const AppBarTheme(
    backgroundColor: ink,
    surfaceTintColor: Colors.transparent,
  ),
  snackBarTheme: const SnackBarThemeData(behavior: SnackBarBehavior.floating),
);
