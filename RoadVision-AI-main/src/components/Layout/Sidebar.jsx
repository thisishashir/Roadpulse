import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Map, FileText, Bell, BarChart2,
    Settings, ClipboardList, LogOut, Radio, ChevronLeft, ChevronRight,
    Navigation, Wrench, AlertTriangle, ScanSearch
} from 'lucide-react';
import './Sidebar.css';

const navConfig = {
    citizen: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/citizen/dashboard' },
        { icon: Map, label: 'Map View', path: '/citizen/map' },
        { icon: FileText, label: 'My Reports', path: '/citizen/reports' },
        { icon: Radio, label: 'Report Damage', path: '/citizen/report' },
        { icon: ScanSearch, label: 'Live Detection', path: '/citizen/live-detection' },
        { icon: Navigation, label: 'Safe Route', path: '/citizen/safe-route' },
        { icon: Settings, label: 'Settings', path: '/citizen/settings' },
    ],
    admin: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Map, label: 'City Map', path: '/admin/map' },
        { icon: ClipboardList, label: 'Reports', path: '/admin/reports' },
        { icon: AlertTriangle, label: 'Alerts', path: '/admin/alerts' },
        { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ],
    maintenance: [
        { icon: Wrench, label: 'My Tasks', path: '/maintenance/dashboard' },
        { icon: Map, label: 'Map', path: '/maintenance/map' },
        { icon: Settings, label: 'Settings', path: '/maintenance/settings' },
    ],
};

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const navItems = navConfig[user?.role] || navConfig.citizen;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
                        <rect width="40" height="40" rx="8" fill="rgba(0,212,255,0.15)" />
                        <path d="M20 6L6 13v4l14 7 14-7v-4L20 6z" fill="#00d4ff" opacity="0.9" />
                        <path d="M6 17v8l14 7V25L6 17z" fill="#00d4ff" opacity="0.5" />
                        <path d="M34 17v8l-14 7V25l14-8z" fill="#00d4ff" opacity="0.7" />
                        <circle cx="20" cy="20" r="2.5" fill="white" />
                    </svg>
                </div>
                {!collapsed && (
                    <div className="logo-text">
                        <span className="logo-primary">Road</span>
                        <span className="logo-accent">Pulse</span>
                        <span className="logo-tag">AI</span>
                    </div>
                )}
                <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Role Badge */}
            {!collapsed && (
                <div className="role-badge">
                    <span className={`role-pill role-${user?.role}`}>
                        {user?.role === 'admin' ? '🏛️ Admin' : user?.role === 'maintenance' ? '👷 Maintenance' : '🚴 Citizen'}
                    </span>
                </div>
            )}

            {/* Nav Items */}
            <nav className="sidebar-nav">
                {navItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        title={collapsed ? label : undefined}
                    >
                        <Icon size={18} strokeWidth={2} />
                        {!collapsed && <span>{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom — Logout */}
            <div className="sidebar-footer">
                <button className="nav-item logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
                    <LogOut size={18} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
