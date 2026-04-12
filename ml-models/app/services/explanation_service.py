import os
from typing import List

from google import genai


def build_fallback_explanation(*, detected_label: str, category: str, confidence: float, evidence: str) -> tuple[str, str]:
    summary = f"A {detected_label.replace('_', ' ')} issue is visible in the uploaded image."
    explanation = (
        f"The detector mapped this image to {category} because it highlighted evidence consistent with "
        f"{detected_label.replace('_', ' ')}. {evidence} Confidence: {confidence:.0%}."
    )
    return summary, explanation


def generate_grounded_explanation(
    *,
    detected_label: str,
    category: str,
    confidence: float,
    evidence: str,
    top_detections: List[dict],
    description: str,
) -> tuple[str, str]:
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        return build_fallback_explanation(
            detected_label=detected_label,
            category=category,
            confidence=confidence,
            evidence=evidence,
        )

    client = genai.Client(api_key=api_key)
    other = ", ".join(f"{item['label']} {item['score']:.2f}" for item in top_detections[1:3]) or "none"

    try:
        prompt = (
            "You explain a computer-vision civic issue detection result.\n"
            "Return compact JSON with keys summary and explanation.\n"
            "Keep it factual, concise, and grounded in the provided evidence.\n\n"
            f"Top detected issue: {detected_label}\n"
            f"Mapped category: {category}\n"
            f"Confidence: {confidence:.2f}\n"
            f"Other detections: {other}\n"
            f"Visual evidence: {evidence}\n"
            f"User description: {description}"
        )
        completion = client.models.generate_content(
            model=os.getenv("GEMINI_MODEL", "gemini-1.5-flash"),
            contents=prompt,
        )
        import json

        parsed = json.loads((completion.text or "").strip().replace("```json", "").replace("```", ""))
        summary = parsed.get("summary")
        explanation = parsed.get("explanation")
        if summary and explanation:
            return summary, explanation
    except Exception:
        pass

    return build_fallback_explanation(
        detected_label=detected_label,
        category=category,
        confidence=confidence,
        evidence=evidence,
    )
