import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .routes import router

load_dotenv()

ROOT_DIR = Path(__file__).resolve().parents[1]
os.environ.setdefault("ULTRALYTICS_CONFIG_DIR", str(ROOT_DIR / ".ultralytics"))
os.environ.setdefault("MPLCONFIGDIR", str(ROOT_DIR / ".matplotlib"))
(ROOT_DIR / ".ultralytics").mkdir(parents=True, exist_ok=True)
(ROOT_DIR / ".matplotlib").mkdir(parents=True, exist_ok=True)
(ROOT_DIR / "outputs").mkdir(parents=True, exist_ok=True)
(ROOT_DIR / "outputs" / "overlays").mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Civic Issue ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

app.mount("/outputs", StaticFiles(directory=ROOT_DIR / "outputs"), name="outputs")
