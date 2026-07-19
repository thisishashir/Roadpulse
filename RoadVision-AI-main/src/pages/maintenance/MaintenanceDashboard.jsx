import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Clock, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';
import { MAINTENANCE_TASKS } from '../../data/mockData';
import { SeverityBadge, StatusBadge } from '../../components/SeverityBadge';

const PRIORITY_COLOR = { 1: 'var(--red)', 2: 'var(--yellow)', 3: 'var(--green)' };
const PRIORITY_LABEL = { 1: 'URGENT', 2: 'HIGH', 3: 'NORMAL' };

const MaintenanceDashboard = () => {
    const pending = MAINTENANCE_TASKS.filter(t => t.status !== 'repaired');
    const completed = MAINTENANCE_TASKS.filter(t => t.status === 'repaired');

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">My Tasks</h1>
                <p className="page-subtitle">Your assigned maintenance jobs — sorted by priority</p>
            </div>

            {/* KPIs */}
            <div className="grid-3" style={{ marginBottom: 24 }}>
                <div className="stat-card" style={{ borderLeft: '3px solid var(--cyan)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>ASSIGNED TASKS</p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--cyan)' }}>{MAINTENANCE_TASKS.length}</p>
                </div>
                <div className="stat-card" style={{ borderLeft: '3px solid var(--yellow)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>IN PROGRESS</p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--yellow)' }}>{MAINTENANCE_TASKS.filter(t => t.status === 'inprogress').length}</p>
                </div>
                <div className="stat-card" style={{ borderLeft: '3px solid var(--green)' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>COMPLETED TODAY</p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--green)' }}>{completed.length}</p>
                </div>
            </div>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {MAINTENANCE_TASKS.map(task => (
                    <div key={task.id} className="section-card" style={{
                        borderLeft: `4px solid ${PRIORITY_COLOR[task.priority]}`,
                        padding: '18px 20px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                            <img src={task.image} alt={task.title} style={{ width: 90, height: 68, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: PRIORITY_COLOR[task.priority], background: `${PRIORITY_COLOR[task.priority]}22`, padding: '2px 8px', borderRadius: 6, letterSpacing: '0.5px' }}>
                                        P{task.priority} · {PRIORITY_LABEL[task.priority]}
                                    </span>
                                    <SeverityBadge severity={task.severity} />
                                    <StatusBadge status={task.status} />
                                </div>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{task.title}</h3>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>📍 {task.location}</p>
                                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{task.description}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', align: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                                    <Clock size={12} /> {task.distance}
                                </div>
                                <div style={{ display: 'flex', align: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                                    Due: {task.dueDate}
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                    <a href={`https://maps.google.com/?q=${task.lat},${task.lng}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                                        <Navigation size={12} /> Navigate
                                    </a>
                                    <Link to={`/maintenance/task/${task.id}`} className="btn btn-primary btn-sm">
                                        <Wrench size={12} /> View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MaintenanceDashboard;
