# app.py

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch
import io
import json
import numpy as np
from torchvision import transforms

from model import load_model, DEVICE
from context_encoder import encode_context

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once
model, ID_TO_CLASS = load_model(
    r"C:\Users\Dell\Documents\Derma_project\backend\derm_multimodal_resnet18.pth"
)


transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])

@app.post("/predict")
async def predict(
    image: UploadFile = File(...),
    context: str = File(...)
):
    img_bytes = await image.read()
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = transform(img).unsqueeze(0).to(DEVICE)

    context_dict = json.loads(context)
    ctx_vec = torch.tensor(
        encode_context(context_dict),
        dtype=torch.float32
    ).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        logits = model(img, ctx_vec)
        probs = torch.softmax(logits, dim=1)
        pred_id = probs.argmax(1).item()

    return {
        "prediction": ID_TO_CLASS[pred_id],
        "confidence": float(probs[0][pred_id])
    }
