import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-surface-container-lowest overflow-hidden font-sans">
            {/* Sidebar */}
            <AdminSidebar />
            
            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <AdminTopbar />
                
                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-surface-container-lowest">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
