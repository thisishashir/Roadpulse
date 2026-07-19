"""
YOLOv8 Real-Time Webcam Object Detection
=========================================
Author  : @thisishashir
Version : 1.0.0
Date    : 2026-03-03

Description:
    This script performs real-time object detection using the YOLOv8 model
    from Ultralytics. It captures video from the default webcam, runs
    inference frame-by-frame, and overlays bounding boxes with class labels
    and confidence scores.

Usage:
    python detect.py

Controls:
    Press 'q' to quit.
"""

import sys
import cv2
import torch
import numpy as np
from ultralytics import YOLO

# ─────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────
MODEL_PATH       = "yolov8n.pt"   # Nano model — fastest; swap for yolov8s/m/l/x for accuracy
CONFIDENCE_THRESH = 0.40           # Minimum confidence to display a detection
WEBCAM_INDEX     = 0               # 0 = default/built-in webcam; change if using external camera
WINDOW_TITLE     = "YOLOv8 Real-Time Object Detection  |  Press 'q' to quit"
FONT             = cv2.FONT_HERSHEY_SIMPLEX

# ─────────────────────────────────────────────
# COLOUR PALETTE — one colour per detected class
# ─────────────────────────────────────────────
np.random.seed(42)
COLOUR_PALETTE = np.random.randint(0, 255, size=(100, 3), dtype=np.uint8)


def get_device() -> str:
    """Detect and return the best available compute device."""
    if torch.cuda.is_available():
        device = "cuda"
        gpu_name = torch.cuda.get_device_name(0)
        print(f"[INFO] GPU detected — using CUDA  ({gpu_name})")
    else:
        device = "cpu"
        print("[INFO] No GPU detected — running on CPU")
    return device


def load_model(model_path: str, device: str) -> YOLO:
    """Load the YOLOv8 model.  Downloads weights automatically on first run."""
    print(f"[INFO] Loading model: {model_path} …")
    model = YOLO(model_path)
    model.to(device)
    print("[INFO] Model loaded successfully.\n")
    return model


def draw_detections(frame: np.ndarray, results) -> np.ndarray:
    """
    Overlay bounding boxes, class labels, and confidence scores on *frame*.

    Parameters
    ----------
    frame   : BGR image array from OpenCV
    results : Ultralytics Results object returned by model inference

    Returns
    -------
    frame   : Annotated BGR image
    """
    for result in results:
        boxes = result.boxes
        if boxes is None:
            continue

        for box in boxes:
            confidence = float(box.conf[0])
            if confidence < CONFIDENCE_THRESH:
                continue

            # ── Bounding box coordinates (pixel values) ──────────────────
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())

            # ── Class info ───────────────────────────────────────────────
            class_id   = int(box.cls[0])
            class_name = result.names.get(class_id, f"class_{class_id}")
            label      = f"{class_name}  {confidence:.0%}"

            # ── Colour — stable per class ─────────────────────────────────
            colour = COLOUR_PALETTE[class_id % len(COLOUR_PALETTE)].tolist()

            # ── Draw rectangle ────────────────────────────────────────────
            cv2.rectangle(frame, (x1, y1), (x2, y2), colour, thickness=2)

            # ── Label background pill ─────────────────────────────────────
            (text_w, text_h), baseline = cv2.getTextSize(label, FONT, 0.55, 1)
            label_y1 = max(y1 - text_h - baseline - 6, 0)
            label_y2 = label_y1 + text_h + baseline + 6
            cv2.rectangle(frame, (x1, label_y1), (x1 + text_w + 8, label_y2), colour, -1)

            # ── Label text ────────────────────────────────────────────────
            cv2.putText(
                frame, label,
                (x1 + 4, label_y2 - baseline - 2),
                FONT, 0.55, (255, 255, 255), thickness=1, lineType=cv2.LINE_AA,
            )

    return frame


def draw_fps(frame: np.ndarray, fps: float) -> np.ndarray:
    """Overlay FPS counter in the top-right corner of *frame*."""
    text  = f"FPS: {fps:.1f}"
    (w, h), _ = cv2.getTextSize(text, FONT, 0.65, 2)
    x = frame.shape[1] - w - 14
    cv2.rectangle(frame, (x - 6, 6), (x + w + 6, h + 16), (0, 0, 0), -1)
    cv2.putText(frame, text, (x, h + 10), FONT, 0.65, (0, 255, 0), 2, cv2.LINE_AA)
    return frame


def open_webcam(index: int) -> cv2.VideoCapture:
    """Open webcam and raise a descriptive error if it cannot be accessed."""
    cap = cv2.VideoCapture(index)
    if not cap.isOpened():
        raise IOError(
            f"[ERROR] Cannot open webcam at index {index}.\n"
            "  • Check that your webcam is connected and not in use by another app.\n"
            "  • Try a different index (e.g., 1, 2) if you have multiple cameras."
        )
    # Optional: set a consistent resolution for performance
    cap.set(cv2.CAP_PROP_FRAME_WIDTH,  1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    print(f"[INFO] Webcam opened  (index={index}, "
          f"{int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))}×"
          f"{int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))})")
    return cap


def run_detection(model: YOLO, cap: cv2.VideoCapture, device: str) -> None:
    """Main detection loop — reads frames, runs inference, and displays results."""
    tick = cv2.TickMeter()
    print("[INFO] Starting detection loop … press 'q' in the window to quit.\n")

    while True:
        tick.start()

        ret, frame = cap.read()
        if not ret:
            print("[WARNING] Failed to read frame from webcam. Retrying …")
            continue

        # ── YOLOv8 Inference ─────────────────────────────────────────────
        results = model.predict(
            source=frame,
            device=device,
            verbose=False,          # suppress per-frame console output
        )

        # ── Annotate frame ───────────────────────────────────────────────
        frame = draw_detections(frame, results)

        tick.stop()
        fps   = 1.0 / tick.getTimeSec() if tick.getTimeSec() > 0 else 0.0
        frame = draw_fps(frame, fps)
        tick.reset()

        # ── Display ──────────────────────────────────────────────────────
        cv2.imshow(WINDOW_TITLE, frame)

        # ── Quit on 'q' ──────────────────────────────────────────────────
        if cv2.waitKey(1) & 0xFF == ord("q"):
            print("\n[INFO] 'q' pressed — exiting …")
            break


def main() -> None:
    """Entry point: device detection → model load → webcam → detection loop."""
    print("=" * 60)
    print("        YOLOv8 Real-Time Webcam Object Detection")
    print("=" * 60)

    # ── Device ───────────────────────────────────────────────────────────
    device = get_device()

    # ── Model ────────────────────────────────────────────────────────────
    try:
        model = load_model(MODEL_PATH, device)
    except Exception as exc:
        print(f"[ERROR] Failed to load model: {exc}")
        sys.exit(1)

    # ── Webcam ───────────────────────────────────────────────────────────
    try:
        cap = open_webcam(WEBCAM_INDEX)
    except IOError as exc:
        print(exc)
        sys.exit(1)

    # ── Detection loop ───────────────────────────────────────────────────
    try:
        run_detection(model, cap, device)
    except KeyboardInterrupt:
        print("\n[INFO] Keyboard interrupt received — exiting …")
    except Exception as exc:
        print(f"\n[ERROR] Unexpected error during detection: {exc}")
    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("[INFO] Resources released. Goodbye!")


# ─────────────────────────────────────────────
if __name__ == "__main__":
    main()
