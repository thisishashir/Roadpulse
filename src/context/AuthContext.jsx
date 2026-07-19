import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('rv_user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = (email, role, name) => {
        const u = { email, role, name: name || email.split('@')[0], avatar: email.charAt(0).toUpperCase() };
        setUser(u);
        localStorage.setItem('rv_user', JSON.stringify(u));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('rv_user');
    };

    const isAdmin = user?.role === 'admin';
    const isCitizen = user?.role === 'citizen';
    const isMaintenance = user?.role === 'maintenance';

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, isCitizen, isMaintenance }}>
            {children}
        </AuthContext.Provider>
    );
};
