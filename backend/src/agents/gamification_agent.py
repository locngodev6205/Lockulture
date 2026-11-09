"""
Agent 4: 'Kiến Trúc Sư Nhiệm Vụ' (Adaptive Gamification Agent)
Nhiệm vụ: Phân tích khu vực người dùng. Nếu bán kính quanh vị trí thiếu di tích
thuộc thời kỳ yêu cầu, Agent 4 tự động hạ chuẩn sang hiện vật bảo tàng hoặc kích hoạt Co-op Quest.
"""
from typing import Dict, Any

class GamificationAgent:
    def adapt_quest(self, era_id: str, nearby_sites_count: int) -> Dict[str, Any]:
        if nearby_sites_count == 0:
            return {
                "is_adapted": True,
                "adapted_quest_type": "MUSEUM_ARTIFACT_OR_PATTERN",
                "instruction": "Khu vực quanh bạn không có công trình triều đại này. Hãy đến bảo tàng gần nhất chụp hiện vật hoặc chụp họa tiết hoa văn truyền thống tương đương!",
                "coop_eligible": True
            }
        return {
            "is_adapted": False,
            "adapted_quest_type": "ORIGINAL_LANDMARK",
            "instruction": "Hãy tìm và chụp trực tiếp công trình di tích thực tế.",
            "coop_eligible": False
        }

gamification_agent = GamificationAgent()
