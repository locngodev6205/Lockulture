import io
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from src.agents import verification_agent as module
from src.core.config import settings
from src.main import app


@pytest.fixture
def image():
    output = io.BytesIO()
    Image.new("RGB", (120, 80), "green").save(output, "JPEG")
    return output.getvalue()


@pytest.fixture
def sdk(monkeypatch):
    generate = AsyncMock(return_value=SimpleNamespace(text='''{
        "is_valid": true, "confidence_score": 0.96,
        "detected_landmark": "Cầu Rồng", "matched_era": "ERA_MODERN",
        "matches_target": true, "is_screen_spoof": false, "reject_reason": null
    }'''))
    client = MagicMock()
    client.aio.__aenter__.return_value.models.generate_content = generate
    monkeypatch.setattr(module.genai, "Client", MagicMock(return_value=client))
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "test-only-no-network")
    return generate


def post(image, **fields):
    with TestClient(app) as client:
        return client.post("/api/v1/verification/verify-photo",
                           files={"photo": ("capture.jpg", image, "image/jpeg")},
                           data={"target_era_id": "ERA_MODERN",
                                 "target_landmark": "Cầu Rồng", **fields})


def test_success_is_structured_and_uses_normalized_image(image, sdk):
    response = post(image)
    assert response.status_code == 200
    result = response.json()
    assert result["is_valid"] and result["xp_reward"] == 150
    assert result["matched_era"] == "ERA_MODERN"
    call = sdk.call_args.kwargs
    assert call["config"].response_mime_type == "application/json"
    assert call["contents"][1].inline_data.mime_type == "image/jpeg"


@pytest.mark.parametrize("changes", [
    {"is_screen_spoof": True}, {"matches_target": False},
    {"confidence_score": .79}, {"matched_era": "ERA_CHAMPA"},
    {"is_valid": False},
])
def test_policy_rejects_inconsistent_ai_success(image, sdk, changes):
    import json
    data = json.loads(sdk.return_value.text)
    data.update(changes)
    sdk.return_value = SimpleNamespace(text=json.dumps(data))
    result = post(image).json()
    assert not result["is_valid"]
    assert result["xp_reward"] == 0 and result["matched_era"] is None
    assert result["reject_reason"]


def test_missing_key_is_not_mock_success(image, monkeypatch):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "")
    assert post(image).status_code == 503


@pytest.mark.parametrize("data,status", [(b"", 400), (b"not-an-image", 400),
                                        (b"x" * (module.MAX_UPLOAD + 1), 413)])
def test_invalid_upload_never_calls_ai(data, status, sdk):
    assert post(data).status_code == status
    sdk.assert_not_called()


def test_unknown_target_or_era_is_rejected(image, sdk):
    assert post(image, target_landmark="Unknown").status_code == 422
    assert post(image, target_era_id="ERA_NGUYEN").status_code == 422
    sdk.assert_not_called()


def test_invalid_ai_response_is_gateway_error(image, sdk):
    sdk.return_value = SimpleNamespace(text="not json")
    assert post(image).status_code == 502


def test_timeout_does_not_grant_rewards(image, sdk):
    sdk.side_effect = TimeoutError()
    assert post(image).status_code == 504


def test_quota_failure_has_safe_message(image, sdk):
    sdk.side_effect = module.errors.ClientError(429, {"error": {"message": "private-upstream-details"}})
    response = post(image)
    assert response.status_code == 429
    assert "private-upstream" not in response.text


def test_old_era_only_request_still_works(image, sdk):
    with TestClient(app) as client:
        response = client.post("/api/v1/verification/verify-photo",
            files={"photo": ("capture.jpg", image, "image/jpeg")},
            data={"target_era_id": "ERA_MODERN", "latitude": 16.0611, "longitude": 108.2274})
    assert response.status_code == 200


def test_image_is_resized_and_metadata_removed():
    output = io.BytesIO()
    Image.new("RGB", (2000, 1000)).save(output, "PNG", comment="private metadata")
    normalized = module.normalize_image(output.getvalue())
    with Image.open(io.BytesIO(normalized)) as image:
        assert image.size == (1080, 540)
        assert not image.getexif()
