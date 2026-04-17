import json
from pathlib import Path

from app.services.classifier_service import analyze_issue


def main():
    root = Path(__file__).resolve().parent
    sample_dir = root / "dataset" / "CIVIC ISSUES.v3i.yolov8-subset-2000-fixed" / "valid" / "images"
    sample_image = next(sample_dir.glob("*"))
    result = analyze_issue(image_path=str(sample_image))
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
