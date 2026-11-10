from typing import Optional, List, Dict
from pydantic import BaseModel, Field

# -------------------------------------------------------------
# CLUE AGENT SCHEMAS (AGENT 1)
# -------------------------------------------------------------
class ClueRequest(BaseModel):
    latitude: float
    longitude: float
    era_id: str
    hint_level: int = 1

class ClueResponse(BaseModel):
    status: str = "SUCCESS"
    target_landmark_type: str
    estimated_distance_meters: int
    clue_text: str
    hint_level: int
    is_easier_available: bool

# -------------------------------------------------------------
# VERIFICATION AGENT SCHEMAS (AGENT 2)
# -------------------------------------------------------------
class VerificationResult(BaseModel):
    is_valid: bool = Field(description="Liệu ảnh có hợp lệ và khớp với thời kỳ không")
    confidence_score: float = Field(ge=0, le=1, description="Độ tin cậy từ 0.0 đến 1.0")
    detected_landmark: str = Field(description="Tên công trình hoặc đồ vật nhận diện được")
    matched_era: Optional[str] = Field(None, description="Mã thời kỳ khớp")
    is_screen_spoof: bool = Field(description="True nếu là ảnh chụp lại màn hình máy tính/điện thoại")
    reject_reason: Optional[str] = Field(None, description="Lý do từ chối nếu không hợp lệ")
    xp_reward: int = Field(0, description="Số điểm thưởng kinh nghiệm")

# -------------------------------------------------------------
# STORYTELLER AGENT SCHEMAS (AGENT 3)
# -------------------------------------------------------------
class PersonaComment(BaseModel):
    persona_name: str
    avatar_url: str
    content: str

class MomentEnrichRequest(BaseModel):
    photo_url: str
    landmark_name: str
    era_id: str

class MomentResponse(BaseModel):
    moment_id: str
    group_id: str
    author_name: str
    photo_url: str
    gen_z_caption: str
    historical_fun_fact: str
    ai_persona_comment: PersonaComment
    created_at: str

# -------------------------------------------------------------
# ALBUM & ERA SCHEMAS
# -------------------------------------------------------------
class HistoricalEraItem(BaseModel):
    era_id: str
    era_name: str
    time_range: str
    is_unlocked: bool
    unlocked_by: Optional[str] = None
    photo_url: Optional[str] = None
    landmark_name: Optional[str] = None
    xp_earned: int = 0

class AlbumResponse(BaseModel):
    group_id: str
    completion_rate: float
    eras: List[HistoricalEraItem]
