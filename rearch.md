# Prompt to Generate `research.md` (Research Paper) for MultiModal DermAI

Copy-paste this entire file into your AI writing model and ask it to **generate a complete, publication-style research paper in Markdown** as `research.md`.

## 1) Output requirements (STRICT)

- **Output only** the full contents of `research.md` in **Markdown** (no extra commentary).
- Use an **academic** tone and structure (Abstract → Introduction → Related Work → Methods → Experiments → Results → Discussion → Conclusion → References).
- **Do not invent** dataset names, sample counts, metrics, or results.  
  - If information is missing, either:
    - ask clarifying questions first, **or**
    - insert clear placeholders like **`[TBD: add dataset details]`** and proceed.
- Include a short **medical safety disclaimer**: “This system is not a medical device… consult a clinician…”.
- Add **figure/table placeholders** (captions + what they should show). Do not claim you generated figures.
- References: provide a **numbered reference list**. If you are unsure of exact bibliographic details, write placeholders and mark them `[verify]`.

## 2) Project context (facts extracted from the repository)

### Repository name (use in paper)
- **MultiModal DermAI** (frontend + backend demo for multimodal skin-condition prediction)

### Problem statement (use)
- Predict a skin condition from:
  1) an RGB skin image, and  
  2) a small set of structured, patient-reported/context features (symptoms + lesion characteristics).

### System overview (high-level)
- A React (Vite) frontend collects:
  - an image (upload or webcam capture), and
  - answers to a medical questionnaire (dropdowns).
- A FastAPI backend exposes `POST /predict` that accepts:
  - `image`: uploaded file
  - `context`: JSON string of questionnaire answers
- The backend returns JSON:
  - `prediction`: class label
  - `confidence`: softmax probability for predicted class

### Model (PyTorch) — architecture details (include exact dims)
The model fuses image and context features:

- **Image encoder:** `ResNet18` backbone (no pretrained weights in code)  
  - final fully connected layer replaced with identity → **512-dim image feature vector**
- **Context encoder (MLP):**
  - input: **39-dim** one-hot feature vector
  - `Linear(39 → 128)` → `LayerNorm(128)` → `ReLU` → **128-dim context embedding**
- **Fusion:** concatenate `[img_feat (512) ; ctx_feat (128)]` → **640-dim fused vector**
- **Classifier head:**
  - `Linear(640 → 256)` → `ReLU` → `Linear(256 → num_classes)`
- **Inference:** `softmax(logits)` and `argmax`
- **Device selection:** CUDA if available, else CPU

### Image preprocessing (inference-time)
- Resize to **224×224**
- Convert to tensor
- Normalize with ImageNet statistics:
  - mean `[0.485, 0.456, 0.406]`
  - std  `[0.229, 0.224, 0.225]`

### Context features (39-dim one-hot; include as a table in the paper)
The frontend questionnaire and backend encoder represent:

1) `onset` (5): `["a few days", "weeks", "months", "years", "Unknown"]`
2) `first_occurrence` (2): `["No", "Yes"]`
3) `itchiness` (2): `["No", "Yes"]`
4) `pain` (2): `["No", "Yes"]`
5) `discharge` (2): `["No", "Yes"]`
6) `surface` (6): `["dry and scaly", "smooth", "raised bumps", "blisters", "pus-filled", "Unknown"]`
7) `edges` (3): `["well-defined", "ill-defined", "Unknown"]`
8) `location` (6): `["face", "back", "neck", "scalp", "body", "Unknown"]`
9) `symmetry` (2): `["No", "Yes"]`
10) `color` (7): `["red", "brown", "white", "pink", "yellow", "mixed", "Unknown"]`
11) `scaling` (2): `["No", "Yes"]`

Total context dimension = 5+2+2+2+2+6+3+6+2+7+2 = **39**.

### Output label space (classes)
The checkpoint contains the following condition labels (use in the paper as the set of supported classes):

- acne
- actinic_keratosis
- alopecia_areata
- athlete's_foot
- cellulitis
- chickenpox
- dermatitis
- eczema
- herpes_simplex_infection
- herpes_zoster
- impetigo
- lichen_planus
- measles
- melanoma
- melasma
- molluscum_contagiosum
- onychomycosis
- psoriasis
- ringworm
- rosacea
- rubella
- scabies
- skin_cancer
- urticaria
- vitiligo
- warts

### Code organization (for the reproducibility section)
- Backend:
  - `backend/app.py` (FastAPI server and preprocessing)
  - `backend/model.py` (model definition + checkpoint loading)
  - `backend/context_encoder.py` (one-hot encoding)
  - `backend/requirements.txt`
  - `backend/derm_multimodal_resnet18.pth` (model checkpoint)
- Frontend:
  - `derma_vite/src/App.jsx` (multi-step flow)
  - `derma_vite/src/components/*` (UI screens)
  - `derma_vite/src/Api.js` (calls backend)

## 3) Missing information you MUST request or mark as TBD

To write a “proper” research paper, you need the following (otherwise use placeholders):

- Dataset source(s) (name/URL), licensing, and ethical approval if applicable
- Total samples, per-class distribution, and train/val/test split strategy
- How context labels were obtained (manual annotation, synthetic, questionnaire, metadata)
- Training procedure (optimizer, LR, epochs, batch size, augmentations, class imbalance handling)
- Evaluation metrics (accuracy, macro-F1, AUROC, confusion matrix, calibration, etc.)
- Baselines:
  - image-only ResNet18
  - context-only MLP
  - fusion variants (early/late fusion)
- Quantitative results (tables) + qualitative analysis (failure cases)
- Hardware used and runtime/latency

If you do not receive these details, write the paper as a **system/method paper** with a clearly labeled **“Results: TBD / Future Evaluation”** section.

## 4) What to generate in `research.md`

Write a full research paper with at least these sections:

1) Title + Author placeholders + Affiliation placeholders  
2) Abstract (150–250 words)  
3) Keywords (5–8)  
4) Introduction (motivation + challenges + contributions)  
5) Related Work (multimodal medical AI + dermatology imaging; keep claims generic unless cited)  
6) Methodology
   - problem formulation (multi-class classification)
   - image pipeline
   - context encoding
   - fusion architecture (include a diagram placeholder)
   - training objective (cross-entropy) and implementation details
7) Experiments
   - dataset description (or `[TBD]`)
   - evaluation protocol + metrics
   - baselines + ablations (include table placeholders)
8) Results
   - quantitative table(s) (or `[TBD]`)
   - qualitative examples/failure modes (describe, no fabricated images)
9) Discussion
   - why multimodal fusion can help (clinical context disambiguation)
   - limitations (bias, domain shift, label noise, “confidence” not equal to correctness)
10) Deployment / System Implementation
   - FastAPI endpoint contract
   - frontend workflow (upload/camera + questionnaire)
   - latency considerations and device selection
11) Ethics, Privacy, and Safety
   - disclaimer: not medical advice
   - privacy handling for images + PHI risks
12) Conclusion and Future Work
13) References (numbered)

Also include an **Appendix** with:
- the full list of context fields/options (the 11 features above)
- the full list of output classes (26 labels above)
- a short “How to run locally” guide (commands only; do not claim you executed them)

## 5) Style preferences

- Prefer clear, short paragraphs and technical precision.
- Use consistent terminology: “context features”, “structured metadata”, “multimodal fusion”.
- Keep claims aligned with provided facts; do not oversell.

