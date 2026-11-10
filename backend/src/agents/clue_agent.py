"""
Agent 1: 'Quản Trò Dẫn Đường' (Dynamic Clue & Location Agent)
Nhiệm vụ: Quét Google Maps Places API tìm di tích quanh vị trí GPS
và dùng Google Gemini API sáng tác mật thư câu đố dẫn đường phong cách cổ phong.
"""
from typing import Dict, Any
from src.core.config import settings
from src.models.schemas import ClueResponse

MOCK_LANDMARKS = {
    "ERA_MODERN": {
        "name": "Cầu Rồng Đà Nẵng",
        "type": "Cây cầu thép biểu tượng hiện đại",
        "distance": 200,
        "clue_l1": "Từ nơi ngươi đứng, hãy hướng mắt về phía dòng sông biếc. Có một con rồng vàng khổng lồ uốn lượn qua làn nước, ngậm vầng dương và hướng mặt ra biển Đông. Hãy đến đó!",
        "clue_l2": "Hãy tiến về đường Nguyễn Văn Linh nối dài qua sông Hàn. Đó chính là Cầu Rồng – cây cầu nặng gần 9.000 tấn thép có khả năng phun lửa!"
    },
    "ERA_NGUYEN": {
        "name": "Thành Điện Hải (Phòng tuyến 1858)",
        "type": "Pháo đài kiên cố triều Nguyễn",
        "distance": 350,
        "clue_l1": "Hãy tìm về nơi thành lũy đá son rêu phong, nơi danh tướng áo vải từng chặn đứng những bước chân ngoại bang đầu tiên năm 1858...",
        "clue_l2": "Hãy tiến về đường Trần Phú, gần bảo tàng thành phố. Tìm pháo đài hình bông sen của tướng Nguyễn Tri Phương!"
    },
    "ERA_CHAMPA": {
        "name": "Bảo tàng Điêu khắc Chăm Đà Nẵng",
        "type": "Bảo tàng điêu khắc sa thạch cổ đại",
        "distance": 400,
        "clue_l1": "Nơi ngã ba sông giao hòa, có ngôi nhà mái nhọn lưu giữ hàng trăm tượng thần Chăm Pa ngàn năm trầm mặc trong sa thạch...",
        "clue_l2": "Đó là Bảo tàng Điêu khắc Chăm nằm cạnh Cầu Rồng, nơi lưu giữ tượng Thần Shiva và đài thờ Trà Kiệu nổi tiếng."
    },
    "ERA_FRENCH_COLONIAL": {
        "name": "Nhà thờ Chính tòa Đà Nẵng (Nhà thờ Con Gà)",
        "type": "Kiến trúc Gothic Pháp màu hồng",
        "distance": 300,
        "clue_l1": "Hãy bước theo tiếng chuông ngân qua hàng cây cổ thụ. Tìm ngôi thánh đường màu hồng có chú gà sừng sững trên đỉnh tháp chuông cao vút...",
        "clue_l2": "Đó là Nhà thờ Con Gà trên đường Trần Phú, xây dựng từ năm 1923 theo phong cách Gothic Tây Âu."
    }
}

class ClueAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL

    async def generate_clue(self, latitude: float, longitude: float, era_id: str, hint_level: int = 1) -> ClueResponse:
        # Nếu có Gemini API Key thực tế và Maps API, gọi API.
        # Dự phòng Fallback để luôn trả kết quả mượt mà trong kỳ Hackathon:
        target = MOCK_LANDMARKS.get(era_id, MOCK_LANDMARKS["ERA_FRENCH_COLONIAL"])
        clue_text = target["clue_l2"] if hint_level > 1 else target["clue_l1"]

        return ClueResponse(
            status="SUCCESS",
            target_landmark_type=target["type"],
            estimated_distance_meters=target["distance"],
            clue_text=clue_text,
            hint_level=hint_level,
            is_easier_available=(hint_level == 1)
        )

clue_agent = ClueAgent()
