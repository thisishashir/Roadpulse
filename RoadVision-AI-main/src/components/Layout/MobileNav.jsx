import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Map, FileText, Bell, BarChart2, Radio, Navigation, Wrench
} from 'lucide-react';
import './MobileNav.css';

const mobileNavConfig = {
    citizen: [
        { icon: LayoutDashboard, label: 'Home', path: '/citizen/dashboard' },
        { icon: Map, label: 'Map', path: '/citizen/map' },
        { icon: Radio, label: 'Report', path: '/citizen/report' },
        { icon: FileText, label: 'Reports', path: '/citizen/reports' },
        { icon: Navigation, label: 'Route', path: '/citizen/safe-route' },
    ],
    admin: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Map, label: 'Map', path: '/admin/map' },
        { icon: FileText, label: 'Reports', path: '/admin/reports' },
        { icon: Bell, label: 'Alerts', path: '/admin/alerts' },
        { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
    ],
    maintenance: [
        { icon: Wrench, label: 'Tasks', path: '/maintenance/dashboard' },
        { icon: Map, label: 'Map', path: '/maintenance/map' },
    ],
};

const MobileNav = () => {
    const { user } = useAuth();
    const items = mobileNavConfig[user?.role] || mobileNavConfig.citizen;

    return (
        <nav className="mobile-nav">
            {items.map(({ icon: Icon, label, path }) => (
                <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) => `mob-nav-item ${isActive ? 'active' : ''}`}
                >
                    <Icon size={20} strokeWidth={1.8} />
                    <span>{label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default MobileNav;
