import React from 'react';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { TrendingUp, MapPin, BarChart2, Cpu } from 'lucide-react';
import { HOTSPOT_DATA, REPAIR_TIMELINE_DATA, EFFICIENCY_DATA } from '../../data/mockData';

const DANGER_ZONES = [
    { zone: 'MG Road', score: 92, reports: 42 },
    { zone: 'NH-44', score: 78, reports: 35 },
    { zone: 'Industrial Zone', score: 85, reports: 28 },
    { zone: 'Sector 21', score: 55, reports: 22 },
    { zone: 'Bridge Road', score: 70, reports: 18 },
];

const ttStyle = { background: '#111827', border: '1px solid var(--border-color)', borderRadius: 8 };
const tickStyle = { fill: 'var(--text-muted)', fontSize: 11 };

const Analytics = () => (
    <div className="animate-fade-in">
        <div className="page-header">
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">Data-driven insights on road damage trends and repair efficiency</p>
        </div>

        <div className="grid-2" style={{ marginBottom: 20 }}>
            {/* Hotspots Bar */}
            <div className="section-card">
                <div className="section-header">
                    <span className="section-title"><MapPin size={16} color="var(--cyan)" /> Damage Hotspots</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={HOTSPOT_DATA} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="zone" tick={tickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={ttStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                        <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                        <Bar dataKey="reports" name="Total Reports" fill="#00d4ff" radius={[4, 4, 0, 0]} opacity={0.85} />
                        <Bar dataKey="critical" name="Critical" fill="#ff4444" radius={[4, 4, 0, 0]} opacity={0.85} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Severity Trend Line */}
            <div className="section-card">
                <div className="section-header">
                    <span className="section-title"><TrendingUp size={16} color="var(--cyan)" /> Severity Trends</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={REPAIR_TIMELINE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={ttStyle} />
                        <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                        <Line type="monotone" dataKey="reported" name="Reported" stroke="#ff4444" strokeWidth={2.5} dot={{ fill: '#ff4444', r: 3 }} />
                        <Line type="monotone" dataKey="repaired" name="Repaired" stroke="#00cc66" strokeWidth={2.5} dot={{ fill: '#00cc66', r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="grid-2">
            {/* Repair Efficiency */}
            <div className="section-card">
                <div className="section-header">
                    <span className="section-title"><Cpu size={16} color="var(--cyan)" /> Repair Efficiency (%)</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={EFFICIENCY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="week" tick={tickStyle} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={tickStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={ttStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} formatter={(v) => [`${v}%`, 'Efficiency']} />
                        <Bar dataKey="efficiency" name="Efficiency" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Danger Zone Rankings */}
            <div className="section-card">
                <div className="section-header">
                    <span className="section-title"><BarChart2 size={16} color="var(--red)" /> Most Dangerous Zones</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {DANGER_ZONES.map((z, i) => (
                        <div key={z.zone}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: i === 0 ? 'var(--red-dim)' : 'rgba(255,255,255,0.05)', border: i === 0 ? '1px solid var(--red)' : '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: i === 0 ? 'var(--red)' : 'var(--text-muted)', flexShrink: 0 }}>
                                        {i + 1}
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 500 }}>{z.zone}</span>
                                </div>
                                <span style={{ fontSize: 12, color: z.score > 80 ? 'var(--red)' : z.score > 60 ? 'var(--yellow)' : 'var(--green)', fontWeight: 700 }}>{z.score}</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${z.score}%`, background: z.score > 80 ? 'var(--red)' : z.score > 60 ? 'var(--yellow)' : 'var(--green)' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default Analytics;
