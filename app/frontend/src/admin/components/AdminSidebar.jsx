import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Users, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Inventory', path: '/admin/inventory', icon: BarChart3 },
];

const AdminSidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-white border-r border-surface-container-low hidden md:flex flex-col h-full shrink-0">
            {/* Logo */}
            <div className="h-20 flex items-center px-8 border-b border-surface-container-low">
                <span className="font-display font-black text-2xl tracking-tighter text-on-background">
                    PetCare <span className="text-primary text-sm tracking-widest uppercase ml-1 opacity-70">Admin</span>
                </span>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                                isActive 
                                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-background'
                            }`}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-surface-container-low">
                <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-bold text-error hover:bg-error/10 transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
