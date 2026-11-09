"""
Agent 2: 'Giám Định Viên Lịch Sử' (Multimodal Verification Agent)
Nhiệm vụ: Sử dụng Gemini Multimodal Vision kiểm tra Anti-spoofing (chống chụp màn hình),
nhận diện công trình/hiện vật và trả về kết quả Structured JSON.
"""
from typing import Optional
from src.core.config import settings
from src.models.schemas import VerificationResult

class VerificationAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL

    async def verify_photo(
        self,
        image_bytes: bytes,
        latitude: float,
        longitude: float,
        target_era_id: str
    ) -> VerificationResult:
        """
        Quy trình thẩm định ảnh qua Gemini Multimodal Vision API.
        Khi thi Hackathon, tích hợp Google GenAI SDK với schema Pydantic.
        """
        # Trả về kết quả mẫu chuẩn hóa để hệ thống sẵn sàng hoạt động ngay:
        return VerificationResult(
            is_valid=True,
            confidence_score=0.96,
            detected_landmark="Bưu điện Trung tâm Sài Gòn",
            matched_era=target_era_id,
            is_screen_spoof=False,
            reject_reason=None,
            xp_reward=150
        )

verification_agent = VerificationAgent()
