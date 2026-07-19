import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

import os

from agentic_road_agent import road_damage_agent


class AskAIRequest(BaseModel):
    detection_context: dict
    ai_analysis: dict
    question: str

app = FastAPI(title="RoadPulse AI ML Backend")

# Create a directory to save "difficult" images for better training (Active Learning)
DATA_COLLECTION_DIR = "training_data_enrichment"
os.makedirs(DATA_COLLECTION_DIR, exist_ok=True)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLOv8 model
# IMPORTANT: General models (yolov8n.pt) trained on COCO dataset do NOT have 'pothole' or 'crack' classes.
# To detect them, you MUST use a specialized model. 
# Attempting to load 'road_damage_best.pt'. If not found, use yolov8n.pt with STRICT filtering.
MODEL_PATH = "road_damage_best.pt"
try:
    model = YOLO(MODEL_PATH)
    print(f"[INFO] Using specialized Road Damage model: {MODEL_PATH}")
    IS_SPECIALIZED = True
except Exception:
    MODEL_PATH = "yolov8n.pt"
    model = YOLO(MODEL_PATH)
    print(f"[WARNING] Specialized model not found. Falling back to baseline: {MODEL_PATH}")
    print("[WARNING] Baseline model will NOT detect road damage accurately. Use download_road_model.py first.")
    IS_SPECIALIZED = False

# Strict Allow-List for Road Damage (Classes from RDD2022 dataset + Generic types)
ALLOWED_ROAD_CLASSES = [
    "pothole", "longitudinal crack", "transverse crack", "alligator crack", 
    "crack", "surface damage", "d00", "d10", "d20", "d40", "d43", "d44", "d11", "d50",
    "manhole", "drainage", "water", "edge crack"
]

@app.get("/")
async def root():
    return {"message": "RoadPulse AI Strict Detection Backend is running"}

@app.post("/detect")
async def detect_damage(file: UploadFile = File(...)):
    # Read image file
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Run YOLO inference
    # imgsz=640 and lower conf can help catch smaller/faded potholes
    results = model.predict(img, imgsz=640, conf=0.20) 
    
    detections = []
    save_for_training = False
    
    for result in results:
        boxes = result.boxes
        for box in boxes:
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            label = result.names[cls_id].lower()
            
            # If we detect something with low confidence (0.1 to 0.3), 
            # we mark it to be saved for future training (Active Learning).
            if 0.1 <= conf <= 0.3:
                save_for_training = True
            
            if not any(target in label for target in ALLOWED_ROAD_CLASSES):
                continue
            
            label_map = {
                "d00": "Longitudinal Crack",
                "d10": "Transverse Crack",
                "d20": "Alligator Crack",
                "d40": "Pothole",
                "d43": "Surface Damage",
                "d44": "Drainage Issue",
                "d11": "Edge Crack",
                "d50": "Manhole Issue",
                "longitudinal crack": "Longitudinal Crack",
                "transverse crack": "Transverse Crack",
                "alligator crack": "Alligator Crack",
                "pothole": "Pothole",
                "other corruption": "Surface Damage"
            }
            raw_label = label_map.get(label, label)
            display_label = str(raw_label).capitalize() if raw_label else "Unknown"
            
            detections.append({
                "box": box.xyxy[0].tolist(),
                "confidence": conf,
                "label": display_label,
                "class_id": cls_id
            })

    # ACTIVE LEARNING: Save difficult cases for future "Better Training"
    if save_for_training:
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filepath = os.path.join(DATA_COLLECTION_DIR, f"training_sample_{timestamp}.jpg")
        cv2.imwrite(filepath, img)

    agentic_analysis = road_damage_agent.analyze(
        detections=detections,
        summary={
            "count": len(detections),
            "classes": list(set([d["label"] for d in detections])),
            "dominant_label": detections[0]["label"] if detections else "No Damage",
        },
        image_info={
            "filename": file.filename,
            "content_type": file.content_type,
            "size_bytes": len(contents),
        },
        specialized_model=IS_SPECIALIZED,
    )

    image_payload = {
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": len(contents),
        "width": int(img.shape[1]) if img is not None else None,
        "height": int(img.shape[0]) if img is not None else None,
    }

    return {
        "detections": detections,
        "image": image_payload,
        "is_specialized": IS_SPECIALIZED,
        "summary": {
            "count": len(detections),
            "classes": list(set([d["label"] for d in detections]))
        },
        "ai_analysis": agentic_analysis,
        "agentic_analysis": agentic_analysis,
    }


@app.post("/ask-ai")
async def ask_ai(request: AskAIRequest):
    result = road_damage_agent.ask(
        detection_context=request.detection_context,
        ai_analysis=request.ai_analysis,
        question=request.question,
    )
    return result

if __name__ == "__main__":
    import uvicorn
    import os
    # Production port handling for services like Render
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
