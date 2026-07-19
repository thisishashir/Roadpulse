# 🚧 RoadPulse – AI-Powered Intelligent Road Damage Detection & Smart Routing

![RoadPulse Banner](https://img.shields.io/badge/RoadPulse-AI%20Powered-blue?style=for-the-badge)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square\&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square\&logo=fastapi)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Computer%20Vision-red?style=flat-square)
![OpenCV](https://img.shields.io/badge/OpenCV-Vision-green?style=flat-square\&logo=opencv)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square\&logo=python)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square\&logo=vite)

### **Making Roads Safer Through Computer Vision, AI, and Intelligent Navigation**

---

# 📖 Overview

RoadPulse is an AI-powered civic technology platform that detects road damage using computer vision and transforms raw detections into meaningful insights through an AI Inspector.

Instead of simply identifying potholes or cracks, RoadPulse helps citizens and authorities understand:

* What damage has been detected
* How severe it is
* Why it matters
* Repair priority
* Safety risks
* Recommended actions

The project combines **YOLOv8**, **FastAPI**, **React**, and a lightweight **AI reasoning layer** to create an intelligent road inspection platform suitable for municipalities, smart cities, and transportation authorities.

---

# ✨ Features

## 🚗 AI Road Damage Detection

* Pothole detection
* Road crack detection
* Multiple damage detection
* Bounding box visualization
* Confidence scoring
* Real-time inference

---

## 🤖 AI Inspector

After YOLO detects damage, an AI Inspector analyzes the structured detection results and generates:

* Human-readable explanation
* Severity assessment
* Repair priority
* Risk assessment
* Repair recommendation
* Citizen-friendly summary

The AI **never performs detection**.

YOLO remains the single source of truth.

---

## 🗺 Smart Navigation *(RoadPulse Extension)*

RoadPulse extends traditional detection systems by integrating intelligent routing.

Planned capabilities include:

* Avoid damaged roads
* Suggest safer routes
* Highlight hazardous segments
* Road condition overlays
* Dynamic rerouting

Powered by:

* OSRM
* OpenStreetMap

---

## 👥 Citizen Dashboard

* Upload road damage
* View AI analysis
* Track submitted reports
* Live detection
* Interactive map
* Report history

---

## 🛠 Admin Dashboard

* Manage reports
* Review AI analysis
* Verify detections
* Analytics dashboard
* Damage statistics
* Maintenance prioritization

---

# 🧠 AI Workflow

```text
Upload Image
      │
      ▼
YOLOv8 Detection
      │
      ▼
Structured Detection JSON
      │
      ▼
AI Inspector
      │
      ├── Explanation
      ├── Severity
      ├── Priority
      ├── Risk Assessment
      ├── Recommendation
      └── Citizen Summary
      │
      ▼
Frontend AI Analysis Card
```

The AI layer enriches detections without replacing the existing computer vision pipeline.

---

# 🏗 Architecture

```text
                React Frontend
                      │
                      ▼
               FastAPI Backend
                      │
      ┌───────────────┴───────────────┐
      │                               │
      ▼                               ▼
 YOLOv8 Detection              AI Inspector
      │                               │
      └───────────────┬───────────────┘
                      ▼
              Unified API Response
                      │
                      ▼
             Citizen/Admin Dashboard
```

---

# 🧩 Tech Stack

## Frontend

* React 19
* Vite
* Tailwind CSS
* React Router
* Leaflet
* Recharts
* Framer Motion

---

## Backend

* FastAPI
* Python
* YOLOv8
* OpenCV
* PyTorch
* Uvicorn

---

## AI

* YOLOv8
* AI Inspector
* OpenAI / Gemini / OpenRouter *(configurable)*

---

## Mapping

* OpenStreetMap
* OSRM *(planned integration)*

---

# 📂 Project Structure

```bash
RoadPulse/
│
├── backend/
│   ├── main.py
│   ├── detect.py
│   ├── models/
│   ├── ai_inspector.py
│   ├── utils/
│   └── requirements.txt
│
├── src/
│   ├── components/
│   ├── pages/
│   │     ├── citizen/
│   │     └── admin/
│   ├── services/
│   ├── hooks/
│   ├── assets/
│   └── App.jsx
│
├── public/
├── package.json
└── README.md
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/thisishashir/RoadPulse.git

cd RoadPulse
```

---

## Frontend

```bash
npm install

npm run dev
```

---

## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

---

# 🔑 Environment Variables

```env
OPENAI_API_KEY=

GEMINI_API_KEY=

API_URL=http://localhost:8000
```

---

# 🔌 API Endpoints

## Detect Road Damage

```http
POST /detect
```

Returns:

```json
{
  "detections": [],
  "ai_analysis": {}
}
```

---

## Ask AI

```http
POST /ask-ai
```

Example Request

```json
{
  "question":"How dangerous is this pothole?"
}
```

---

# 🤖 AI Inspector Output

```json
{
  "explanation":"Large pothole detected on the driving lane.",
  "severity":"High",
  "priority":"Urgent",
  "recommendation":"Repair within 24 hours.",
  "risk":"High risk for two-wheelers.",
  "summary":"Large pothole detected requiring immediate attention."
}
```

---

# 🎯 Current Capabilities

* ✅ Road damage detection
* ✅ AI-powered explanations
* ✅ Citizen reporting
* ✅ Live detection
* ✅ Dashboard
* ✅ Image upload
* ✅ AI Inspector
* ✅ Damage prioritization

---

# 🚧 Future Roadmap

### AI

* Conversational AI Inspector
* Multi-image analysis
* Automatic report generation
* Predictive road deterioration
* Maintenance cost estimation

---

### Navigation

* OSRM integration
* Hazard-aware routing
* Live rerouting
* Heatmaps
* Road quality score

---

### Analytics

* City-wide dashboards
* Damage trends
* Repair analytics
* Maintenance optimization

---

# 🛡 Why RoadPulse?

Unlike traditional road damage detection systems that stop after identifying potholes, RoadPulse provides actionable intelligence.

RoadPulse answers questions such as:

* How severe is the damage?
* Should it be repaired immediately?
* What risks does it pose?
* What action should authorities take?
* How should it be explained to citizens?

This makes RoadPulse an AI-assisted road inspection platform rather than just an object detection application.

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Built With

* React
* FastAPI
* YOLOv8
* OpenCV
* PyTorch
* OpenStreetMap
* OSRM
* Artificial Intelligence

---

# 🌟 Vision

RoadPulse aims to bridge the gap between computer vision and intelligent civic infrastructure by helping citizens, municipalities, and smart cities detect, understand, and respond to road damage faster than ever before.

Rather than replacing human decision-making, RoadPulse augments it with explainable AI, enabling safer roads, better maintenance planning, and smarter urban mobility.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

**Built with ❤️ to make roads safer.**

</div>
