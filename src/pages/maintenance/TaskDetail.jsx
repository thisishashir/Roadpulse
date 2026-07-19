import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, CircleMarker, Popup } from 'react-leaflet';
import { ArrowLeft, Upload, CheckCircle, Camera, Navigation } from 'lucide-react';
import { MAINTENANCE_TASKS } from '../../data/mockData';
import { SeverityBadge, StatusBadge } from '../../components/SeverityBadge';
import ThemedTileLayer from '../../components/ThemedTileLayer';
import 'leaflet/dist/leaflet.css';

const COLOR = { minor: '#00cc66', moderate: '#ffaa00', severe: '#ff6600', critical: '#ff4444' };

const TaskDetail = () => {
    const { id } = useParams();
    const task = MAINTENANCE_TASKS.find(t => t.id === id) || MAINTENANCE_TASKS[0];

    const [status, setStatus] = useState(task.status);
    const [beforeImg, setBeforeImg] = useState(null);
    const [afterImg, setAfterImg] = useState(null);
    const [completed, setCompleted] = useState(false);
    const beforeRef = useRef();
    const afterRef = useRef();

    const handleImg = (file, setter) => {
        if (!file) return;
        const r = new FileReader();
        r.onload = e => setter(e.target.result);
        r.readAsDataURL(file);
    };

    if (completed) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, textAlign: 'center' }}>
            <CheckCircle size={64} color="var(--green)" style={{ animation: 'float 2s ease infinite' }} />
            <h2 style={{ fontSize: 26, color: 'var(--green)' }}>Task Completed!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Record updated. The municipality has been notified.</p>
            <Link to="/maintenance/dashboard" className="btn btn-primary btn-lg"><ArrowLeft size={16} /> Back to Tasks</Link>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Link to="/maintenance/dashboard" className="btn btn-ghost btn-sm"><ArrowLeft size={14} /> Back</Link>
                <div>
                    <h1 className="page-title" style={{ marginBottom: 0 }}>Task Detail</h1>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{task.id} · Due {task.dueDate}</p>
                </div>
            </div>

            <div className="grid-2" style={{ gap: 20 }}>
                {/* Left: Info + Map */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Damage Image + Info */}
                    <div className="section-card">
                        <img src={task.image} alt={task.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 10, marginBottom: 14 }} />
                        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{task.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{task.description}</p>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                            <SeverityBadge severity={task.severity} />
                            <StatusBadge status={status} />
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {task.location}</p>
                    </div>

                    {/* Map */}
                    <div className="section-card">
                        <div className="section-header">
                            <span className="section-title">Location</span>
                            <a href={`https://maps.google.com/?q=${task.lat},${task.lng}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                                <Navigation size={12} /> Navigate
                            </a>
                        </div>
                        <div style={{ height: 200, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            <MapContainer center={[task.lat, task.lng]} zoom={15} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                                <ThemedTileLayer />
                                <CircleMarker center={[task.lat, task.lng]} radius={14}
                                    fillColor={COLOR[task.severity]} color={COLOR[task.severity]} fillOpacity={0.9} weight={3}>
                                    <Popup><strong>{task.title}</strong></Popup>
                                </CircleMarker>
                            </MapContainer>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Status Update */}
                    <div className="section-card">
                        <div className="section-title" style={{ marginBottom: 14 }}>Update Status</div>
                        <div className="form-group" style={{ marginBottom: 16 }}>
                            <label className="form-label">Current Status</label>
                            <select className="form-input" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="assigned">Assigned</option>
                                <option value="inprogress">In Progress</option>
                                <option value="repaired">Repaired</option>
                            </select>
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={() => setCompleted(true)}
                        >
                            <CheckCircle size={15} /> Mark as Completed
                        </button>
                    </div>

                    {/* Before Photo */}
                    <div className="section-card">
                        <div className="section-title" style={{ marginBottom: 12 }}><Camera size={14} color="var(--cyan)" /> Before Repair Photo</div>
                        {beforeImg
                            ? <img src={beforeImg} alt="before" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }} />
                            : <div className="upload-zone" onClick={() => beforeRef.current?.click()}>
                                <Upload size={24} color="var(--text-muted)" />
                                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Upload before photo</p>
                                <input ref={beforeRef} type="file" accept="image/*" hidden onChange={e => handleImg(e.target.files[0], setBeforeImg)} />
                            </div>
                        }
                    </div>

                    {/* After Photo */}
                    <div className="section-card">
                        <div className="section-title" style={{ marginBottom: 12 }}><Camera size={14} color="var(--green)" /> After Repair Photo</div>
                        {afterImg
                            ? <img src={afterImg} alt="after" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }} />
                            : <div className="upload-zone" onClick={() => afterRef.current?.click()}>
                                <Upload size={24} color="var(--text-muted)" />
                                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Upload after photo</p>
                                <input ref={afterRef} type="file" accept="image/*" hidden onChange={e => handleImg(e.target.files[0], setAfterImg)} />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
