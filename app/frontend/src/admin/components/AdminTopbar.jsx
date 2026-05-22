import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, Menu, UserCircle, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import API from '../../api/axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminTopbar = () => {
    const { t } = useTranslation();
    const { user } = useSelector(state => state.auth);
    const [notifications, setNotifications] = useState([]);
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await API.get('/admin/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotif(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.length;

    return (
        <header className="h-20 bg-white border-b border-surface-container-low px-6 lg:px-8 flex items-center justify-between shrink-0 relative z-30">
            {/* Mobile Menu Button (Placeholder for future mobile sidebar toggle) */}
            <button className="md:hidden p-2 -ml-2 text-on-surface-variant hover:bg-surface-container rounded-lg">
                <Menu size={24} />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center gap-3 bg-surface-container-lowest border border-surface-container-low px-4 py-2.5 rounded-xl w-96 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                <Search size={18} className="text-on-surface-variant opacity-60" />
                <input
                    type="text"
                    placeholder={t('admin.search_anything')}
                    className="bg-transparent border-none outline-none text-sm font-medium w-full text-on-background placeholder:text-on-surface-variant/50"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 md:gap-6 ml-auto md:ml-0">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotif(!showNotif)}
                        className="relative p-2.5 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                    >
                        <Bell size={22} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-error text-primary text-[10px] font-black rounded-full flex items-center justify-center border-2 border-primary shadow-sm">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotif && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-surface-container-low overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-surface-container-low flex items-center justify-between bg-surface-container-lowest/50">
                                <h3 className="font-bold text-on-background">{t('admin.notifications')}</h3>
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{t('admin.new_notifications', { count: unreadCount })}</span>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(n => (
                                        <Link
                                            key={n.id}
                                            to={`/admin/orders`}
                                            onClick={() => setShowNotif(false)}
                                            className="block p-4 border-b border-surface-container-low/50 hover:bg-surface-container/50 transition-colors"
                                        >
                                            <p className="text-sm font-bold text-on-background mb-1">{t('admin.new_order_notif', { id: n.id })}</p>
                                            <p className="text-xs font-medium text-on-surface-variant line-clamp-1">{t('admin.from_user', { name: n.user_name })} - {new Intl.NumberFormat('vi-VN').format(n.total_amount)}đ</p>
                                            <p className="text-[10px] font-bold text-primary mt-2 uppercase tracking-widest">
                                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-on-surface-variant font-medium text-sm">
                                        {t('admin.no_notifications')}
                                    </div>
                                )}
                            </div>
                            <Link to="/admin/orders" onClick={() => setShowNotif(false)} className="block p-3 text-center text-xs font-black text-primary hover:bg-primary/5 transition-colors uppercase tracking-widest border-t border-surface-container-low">
                                {t('admin.view_all_orders')}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-surface-container-low">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold text-on-background">{user?.name || 'Admin'}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t('admin.administrator')}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                        <UserCircle size={24} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
