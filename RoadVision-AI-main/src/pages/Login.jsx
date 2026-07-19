import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Shield, Zap } from 'lucide-react';
import './Auth.css';

const DEMO_CREDENTIALS = {
    citizen: { email: 'citizen@demo.com', pass: 'demo123' },
    admin: { email: 'admin@demo.com', pass: 'demo123' },
    maintenance: { email: 'crew@demo.com', pass: 'demo123' },
};

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '', role: 'citizen' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const fillDemo = (role) => {
        const c = DEMO_CREDENTIALS[role];
        setForm({ email: c.email, password: c.pass, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.email || !form.password) return setError('Please fill all fields');
        setLoading(true);
        await new Promise(r => setTimeout(r, 900));
        login(form.email, form.role, form.email.split('@')[0]);
        setLoading(false);
        navigate('/');
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="bg-particle" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${4 + Math.random() * 6}s`,
                    }} />
                ))}
                <div className="bg-grid" />
            </div>

            <div className="auth-card animate-fade-in">
                {/* Header */}
                <div className="auth-header">
                    <div className="auth-logo">
                        <svg viewBox="0 0 40 40" fill="none" width="44" height="44">
                            <rect width="40" height="40" rx="10" fill="rgba(0,212,255,0.15)" />
                            <path d="M20 6L6 13v4l14 7 14-7v-4L20 6z" fill="#00d4ff" opacity="0.9" />
                            <path d="M6 17v8l14 7V25L6 17z" fill="#00d4ff" opacity="0.5" />
                            <path d="M34 17v8l-14 7V25l14-8z" fill="#00d4ff" opacity="0.7" />
                            <circle cx="20" cy="20" r="2.5" fill="white" />
                        </svg>
                    </div>
                    <h1 className="auth-title">RoadPulse <span>AI</span></h1>
                    <p className="auth-subtitle">Smart City Road Monitoring System</p>
                </div>

                {/* Demo Quick Fill */}
                <div className="demo-pills">
                    <span className="demo-label"><Zap size={12} /> Quick Demo:</span>
                    {['citizen', 'admin', 'maintenance'].map(r => (
                        <button key={r} className="demo-pill" onClick={() => fillDemo(r)}>
                            {r === 'citizen' ? '🚴' : r === 'admin' ? '🏛️' : '👷'} {r}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => set('email', e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="pass-wrapper">
                            <input
                                className="form-input"
                                type={showPass ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={e => set('password', e.target.value)}
                                autoComplete="current-password"
                            />
                            <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Login As</label>
                        <select className="form-input" value={form.role} onChange={e => set('role', e.target.value)}>
                            <option value="citizen">🚴 Citizen</option>
                            <option value="admin">🏛️ Municipality Admin</option>
                            <option value="maintenance">👷 Maintenance Crew</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                        {loading ? <><span className="spinner" /> Authenticating...</> : <><Shield size={16} /> Sign In</>}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Citizens only — <Link to="/register">Create an account</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
