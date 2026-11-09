import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lockulture/features/album/presentation/screens/album_screen.dart';
import 'package:lockulture/features/feed/presentation/screens/feed_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const LockultureApp());
}

class LockultureApp extends StatelessWidget {
  const LockultureApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Lockulture",
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        primaryColor: Colors.amber,
        scaffoldBackgroundColor: const Color(0xFF12121E),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    AlbumScreen(),
    FeedScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        backgroundColor: const Color(0xFF1E1E2C),
        indicatorColor: Colors.amber.withOpacity(0.2),
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) => setState(() => _currentIndex = index),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.auto_stories_outlined),
            selectedIcon: Icon(Icons.auto_stories, color: Colors.amber),
            label: "Album Lịch Sử",
          ),
          NavigationDestination(
            icon: Icon(Icons.photo_library_outlined),
            selectedIcon: Icon(Icons.photo_library, color: Colors.amber),
            label: "Feed Locket",
          ),
        ],
      ),
    );
  }
}
