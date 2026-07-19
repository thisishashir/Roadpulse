import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';

const AppLayout = () => (
    <div className="page-wrapper">
        <Sidebar />
        <div className="main-content">
            <Navbar />
            <div className="content-area">
                <Outlet />
            </div>
        </div>
        <MobileNav />
    </div>
);

export default AppLayout;
