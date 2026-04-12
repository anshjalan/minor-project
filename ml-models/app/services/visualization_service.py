from pathlib import Path
from typing import List

from PIL import Image
from ultralytics.utils.plotting import Annotator, colors


def save_overlay(image_path: str, detections: List[dict], output_dir: str) -> str:
    output_root = Path(output_dir)
    output_root.mkdir(parents=True, exist_ok=True)

    image = Image.open(image_path).convert("RGB")
    annotator = Annotator(image.copy())

    for index, detection in enumerate(detections):
        annotator.box_label(
            detection["bbox"],
            f"{detection['label']} {detection['score']:.2f}",
            color=colors(index, True),
        )

    annotated = annotator.result()
    output_path = output_root / f"{Path(image_path).stem}-overlay.jpg"
    Image.fromarray(annotated).save(output_path, quality=90)
    return str(output_path)


def build_evidence(detections: List[dict]) -> str:
    if not detections:
        return "The detector did not find a confident issue region in the image."

    top = detections[0]
    x1, y1, x2, y2 = top["bbox"]
    center_x = (x1 + x2) / 2
    center_y = (y1 + y2) / 2
    horizontal = "left" if center_x < 300 else "right" if center_x > 700 else "center"
    vertical = "top" if center_y < 250 else "bottom" if center_y > 550 else "middle"
    return (
        f"The strongest detection is {top['label'].replace('_', ' ')} near the {horizontal}-{vertical} area "
        f"of the image with confidence {top['score']:.0%}."
    )
