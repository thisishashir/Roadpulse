import React, { useState, useRef } from 'react';
import { Camera, MapPin, Upload, X, CheckCircle, Cpu, AlertTriangle } from 'lucide-react';
import config from '../../config';
import { appendCustomReport } from '../../utils/reportStorage';
import './ReportDamage.css';

const DAMAGE_TYPES = ['Pothole', 'Road Crack', 'Alligator Crack', 'Surface Damage', 'Edge Break', 'Manhole Issue', 'Other'];
const SEVERITIES = ['minor', 'moderate', 'severe', 'critical'];

const ReportDamage = () => {
    const [image, setImage] = useState(null);
    const [aiResult, setAiResult] = useState(null);
    const [agentResult, setAgentResult] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [form, setForm] = useState({ type: '', severity: '', location: '', description: '' });
    const [gpsLoading, setGpsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const fileRef = useRef();

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleImage = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target.result);
            runAI(file);
        };
        reader.readAsDataURL(file);
    };

    const runAI = async (file) => {
        setAiLoading(true);
        setAiResult(null);
        setAgentResult(null);
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${config.API_URL}/detect`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Backend offline');

            const data = await response.json();
            const aiAnalysis = data.ai_analysis || data.agentic_analysis || null;
            
            if (data.detections && data.detections.length > 0) {
                // Get highest confidence detection
                const best = data.detections.sort((a, b) => b.confidence - a.confidence)[0];
                
                // Map YOLO classes to app types if needed
                let type = best.label;
                if (type === 'person') type = 'Other'; // Example mapping
                
                const severity = best.confidence > 0.8 ? 'severe' : best.confidence > 0.5 ? 'moderate' : 'minor';
                
                setAiResult({ 
                    type: type, 
                    severity: severity, 
                    confidence: Math.round(best.confidence * 100) 
                });
                setAgentResult(aiAnalysis);
                
                setForm(f => ({ ...f, type: type, severity: severity }));
            } else {
                setAiResult({ type: 'No Damage Detected', severity: 'N/A', confidence: 100 });
                setAgentResult(aiAnalysis);
            }
        } catch (err) {
            console.error("AI detection failed:", err);
            // Fallback to mock for demo if backend fails or just show error
            setAiResult({ type: 'Detection Error', severity: 'N/A', confidence: 0 });
            setAgentResult(null);
        } finally {
            setAiLoading(false);
        }
    };

    const getGPS = () => {
        setGpsLoading(true);
        navigator.geolocation?.getCurrentPosition(
            (pos) => {
                setForm(f => ({ ...f, location: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}` }));
                setGpsLoading(false);
            },
            () => {
                setForm(f => ({ ...f, location: 'MG Road, New Delhi (demo fallback)' }));
                setGpsLoading(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1200));

        const report = {
            id: `RPT-${Date.now().toString().slice(-6)}`,
            image: image,
            type: form.type || aiResult?.type || 'Other',
            severity: form.severity || aiResult?.severity || 'moderate',
            location: form.location || 'Unspecified location',
            date: new Date().toISOString().slice(0, 10),
            status: 'reported',
            assignedTo: null,
            reportedBy: 'current-user',
            description: form.description,
            aiConfidence: aiResult?.confidence ?? null,
            aiAnalysis: agentResult,
        };

        appendCustomReport(report);
        setSubmitted(true);
        setSubmitting(false);
    };

    if (submitted) return (
        <div className="report-success animate-fade-in">
            <div className="success-icon"><CheckCircle size={56} color="var(--green)" /></div>
            <h2>Report Submitted!</h2>
            <p>Your report has been sent to the municipality. Reference: <strong style={{ color: 'var(--cyan)' }}>RPT-{Date.now().toString().slice(-5)}</strong></p>
            <button className="btn btn-primary btn-lg" onClick={() => { setSubmitted(false); setSubmitting(false); setImage(null); setAiResult(null); setAgentResult(null); setForm({ type: '', severity: '', location: '', description: '' }); }}>
                Report Another
            </button>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Report Road Damage</h1>
                <p className="page-subtitle">AI-powered damage detection — upload a photo and let AI do the rest</p>
            </div>

            <div className="report-grid">
                {/* Left: Upload */}
                <div>
                    <div className="section-card" style={{ marginBottom: 16 }}>
                        <div className="section-title" style={{ marginBottom: 14 }}><Camera size={16} color="var(--cyan)" /> Upload / Capture Photo</div>
                        {image ? (
                            <div className="image-preview-wrapper">
                                <img src={image} alt="Damage" className="damage-preview-img" />
                                {aiLoading && (
                                    <div className="ai-overlay">
                                        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
                                        <p>AI Analyzing...</p>
                                    </div>
                                )}
                                {aiResult && !aiLoading && (
                                    <div className="ai-result-overlay">
                                        <div className="ai-badge">
                                            <Cpu size={14} /> Detected: <strong>{aiResult.severity} {aiResult.type}</strong> ({aiResult.confidence}% conf.)
                                        </div>
                                    </div>
                                )}
                                <button type="button" className="remove-img-btn" onClick={() => { setImage(null); setAiResult(null); setAgentResult(null); }}>
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div
                                className="upload-zone"
                                onClick={() => fileRef.current?.click()}
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => { e.preventDefault(); handleImage(e.dataTransfer.files[0]); }}
                            >
                                <Upload size={32} color="var(--text-muted)" style={{ marginBottom: 10 }} />
                                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: 'var(--text-primary)' }}>Drop image here or click to upload</p>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>JPG, PNG, HEIC supported</p>
                                <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => handleImage(e.target.files[0])} />
                            </div>
                        )}
                    </div>

                    {/* GPS */}
                    <div className="section-card">
                        <div className="section-title" style={{ marginBottom: 12 }}><MapPin size={16} color="var(--cyan)" /> Location</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="GPS location or address..." style={{ flex: 1 }} />
                            <button type="button" className="btn btn-outline" onClick={getGPS} disabled={gpsLoading} style={{ flexShrink: 0 }}>
                                {gpsLoading ? <span className="spinner" /> : <MapPin size={14} />} GPS
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="section-card">
                    <div className="section-title" style={{ marginBottom: 16 }}>Damage Details</div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="form-group">
                            <label className="form-label">Damage Type</label>
                            <select className="form-input" value={form.type} onChange={e => set('type', e.target.value)}>
                                <option value="">Select type...</option>
                                {DAMAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Severity</label>
                            <div className="sev-selector">
                                {SEVERITIES.map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        className={`sev-btn sev-${s} ${form.severity === s ? 'selected' : ''}`}
                                        onClick={() => set('severity', s)}
                                    >
                                        <span className={`sev-dot ${s}`} /> {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {aiResult && (
                            <div className="ai-badge" style={{ padding: '8px 14px' }}>
                                <Cpu size={14} />
                                AI Detected: <strong>{aiResult.type}</strong> — <strong style={{ textTransform: 'capitalize' }}>{aiResult.severity}</strong> ({aiResult.confidence}% confidence)
                            </div>
                        )}

                        {agentResult && (
                            <div className="section-card" style={{ marginTop: 8, padding: 14, borderColor: 'var(--cyan)' }}>
                                <div className="section-title" style={{ marginBottom: 10 }}><Cpu size={16} color="var(--cyan)" /> AI Analysis</div>
                                <p style={{ margin: '0 0 10px', fontSize: 14 }}>{agentResult.explanation}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                                    <span className="ai-badge"><AlertTriangle size={14} /> Severity: <strong style={{ marginLeft: 4 }}>{agentResult.severity}</strong></span>
                                    <span className="ai-badge"><Cpu size={14} /> Priority: <strong style={{ marginLeft: 4 }}>{agentResult.priority}</strong></span>
                                </div>
                                <p style={{ margin: '0 0 8px', fontSize: 14 }}><strong>Repair Recommendation:</strong> {agentResult.recommendation}</p>
                                <p style={{ margin: '0 0 8px', fontSize: 14 }}><strong>Risk Assessment:</strong> {agentResult.risk}</p>
                                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}><strong>Citizen Summary:</strong> {agentResult.summary}</p>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input"
                                rows={4}
                                placeholder="Describe the road damage in detail..."
                                value={form.description}
                                onChange={e => set('description', e.target.value)}
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" disabled={submitting || !image} style={{ width: '100%', justifyContent: 'center' }}>
                            {submitting ? <><span className="spinner" /> Submitting...</> : 'Submit Report'}
                        </button>
                        {!image && <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>Please upload a photo to submit</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportDamage;
