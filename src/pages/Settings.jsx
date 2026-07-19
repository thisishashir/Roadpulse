import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Bell, Moon, Globe } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your account and preferences</p>
            </div>
            <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Profile */}
                <div className="section-card">
                    <div className="section-title" style={{ marginBottom: 20 }}><User size={16} color="var(--cyan)" /> Profile</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white' }}>{user?.avatar}</div>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: 17 }}>{user?.name}</p>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role} · {user?.email}</p>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div className="form-group"><label className="form-label">Display Name</label><input className="form-input" defaultValue={user?.name} /></div>
                        <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue={user?.email} readOnly style={{ opacity: 0.6 }} /></div>
                    </div>
                </div>
                {/* Preferences */}
                <div className="section-card">
                    <div className="section-title" style={{ marginBottom: 16 }}><Bell size={16} color="var(--cyan)" /> Notifications</div>
                    {[
                        ['Critical alerts via SMS', true],
                        ['Email digest (daily)', false],
                        ['Push notifications', true],
                        ['Repair status updates', true],
                    ].map(([label, def]) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <span style={{ fontSize: 13 }}>{label}</span>
                            <label style={{ position: 'relative', display: 'inline-block', width: 42, height: 22 }}>
                                <input type="checkbox" defaultChecked={def} style={{ opacity: 0, width: 0, height: 0 }} />
                                <span style={{
                                    position: 'absolute', inset: 0, borderRadius: 22,
                                    background: def ? 'var(--cyan)' : 'rgba(255,255,255,0.1)',
                                    cursor: 'pointer', transition: '0.3s',
                                    display: 'flex', alignItems: 'center',
                                    paddingLeft: def ? 22 : 2,
                                }}>
                                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', display: 'block', transition: '0.3s' }} />
                                </span>
                            </label>
                        </div>
                    ))}
                </div>
                {/* App Settings */}
                <div className="section-card">
                    <div className="section-title" style={{ marginBottom: 14 }}><Globe size={16} color="var(--cyan)" /> App Settings</div>
                    <div className="form-group" style={{ marginBottom: 12 }}>
                        <label className="form-label">Detection Radius</label>
                        <select className="form-input"><option>5 km</option><option>10 km</option><option>20 km</option></select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Language</label>
                        <select className="form-input"><option>English</option><option>Hindi</option></select>
                    </div>
                </div>
                <button className="btn btn-primary" style={{ width: 'fit-content' }}>Save Changes</button>
            </div>
        </div>
    );
};

export default Settings;
