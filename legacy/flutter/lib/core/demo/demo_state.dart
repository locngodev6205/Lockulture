import "package:flutter/foundation.dart";
import 'package:flutter_riverpod/flutter_riverpod.dart';

class Era {
  final String id, name, period;
  const Era(this.id, this.name, this.period);
}

const eras = [
  Era('champa', 'Dấu ấn Chăm Pa', 'Thế kỷ II – XV'),
  Era('expansion', 'Mở cõi & tín ngưỡng', 'Thế kỷ XV – XVIII'),
  Era('nguyen', 'Triều Nguyễn', 'Thế kỷ XIX'),
  Era('french', 'Dấu xưa Tourane', '1888 – 1945'),
  Era('revolution', 'Kháng chiến & thống nhất', '1945 – 1975'),
  Era('modern', 'Đổi mới & hiện đại', '1997 – nay'),
];

class Site {
  final String name, era, persona, clue, fact;
  final double lat, lng;
  const Site(
    this.name,
    this.era,
    this.lat,
    this.lng,
    this.persona,
    this.clue,
    this.fact,
  );
}

const sites = [
  Site(
    'Cầu Rồng',
    'modern',
    16.0611,
    108.2274,
    'Thần Rồng Sông Hàn',
    'Ta nằm vắt ngang dòng Hàn, khoác vảy vàng và hướng về biển lớn. Cuối tuần, ta đánh thức màn đêm bằng lửa và nước. Ngươi có tìm được ta?',
    'Cầu Rồng được khánh thành năm 2013, kết nối hai bờ sông Hàn.',
  ),
  Site(
    'Bảo tàng Điêu khắc Chăm',
    'champa',
    16.0607,
    108.2236,
    'Người giữ ký ức Chăm',
    'Bên dòng Hàn, những vị thần sa thạch vẫn kể chuyện ngàn năm. Hãy tìm mái nhà gìn giữ ký ức Chăm Pa.',
    'Bảo tàng lưu giữ các tác phẩm điêu khắc của nền văn hóa Chăm Pa.',
  ),
  Site(
    'Tháp Chăm Phong Lệ',
    'champa',
    15.9982,
    108.2045,
    'Người giữ tháp',
    'Dưới lớp đất làng xưa, dấu chân của những người xây tháp còn ở lại. Hãy tìm ký ức Phong Lệ.',
    'Phong Lệ là địa điểm khảo cổ có dấu tích kiến trúc Chăm.',
  ),
  Site(
    'Ngũ Hành Sơn',
    'expansion',
    16.0044,
    108.2635,
    'Người kể chuyện núi',
    'Năm ngọn núi mang tên ngũ hành, giấu những mái chùa và hang động trong lòng đá.',
    'Ngũ Hành Sơn gắn với cảnh quan núi đá và đời sống tín ngưỡng địa phương.',
  ),
  Site(
    'Đình làng Hải Châu',
    'expansion',
    16.0652,
    108.2198,
    'Tiền hiền Hải Châu',
    'Giữa lòng phố thị, mái đình còn nhớ bước chân những người khai khẩn làng xưa.',
    'Đình làng Hải Châu là một địa điểm sinh hoạt văn hóa và tín ngưỡng của cộng đồng.',
  ),
  Site(
    'Thành Điện Hải',
    'nguyen',
    16.0754,
    108.2235,
    'Nguyễn Tri Phương',
    'Tìm thành lũy giữ lời thề bên cửa biển, nơi còn vang tiếng súng của năm 1858.',
    'Thành Điện Hải gắn với cuộc kháng chiến chống liên quân Pháp – Tây Ban Nha năm 1858.',
  ),
  Site(
    'Hải Vân Quan',
    'nguyen',
    16.1972,
    108.1317,
    'Người lính giữ đèo',
    'Nơi mây và núi gặp nhau, cửa quan đứng canh con đường qua đèo.',
    'Hải Vân Quan nằm trên đỉnh đèo Hải Vân.',
  ),
  Site(
    'Nhà thờ Con Gà',
    'french',
    16.0667,
    108.2239,
    'Người kể chuyện Tourane',
    'Theo tiếng chuông tìm bức tường hồng; trên đỉnh tháp, một chú gà đứng nhìn thành phố.',
    'Nhà thờ Chính tòa Đà Nẵng còn được gọi là Nhà thờ Con Gà.',
  ),
  Site(
    'Chợ Hàn',
    'french',
    16.0683,
    108.2244,
    'Tiểu thương Chợ Hàn',
    'Hương vị phố biển theo tiếng rao, bên dòng sông mang cùng tên ngôi chợ.',
    'Chợ Hàn là một địa điểm thương mại quen thuộc ở trung tâm Đà Nẵng.',
  ),
  Site(
    'Bảo tàng Quân khu 5',
    'revolution',
    16.0494,
    108.2177,
    'Người lính năm xưa',
    'Những kỷ vật lặng im vẫn kể về một thời khói lửa. Hãy tìm nơi ký ức người lính được giữ gìn.',
    'Bảo tàng giới thiệu lịch sử và các hiện vật gắn với lực lượng vũ trang Quân khu 5.',
  ),
  Site(
    'Căn cứ K20',
    'revolution',
    16.0315,
    108.2483,
    'Người giao liên K20',
    'Trong lòng làng nhỏ, những lối đi bí mật từng nối nhịp một thời kháng chiến.',
    'K20 là căn cứ cách mạng tại Đà Nẵng.',
  ),
  Site(
    'Cầu Sông Hàn',
    'modern',
    16.0722,
    108.2275,
    'Người kỹ sư sông Hàn',
    'Ta xoay mình giữa dòng sông để những con tàu đi qua, rồi lại nối nhịp phố đôi bờ.',
    'Cầu Sông Hàn được đưa vào sử dụng năm 2000.',
  ),
];

class Moment {
  final Site site;
  final String caption, author;
  final Set<String> reactions;
  final Uint8List? photo;
  Moment(
    this.site,
    this.caption, {
    this.author = 'Bạn',
    this.photo,
    Set<String>? reactions,
  }) : reactions = reactions ?? {};
}

class DemoState extends ChangeNotifier {
  final Set<String> unlocked = {'champa'};
  final Map<String, Site> discoveries = {'champa': sites[1]};
  final Map<String, Uint8List> discoveryPhotos = {};
  final List<Moment> moments = [];
  Site selected = sites.first;
  bool spoof = false;
  int get xp => 100 + (unlocked.length - 1) * 150;
  void select(Site site) {
    selected = site;
    notifyListeners();
  }

  void setSpoof(bool value) {
    spoof = value;
    notifyListeners();
  }

  bool unlock(Site site, {Uint8List? photo}) {
    final fresh = unlocked.add(site.era);
    if (fresh) discoveries[site.era] = site;
    if (photo != null) {
      discoveries[site.era] = site;
      discoveryPhotos[site.era] = photo;
    }
    notifyListeners();
    return fresh;
  }

  void publish(Site site, String caption, {Uint8List? photo}) {
    moments.insert(0, Moment(site, caption, photo: photo));
    notifyListeners();
  }

  void react(Moment moment, String reaction) {
    if (!moment.reactions.add(reaction)) moment.reactions.remove(reaction);
    notifyListeners();
  }

  void reset() {
    unlocked
      ..clear()
      ..add('champa');
    discoveries
      ..clear()
      ..['champa'] = sites[1];
    moments.clear();
    discoveryPhotos.clear();
    selected = sites.first;
    spoof = false;
    notifyListeners();
  }
}

final demoProvider = ChangeNotifierProvider((ref) => DemoState());
