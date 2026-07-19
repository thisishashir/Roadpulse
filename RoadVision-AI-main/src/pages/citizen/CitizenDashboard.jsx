import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileText, Radio, MapPin, TrendingUp, Clock, CheckCircle, Zap } from 'lucide-react';
import { MapContainer, CircleMarker, Popup } from 'react-leaflet';
import { CITIZEN_STATS, DAMAGE_REPORTS, ALERTS, MAP_CENTER } from '../../data/mockData';
import { SeverityBadge, StatusBadge } from '../../components/SeverityBadge';
import ThemedTileLayer from '../../components/ThemedTileLayer';
import 'leaflet/dist/leaflet.css';

const COLOR = { minor: '#00cc66', moderate: '#ffaa00', severe: '#ff6600', critical: '#ff4444' };

const CitizenDashboard = () => {
    const nearby = DAMAGE_REPORTS.slice(0, 4);
    const recentAlerts = ALERTS.filter(a => !a.read).slice(0, 3);

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">My Dashboard</h1>
                <p className="page-subtitle">Stay informed about road hazards in your area</p>
            </div>

            {/* KPI Cards */}
            <div className="grid-4" style={{ marginBottom: 20 }}>
                <div className="stat-card" style={{ borderLeft: '3px solid var(--red)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Nearby Hazards</p>
                            <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--red)' }}>{CITIZEN_STATS.nearbyHazards}</p>
                        </div>
                        <div style={{ background: 'var(--red-dim)', padding: 10, borderRadius: 10 }}>
                            <AlertTriangle size={20} color="var(--red)" />
                        </div>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Within 5km of you</p>
                </div>

                <div className="stat-card" style={{ borderLeft: '3px solid var(--cyan)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>My Reports</p>
                            <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--cyan)' }}>{CITIZEN_STATS.myReports}</p>
                        </div>
                        <div style={{ background: 'var(--cyan-dim)', padding: 10, borderRadius: 10 }}>
                            <FileText size={20} color="var(--cyan)" />
                        </div>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Submitted by you</p>
                </div>

                <div className="stat-card" style={{ borderLeft: '3px solid var(--red)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Critical Nearby</p>
                            <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--red)' }}>{CITIZEN_STATS.criticalNearby}</p>
                        </div>
                        <div style={{ background: 'var(--red-dim)', padding: 10, borderRadius: 10, animation: 'pulse-ring 1.5s infinite' }}>
                            <Zap size={20} color="var(--red)" />
                        </div>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Needs immediate action</p>
                </div>

                <div className="stat-card" style={{ borderLeft: '3px solid var(--green)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Active Alerts</p>
                            <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--green)' }}>{CITIZEN_STATS.activeAlerts}</p>
                        </div>
                        <div style={{ background: 'var(--green-dim)', padding: 10, borderRadius: 10 }}>
                            <CheckCircle size={20} color="var(--green)" />
                        </div>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>From the city system</p>
                </div>
            </div>

            {/* Quick Action */}
            <Link to="/citizen/report" className="btn btn-primary btn-lg" style={{ marginBottom: 24, display: 'inline-flex' }}>
                <Radio size={18} /> Report Road Damage
            </Link>

            <div className="grid-2" style={{ gap: 20 }}>
                {/* Mini Map */}
                <div className="section-card">
                    <div className="section-header">
                        <span className="section-title"><MapPin size={16} color="var(--cyan)" /> Nearby Hazards Map</span>
                        <Link to="/citizen/map" className="btn btn-outline btn-sm">Full Map</Link>
                    </div>
                    <div style={{ height: 280, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <MapContainer center={MAP_CENTER} zoom={11} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                            <ThemedTileLayer />
                            {nearby.map(r => (
                                <CircleMarker
                                    key={r.id}
                                    center={[r.lat, r.lng]}
                                    radius={r.severity === 'critical' ? 12 : 8}
                                    fillColor={COLOR[r.severity]}
                                    color={COLOR[r.severity]}
                                    fillOpacity={0.85}
                                    weight={2}
                                >
                                    <Popup>
                                        <strong style={{ color: 'var(--text-primary)' }}>{r.type}</strong>
                                        <br />{r.location}<br />
                                        <span style={{ color: COLOR[r.severity] }}>● {r.severity}</span>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    </div>
                    {/* Legend */}
                    <div style={{ display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
                        {[['minor', '#00cc66', '🟢 Minor'], ['moderate', '#ffaa00', '🟡 Moderate'], ['severe', '#ff6600', '🟠 Severe'], ['critical', '#ff4444', '🔴 Critical']].map(([s, c, l]) => (
                            <span key={s} style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l}</span>
                        ))}
                    </div>
                </div>

                {/* Recent Alerts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="section-card" style={{ flex: 1 }}>
                        <div className="section-header">
                            <span className="section-title"><AlertTriangle size={16} color="var(--red)" /> Active Alerts</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {recentAlerts.map(a => (
                                <div key={a.id} className={`alert-banner alert-${a.type}`}>
                                    <span style={{ fontSize: 18 }}>{a.icon}</span>
                                    <div>
                                        <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 1 }}>{a.title}</p>
                                        <p style={{ fontSize: 11, opacity: 0.8 }}>{a.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* My Recent Reports */}
                    <div className="section-card" style={{ flex: 1 }}>
                        <div className="section-header">
                            <span className="section-title"><Clock size={16} color="var(--cyan)" /> My Recent Reports</span>
                            <Link to="/citizen/reports" className="btn btn-ghost btn-sm">View All</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {DAMAGE_REPORTS.slice(0, 3).map(r => (
                                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <img src={r.image} alt={r.type} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{r.type}</p>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.location}</p>
                                    </div>
                                    <StatusBadge status={r.status} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;
