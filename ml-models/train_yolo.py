from pathlib import Path

from ultralytics import YOLO


def main():
    root = Path(__file__).resolve().parent
    data_path = root / "CIVIC ISSUES.v3i.yolov8" / "data.yaml"
    runs_path = root / "runs"
    model = YOLO("yolov8n.pt")
    model.train(
        data=str(data_path),
        epochs=20,
        imgsz=512,

        batch=16,
        project=str(runs_path),
        name="civic-issues-yolov8n",
        device=0,
        workers=8,
    )


if __name__ == "__main__":
    main()
