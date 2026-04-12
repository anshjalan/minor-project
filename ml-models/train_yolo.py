from pathlib import Path

from ultralytics import YOLO


def main():
    root = Path(__file__).resolve().parent
    data_path = root / "dataset" / "CIVIC ISSUES.v3i.yolov8-subset-4000" / "data.yaml"
    runs_path = root / "runs"
    model = YOLO("yolov8n.pt")
    model.train(
        data=str(data_path),
        epochs=5,
        imgsz=512,
        batch=8,
        project=str(runs_path),
        name="civic-issues-yolov8n",
        device="cpu",
        workers=0,
    )


if __name__ == "__main__":
    main()
