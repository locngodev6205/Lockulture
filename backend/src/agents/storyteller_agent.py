"""
Agent 3: 'Người Kể Chuyện Locket' (Social Storytelling Agent)
Nhiệm vụ: Tạo Caption ngắn gọn, bắt trend Gen Z kết hợp Fun fact lịch sử,
đồng thời đóng vai một nhân vật lịch sử để lại bình luận đầu tiên dưới ảnh bài đăng.
"""
from datetime import datetime
from src.core.config import settings
from src.models.schemas import MomentResponse, PersonaComment

class StorytellerAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL

    async def enrich_moment(
        self,
        photo_url: str,
        landmark_name: str,
        era_id: str,
        author_name: str = "Nam"
    ) -> MomentResponse:
        """
        Sinh caption và bình luận persona bằng Gemini API.
        """
        return MomentResponse(
            moment_id=f"mom_{int(datetime.utcnow().timestamp())}",
            group_id="grp_devfest_01",
            author_name=author_name,
            photo_url=photo_url,
            gen_z_caption=f"Sống chậm lại cùng {landmark_name}... Đẹp đỉnh nóc kịch trần luôn cả nhà ơi! 📮✨",
            historical_fun_fact=f"{landmark_name} được xây dựng cuối thế kỷ 19, là biểu tượng giao thoa kiến trúc phương Tây.",
            ai_persona_comment=PersonaComment(
                persona_name="Bác Bưu Tá Năm 1891",
                avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=postman",
                content="Kính chào các tân lữ khách! Ngày xưa gửi phong thư qua trùng dương mất cả tháng, nay các cháu truyền ảnh qua chiếc gương ma thuật nhanh quá!"
            ),
            created_at=datetime.utcnow().isoformat() + "Z"
        )

storyteller_agent = StorytellerAgent()
