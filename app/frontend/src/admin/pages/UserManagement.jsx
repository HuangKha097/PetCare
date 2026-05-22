import React, { useState, useEffect } from 'react';
import { Search, Trash2, Shield, User, MoreVertical, X, Lock, Eye, Edit2, Ban, CheckCircle, ShoppingBag, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAllUsers, getUserDetails, updateUserInfo, toggleUserStatus, deleteUser } from '../../services/adminService';
import { getLocalizedText } from '../../utils/i18nUtils';

const UserManagement = () => {
    const { t, i18n } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modals
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [editData, setEditData] = useState({ name: '', phone: '', address: '', city: '', role: 'user' });

    // Password Action State
    const [adminPassword, setAdminPassword] = useState('');
    const [modalError, setModalError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); // { type: 'status' | 'delete' | 'edit', userId: 1 }

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter & Search Logic
    const filteredUsers = users.filter(u => {
        const matchesRole = filter === 'All' || u.role === filter.toLowerCase();
        const matchesStatus = statusFilter === 'All' || 
                             (statusFilter === 'Active' && u.is_active) || 
                             (statusFilter === 'Banned' && !u.is_active);
        const matchesSearch = 
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.phone?.includes(searchTerm);
        return matchesRole && matchesStatus && matchesSearch;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filter, statusFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const getRoleLabel = (role) => {
        const roles = {
            'user': t('admin_users.user_customer'),
            'admin': t('admin_users.admin_manager'),
        };
        return roles[role] || role;
    };

    const getStatusLabel = (isActive) => {
        return isActive ? t('admin_users.active') : t('admin_users.banned');
    };

    // Modal Handlers
    const handleViewDetails = async (user) => {
        try {
            setSelectedUser(user);
            const res = await getUserDetails(user.id);
            setUserDetails(res.data);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Failed to fetch user details', error);
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditData({
            name: user.name || '',
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
            role: user.role || 'user'
        });
        setShowEditModal(true);
    };

    const requestToggleStatus = (user) => {
        setPendingAction({ type: 'status', userId: user.id, user });
        setShowPasswordModal(true);
        setAdminPassword('');
        setModalError('');
    };

    const requestDelete = (user) => {
        setPendingAction({ type: 'delete', userId: user.id, user });
        setShowPasswordModal(true);
        setAdminPassword('');
        setModalError('');
    };

    const handleConfirmAction = async (e) => {
        e.preventDefault();
        setModalError('');
        setIsSubmitting(true);

        try {
            if (pendingAction.type === 'status') {
                const res = await toggleUserStatus(pendingAction.userId, adminPassword);
                setUsers(users.map(u => u.id === pendingAction.userId ? { ...u, is_active: res.data.is_active } : u));
            } else if (pendingAction.type === 'delete') {
                await deleteUser(pendingAction.userId, adminPassword);
                setUsers(users.filter(u => u.id !== pendingAction.userId));
            } else if (pendingAction.type === 'edit') {
                await updateUserInfo(pendingAction.userId, editData, adminPassword);
                setUsers(users.map(u => u.id === pendingAction.userId ? { ...u, ...editData } : u));
                setShowEditModal(false);
            }
            setShowPasswordModal(false);
            setPendingAction(null);
        } catch (error) {
            setModalError(error.response?.data?.message || t('admin.invalid_password'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setPendingAction({ type: 'edit', userId: selectedUser.id, user: selectedUser });
        setShowPasswordModal(true);
        setAdminPassword('');
        setModalError('');
    };

    return (
        <div className="w-full space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-on-background mb-1">{t('admin_users.title')}</h1>
                    <p className="text-on-surface-variant font-medium">{t('admin_users.desc')}</p>
                </div>
            </div>

            {/* Toolbar & Filters */}
            <div className="bg-white rounded-2xl border border-surface-container-low shadow-sm p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
                    <input 
                        type="text" 
                        placeholder={t('admin_users.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-surface-container-low rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('admin_users.role_label')}:</span>
                        <div className="flex bg-surface-container-low rounded-lg p-1">
                            {['All', 'User', 'Admin'].map(r => (
                                <button 
                                    key={r}
                                    onClick={() => setFilter(r)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filter === r ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}`}
                                >
                                    {r === 'All' ? t('admin.all_status').split(' ')[0] : r}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{t('admin_users.status_label')}:</span>
                        <div className="flex bg-surface-container-low rounded-lg p-1">
                            {['All', 'Active', 'Banned'].map(s => (
                                <button 
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${statusFilter === s ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}`}
                                >
                                    {s === 'All' ? t('admin.all_status').split(' ')[0] : (s === 'Active' ? t('admin_users.active') : t('admin_users.banned'))}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl border border-surface-container-low shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-surface-container-lowest border-b border-surface-container-low text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                                <th className="p-4 pl-6 font-semibold">{t('admin_users.user_info')}</th>
                                <th className="p-4 font-semibold">{t('admin_users.contact_stats')}</th>
                                <th className="p-4 font-semibold">{t('admin_users.role_status')}</th>
                                <th className="p-4 font-semibold">{t('admin_users.joined_date')}</th>
                                <th className="p-4 pr-6 font-semibold text-right">{t('admin_users.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                    </td>
                                </tr>
                            ) : currentUsers.length > 0 ? (
                                currentUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-surface-container-low last:border-0 hover:bg-surface-container-lowest/50 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                                    {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-on-background text-base">{user.name || 'Unknown'}</div>
                                                    <div className="text-xs text-on-surface-variant font-medium mt-0.5">ID: #{user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-on-background">{user.email}</div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-on-surface-variant font-medium">
                                                <span className="flex items-center gap-1"><ShoppingBag size={12} /> {t('admin_users.orders_count', { count: user.total_orders || 0 })}</span>
                                                <span className="flex items-center gap-1 text-primary font-bold">{t('admin_users.spent_amount', { amount: new Intl.NumberFormat('vi-VN').format(user.total_spent || 0) + 'đ' })}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-2 items-start">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-surface-container text-on-surface-variant'}`}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {getStatusLabel(user.is_active)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-on-surface-variant font-medium">
                                            {new Date(user.created_at).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => handleViewDetails(user)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title={t('admin_orders.view')}>
                                                    <Eye size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleEditClick(user)} 
                                                    disabled={user.is_protected}
                                                    className={`p-2 rounded-lg transition-colors ${user.is_protected ? 'opacity-30 cursor-not-allowed text-on-surface-variant' : 'text-on-surface-variant hover:text-primary hover:bg-primary/10'}`} 
                                                    title={user.is_protected ? t('admin_users.system_protected_edit') : t('admin_users.edit_user')}
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => requestToggleStatus(user)} 
                                                    disabled={user.is_protected}
                                                    className={`p-2 rounded-lg transition-colors ${user.is_protected ? 'opacity-30 cursor-not-allowed' : user.is_active ? 'text-on-surface-variant hover:text-error hover:bg-error/10' : 'text-green-600 hover:bg-green-50'}`} 
                                                    title={user.is_protected ? t('admin_users.system_protected_ban') : (user.is_active ? t('admin_users.banned') : t('admin_users.active'))}
                                                >
                                                    {user.is_active ? <Ban size={18} /> : <CheckCircle size={18} />}
                                                </button>
                                                <button 
                                                    onClick={() => requestDelete(user)} 
                                                    disabled={user.is_protected}
                                                    className={`p-2 rounded-lg transition-colors ${user.is_protected ? 'opacity-30 cursor-not-allowed text-on-surface-variant' : 'text-on-surface-variant hover:text-error hover:bg-error/10'}`} 
                                                    title={user.is_protected ? t('admin_users.system_protected_delete') : t('admin.delete')}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-on-surface-variant font-medium">{t('admin_users.no_users')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && filteredUsers.length > itemsPerPage && (
                    <div className="p-4 border-t border-surface-container-low flex items-center justify-between bg-surface-container-lowest/50">
                        <div className="text-sm font-medium text-on-surface-variant">
                            Showing <span className="font-bold text-on-background">{indexOfFirstItem + 1}</span> to <span className="font-bold text-on-background">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of <span className="font-bold text-on-background">{filteredUsers.length}</span> users
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg border border-surface-container-low text-xs font-bold text-on-background disabled:opacity-50 hover:bg-surface-container-low">Prev</button>
                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i+1)} className={`w-8 h-8 rounded-lg text-xs font-bold ${currentPage === i+1 ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>{i+1}</button>
                                ))}
                            </div>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg border border-surface-container-low text-xs font-bold text-on-background disabled:opacity-50 hover:bg-surface-container-low">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- Modals --- */}

            {/* View Detail Modal */}
            {showDetailModal && userDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-surface-container-lowest">
                            <h2 className="text-xl font-black text-on-background">{t('admin_users.user_profile')}</h2>
                            <button onClick={() => setShowDetailModal(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 flex flex-col items-center text-center p-6 bg-surface-container-lowest rounded-2xl border border-surface-container-low">
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center font-black text-4xl mb-4 ${userDetails.user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                                        {getLocalizedText(userDetails.user.name, i18n.language).charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className="text-xl font-black text-on-background">{getLocalizedText(userDetails.user.name, i18n.language)}</h3>
                                    <p className="text-sm font-medium text-on-surface-variant">{userDetails.user.email}</p>
                                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${userDetails.user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-surface-container text-on-surface-variant'}`}>{getRoleLabel(userDetails.user.role)}</span>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${userDetails.user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{getStatusLabel(userDetails.user.is_active)}</span>
                                    </div>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white border border-surface-container-low rounded-xl flex items-center gap-3">
                                        <Phone className="text-primary" size={20} />
                                        <div><p className="text-[10px] uppercase font-black text-on-surface-variant opacity-50">{t('admin_users.phone')}</p><p className="font-bold text-on-background">{userDetails.user.phone || 'N/A'}</p></div>
                                    </div>
                                    <div className="p-4 bg-white border border-surface-container-low rounded-xl flex items-center gap-3">
                                        <MapPin className="text-primary" size={20} />
                                        <div><p className="text-[10px] uppercase font-black text-on-surface-variant opacity-50">{t('admin_users.location')}</p><p className="font-bold text-on-background">{userDetails.user.city || 'N/A'}</p></div>
                                    </div>
                                    <div className="p-4 bg-white border border-surface-container-low rounded-xl flex items-center gap-3 sm:col-span-2">
                                        <MapPin className="text-primary" size={20} />
                                        <div><p className="text-[10px] uppercase font-black text-on-surface-variant opacity-50">{t('admin_users.address')}</p><p className="font-bold text-on-background">{userDetails.user.address || 'N/A'}</p></div>
                                    </div>
                                    <div className="p-4 bg-white border border-surface-container-low rounded-xl flex items-center gap-3 sm:col-span-2">
                                        <Calendar className="text-primary" size={20} />
                                        <div><p className="text-[10px] uppercase font-black text-on-surface-variant opacity-50">{t('admin_users.member_since')}</p><p className="font-bold text-on-background">{new Date(userDetails.user.created_at).toLocaleString(i18n.language, { dateStyle: 'long' })}</p></div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-black text-on-background mb-4 flex items-center gap-2"><ShoppingBag size={20} className="text-primary" /> {t('admin_users.order_history')}</h3>
                                <div className="border border-surface-container-low rounded-xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-surface-container-lowest border-b border-surface-container-low">
                                            <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black">
                                                <th className="p-4">{t('admin_orders.order_id_date').split(' ')[0]} ID</th>
                                                <th className="p-4">{t('admin_users.joined_date').split(' ')[1]}</th>
                                                <th className="p-4">{t('admin_orders.status')}</th>
                                                <th className="p-4 text-right">{t('admin_orders.total')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-medium">
                                            {userDetails.orders.length > 0 ? userDetails.orders.map(order => (
                                                <tr key={order.id} className="border-b last:border-0 hover:bg-surface-container-lowest/50">
                                                    <td className="p-4 font-black">#{order.id}</td>
                                                    <td className="p-4 text-on-surface-variant">{new Date(order.created_at).toLocaleDateString(i18n.language)}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>{t(`admin_orders.${order.status.toLowerCase()}`)}</span>
                                                    </td>
                                                    <td className="p-4 text-right font-black text-primary">{new Intl.NumberFormat('vi-VN').format(order.total_amount)}đ</td>
                                                </tr>
                                            )) : <tr><td colSpan="4" className="p-8 text-center text-on-surface-variant opacity-50">{t('admin_users.no_orders')}</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-surface-container-lowest">
                            <h2 className="text-xl font-black text-on-background">{t('admin_users.edit_user')}</h2>
                            <button onClick={() => setShowEditModal(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-1.5">{t('admin_users.full_name')}</label>
                                <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-container-low focus:border-primary outline-none text-sm font-bold transition-all" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-1.5">{t('admin_users.phone')}</label>
                                    <input type="text" value={editData.phone} onChange={(e) => setEditData({...editData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-container-low focus:border-primary outline-none text-sm font-bold transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-1.5">{t('admin_users.city')}</label>
                                    <input type="text" value={editData.city} onChange={(e) => setEditData({...editData, city: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-container-low focus:border-primary outline-none text-sm font-bold transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-1.5">{t('admin_users.address')}</label>
                                <textarea value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-container-low focus:border-primary outline-none text-sm font-bold transition-all resize-none h-20" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-1.5">{t('admin_users.role')}</label>
                                <select value={editData.role} onChange={(e) => setEditData({...editData, role: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-surface-container-low focus:border-primary outline-none text-sm font-bold transition-all">
                                    <option value="user">{t('admin_users.user_customer')}</option>
                                    <option value="admin">{t('admin_users.admin_manager')}</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 bg-surface-container-highest text-on-background font-bold rounded-xl hover:bg-on-surface-variant hover:text-white transition-colors">{t('admin.cancel')}</button>
                                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all">{t('admin.save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Security Verification Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-surface-container-lowest">
                            <h2 className="text-xl font-black text-on-background flex items-center gap-2"><Lock className="text-error" size={24} /> {t('admin_users.verification')}</h2>
                            <button onClick={() => setShowPasswordModal(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleConfirmAction} className="p-6 space-y-6">
                            <div className={`p-4 rounded-xl border ${pendingAction?.type === 'status' ? 'bg-amber-50 border-amber-200 text-amber-900' : pendingAction?.type === 'delete' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-blue-50 border-blue-200 text-blue-900'}`}>
                                <h4 className="font-black text-sm uppercase tracking-wider mb-1">{t('admin_users.confirm_type', { type: pendingAction?.type })}</h4>
                                <p className="text-sm font-medium">{t('admin_users.confirm_desc', { name: getLocalizedText(pendingAction?.user?.name, i18n.language) })}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-1.5">{t('admin_users.enter_password')}</label>
                                <input type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-surface-container-low focus:border-primary outline-none transition-all" autoFocus />
                                {modalError && <p className="mt-2 text-xs font-bold text-error">{modalError}</p>}
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 bg-surface-container-highest text-on-background font-bold rounded-xl transition-colors">{t('admin.cancel')}</button>
                                <button type="submit" disabled={isSubmitting || !adminPassword} className={`flex-1 py-3 text-white font-bold rounded-xl transition-all shadow-lg ${pendingAction?.type === 'delete' ? 'bg-error shadow-error/20' : 'bg-primary shadow-primary/20'}`}>{isSubmitting ? t('admin_users.verifying') : t('admin_users.confirm_action')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
