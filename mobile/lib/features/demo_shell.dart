import 'dart:math' as math;
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/demo/demo_state.dart';
import '../core/theme/app_theme.dart';
import '../core/services/verification_service.dart';
import 'camera/live_capture_screen.dart';

class DemoShell extends ConsumerStatefulWidget {
  const DemoShell({super.key});
  @override
  ConsumerState<DemoShell> createState() => _DemoShellState();
}

class _DemoShellState extends ConsumerState<DemoShell> {
  int tab = 0;
  bool scanning = false;
  void toast(String text) =>
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));
  @override
  Widget build(BuildContext context) {
    final state = ref.watch(demoProvider);
    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 720),
          child: SafeArea(
            child: IndexedStack(
              index: tab,
              children: [album(state), hunt(state), feed(state)],
            ),
          ),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: tab,
        onDestinationSelected: (value) => setState(() => tab = value),
        backgroundColor: const Color(0xFF111927),
        indicatorColor: gold.withValues(alpha: .14),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.auto_stories_outlined),
            selectedIcon: Icon(Icons.auto_stories, color: gold),
            label: 'Album',
          ),
          NavigationDestination(
            icon: Icon(Icons.camera_alt_outlined),
            selectedIcon: Icon(Icons.camera_alt, color: gold),
            label: 'Săn tìm',
          ),
          NavigationDestination(
            icon: Icon(Icons.people_outline),
            selectedIcon: Icon(Icons.people, color: gold),
            label: 'Bạn bè',
          ),
        ],
      ),
    );
  }

  Widget header(String title, {String? subtitle}) => Padding(
    padding: const EdgeInsets.fromLTRB(24, 20, 16, 12),
    child: Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: heritage(25)),
              if (subtitle != null)
                Text(
                  subtitle,
                  style: const TextStyle(color: muted, fontSize: 12),
                ),
            ],
          ),
        ),
        IconButton(
          tooltip: 'Chế độ giám khảo',
          onPressed: judge,
          icon: const Icon(Icons.tune_rounded, color: gold),
        ),
      ],
    ),
  );
  Widget album(DemoState state) => CustomScrollView(
    slivers: [
      SliverToBoxAdapter(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            header('Lockulture', subtitle: 'Nhặt khoảnh khắc. Chạm di sản.'),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  const Icon(Icons.location_on_outlined, size: 16, color: gold),
                  const SizedBox(width: 6),
                  const Text('Đà Nẵng', style: TextStyle(color: gold)),
                  const Spacer(),
                  badge('Bản trải nghiệm', Icons.science_outlined),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 26, 24, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Một thành phố.\nNgàn lớp ký ức.', style: heritage(36)),
                  const SizedBox(height: 12),
                  const Text(
                    'Theo dấu thời gian, lưu lại câu chuyện của bạn.',
                    style: TextStyle(color: muted, fontSize: 13),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: Stack(
                  children: [
                    const SizedBox(
                      height: 225,
                      width: double.infinity,
                      child: HeritageScene(),
                    ),
                    Positioned.fill(
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              ink.withValues(alpha: .95),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Positioned(
                      left: 20,
                      top: 18,
                      child: badge('Nhiệm vụ nổi bật', Icons.explore_outlined),
                    ),
                    Positioned(
                      left: 20,
                      right: 20,
                      bottom: 16,
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Lời gọi từ sông Hàn',
                                  style: heritage(23),
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  'Cầu Rồng • Đổi mới & hiện đại',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: Color(0xFFD1D7E0),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          IconButton.filled(
                            onPressed: () => clue(sites.first),
                            tooltip: 'Khám phá Cầu Rồng',
                            style: IconButton.styleFrom(
                              backgroundColor: gold,
                              foregroundColor: ink,
                            ),
                            icon: const Icon(Icons.arrow_forward),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Hành trình của nhóm',
                          style: TextStyle(fontWeight: FontWeight.w600),
                        ),
                      ),
                      Text(
                        '${state.unlocked.length}/6 thời kỳ',
                        style: const TextStyle(color: gold, fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: state.unlocked.length / 6,
                      minHeight: 5,
                      color: gold,
                      backgroundColor: surface,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Icon(
                        Icons.workspace_premium_outlined,
                        color: gold,
                        size: 18,
                      ),
                      const SizedBox(width: 6),
                      const Text(
                        'Lữ khách sông Hàn',
                        style: TextStyle(fontSize: 12, color: muted),
                      ),
                      const Spacer(),
                      Text(
                        '${state.xp} XP',
                        style: const TextStyle(color: gold, fontSize: 12),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
              child: Text('Dòng thời gian của bạn', style: heritage(23)),
            ),
          ],
        ),
      ),
      SliverList.builder(
        itemCount: eras.length,
        itemBuilder: (context, index) {
          final era = eras[index];
          final open = state.unlocked.contains(era.id);
          final site =
              state.discoveries[era.id] ??
              sites.firstWhere((s) => s.era == era.id);
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  SizedBox(
                    width: 25,
                    child: Column(
                      children: [
                        const SizedBox(height: 22),
                        Icon(
                          open ? Icons.check_circle : Icons.circle_outlined,
                          size: 16,
                          color: open ? jade : const Color(0xFF5D6878),
                        ),
                        if (index < eras.length - 1)
                          const Expanded(
                            child: VerticalDivider(
                              color: Color(0xFF2C3748),
                              thickness: 1,
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Material(
                        color: open ? const Color(0xFF162B2C) : surface,
                        borderRadius: BorderRadius.circular(18),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(18),
                          onTap: () => open ? discovery(site) : clue(site),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        era.period,
                                        style: TextStyle(
                                          fontSize: 10,
                                          color: open ? jade : muted,
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(era.name, style: heritage(19)),
                                      const SizedBox(height: 6),
                                      Text(
                                        open
                                            ? 'Đã lưu dấu • ${site.name}'
                                            : 'Một câu chuyện đang đợi bạn',
                                        style: TextStyle(
                                          fontSize: 11,
                                          color: open ? jade : muted,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Icon(
                                  open
                                      ? Icons.verified_outlined
                                      : Icons.lock_outline,
                                  color: open ? jade : muted,
                                  size: 23,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
      const SliverToBoxAdapter(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text(
            'Không cần đi theo thứ tự. Mỗi bước chân đều là một khởi đầu.',
            textAlign: TextAlign.center,
            style: TextStyle(color: muted, fontSize: 11),
          ),
        ),
      ),
    ],
  );
  Widget badge(String text, IconData icon) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
    decoration: BoxDecoration(
      color: ink.withValues(alpha: .72),
      borderRadius: BorderRadius.circular(30),
      border: Border.all(color: Colors.white12),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: gold, size: 13),
        const SizedBox(width: 6),
        Text(
          text,
          style: const TextStyle(fontSize: 10, color: Color(0xFFE7D5B5)),
        ),
      ],
    ),
  );
  void clue(Site site) {
    bool easy = false;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: surface,
      showDragHandle: true,
      builder: (sheetContext) => StatefulBuilder(
        builder: (context, update) => SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(24, 0, 24, 28),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                badge('Mật thư dành cho bạn', Icons.history_edu),
                const SizedBox(height: 20),
                Text(
                  'Người gác cổng\nthời gian nhắn rằng…',
                  style: heritage(28),
                ),
                const SizedBox(height: 22),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(22),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEEE2C9),
                    borderRadius: BorderRadius.circular(4),
                    border: const Border(
                      left: BorderSide(color: gold, width: 4),
                    ),
                  ),
                  child: Text(
                    easy
                        ? 'Hãy tìm ${site.name} tại Đà Nẵng. Đó là nơi câu chuyện tiếp theo đang chờ bạn.'
                        : '“${site.clue}”',
                    style: heritage(20, color: const Color(0xFF3F3528)),
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Khoảng cách mô phỏng: 200 m • +150 XP khi mở khóa mới',
                  style: TextStyle(color: muted, fontSize: 11),
                ),
                const SizedBox(height: 22),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: easy ? null : () => update(() => easy = true),
                    icon: const Icon(Icons.lightbulb_outline, size: 19),
                    label: Text(
                      easy ? 'Đã hiển thị gợi ý cuối' : 'Gợi ý dễ hơn',
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: () {
                      ref.read(demoProvider).select(site);
                      Navigator.pop(sheetContext);
                      setState(() => tab = 1);
                    },
                    icon: const Icon(Icons.camera_alt_outlined),
                    label: const Text('Bắt đầu săn tìm'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void discovery(Site site) => showModalBottomSheet(
    context: context,
    showDragHandle: true,
    backgroundColor: surface,
    builder: (context) => SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 0, 24, 28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(Icons.verified, color: jade, size: 36),
            const SizedBox(height: 16),
            Text(site.name, style: heritage(28)),
            if (ref.read(demoProvider).discoveryPhotos[site.era] != null)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.memory(
                    ref.read(demoProvider).discoveryPhotos[site.era]!,
                    height: 200,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            const SizedBox(height: 12),
            Text(site.fact),
            const SizedBox(height: 12),
            const Text(
              'Đã lưu vào album của nhóm trong phiên demo.',
              style: TextStyle(color: muted),
            ),
          ],
        ),
      ),
    ),
  );
  Widget hunt(DemoState state) => ListView(
    padding: EdgeInsets.zero,
    children: [
      header(
        'Săn tìm di sản',
        subtitle: 'Một góc nhìn mới cho những điều xưa cũ',
      ),
      Padding(
        padding: const EdgeInsets.fromLTRB(24, 10, 24, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                badge('Chế độ mô phỏng', Icons.science_outlined),
                const Spacer(),
                IconButton(
                  onPressed: scanning ? null : pickMission,
                  tooltip: 'Đổi nhiệm vụ',
                  icon: const Icon(Icons.swap_horiz, color: gold),
                ),
              ],
            ),
            const SizedBox(height: 18),
            Text(state.selected.name, style: heritage(30)),
            const SizedBox(height: 6),
            Text(
              eras.firstWhere((e) => e.id == state.selected.era).name,
              style: const TextStyle(color: muted),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                key: const ValueKey('real-camera-button'),
                onPressed: scanning ? null : liveCapture,
                icon: const Icon(Icons.camera_enhance_outlined),
                label: const Text('Camera thật + Gemini'),
              ),
            ),
            const SizedBox(height: 24),
            AspectRatio(
              aspectRatio: 1,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(28),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    HeritageScene(era: state.selected.era),
                    const Positioned(
                      top: 18,
                      left: 18,
                      child: Icon(Icons.crop_free, size: 42, color: gold),
                    ),
                    const Positioned(
                      bottom: 18,
                      right: 18,
                      child: RotatedBox(
                        quarterTurns: 2,
                        child: Icon(Icons.crop_free, size: 42, color: gold),
                      ),
                    ),
                    Align(
                      alignment: Alignment.bottomCenter,
                      child: Container(
                        margin: const EdgeInsets.all(30),
                        padding: const EdgeInsets.all(10),
                        color: ink.withValues(alpha: .7),
                        child: const Text(
                          'Ảnh minh họa • Camera chưa kết nối',
                          style: TextStyle(fontSize: 10),
                        ),
                      ),
                    ),
                    if (scanning)
                      Container(
                        color: ink.withValues(alpha: .82),
                        child: const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            CircularProgressIndicator(color: gold),
                            SizedBox(height: 24),
                            Text('Đang giám định khoảnh khắc…'),
                            SizedBox(height: 8),
                            Text(
                              'Mô phỏng trải nghiệm',
                              style: TextStyle(color: muted, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                const Icon(Icons.location_on_outlined, color: gold, size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'GPS mô phỏng: ${state.selected.lat}, ${state.selected.lng}',
                    style: const TextStyle(fontSize: 11, color: muted),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Center(
              child: Text(
                state.spoof
                    ? 'Kịch bản: ảnh chụp màn hình'
                    : 'Đưa di sản vào chính giữa khung hình',
                style: const TextStyle(color: muted, fontSize: 12),
              ),
            ),
            const SizedBox(height: 20),
            Center(
              child: Semantics(
                button: true,
                label: 'Chụp mô phỏng',
                child: SizedBox(
                  width: 82,
                  height: 82,
                  child: FilledButton(
                    key: const ValueKey('capture-button'),
                    onPressed: scanning ? null : capture,
                    style: FilledButton.styleFrom(
                      shape: const CircleBorder(),
                      padding: EdgeInsets.zero,
                      side: const BorderSide(color: Colors.white, width: 3),
                    ),
                    child: const Icon(Icons.camera_alt, size: 30),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            const Center(
              child: Text(
                'Chạm để thử giám định',
                style: TextStyle(color: gold, fontSize: 11),
              ),
            ),
          ],
        ),
      ),
    ],
  );
  void pickMission() => showModalBottomSheet(
    context: context,
    showDragHandle: true,
    backgroundColor: surface,
    builder: (context) => ListView(
      children: [
        Padding(
          padding: const EdgeInsets.all(20),
          child: Text('Bạn muốn tìm dấu ấn nào?', style: heritage(24)),
        ),
        ...eras.map(
          (e) => ListTile(
            title: Text(e.name),
            subtitle: Text(e.period),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              ref
                  .read(demoProvider)
                  .select(sites.firstWhere((s) => s.era == e.id));
              Navigator.pop(context);
            },
          ),
        ),
      ],
    ),
  );
  Future<void> capture() async {
    final state = ref.read(demoProvider);
    final site = state.selected;
    final spoof = state.spoof;
    setState(() => scanning = true);
    await Future<void>.delayed(
      Duration(
        milliseconds: MediaQuery.of(context).disableAnimations ? 100 : 1500,
      ),
    );
    if (!mounted) return;
    setState(() => scanning = false);
    final fresh = spoof ? false : state.unlock(site);
    if (!mounted) return;
    showModalBottomSheet(
      context: context,
      isDismissible: false,
      enableDrag: false,
      isScrollControlled: true,
      backgroundColor: surface,
      builder: (resultContext) => SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(
                spoof ? Icons.phonelink_erase : Icons.auto_awesome,
                size: 52,
                color: spoof ? const Color(0xFFFF8096) : gold,
              ),
              const SizedBox(height: 20),
              Text(
                spoof
                    ? 'Khoảnh khắc cần\nmột lần thử nữa'
                    : fresh
                    ? 'Một dấu ấn mới\ntrong hành trình!'
                    : 'Gặp lại một\ndấu ấn thân quen',
                style: heritage(30),
              ),
              const SizedBox(height: 16),
              Text(
                spoof
                    ? 'Ảnh được mô phỏng là chụp lại màn hình. Hãy thử kịch bản ảnh thực tế trong Chế độ giám khảo.'
                    : '${site.name} đã có trong album của nhóm. ${fresh ? '+150 XP dành cho bước chân khám phá của bạn.' : 'Thời kỳ này đã mở khóa nên không cộng thêm XP.'}',
              ),
              const SizedBox(height: 16),
              const Text(
                'Kết quả mô phỏng, chưa qua xác thực AI.',
                style: TextStyle(color: muted, fontSize: 11),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: () {
                    Navigator.pop(resultContext);
                    if (!spoof) compose(site);
                  },
                  child: Text(spoof ? 'Quay lại thử' : 'Kể câu chuyện của bạn'),
                ),
              ),
              if (!spoof)
                SizedBox(
                  width: double.infinity,
                  child: TextButton(
                    onPressed: () {
                      Navigator.pop(resultContext);
                      setState(() => tab = 0);
                    },
                    child: const Text('Về album'),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> liveCapture() async {
    final site = ref.read(demoProvider).selected;
    final photo = await Navigator.push<VerifiedPhoto>(
      context,
      MaterialPageRoute(builder: (_) => LiveCaptureScreen(site: site)),
    );
    if (!mounted || photo == null || !photo.assessment.valid) return;
    final fresh = ref.read(demoProvider).unlock(site, photo: photo.bytes);
    toast(
      fresh
          ? 'Đã mở khóa ${site.name}: +150 XP.'
          : 'Đã cập nhật ảnh. Thời kỳ này đã nhận XP.',
    );
    await compose(site, photo: photo.bytes);
  }

  Future<void> compose(Site site, {Uint8List? photo}) async {
    final caption = TextEditingController(
      text:
          'Một chiều chạm vào ký ức Đà Nẵng tại ${site.name}. Đi để thấy lịch sử gần mình hơn.',
    );
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: surface,
      showDragHandle: true,
      builder: (composeContext) => SafeArea(
        child: Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.viewInsetsOf(composeContext).bottom,
          ),
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Gửi một khoảnh khắc', style: heritage(27)),
                const SizedBox(height: 18),
                ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: SizedBox(
                    height: 150,
                    width: double.infinity,
                    child: photo == null
                        ? HeritageScene(era: site.era)
                        : Image.memory(photo, fit: BoxFit.cover),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: caption,
                  maxLines: 4,
                  maxLength: 500,
                  decoration: const InputDecoration(
                    labelText: 'Cảm nghĩ của bạn',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Chuyện nhỏ về ${site.name}',
                  style: const TextStyle(color: gold),
                ),
                const SizedBox(height: 6),
                Text(
                  site.fact,
                  style: const TextStyle(fontSize: 12, color: muted),
                ),
                const SizedBox(height: 16),
                persona(site),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: () {
                      final text = caption.text.trim();
                      if (text.isEmpty) {
                        toast('Viết một dòng cảm nghĩ trước khi đăng nhé.');
                        return;
                      }
                      ref.read(demoProvider).publish(site, text, photo: photo);
                      Navigator.pop(composeContext);
                      setState(() => tab = 2);
                      toast('Đã đăng khoảnh khắc vào nhóm demo.');
                    },
                    icon: const Icon(Icons.send_outlined, size: 18),
                    label: const Text('Đăng lên nhóm bạn'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
    // The route's closing transition may still render the text field.
    await Future<void>.delayed(const Duration(milliseconds: 400));
    caption.dispose();
  }

  Widget persona(Site site) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: gold.withValues(alpha: .07),
      borderRadius: BorderRadius.circular(14),
      border: Border.all(color: gold.withValues(alpha: .2)),
    ),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Icon(Icons.temple_buddhist_outlined, color: gold, size: 22),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                site.persona,
                style: const TextStyle(
                  color: gold,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 5),
              const Text(
                '“Khá khen lữ khách! Cảm ơn bạn đã mang câu chuyện nơi này đến với những người bạn của mình.”',
                style: TextStyle(fontSize: 12, color: Color(0xFFD7DDE5)),
              ),
            ],
          ),
        ),
      ],
    ),
  );
  Widget feed(DemoState state) => ListView(
    children: [
      header(
        'Khoảnh khắc bạn bè',
        subtitle: 'Những chuyến đi nối chúng mình lại gần',
      ),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
        child: Row(
          children: [
            badge('Nhóm Lữ khách sông Hàn', Icons.people_outline),
            const Spacer(),
            Text(
              '${state.moments.length} bài',
              style: const TextStyle(color: muted, fontSize: 11),
            ),
          ],
        ),
      ),
      if (state.moments.isEmpty)
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 60),
          child: Column(
            children: [
              const Icon(Icons.mark_as_unread_outlined, size: 60, color: gold),
              const SizedBox(height: 24),
              Text(
                'Câu chuyện đầu tiên\nđang chờ bạn',
                textAlign: TextAlign.center,
                style: heritage(29),
              ),
              const SizedBox(height: 16),
              const Text(
                'Săn tìm một di sản, lưu dấu trong album và gửi khoảnh khắc đến nhóm bạn.',
                textAlign: TextAlign.center,
                style: TextStyle(color: muted),
              ),
              const SizedBox(height: 26),
              FilledButton(
                onPressed: () => setState(() => tab = 1),
                child: const Text('Đi săn tìm ngay'),
              ),
            ],
          ),
        ),
      ...state.moments.map(
        (moment) => Padding(
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const CircleAvatar(
                    backgroundColor: Color(0xFF3F4B3E),
                    child: Icon(Icons.person_outline, color: gold),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          moment.author,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '${moment.site.name} • Vừa xong',
                          style: const TextStyle(color: muted, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.public, size: 16, color: muted),
                ],
              ),
              const SizedBox(height: 16),
              ClipRRect(
                borderRadius: BorderRadius.circular(22),
                child: AspectRatio(
                  aspectRatio: 1,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      if (moment.photo == null)
                        HeritageScene(era: moment.site.era)
                      else
                        Image.memory(moment.photo!, fit: BoxFit.cover),
                      Positioned(
                        bottom: 16,
                        left: 16,
                        child: badge(
                          moment.photo == null
                              ? 'Ảnh minh họa'
                              : 'Ảnh chụp • Đã giám định AI',
                          Icons.landscape_outlined,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(moment.caption),
              const SizedBox(height: 12),
              Text(
                moment.site.fact,
                style: const TextStyle(color: muted, fontSize: 12),
              ),
              const SizedBox(height: 16),
              persona(moment.site),
              const SizedBox(height: 10),
              Wrap(
                spacing: 10,
                children: ['❤️', '🔥', '👏', '👑']
                    .map(
                      (r) => FilterChip(
                        label: Text(r),
                        selected: moment.reactions.contains(r),
                        onSelected: (_) =>
                            ref.read(demoProvider).react(moment, r),
                      ),
                    )
                    .toList(),
              ),
              const SizedBox(height: 14),
              const Divider(color: Colors.white12),
            ],
          ),
        ),
      ),
    ],
  );
  void judge() => showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: surface,
    showDragHandle: true,
    builder: (sheetContext) => Consumer(
      builder: (context, ref, _) {
        final state = ref.watch(demoProvider);
        return SafeArea(
          child: SizedBox(
            height: MediaQuery.sizeOf(context).height * .78,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Chế độ giám khảo', style: heritage(27)),
                      const SizedBox(height: 8),
                      const Text(
                        'Dữ liệu và kết quả đều được mô phỏng trong phiên.',
                        style: TextStyle(color: muted, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                SwitchListTile(
                  title: const Text('Mô phỏng ảnh màn hình'),
                  subtitle: const Text(
                    'Bật để thử kết quả từ chối',
                    style: TextStyle(color: muted, fontSize: 11),
                  ),
                  value: state.spoof,
                  onChanged: scanning ? null : state.setSpoof,
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                  child: Text(
                    'Chọn địa điểm mô phỏng',
                    style: TextStyle(color: gold),
                  ),
                ),
                Expanded(
                  child: ListView.builder(
                    itemCount: sites.length,
                    itemBuilder: (context, i) => ListTile(
                      title: Text(
                        sites[i].name,
                        style: const TextStyle(fontSize: 13),
                      ),
                      subtitle: Text(
                        '${sites[i].lat}, ${sites[i].lng}',
                        style: const TextStyle(fontSize: 10, color: muted),
                      ),
                      trailing: Icon(
                        state.selected == sites[i]
                            ? Icons.radio_button_checked
                            : Icons.radio_button_off,
                        color: state.selected == sites[i] ? gold : muted,
                      ),
                      selected: state.selected == sites[i],
                      enabled: !scanning,
                      onTap: () => state.select(sites[i]),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: scanning
                              ? null
                              : () {
                                  state.reset();
                                  Navigator.pop(sheetContext);
                                  setState(() => tab = 0);
                                  toast('Đã đặt lại phiên demo.');
                                },
                          child: const Text('Đặt lại demo'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: FilledButton(
                          onPressed: () => Navigator.pop(sheetContext),
                          child: const Text('Hoàn tất'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    ),
  );
}

/// Original vector illustration: Hàn river, bridge and heritage silhouettes.
/// Rendered locally so the demo remains usable without image downloads.
class HeritageScene extends StatelessWidget {
  final String era;
  const HeritageScene({super.key, this.era = 'modern'});
  @override
  Widget build(BuildContext context) =>
      CustomPaint(painter: _ScenePainter(era));
}

class _ScenePainter extends CustomPainter {
  final String era;
  _ScenePainter(this.era);
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width, h = size.height;
    final p = Paint();
    canvas.drawRect(
      Offset.zero & size,
      p
        ..shader = const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF243948), Color(0xFF536666), Color(0xFF152D3A)],
        ).createShader(Offset.zero & size),
    );
    p.shader = null;
    canvas.drawCircle(
      Offset(w * .76, h * .23),
      h * .13,
      p..color = const Color(0xFFE5C595),
    );
    for (int i = 0; i < 19; i++) {
      final x = i * w / 18;
      final bh = h * (.07 + (math.sin(i * 7).abs() * .15));
      canvas.drawRect(
        Rect.fromLTWH(x, h * .58 - bh, w / 25, bh),
        p..color = const Color(0xFF263C46),
      );
    }
    canvas.drawRect(
      Rect.fromLTWH(0, h * .58, w, h * .42),
      p..color = const Color(0xFF173441),
    );
    if (era == 'modern') {
      final deck = Path()
        ..moveTo(-10, h * .64)
        ..lineTo(w + 10, h * .55);
      canvas.drawPath(
        deck,
        p
          ..color = const Color(0xFFE9B45E)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 7,
      );
      final dragon = Path()
        ..moveTo(-15, h * .58)
        ..cubicTo(w * .18, h * .18, w * .29, h * .72, w * .43, h * .46)
        ..cubicTo(w * .60, h * .12, w * .67, h * .64, w * .8, h * .37)
        ..lineTo(w * .89, h * .32)
        ..lineTo(w * .95, h * .34);
      canvas.drawPath(
        dragon,
        p
          ..color = const Color(0xFFD9A14D)
          ..strokeWidth = 16
          ..strokeCap = StrokeCap.round,
      );
      canvas.drawPath(
        dragon,
        p
          ..color = const Color(0xFFF5D392)
          ..strokeWidth = 3,
      );
      for (int i = 1; i < 13; i++) {
        final x = w * i / 14;
        canvas.drawLine(
          Offset(x, h * .62 - i * h * .005),
          Offset(x, h * .48),
          p
            ..color = const Color(0xFFA5804C)
            ..strokeWidth = 1,
        );
      }
      p.style = PaintingStyle.fill;
      canvas.drawCircle(Offset(w * .9, h * .32), 2, p..color = ink);
    } else {
      final cx = w * .5;
      final base = h * .60;
      p.style = PaintingStyle.fill;
      canvas.drawRect(
        Rect.fromLTWH(cx - w * .2, base - h * .2, w * .4, h * .2),
        p..color = const Color(0xFFB99A73),
      );
      final roof = Path()
        ..moveTo(cx - w * .28, base - h * .2)
        ..lineTo(cx, base - h * .43)
        ..lineTo(cx + w * .28, base - h * .2)
        ..close();
      canvas.drawPath(roof, p..color = const Color(0xFF785847));
      for (int i = -1; i < 2; i++) {
        canvas.drawRect(
          Rect.fromLTWH(
            cx + i * w * .12 - w * .025,
            base - h * .13,
            w * .05,
            h * .13,
          ),
          p..color = const Color(0xFF283A3F),
        );
      }
      canvas.drawRect(
        Rect.fromLTWH(cx - w * .25, base, w * .5, h * .025),
        p..color = gold,
      );
    }
    p.style = PaintingStyle.stroke;
    p.strokeWidth = 1;
    for (int i = 0; i < 18; i++) {
      final y = h * .67 + i * h * .019;
      final x = math.sin(i * 2.7) * w * .25 + w * .3;
      canvas.drawLine(
        Offset(x, y),
        Offset(x + w * .35, y),
        p
          ..color = const Color(
            0xFF729092,
          ).withValues(alpha: .12 + (i % 3) * .06),
      );
    }
    p.style = PaintingStyle.fill;
    canvas.drawRect(
      Offset.zero & size,
      p
        ..shader = const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.transparent, Color(0x880B0F19)],
        ).createShader(Offset.zero & size),
    );
  }

  @override
  bool shouldRepaint(covariant _ScenePainter oldDelegate) =>
      era != oldDelegate.era;
}
