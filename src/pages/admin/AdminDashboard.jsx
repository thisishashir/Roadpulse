import React from 'react';
import { BarChart2, AlertTriangle, CheckCircle, Clock, TrendingUp, Zap, Users, MapPin } from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { ADMIN_STATS, SEVERITY_CHART_DATA, REPAIR_TIMELINE_DATA, ALERTS, DAMAGE_REPORTS } from '../../data/mockData';
import { SeverityBadge, StatusBadge } from '../../components/SeverityBadge';

const KPI = ({ label, value, sub, icon: Icon, color, bgColor }) => (
    <div className="stat-card" style={{ borderLeft: `3px solid ${color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
                <p style={{ fontSize: 34, fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
            </div>
            <div style={{ background: bgColor, padding: 10, borderRadius: 12, flexShrink: 0 }}>
                <Icon size={22} color={color} />
            </div>
        </div>
        {sub && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>{sub}</p>}
    </div>
);

const AdminDashboard = () => {
    const critical = ALERTS.filter(a => a.type === 'critical' && !a.read);
    const recentReports = DAMAGE_REPORTS.slice(0, 5);

    const customTooltip = ({ active, payload }) => {
        if (active && payload?.length) {
            return (
                <div style={{ background: '#111827', border: '1px solid var(--border-color)', borderRadius: 8, padding: '8px 12px' }}>
                    <p style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{payload[0].name}: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-subtitle">Smart city road monitoring overview for Municipality Administrators</p>
            </div>

            {/* KPIs */}
            <div className="grid-4" style={{ marginBottom: 24 }}>
                <KPI label="Total Damages" value={ADMIN_STATS.totalDamages} sub="Across all city zones" icon={BarChart2} color="var(--cyan)" bgColor="var(--cyan-dim)" />
                <KPI label="Critical Issues" value={ADMIN_STATS.criticalIssues} sub="Needing immediate action" icon={Zap} color="var(--red)" bgColor="var(--red-dim)" />
                <KPI label="Repairs Completed" value={`${ADMIN_STATS.repairPercentage}%`} sub={`${ADMIN_STATS.repairsCompleted} of ${ADMIN_STATS.totalDamages} total`} icon={CheckCircle} color="var(--green)" bgColor="var(--green-dim)" />
                <KPI label="Avg Repair Time" value={ADMIN_STATS.avgRepairTime} sub="Down from 3.1 days last month" icon={Clock} color="var(--yellow)" bgColor="var(--yellow-dim)" />
            </div>

            <div className="grid-2" style={{ marginBottom: 24 }}>
                {/* Area Chart */}
                <div className="section-card">
                    <div className="section-header">
                        <span className="section-title"><TrendingUp size={16} color="var(--cyan)" /> Repair Timeline</span>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={REPAIR_TIMELINE_DATA}>
                            <defs>
                                <linearGradient id="gradReported" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ff4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ff4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradRepaired" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00cc66" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00cc66" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#111827', border: '1px solid var(--border-color)', borderRadius: 8 }} />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                            <Area type="monotone" dataKey="reported" name="Reported" stroke="#ff4444" fill="url(#gradReported)" strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="repaired" name="Repaired" stroke="#00cc66" fill="url(#gradRepaired)" strokeWidth={2} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Donut Chart */}
                <div className="section-card">
                    <div className="section-header">
                        <span className="section-title"><BarChart2 size={16} color="var(--cyan)" /> Severity Distribution</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <ResponsiveContainer width={200} height={200}>
                            <PieChart>
                                <Pie data={SEVERITY_CHART_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" strokeWidth={0}>
                                    {SEVERITY_CHART_DATA.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: '#111827', border: '1px solid var(--border-color)', borderRadius: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flex: 1 }}>
                            {SEVERITY_CHART_DATA.map((d) => (
                                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0, display: 'inline-block' }} />
                                        <span style={{ fontSize: 12 }}>{d.name}</span>
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-2">
                {/* Live Alerts */}
                <div className="section-card">
                    <div className="section-header">
                        <span className="section-title"><AlertTriangle size={16} color="var(--red)" /> Live Critical Alerts</span>
                        <span className="badge badge-critical blink">{critical.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {ALERTS.slice(0, 4).map(a => (
                            <div key={a.id} className={`alert-banner alert-${a.type}`}>
                                <span style={{ fontSize: 16 }}>{a.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 1 }}>{a.title}</p>
                                    <p style={{ fontSize: 11, opacity: 0.8 }}>{a.location} · {a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="section-card">
                    <div className="section-header">
                        <span className="section-title"><MapPin size={16} color="var(--cyan)" /> Recent Reports</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {recentReports.map(r => (
                            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <img src={r.image} alt={r.type} style={{ width: 42, height: 32, objectFit: 'cover', borderRadius: 6 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{r.type}</p>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.location}</p>
                                </div>
                                <SeverityBadge severity={r.severity} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
