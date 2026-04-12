import os
from pathlib import Path
from typing import List

from dotenv import load_dotenv

from ultralytics import YOLO

from .explanation_service import generate_grounded_explanation
from .label_mapping import category_priority, map_label_to_category
from .visualization_service import build_evidence, save_overlay

ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")
DEFAULT_MODEL_PATH = ROOT_DIR / "models" / "best.pt"
FALLBACK_MODEL_NAME = os.getenv("YOLO_FALLBACK_MODEL", "yolov8n.pt")
OVERLAY_DIR = Path(os.getenv("XAI_OUTPUT_DIR", ROOT_DIR / "outputs" / "overlays"))
BACKEND_UPLOADS_DIR = Path(os.getenv("BACKEND_UPLOADS_DIR", ROOT_DIR.parent / "backend" / "uploads" / "xai"))

_MODEL = None
_MODEL_SOURCE = "uninitialized"


def _get_model():
    global _MODEL, _MODEL_SOURCE
    if _MODEL is not None:
        return _MODEL

    model_path = Path(os.getenv("YOLO_MODEL_PATH", str(DEFAULT_MODEL_PATH)))
    if model_path.exists():
        _MODEL = YOLO(str(model_path))
        _MODEL_SOURCE = str(model_path)
        return _MODEL

    _MODEL = YOLO(FALLBACK_MODEL_NAME)
    _MODEL_SOURCE = FALLBACK_MODEL_NAME
    return _MODEL


def _normalize_detections(results) -> List[dict]:
    detections = []
    names = results.names
    for box in results.boxes:
        cls_index = int(box.cls.item())
        label = names[cls_index]
        score = float(box.conf.item())
        bbox = [int(value) for value in box.xyxy[0].tolist()]
        detections.append({"label": label, "score": score, "bbox": bbox})

    detections.sort(key=lambda item: item["score"], reverse=True)
    return detections[:5]


def _fallback_from_text(text: str) -> dict:
    lower = text.lower()
    if "garbage" in lower or "trash" in lower:
        label = "Garbage"
    elif "pothole" in lower or "road" in lower or "crack" in lower:
        label = "pothole"
    elif "pole" in lower or "light" in lower:
        label = "Damaged_Electric_Poles"
    else:
        label = "unknown"

    category = map_label_to_category(label)
    evidence = "No image detection was available, so the service used a conservative text fallback."
    summary, explanation = generate_grounded_explanation(
        detected_label=label,
        category=category,
        confidence=0.0,
        evidence=evidence,
        top_detections=[],
        description=text,
    )
    return {
        "category": category,
        "detectedLabel": label,
        "confidence": 0.0,
        "summary": summary,
        "explanation": explanation,
        "xaiOverlayImageUrl": "",
        "xaiEvidence": evidence,
        "topDetections": [],
        "priority": category_priority(category),
        "modelSource": _MODEL_SOURCE,
    }


def analyze_issue(*, image_path: str, description: str = "", voice_transcript: str = "") -> dict:
    combined_text = " ".join(part for part in [description, voice_transcript] if part).strip()
    if not image_path:
        return _fallback_from_text(combined_text)

    image_file = Path(image_path)
    if not image_file.exists():
        return _fallback_from_text(combined_text)

    model = _get_model()
    results = model.predict(source=str(image_file), conf=0.0, verbose=False, imgsz=640)[0]
    detections = _normalize_detections(results)

    if not detections:
        return _fallback_from_text(combined_text)

    top = detections[0]
    category = map_label_to_category(top["label"])
    evidence = build_evidence(detections)
    OVERLAY_DIR.mkdir(parents=True, exist_ok=True)
    BACKEND_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    overlay_path = save_overlay(str(image_file), detections, str(BACKEND_UPLOADS_DIR))
    overlay_name = Path(overlay_path).name
    summary, explanation = generate_grounded_explanation(
        detected_label=top["label"],
        category=category,
        confidence=top["score"],
        evidence=evidence,
        top_detections=detections,
        description=combined_text,
    )

    return {
        "category": category,
        "detectedLabel": top["label"],
        "confidence": top["score"],
        "summary": summary,
        "explanation": explanation,
        "xaiOverlayImageUrl": f"/uploads/xai/{overlay_name}",
        "xaiEvidence": evidence,
        "topDetections": detections,
        "priority": category_priority(category),
        "modelSource": _MODEL_SOURCE,
    }
