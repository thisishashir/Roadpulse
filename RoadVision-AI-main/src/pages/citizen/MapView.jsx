import React, { useState } from 'react';
import { MapContainer, CircleMarker, Popup } from 'react-leaflet';
import { DAMAGE_REPORTS, MAP_CENTER } from '../../data/mockData';
import { SeverityBadge, StatusBadge } from '../../components/SeverityBadge';
import ThemedTileLayer from '../../components/ThemedTileLayer';
import 'leaflet/dist/leaflet.css';

const COLOR = { minor: '#00cc66', moderate: '#ffaa00', severe: '#ff6600', critical: '#ff4444' };
const ALL_SEV = ['all', 'minor', 'moderate', 'severe', 'critical'];

const MapView = () => {
    const [filter, setFilter] = useState('all');
    const visible = filter === 'all' ? DAMAGE_REPORTS : DAMAGE_REPORTS.filter(r => r.severity === filter);

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 90px)', gap: 12 }}>
            <div className="page-header" style={{ marginBottom: 8 }}>
                <h1 className="page-title">Map View</h1>
                <p className="page-subtitle">Color-coded road hazard markers in your city</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {ALL_SEV.map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ textTransform: 'capitalize' }}>
                        {s === 'all' ? '🗺️ All' : s === 'minor' ? '🟢 Minor' : s === 'moderate' ? '🟡 Moderate' : s === 'severe' ? '🟠 Severe' : '🔴 Critical'}
                    </button>
                ))}
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{visible.length} markers</span>
            </div>

            {/* Map */}
            <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-color)', minHeight: 400 }}>
                <MapContainer center={MAP_CENTER} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <ThemedTileLayer />
                    {visible.map(r => (
                        <CircleMarker
                            key={r.id}
                            center={[r.lat, r.lng]}
                            radius={r.severity === 'critical' ? 14 : r.severity === 'severe' ? 11 : 9}
                            fillColor={COLOR[r.severity]}
                            color={COLOR[r.severity]}
                            fillOpacity={0.85}
                            weight={r.severity === 'critical' ? 3 : 2}
                        >
                            <Popup maxWidth={260}>
                                <div style={{ padding: '2px 0' }}>
                                    <img src={r.image} alt={r.type} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, marginBottom: 8, display: 'block' }} />
                                    <strong style={{ color: 'var(--text-primary)', fontSize: 13 }}>{r.type}</strong>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 6px' }}>{r.location}</p>
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                        <SeverityBadge severity={r.severity} />
                                        <StatusBadge status={r.status} />
                                    </div>
                                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>Reported: {r.date}</p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>

            {/* Legend */}
            <div className="section-card" style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Legend:</span>
                    {[['minor', '#00cc66', '🟢 Minor'], ['moderate', '#ffaa00', '🟡 Moderate'], ['severe', '#ff6600', '🟠 Severe'], ['critical', '#ff4444', '🔴 Critical — pulse']].map(([s, c, l]) => (
                        <span key={s} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block', flexShrink: 0 }} /> {l}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapView;
