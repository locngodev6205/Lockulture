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
        group_id="grp_devfest_01",
        completion_rate=0.5,
        eras=[
            HistoricalEraItem(
                era_id="ERA_ANCIENT",
                era_name="Thời Cổ Đại & Dựng Nước",
                time_range="Trước thế kỷ X",
                is_unlocked=True,
                unlocked_by="Nam",
                photo_url="https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=500",
                landmark_name="Đền Hùng",
                xp_earned=100
            ),
            HistoricalEraItem(
                era_id="ERA_LY_TRAN",
                era_name="Thời Lý - Trần (Hào Khí Đông A)",
                time_range="Thế kỷ XI - XIV",
                is_unlocked=False
            ),
            HistoricalEraItem(
                era_id="ERA_NGUYEN",
                era_name="Thời Triều Nguyễn",
                time_range="Thế kỷ XIX",
                is_unlocked=False
            ),
            HistoricalEraItem(
                era_id="ERA_FRENCH_COLONIAL",
                era_name="Thời Kỳ Cận Đại & Giao Thoa Văn Hóa",
                time_range="Cuối XIX - Đầu XX",
                is_unlocked=False
            ),
            HistoricalEraItem(
                era_id="ERA_MODERN",
                era_name="Thời Kỳ Kháng Chiến & Độc Lập",
                time_range="1945 - 1975",
                is_unlocked=True,
                unlocked_by="Linh",
                photo_url="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=500",
                landmark_name="Dinh Độc Lập",
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
        "mock_sites": [
            {
                "site_id": "HCM_POST_OFFICE",
                "site_name": "Bưu điện Trung tâm TP.HCM",
                "latitude": 10.779785,
                "longitude": 106.699018,
                "era_id": "ERA_FRENCH_COLONIAL"
            },
            {
                "site_id": "HCM_INDEPENDENCE_PALACE",
                "site_name": "Dinh Độc Lập",
                "latitude": 10.776889,
                "longitude": 106.695346,
                "era_id": "ERA_MODERN"
            },
            {
                "site_id": "HN_TEMPLE_OF_LITERATURE",
                "site_name": "Văn Miếu - Quốc Tử Giám",
                "latitude": 21.028511,
                "longitude": 105.835526,
                "era_id": "ERA_LY_TRAN"
            }
        ]
    }
