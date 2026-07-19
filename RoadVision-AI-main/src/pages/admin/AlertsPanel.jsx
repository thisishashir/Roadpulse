import React, { useState } from 'react';
import { Bell, CheckCircle, Filter } from 'lucide-react';
import { ALERTS } from '../../data/mockData';

const AlertsPanel = () => {
    const [filter, setFilter] = useState('all');
    const [alerts, setAlerts] = useState(ALERTS);

    const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);
    const criticals = alerts.filter(a => a.type === 'critical' && !a.read).length;

    const markRead = (id) => setAlerts(as => as.map(a => a.id === id ? { ...a, read: true } : a));
    const markAllRead = () => setAlerts(as => as.map(a => ({ ...a, read: true })));

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Alerts Panel</h1>
                <p className="page-subtitle">Real-time road damage alerts and system notifications</p>
            </div>

            {/* Critical Banner */}
            {criticals > 0 && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'var(--red-dim)', border: '1px solid rgba(255,68,68,0.4)',
                    borderRadius: 12, padding: '14px 18px', marginBottom: 20,
                    animation: 'flash-bg 2s infinite',
                }}>
                    <span className="blink" style={{ fontSize: 24 }}>🚨</span>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#ffb3b3' }}>{criticals} Critical Alert{criticals > 1 ? 's' : ''} Require Immediate Action</p>
                        <p style={{ fontSize: 12, color: 'rgba(255,179,179,0.7)' }}>Respond immediately to prevent accidents</p>
                    </div>
                </div>
            )}

            {/* Filter Tabs + Actions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
                {['all', 'critical', 'warning', 'info'].map(t => (
                    <button key={t} onClick={() => setFilter(t)}
                        className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ textTransform: 'capitalize' }}>
                        {t === 'critical' ? '🚨 Critical' : t === 'warning' ? '⚠️ Warning' : t === 'info' ? 'ℹ️ Info' : '🔔 All'}
                    </button>
                ))}
                <button className="btn btn-sm btn-ghost" onClick={markAllRead} style={{ marginLeft: 'auto', gap: 5 }}>
                    <CheckCircle size={13} /> Mark All Read
                </button>
            </div>

            {/* Alert List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.length === 0 ? (
                    <div className="empty-state"><div className="empty-icon">🔔</div><p>No alerts in this category</p></div>
                ) : filtered.map(a => (
                    <div key={a.id} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 14,
                        padding: '16px 18px',
                        background: a.type === 'critical' && !a.read
                            ? 'rgba(255,68,68,0.08)'
                            : 'var(--bg-card)',
                        border: '1px solid',
                        borderColor: a.type === 'critical' && !a.read ? 'rgba(255,68,68,0.3)' : 'var(--border-color)',
                        borderRadius: 12, cursor: 'default',
                        animation: a.type === 'critical' && !a.read ? 'flash-bg 3s infinite' : 'none',
                        opacity: a.read ? 0.6 : 1,
                        transition: 'opacity 0.3s',
                    }}>
                        <span style={{ fontSize: 26, flexShrink: 0, lineHeight: 1, marginTop: 2, animation: a.type === 'critical' && !a.read ? 'blink 1.5s infinite' : 'none' }}>{a.icon}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{a.title}</span>
                                <span style={{
                                    fontSize: 10, padding: '2px 8px', borderRadius: 10, background:
                                        a.type === 'critical' ? 'var(--red-dim)' : a.type === 'warning' ? 'var(--yellow-dim)' : 'var(--cyan-dim)',
                                    color: a.type === 'critical' ? 'var(--red)' : a.type === 'warning' ? 'var(--yellow)' : 'var(--cyan)',
                                    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'
                                }}>
                                    {a.type}
                                </span>
                                {!a.read && <span className="blink" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }} />}
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{a.message}</p>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>📍 {a.location}</span>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>🕐 {a.time}</span>
                            </div>
                        </div>
                        {!a.read && (
                            <button className="btn btn-ghost btn-sm" onClick={() => markRead(a.id)} style={{ flexShrink: 0 }}>
                                <CheckCircle size={13} /> Done
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertsPanel;
