import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', location: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) return setError('Please fill required fields');
        if (form.password !== form.confirm) return setError('Passwords do not match');
        setLoading(true);
        await new Promise(r => setTimeout(r, 900));
        login(form.email, 'citizen', form.name);
        navigate('/');
    };

    return (
        <div className="auth-page">
            <div className="auth-bg"><div className="bg-grid" /></div>
            <div className="auth-card animate-fade-in">
                <div className="auth-header">
                    <h1 className="auth-title">Create <span>Account</span></h1>
                    <p className="auth-subtitle">Join RoadPulse AI as a Citizen</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">{error}</div>}
                    <div className="auth-split">
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input className="form-input" placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mobile *</label>
                            <input className="form-input" placeholder="+91 9876543210" value={form.phone} onChange={e => set('phone', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                    <div className="auth-split">
                        <div className="form-group">
                            <label className="form-label">Password *</label>
                            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password *</label>
                            <input className="form-input" type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Location (optional)</label>
                        <input className="form-input" placeholder="City / Area" value={form.location} onChange={e => set('location', e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? <><span className="spinner" /> Creating Account...</> : <><UserPlus size={16} /> Create Account</>}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
