from fastapi import APIRouter, HTTPException

from .schemas import AnalyzeRequest, AnalyzeResponse
from .services.classifier_service import analyze_issue

router = APIRouter()


@router.get("/api/health")
def health_check():
    return {"status": "ok", "service": "ml-models-python"}


@router.post("/api/ai/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest):
    if not payload.image_path and not payload.description and not payload.voice_transcript:
        raise HTTPException(status_code=400, detail="image_path or description or voice_transcript is required")

    result = analyze_issue(
        image_path=payload.image_path,
        description=payload.description,
        voice_transcript=payload.voice_transcript,
    )
    return AnalyzeResponse(**result)
