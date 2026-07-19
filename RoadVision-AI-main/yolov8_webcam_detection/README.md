# 🎯 YOLOv8 Real-Time Webcam Object Detection

A production-ready Python project that uses **Ultralytics YOLOv8** and **OpenCV** to perform real-time object detection directly from your laptop webcam — running smoothly on CPU with optional GPU acceleration.

---

## 📸 Features

- ✅ Real-time object detection via webcam (30 FPS on modern CPU)
- ✅ Bounding boxes with **class label** + **confidence score**
- ✅ Live **FPS counter** overlay
- ✅ Automatic **GPU detection** (CUDA) with CPU fallback
- ✅ Detects **80 COCO classes** out of the box (people, cars, animals, etc.)
- ✅ Clean exit on pressing **`q`**
- ✅ Production-style error handling

---

## 📁 Project Structure

```
yolov8_webcam_detection/
│
├── venv/               ← Virtual environment (created during setup)
├── requirements.txt    ← Python dependencies
├── detect.py           ← Main detection script
└── README.md           ← This file
```

---

## ⚙️ Requirements

| Component      | Minimum Version |
|----------------|-----------------|
| Python         | 3.9+            |
| Ultralytics    | 8.0+            |
| OpenCV-Python  | 4.6+            |
| PyTorch        | 2.0+ (CPU)      |
| NumPy          | 1.24+           |

> **GPU (optional):** NVIDIA GPU with CUDA 11.8+ for hardware acceleration.

---

## 🚀 Quick Start

### Step 1 — Navigate to the project folder

```powershell
cd "e:\Projects\ML Projects\yolov8_webcam_detection"
```

### Step 2 — Create a virtual environment

```powershell
python -m venv venv
```

### Step 3 — Activate the virtual environment

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**macOS / Linux:**
```bash
source venv/bin/activate
```

### Step 4 — Install dependencies

```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

> ⏳ First-time installation may take a few minutes (PyTorch is large).

### Step 5 — Run the detector

```powershell
python detect.py
```

On the **very first run**, YOLOv8 will automatically download the `yolov8n.pt` model weights (~6 MB). Subsequent runs start immediately.

---

## 🎮 Controls

| Key | Action       |
|-----|--------------|
| `q` | Quit / close the window |

---

## 🔧 Configuration

Open `detect.py` and adjust the constants at the top of the file:

| Constant            | Default       | Description                                      |
|---------------------|---------------|--------------------------------------------------|
| `MODEL_PATH`        | `yolov8n.pt`  | Model variant: `n`, `s`, `m`, `l`, `x`           |
| `CONFIDENCE_THRESH` | `0.40`        | Minimum confidence to show a detection (0–1)     |
| `WEBCAM_INDEX`      | `0`           | Camera index (try `1`, `2` for external cameras) |

### Model Variants (Speed vs. Accuracy)

| Model       | Size   | Speed (CPU) | mAP   |
|-------------|--------|-------------|-------|
| `yolov8n.pt`| ~6 MB  | ⚡ Fastest  | 37.3  |
| `yolov8s.pt`| ~22 MB | Fast        | 44.9  |
| `yolov8m.pt`| ~52 MB | Moderate    | 50.2  |
| `yolov8l.pt`| ~87 MB | Slow        | 52.9  |
| `yolov8x.pt`| ~131 MB| Slowest     | 53.9  |

---

## 🖥️ GPU Acceleration

The script automatically detects CUDA and prints:

```
[INFO] GPU detected — using CUDA  (NVIDIA GeForce RTX 3060)
```

or

```
[INFO] No GPU detected — running on CPU
```

To install **PyTorch with CUDA** manually (if the default CPU version was installed):

```powershell
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| `[ERROR] Cannot open webcam at index 0` | Webcam may be in use by another app (Teams, Zoom, etc.). Close them and retry, or try index `1`. |
| Low FPS on CPU | Switch to a lighter model (`yolov8n.pt`) or reduce resolution in the script. |
| `ModuleNotFoundError: No module named 'ultralytics'` | Ensure the virtual environment is **activated** before running. |
| PowerShell execution policy error | Run: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
| Model download fails | Check your internet connection. The model downloads once from [ultralytics.com](https://ultralytics.com). |
| CUDA not being used despite having a GPU | Install the CUDA-enabled PyTorch build (see GPU section above). |

---

## 📦 Dependencies

```
ultralytics      — YOLOv8 model framework
opencv-python    — Webcam capture and image rendering
torch            — Deep learning backend
torchvision      — Image transformations
numpy            — Array operations
```

---

## 📄 License

This project is licensed under the **MIT License**. The YOLOv8 model is subject to the [Ultralytics AGPL-3.0 License](https://github.com/ultralytics/ultralytics/blob/main/LICENSE).

---

## 🙏 Acknowledgements

- [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics)
- [OpenCV](https://opencv.org/)
- [PyTorch](https://pytorch.org/)
