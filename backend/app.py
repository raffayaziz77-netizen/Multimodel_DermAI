import json
import os
import ast
from contextlib import asynccontextmanager
from pathlib import Path

import torch
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from torchvision import transforms

try:
    from .model import load_model, DEVICE
    from .context_encoder import encode_context
except ImportError:  # pragma: no cover
    from model import load_model, DEVICE
    from context_encoder import encode_context

DEFAULT_MODEL_PATH = Path(__file__).resolve().parent / "derm_multimodal_resnet18.pth"
MODEL_PATH = Path(os.environ.get("MODEL_PATH", str(DEFAULT_MODEL_PATH)))


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"Model checkpoint not found at '{MODEL_PATH}'. "
            "Set MODEL_PATH env var to the correct path."
        )

    model, id_to_class = load_model(str(MODEL_PATH))
    app.state.model = model
    app.state.id_to_class = id_to_class
    yield


app = FastAPI(lifespan=lifespan)

cors_origins_env = os.environ.get("CORS_ORIGINS", "*").strip()
if cors_origins_env == "*":
    cors_origins = ["*"]
else:
    cors_origins = [
        origin.strip()
        for origin in cors_origins_env.split(",")
        if origin.strip()
    ]

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])


def _parse_context(raw: str):
    if raw is None:
        return {}

    raw = raw.strip()
    if not raw:
        return {}

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        # Common client mistake: sending Python dict string instead of JSON.
        try:
            parsed = ast.literal_eval(raw)
        except Exception as exc:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Invalid context JSON. Send a JSON object string, e.g. "
                    '{"onset":"weeks","itchiness":"Yes","location":"face"}'
                ),
            ) from exc

    # Handle double-encoded JSON like "\"{...}\""
    if isinstance(parsed, str):
        try:
            parsed = json.loads(parsed)
        except json.JSONDecodeError:
            pass

    if not isinstance(parsed, dict):
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid context JSON. Expected a JSON object like "
                '{"onset":"weeks","itchiness":"Yes","location":"face"}'
            ),
        )

    return parsed


@app.get("/health")
async def health():
    return {"status": "ok", "device": DEVICE}


@app.post("/predict")
async def predict(
    image: UploadFile = File(...),
    context: str = Form(...)
):
    try:
        img_bytes = await image.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid image file") from exc

    img = transform(img).unsqueeze(0).to(DEVICE)

    context_dict = _parse_context(context)

    ctx_vec = torch.tensor(
        encode_context(context_dict),
        dtype=torch.float32
    ).unsqueeze(0).to(DEVICE)

    model = app.state.model
    id_to_class = app.state.id_to_class

    with torch.inference_mode():
        logits = model(img, ctx_vec)
        probs = torch.softmax(logits, dim=1)
        pred_id = probs.argmax(1).item()

    return {
        "prediction": id_to_class[pred_id],
        "confidence": float(probs[0][pred_id])
    }
