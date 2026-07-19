import React, { useState } from 'react';
import { MapContainer, CircleMarker, Popup } from 'react-leaflet';
import { Layers, Filter, Download } from 'lucide-react';
import { DAMAGE_REPORTS, MAP_CENTER } from '../../data/mockData';
import { SeverityBadge, StatusBadge } from '../../components/SeverityBadge';
import ThemedTileLayer from '../../components/ThemedTileLayer';
import 'leaflet/dist/leaflet.css';

const COLOR = { minor: '#00cc66', moderate: '#ffaa00', severe: '#ff6600', critical: '#ff4444' };

const CityMap = () => {
    const [filter, setFilter] = useState('all');
    const [showHeatmap, setShowHeatmap] = useState(false);

    const visible = filter === 'all' ? DAMAGE_REPORTS : DAMAGE_REPORTS.filter(r => r.severity === filter);

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 90px)', gap: 10 }}>
            <div className="page-header" style={{ marginBottom: 8 }}>
                <h1 className="page-title">City Map</h1>
                <p className="page-subtitle">Full city overview with clustering and heatmap</p>
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['all', 'minor', 'moderate', 'severe', 'critical'].map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ textTransform: 'capitalize' }}>
                            {s === 'all' ? 'All' : s}
                        </button>
                    ))}
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button
                        className={`btn btn-sm ${showHeatmap ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setShowHeatmap(h => !h)}>
                        <Layers size={13} /> {showHeatmap ? 'Heatmap ON' : 'Heatmap'}
                    </button>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>{visible.length} reports</span>
                </div>
            </div>

            {/* Map */}
            <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-color)', minHeight: 400, position: 'relative' }}>
                <MapContainer center={MAP_CENTER} zoom={11} style={{ height: '100%', width: '100%' }}>
                    <ThemedTileLayer />
                    {visible.map(r => (
                        <CircleMarker key={r.id} center={[r.lat, r.lng]}
                            radius={r.severity === 'critical' ? 16 : r.severity === 'severe' ? 12 : 9}
                            fillColor={COLOR[r.severity]}
                            color={r.severity === 'critical' ? '#ff0000' : COLOR[r.severity]}
                            fillOpacity={showHeatmap ? 0.4 : 0.85}
                            weight={r.severity === 'critical' ? 3 : 2}
                            opacity={showHeatmap ? 0.5 : 1}
                        >
                            <Popup maxWidth={280}>
                                <div>
                                    <img src={r.image} alt={r.type} style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 6, marginBottom: 8, display: 'block' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: 13 }}>{r.type}</strong>
                                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r.id}</span>
                                    </div>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{r.location}</p>
                                    <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                                        <SeverityBadge severity={r.severity} />
                                        <StatusBadge status={r.status} />
                                    </div>
                                    {r.assignedTo && (
                                        <p style={{ fontSize: 11, color: 'var(--green)' }}>👷 Assigned: {r.assignedTo}</p>
                                    )}
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>

                {/* Heatmap overlay visual */}
                {showHeatmap && (
                    <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: 'radial-gradient(ellipse at 43% 48%, rgba(255,68,68,0.25) 0%, transparent 30%), radial-gradient(ellipse at 55% 42%, rgba(255,170,0,0.2) 0%, transparent 25%), radial-gradient(ellipse at 48% 60%, rgba(255,102,0,0.15) 0%, transparent 20%)',
                        borderRadius: 12,
                    }} />
                )}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', padding: '8px 4px' }}>
                {[['#00cc66', 'Minor'], ['#ffaa00', 'Moderate'], ['#ff6600', 'Severe'], ['#ff4444', 'Critical (pulsing)']].map(([c, l]) => (
                    <span key={l} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, flexShrink: 0, display: 'inline-block' }} />{l}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default CityMap;
