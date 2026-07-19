import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { DAMAGE_REPORTS } from '../../data/mockData';
import { SeverityBadge, StatusBadge } from '../../components/SeverityBadge';

const statuses = ['all', 'reported', 'assigned', 'inprogress', 'repaired'];

const MyReports = () => {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filtered = DAMAGE_REPORTS.filter(r => {
        const matchSearch = r.type.toLowerCase().includes(search.toLowerCase()) ||
            r.location.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || r.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">My Reports</h1>
                <p className="page-subtitle">Track the status of your damage reports</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
                    <Search size={14} color="var(--text-muted)" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..." />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {statuses.map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`}
                            style={{ textTransform: 'capitalize' }}>
                            {s === 'inprogress' ? 'In Progress' : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status Pipeline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24, overflowX: 'auto', padding: '2px 0' }}>
                {['Reported', 'Assigned', 'In Progress', 'Repaired'].map((s, i, arr) => (
                    <React.Fragment key={s}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--cyan-dim)', border: '2px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--cyan)' }}>{i + 1}</div>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{s}</span>
                        </div>
                        {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: 'linear-gradient(to right, var(--cyan), var(--border-color))', minWidth: 30, marginBottom: 16 }} />}
                    </React.Fragment>
                ))}
            </div>

            {/* Table */}
            <div className="section-card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Type</th>
                                <th>Severity</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">📋</div><p>No reports found</p></div></td></tr>
                            ) : filtered.map(r => (
                                <tr key={r.id}>
                                    <td>
                                        <img src={r.image} alt={r.type} style={{ width: 52, height: 38, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)' }} />
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{r.type}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.id}</div>
                                    </td>
                                    <td><SeverityBadge severity={r.severity} /></td>
                                    <td style={{ maxWidth: 160 }}>
                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{r.location}</div>
                                    </td>
                                    <td>{r.date}</td>
                                    <td><StatusBadge status={r.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyReports;
