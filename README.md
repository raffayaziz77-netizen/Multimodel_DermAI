# MultiModal DermAI

Multimodal skin-condition prediction demo:
- **Frontend:** React + Vite UI (`derma_vite/`)
- **Backend:** FastAPI + PyTorch inference API (`backend/`)

The model takes:
1) an RGB image, and  
2) a JSON “context” object (questionnaire answers),  
and returns a predicted class + confidence.

## Requirements

- **Python 3.9+**
- **Node.js 18+** (for the frontend)

## 1) Run the backend API (FastAPI)

From the repo root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Start the server:

```bash
HOST=0.0.0.0 PORT=8000 CORS_ORIGINS="*" python3 server.py
```

Useful environment variables:
- `MODEL_PATH` (optional): path to `derm_multimodal_resnet18.pth` (default: `backend/derm_multimodal_resnet18.pth`)
- `CORS_ORIGINS` (optional): `*` or comma-separated origins (example: `https://your-frontend.com,https://www.your-frontend.com`)
- `HOST` (default `0.0.0.0`), `PORT` (default `8000`)

Health check:

```bash
curl http://localhost:8000/health
```

Swagger UI:
- Open `http://localhost:8000/docs`

### Test `/predict` in Swagger UI

1. Open `POST /predict` → **Try it out**
2. Select an **image** file
3. For **context**, paste a **valid JSON object string**, for example:

```json
{"onset":"weeks","first_occurrence":"No","itchiness":"Yes","pain":"No","discharge":"No","surface":"dry and scaly","edges":"well-defined","location":"face","symmetry":"No","color":"red","scaling":"Yes"}
```

Note: `context` is sent as a **form field string** (multipart), so it must be JSON (not `string` / not unquoted text).

### Test `/predict` with curl

```bash
curl -X POST http://localhost:8000/predict \
  -F "image=@/path/to/skin.jpg" \
  --form-string 'context={"onset":"weeks","first_occurrence":"No","itchiness":"Yes","pain":"No","discharge":"No","surface":"dry and scaly","edges":"well-defined","location":"face","symmetry":"No","color":"red","scaling":"Yes"}'
```

## 2) Run the frontend (React + Vite)

From the repo root:

```bash
cd derma_vite
npm install
```

Create a local env file:

```bash
cp .env.example .env.local
```

Edit `derma_vite/.env.local` and set your API URL, for example:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

## API Contract

### `POST /predict`

- Content-Type: `multipart/form-data`
- Fields:
  - `image` (file)
  - `context` (string): JSON object with questionnaire answers
- Response:
  - `prediction` (string)
  - `confidence` (float, 0–1)

### `GET /health`

- Response includes backend status and selected device (`cpu` / `cuda`).

