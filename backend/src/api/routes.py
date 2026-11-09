from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Dict, Any
from src.models.schemas import (
    ClueRequest, ClueResponse, VerificationResult,
    MomentEnrichRequest, MomentResponse, AlbumResponse, HistoricalEraItem
)
from src.agents.clue_agent import clue_agent
from src.agents.verification_agent import verification_agent
from src.agents.storyteller_agent import storyteller_agent
from src.agents.gamification_agent import gamification_agent

router = APIRouter()

# ------------------------------------------------------------------
# ALBUM POKEDEX & ERAS
# ------------------------------------------------------------------
@router.get("/album/eras", response_model=AlbumResponse)
async def get_album_eras():
    return AlbumResponse(
        group_id="grp_danang_01",
        completion_rate=0.4,
        eras=[
            HistoricalEraItem(
                era_id="ERA_CHAMPA",
                era_name="Thời Cổ Đại & Văn Hóa Chăm Pa",
                time_range="Thế kỷ II - XV",
                is_unlocked=True,
                unlocked_by="Nam",
                photo_url="https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=500",
                landmark_name="Bảo tàng Điêu khắc Chăm",
                xp_earned=100
            ),
            HistoricalEraItem(
                era_id="ERA_NGUYEN",
                era_name="Thời Triều Nguyễn & Phòng Tuyến Kháng Pháp",
                time_range="Thế kỷ XIX",
                is_unlocked=False
            ),
            HistoricalEraItem(
                era_id="ERA_FRENCH_COLONIAL",
                era_name="Thời Kỳ Cận Đại & Nhượng Địa Tourane",
                time_range="1888 - 1945",
                is_unlocked=False
            ),
            HistoricalEraItem(
                era_id="ERA_REVOLUTION",
                era_name="Thời Kỳ Kháng Chiến & Cách Mạng",
                time_range="1945 - 1975",
                is_unlocked=False
            ),
            HistoricalEraItem(
                era_id="ERA_MODERN",
                era_name="Thời Kỳ Đổi Mới & Hiện Đại (Cầu Rồng)",
                time_range="1997 - Nay",
                is_unlocked=True,
                unlocked_by="Linh",
                photo_url="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500",
                landmark_name="Cầu Rồng Đà Nẵng",
                xp_earned=150
            )
        ]
    )

# ------------------------------------------------------------------
# AGENT 1: CLUES
# ------------------------------------------------------------------
@router.post("/clues/generate", response_model=ClueResponse)
async def generate_clue(req: ClueRequest):
    return await clue_agent.generate_clue(
        latitude=req.latitude,
        longitude=req.longitude,
        era_id=req.era_id,
        hint_level=req.hint_level
    )

# ------------------------------------------------------------------
# AGENT 2: VERIFICATION
# ------------------------------------------------------------------
@router.post("/verification/verify-photo", response_model=VerificationResult)
async def verify_photo(
    photo: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    target_era_id: str = Form(...)
):
    contents = await photo.read()
    return await verification_agent.verify_photo(
        image_bytes=contents,
        latitude=latitude,
        longitude=longitude,
        target_era_id=target_era_id
    )

# ------------------------------------------------------------------
# AGENT 3: SOCIAL FEED & MOMENTS
# ------------------------------------------------------------------
@router.post("/feed/moments/enrich-and-post", response_model=MomentResponse)
async def enrich_moment(req: MomentEnrichRequest):
    return await storyteller_agent.enrich_moment(
        photo_url=req.photo_url,
        landmark_name=req.landmark_name,
        era_id=req.era_id
    )

# ------------------------------------------------------------------
# MOCK DEMO LANDMARKS
# ------------------------------------------------------------------
@router.get("/mock/landmarks")
async def get_mock_landmarks():
    return {
        "city": "Đà Nẵng",
        "mock_sites": [
            {
                "site_id": "DN_DRAGON_BRIDGE",
                "site_name": "Cầu Rồng Đà Nẵng",
                "latitude": 16.0611,
                "longitude": 108.2274,
                "era_id": "ERA_MODERN",
                "era_name": "Thời Kỳ Đổi Mới & Hiện Đại",
                "persona_name": "Thần Rồng Vàng Sông Hàn"
            },
            {
                "site_id": "DN_DIEN_HAI_CITADEL",
                "site_name": "Thành Điện Hải (Phòng tuyến 1858)",
                "latitude": 16.0754,
                "longitude": 108.2235,
                "era_id": "ERA_NGUYEN",
                "era_name": "Thời Triều Nguyễn & Kháng Pháp",
                "persona_name": "Danh tướng Nguyễn Tri Phương"
            },
            {
                "site_id": "DN_CHAM_MUSEUM",
                "site_name": "Bảo tàng Điêu khắc Chăm Đà Nẵng",
                "latitude": 16.0607,
                "longitude": 108.2236,
                "era_id": "ERA_CHAMPA",
                "era_name": "Thời Cổ Đại & Chăm Pa",
                "persona_name": "Nữ thần Ánh sáng Chăm Pa"
            },
            {
                "site_id": "DN_ROOSTER_CHURCH",
                "site_name": "Nhà thờ Chính tòa Đà Nẵng (Nhà thờ Con Gà)",
                "latitude": 16.0667,
                "longitude": 108.2239,
                "era_id": "ERA_FRENCH_COLONIAL",
                "era_name": "Thời Cận Đại & Pháp Thuộc",
                "persona_name": "Linh mục Louis Vallet (1923)"
            }
        ]
    }
