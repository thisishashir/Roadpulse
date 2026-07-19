import json
import os
from typing import Any, Dict, List, Optional

import requests


class RoadDamageAgent:
    def __init__(self) -> None:
        self.provider = os.getenv("ROADVISION_AGENT_PROVIDER", "heuristic").strip().lower()
        self.api_url = os.getenv("ROADVISION_AGENT_API_URL", "https://api.openai.com/v1/chat/completions")
        self.api_key = os.getenv("ROADVISION_AGENT_API_KEY", "").strip()
        self.model = os.getenv("ROADVISION_AGENT_MODEL", "gpt-4o-mini").strip()
        self.timeout = float(os.getenv("ROADVISION_AGENT_TIMEOUT", "20"))

    def analyze(
        self,
        detections: List[Dict[str, Any]],
        summary: Dict[str, Any],
        image_info: Optional[Dict[str, Any]] = None,
        specialized_model: bool = False,
    ) -> Dict[str, Any]:
        payload = self._build_payload(detections, summary, image_info, specialized_model)

        if self.provider in {"openai", "openai_compatible", "llm"} and self.api_key:
            try:
                return self._with_defaults(self._analyze_with_llm(payload), mode="agentic", provider=self.provider)
            except Exception as exc:
                fallback = self._fallback_analysis()
                fallback["provider"] = "llm-fallback"
                fallback["fallback_reason"] = str(exc)
                return fallback

        analysis = self._heuristic_analysis(payload)
        analysis["provider"] = "heuristic"
        return self._with_defaults(analysis, mode="rule-agent", provider="heuristic")

    def ask(
        self,
        detection_context: Dict[str, Any],
        ai_analysis: Dict[str, Any],
        question: str,
    ) -> Dict[str, Any]:
        payload = {
            "detection_context": detection_context,
            "ai_analysis": ai_analysis,
            "question": question,
        }

        if self.provider in {"openai", "openai_compatible", "llm"} and self.api_key:
            try:
                return self._with_defaults(self._ask_with_llm(payload), mode="answer")
            except Exception as exc:
                fallback = self._fallback_ask_response()
                fallback["fallback_reason"] = str(exc)
                return fallback

        return self._ask_with_heuristics(payload)

    def _build_payload(
        self,
        detections: List[Dict[str, Any]],
        summary: Dict[str, Any],
        image_info: Optional[Dict[str, Any]],
        specialized_model: bool,
    ) -> Dict[str, Any]:
        dominant_label = summary.get("dominant_label") or (detections[0]["label"] if detections else "No Damage")
        max_confidence = max((float(item.get("confidence", 0.0)) for item in detections), default=0.0)

        return {
            "specialized_model": specialized_model,
            "dominant_label": dominant_label,
            "max_confidence": max_confidence,
            "summary": summary,
            "detections": detections,
            "image_info": image_info or {},
        }

    def _heuristic_analysis(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        detections = payload["detections"]
        summary = payload["summary"]
        classes = [str(item.get("label", "")).lower() for item in detections]
        dominant_label = str(payload.get("dominant_label", "No Damage"))
        max_confidence = float(payload.get("max_confidence", 0.0))
        count = len(detections)

        risk_score = 15
        if any("pothole" in label for label in classes):
            risk_score += 45
        if any("crack" in label for label in classes):
            risk_score += 20
        if any(label in {"manhole issue", "drainage issue"} for label in classes):
            risk_score += 15
        if count > 1:
            risk_score += 10
        if max_confidence >= 0.85:
            risk_score += 10

        risk_score = max(0, min(risk_score, 100))

        if risk_score >= 80:
            priority = "critical"
            recommendation = "Dispatch a repair crew immediately and place temporary traffic control around the damaged area."
        elif risk_score >= 60:
            priority = "high"
            recommendation = "Create a repair ticket, verify the site, and schedule a crew within the current shift."
        elif risk_score >= 35:
            priority = "medium"
            recommendation = "Log the defect, confirm coordinates, and plan a near-term inspection."
        else:
            priority = "low"
            recommendation = "Monitor the location and re-scan if the area changes."

        reasoning_parts = []
        if detections:
            reasoning_parts.append(f"Detected {count} road defect(s) with dominant class '{dominant_label}'.")
            reasoning_parts.append(f"Highest confidence is {round(max_confidence * 100)}%.")
        else:
            reasoning_parts.append("No road damage detections were returned by the vision model.")
        if payload.get("specialized_model"):
            reasoning_parts.append("The specialized road-damage model is active, so the output is focused on potholes and cracks.")
        else:
            reasoning_parts.append("The fallback detector is active, so this result should be treated as lower confidence.")

        if priority == "critical":
            severity = "High"
        elif priority == "high":
            severity = "High"
        elif priority == "medium":
            severity = "Medium"
        else:
            severity = "Low"

        return {
            "status": "analysis_complete",
            "mode": "heuristic",
            "incident_type": dominant_label,
            "risk_score": risk_score,
            "priority": priority,
            "recommended_action": recommendation,
            "needs_human_review": priority in {"critical", "high"},
            "confidence": round(max_confidence, 3),
            "summary": summary,
            "evidence": [
                {
                    "label": item.get("label"),
                    "confidence": round(float(item.get("confidence", 0.0)), 3),
                }
                for item in detections
            ],
            "reasoning": " ".join(reasoning_parts),
            "follow_up": [
                "Validate the GPS location before dispatch.",
                "Retain the image for review and future model improvements.",
            ],
            "explanation": " ".join(reasoning_parts),
            "severity": severity,
            "recommendation": recommendation,
            "risk": "Higher values indicate more urgent repairs and wider traffic disruption potential.",
        }

    def _ask_with_heuristics(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        detection_context = payload.get("detection_context") or {}
        ai_analysis = payload.get("ai_analysis") or {}
        question = str(payload.get("question") or "").strip()

        if not question:
            return {"answer": "Please provide a question.", "mode": "heuristic"}

        severity = str(ai_analysis.get("severity", "Unknown"))
        priority = str(ai_analysis.get("priority", "Manual Review"))
        summary_value = ai_analysis.get("summary", "Road damage detected by computer vision.")
        if isinstance(summary_value, dict):
            summary = self._compact_dict(summary_value)
            summary_sentence = self._summarize_analysis_dict(summary_value)
        else:
            summary = str(summary_value)
            summary_sentence = summary
        explanation = str(ai_analysis.get("explanation", ai_analysis.get("reasoning", "AI analysis unavailable.")))
        recommendation = str(ai_analysis.get("recommendation", ai_analysis.get("recommended_action", "Review detection manually.")))
        risk = str(ai_analysis.get("risk", "Unknown"))
        labels = detection_context.get("classes") or detection_context.get("labels") or []
        label_text = ", ".join(map(str, labels)) if labels else "no listed labels"

        answer = (
            f"Based on the supplied detection context ({detection_context.get('count', 'unknown')} detections: {label_text}), "
            f"the severity is {severity.lower()} and the priority is {priority.lower()}. {summary_sentence} {recommendation} Risk note: {risk}."
        )

        return {
            "answer": answer,
            "mode": "heuristic",
            "used_context": {
                "detection_count": detection_context.get("count"),
                "labels": detection_context.get("classes"),
                "question": question,
            },
            "supporting_analysis": {
                "explanation": explanation,
                "severity": severity,
                "priority": priority,
                "recommendation": recommendation,
                "risk": risk,
                "summary": summary,
            },
        }

    def _compact_dict(self, value: Dict[str, Any]) -> str:
        parts = []
        for key, item in value.items():
            parts.append(f"{key}: {item}")
        return "; ".join(parts)

    def _summarize_analysis_dict(self, value: Dict[str, Any]) -> str:
        count = value.get("count")
        classes = value.get("classes") or []
        if count is not None and classes:
            return f"Road damage summary: {count} detection(s) with labels {', '.join(map(str, classes))}."
        if count is not None:
            return f"Road damage summary: {count} detection(s)."
        if classes:
            return f"Road damage summary: labels {', '.join(map(str, classes))}."
        return "Road damage detected by computer vision."

    def _fallback_analysis(self) -> Dict[str, Any]:
        return {
            "explanation": "AI analysis unavailable.",
            "severity": "Unknown",
            "priority": "Manual Review",
            "recommendation": "Review detection manually.",
            "risk": "Unknown",
            "summary": "Road damage detected by computer vision.",
        }

    def _fallback_ask_response(self) -> Dict[str, Any]:
        return {
            "answer": "AI analysis unavailable. Review the detection manually.",
            "citations": [],
        }

    def _analyze_with_llm(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are a road-safety operations agent. Turn YOLO detections into concise municipal action. "
                    "Return valid JSON only with keys: explanation, severity, priority, recommendation, risk, summary. "
                    "Do not invent detections or contradict YOLO. If information is unavailable, say so."
                ),
            },
            {
                "role": "user",
                "content": json.dumps(payload, ensure_ascii=True),
            },
        ]

        response = requests.post(
            self.api_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": self.model,
                "messages": messages,
                "temperature": 0.2,
                "response_format": {"type": "json_object"},
            },
            timeout=self.timeout,
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        analysis = json.loads(content)

        if not isinstance(analysis, dict):
            raise ValueError("Agent response must be a JSON object")

        return self._coerce_analysis_shape(analysis)

    def _ask_with_llm(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        messages = [
            {
                "role": "system",
                "content": (
                    "You answer questions about road damage inspection using only the supplied detection context and AI analysis. "
                    "Never invent new detections, never contradict YOLO, and never use outside memory. "
                    "Return valid JSON only with keys: answer, citations. If information is unavailable, say so."
                ),
            },
            {
                "role": "user",
                "content": json.dumps(payload, ensure_ascii=True),
            },
        ]

        response = requests.post(
            self.api_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": self.model,
                "messages": messages,
                "temperature": 0.1,
                "response_format": {"type": "json_object"},
            },
            timeout=self.timeout,
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        analysis = json.loads(content)

        if not isinstance(analysis, dict):
            raise ValueError("Agent response must be a JSON object")

        return analysis

    def _with_defaults(self, analysis: Dict[str, Any], **overrides: Any) -> Dict[str, Any]:
        shaped = self._coerce_analysis_shape(analysis)
        shaped.update(overrides)
        return shaped

    def _coerce_analysis_shape(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        explanation = analysis.get("explanation") or analysis.get("reasoning") or "AI analysis unavailable."
        severity = analysis.get("severity") or self._map_priority_to_severity(analysis.get("priority"))
        priority = analysis.get("priority") or analysis.get("priority_level") or "Manual Review"
        recommendation = analysis.get("recommendation") or analysis.get("recommended_action") or "Review detection manually."
        risk = analysis.get("risk") or analysis.get("risk_assessment") or "Unknown"
        summary = analysis.get("summary") or "Road damage detected by computer vision."

        shaped = dict(analysis)
        shaped.update(
            {
                "explanation": explanation,
                "severity": severity,
                "priority": priority,
                "recommendation": recommendation,
                "risk": risk,
                "summary": summary,
            }
        )
        return shaped

    def _map_priority_to_severity(self, priority: Optional[str]) -> str:
        normalized = str(priority or "").strip().lower()
        if normalized in {"urgent", "high", "critical"}:
            return "High"
        if normalized == "medium":
            return "Medium"
        if normalized == "low":
            return "Low"
        return "Unknown"


road_damage_agent = RoadDamageAgent()