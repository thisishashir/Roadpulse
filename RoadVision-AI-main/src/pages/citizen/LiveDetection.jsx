import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, AlertCircle, ScanSearch, CheckCircle2, AlertTriangle } from 'lucide-react';
import config from '../../config';
import './LiveDetection.css';

const LiveDetection = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detections, setDetections] = useState([]);
    const [agentResult, setAgentResult] = useState(null);
    const [error, setError] = useState(null);
    const [fps, setFps] = useState(0);

    useEffect(() => {
        startWebcam();
        return () => stopWebcam();
    }, []);

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setError(null);
        } catch (err) {
            console.error("Error accessing webcam:", err);
            setError("Could not access webcam. Please ensure camera permissions are granted.");
        }
    };

    const stopWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    const captureAndDetect = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
            if (!blob) return;

            const formData = new FormData();
            formData.append('file', blob, 'frame.jpg');

            const startTime = performance.now();
            try {
                const response = await fetch(`${config.API_URL}/detect`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Backend server is not running');

                const data = await response.json();
                const endTime = performance.now();
                const aiAnalysis = data.ai_analysis || data.agentic_analysis || null;
                
                setDetections(data.detections);
                setAgentResult(aiAnalysis);
                setFps(Math.round(1000 / (endTime - startTime)));
                setError(null);
            } catch (err) {
                console.error("Detection error:", err);
                setError("Detection server is offline. Please start the Python backend.");
                setIsDetecting(false);
            }
        }, 'image/jpeg');
    };

    useEffect(() => {
        let intervalId;
        if (isDetecting) {
            intervalId = setInterval(captureAndDetect, 500); // Detect every 500ms
        }
        return () => clearInterval(intervalId);
    }, [isDetecting]);

    const drawDetections = () => {
        if (!canvasRef.current || detections.length === 0) return null;

        return detections.map((det, index) => {
            const [x1, y1, x2, y2] = det.box;
            const video = videoRef.current;
            if (!video) return null;

            // Calculate responsive coordinates
            const scaleX = video.clientWidth / video.videoWidth;
            const scaleY = video.clientHeight / video.videoHeight;

            return (
                <div 
                    key={index}
                    className="detection-box"
                    style={{
                        left: `${x1 * scaleX}px`,
                        top: `${y1 * scaleY}px`,
                        width: `${(x2 - x1) * scaleX}px`,
                        height: `${(y2 - y1) * scaleY}px`,
                    }}
                >
                    <span className="detection-label">
                        {det.label} {Math.round(det.confidence * 100)}%
                    </span>
                </div>
            );
        });
    };

    return (
        <div className="live-detection-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Real-Time Road Analysis</h1>
                    <p className="page-subtitle">AI-powered pothole and crack detection using YOLOv8</p>
                </div>
                <div className="status-badges">
                    {isDetecting && <span className="badge-pulse">Live Scanning</span>}
                    {fps > 0 && <span className="badge-fps">{fps} FPS</span>}
                </div>
            </div>

            <div className="detection-viewport-wrapper">
                <div className="video-container">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="live-video"
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <div className="detections-overlay">
                        {drawDetections()}
                    </div>
                </div>

                <div className="controls-panel">
                    <div className="info-card">
                        <div className="info-icon">
                            <ScanSearch size={24} />
                        </div>
                        <div className="info-content">
                            <h3>AI Road Inspection</h3>
                            <p>Our neural network identifies road distress markers in real-time. Use this for instant site analysis.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="error-alert">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="action-buttons">
                        <button 
                            className={`btn-primary ${isDetecting ? 'btn-stop' : ''}`}
                            onClick={() => setIsDetecting(!isDetecting)}
                        >
                            {isDetecting ? <RefreshCw className="spin" /> : <Camera />}
                            {isDetecting ? 'Stop Analysis' : 'Start AI Analysis'}
                        </button>
                    </div>

                    <div className="detection-summary">
                        <h3>Detection Results</h3>
                        {detections.length === 0 ? (
                            <p className="no-detections">No damage detected in current view.</p>
                        ) : (
                            <div className="detection-list">
                                {detections.map((det, i) => (
                                    <div key={i} className="detection-item">
                                        <div className="det-type">
                                            <CheckCircle2 size={16} className="icon-success" />
                                            <span>{det.label}</span>
                                        </div>
                                        <span className="det-conf">{Math.round(det.confidence * 100)}% Match</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {agentResult && (
                        <div className="info-card" style={{ marginTop: 14 }}>
                            <div className="info-content">
                                <h3>AI Analysis</h3>
                                <p style={{ marginBottom: 10 }}>{agentResult.explanation}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                                    <span className="ai-badge"><AlertTriangle size={14} /> Severity: <strong style={{ marginLeft: 4 }}>{agentResult.severity}</strong></span>
                                    <span className="ai-badge"><Camera size={14} /> Priority: <strong style={{ marginLeft: 4 }}>{agentResult.priority}</strong></span>
                                </div>
                                <p style={{ marginBottom: 8 }}><strong>Repair Recommendation:</strong> {agentResult.recommendation}</p>
                                <p style={{ marginBottom: 8 }}><strong>Risk Assessment:</strong> {agentResult.risk}</p>
                                <p style={{ margin: 0 }}><strong>Citizen Summary:</strong> {agentResult.summary}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveDetection;
