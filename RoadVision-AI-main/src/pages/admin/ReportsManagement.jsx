import React, { useState } from 'react';
import { UserCheck, X, Search } from 'lucide-react';
import { DAMAGE_REPORTS, MAINTENANCE_CREWS } from '../../data/mockData';
import { SeverityBadge, StatusBadge } from '../../components/SeverityBadge';

const ReportsManagement = () => {
    const [reports, setReports] = useState(DAMAGE_REPORTS);
    const [search, setSearch] = useState('');
    const [assignModal, setAssignModal] = useState(null);
    const [selectedCrew, setSelectedCrew] = useState('');

    const filtered = reports.filter(r =>
        r.type.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase())
    );

    const handleAssign = () => {
        if (!selectedCrew) return;
        const crew = MAINTENANCE_CREWS.find(c => c.id === selectedCrew);
        setReports(rs => rs.map(r => r.id === assignModal.id
            ? { ...r, status: 'assigned', assignedTo: crew?.name }
            : r
        ));
        setAssignModal(null);
        setSelectedCrew('');
    };

    const handleStatusChange = (id, val) => {
        setReports(rs => rs.map(r => r.id === id ? { ...r, status: val } : r));
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Reports Management</h1>
                <p className="page-subtitle">Review, assign, and track all damage reports</p>
            </div>

            {/* Search */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
                    <Search size={14} color="var(--text-muted)" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by type or location..." />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} reports</div>
            </div>

            <div className="section-card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Report</th>
                                <th>Severity</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Assigned To</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(r => (
                                <tr key={r.id}>
                                    <td>
                                        <img src={r.image} alt={r.type} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{r.type}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.id}</div>
                                    </td>
                                    <td><SeverityBadge severity={r.severity} /></td>
                                    <td style={{ maxWidth: 150 }}>
                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150, fontSize: 12 }}>{r.location}</div>
                                    </td>
                                    <td style={{ fontSize: 12 }}>{r.date}</td>
                                    <td>
                                        <span style={{ fontSize: 12, color: r.assignedTo ? 'var(--green)' : 'var(--text-muted)' }}>
                                            {r.assignedTo || '—'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="form-input"
                                            value={r.status}
                                            onChange={e => handleStatusChange(r.id, e.target.value)}
                                            style={{ padding: '4px 8px', fontSize: 11, width: 120 }}>
                                            <option value="reported">Reported</option>
                                            <option value="assigned">Assigned</option>
                                            <option value="inprogress">In Progress</option>
                                            <option value="repaired">Repaired</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="btn btn-outline btn-sm" onClick={() => setAssignModal(r)}>
                                            <UserCheck size={12} /> Assign
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assign Modal */}
            {assignModal && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setAssignModal(null); }}>
                    <div className="modal-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 className="modal-title" style={{ margin: 0 }}>Assign Maintenance Crew</h3>
                            <button onClick={() => setAssignModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Report</p>
                            <div className="glass-card" style={{ padding: '10px 14px' }}>
                                <strong style={{ fontSize: 13 }}>{assignModal.type}</strong>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{assignModal.location}</p>
                                <div style={{ marginTop: 8 }}><SeverityBadge severity={assignModal.severity} /></div>
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 20 }}>
                            <label className="form-label">Select Crew</label>
                            <select className="form-input" value={selectedCrew} onChange={e => setSelectedCrew(e.target.value)}>
                                <option value="">Choose a crew...</option>
                                {MAINTENANCE_CREWS.map(c => (
                                    <option key={c.id} value={c.id} disabled={!c.available}>
                                        {c.name} — {c.members} members {!c.available ? '(busy)' : `(${c.activeJobs} jobs)`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn btn-primary" onClick={handleAssign} disabled={!selectedCrew}>
                                <UserCheck size={14} /> Assign Crew
                            </button>
                            <button className="btn btn-ghost" onClick={() => setAssignModal(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsManagement;
