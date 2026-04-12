from typing import List, Optional

from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    image_path: str = ""
    description: str = ""
    voice_transcript: str = Field(default="", alias="voiceTranscript")

    model_config = {
        "populate_by_name": True,
    }


class DetectionBox(BaseModel):
    label: str
    score: float
    bbox: List[int]


class AnalyzeResponse(BaseModel):
    category: str
    detected_label: str = Field(alias="detectedLabel")
    confidence: float
    summary: str
    explanation: str
    xai_overlay_image_url: str = Field(alias="xaiOverlayImageUrl")
    xai_evidence: str = Field(alias="xaiEvidence")
    top_detections: List[DetectionBox] = Field(alias="topDetections")
    priority: str

    model_config = {
        "populate_by_name": True,
    }
