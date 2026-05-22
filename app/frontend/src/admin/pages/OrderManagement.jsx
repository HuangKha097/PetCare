import React, { useState, useEffect } from 'react';
import { Search, Eye, ChevronDown, CheckCircle2, Clock, Truck, Package, XCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { getLocalizedText } from '../../utils/i18nUtils';

const STATUS_COLORS = {
    'Pending': 'bg-amber-100 text-amber-800',
    'Confirmed': 'bg-indigo-100 text-indigo-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
};

const STATUS_ICONS = {
    'Pending': Clock,
    'Confirmed': CheckCircle2,
    'Processing': Package,
    'Shipped': Truck,
    'Delivered': CheckCircle2,
    'Cancelled': XCircle,
};

const ALL_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const getAllowedTransitions = (status) => {
    const transitions = {
        'Pending': ['Pending', 'Confirmed', 'Cancelled'],
        'Confirmed': ['Confirmed', 'Processing', 'Cancelled'],
        'Processing': ['Processing', 'Shipped'],
        'Shipped': ['Shipped', 'Delivered'],
        'Delivered': ['Delivered'],
        'Cancelled': ['Cancelled']
    };
    return transitions[status] || [status];
};

const OrderManagement = () => {
    const { i18n, t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // View Detail Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const getStatusLabel = (status) => {
        const labels = {
            'Pending': t('admin_orders.pending'),
            'Confirmed': t('admin_orders.confirmed'),
            'Processing': t('admin_orders.processing'),
            'Shipped': t('admin_orders.shipped'),
            'Delivered': t('admin_orders.delivered'),
            'Cancelled': t('admin_orders.cancelled'),
        };
        return labels[status] || status;
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await getAllOrders();
            setOrders(res.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error('Failed to update status', error);
            alert(t('admin.save_failed'));
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesStatus = filter === 'All' || o.status === filter;
        const matchesSearch = 
            o.id.toString().includes(searchTerm) || 
            (o.user_name && o.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (o.user_email && o.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (o.phone && o.phone.includes(searchTerm));
        return matchesStatus && matchesSearch;
    });

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    return (
        <div className="w-full space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-on-background mb-1">{t('admin_orders.title')}</h1>
                    <p className="text-on-surface-variant font-medium">{t('admin_orders.desc')}</p>
                </div>
            </div>

            {/* Quick Stats Pipeline */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => {
                    const count = status === 'All' ? orders.length : orders.filter(o => o.status === status).length;
                    const Icon = status === 'All' ? Package : STATUS_ICONS[status];
                    const label = status === 'All' ? t('admin_orders.filter_all') : getStatusLabel(status);
                    return (
                        <div 
                            key={status} 
                            onClick={() => setFilter(status)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${filter === status ? 'border-primary bg-primary/5 shadow-md' : 'border-surface-container-low bg-white hover:border-primary/30'}`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Icon size={18} className={filter === status ? 'text-primary' : 'text-on-surface-variant'} />
                                <span className={`text-sm font-bold ${filter === status ? 'text-primary' : 'text-on-surface-variant'} truncate`}>{label}</span>
                            </div>
                            <div className="text-2xl font-black text-on-background">{count}</div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-2xl border border-surface-container-low shadow-sm overflow-hidden flex flex-col">
                {/* Toolbar */}
                <div className="p-4 border-b border-surface-container-low flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-lowest/50">
                    <div className="relative w-full sm:w-80">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
                        <input 
                            type="text" 
                            placeholder={t('admin_orders.search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-surface-container-low rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                    {filter !== 'All' && (
                        <button 
                            onClick={() => setFilter('All')}
                            className="text-sm font-bold text-primary hover:underline"
                        >
                            {t('admin_orders.clear_filters')}
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-surface-container-lowest border-b border-surface-container-low text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                                <th className="p-4 pl-6 font-semibold">{t('admin_orders.order_id_date')}</th>
                                <th className="p-4 font-semibold">{t('admin_orders.customer')}</th>
                                <th className="p-4 font-semibold">{t('admin_orders.payment_total')}</th>
                                <th className="p-4 font-semibold">{t('admin_orders.status')}</th>
                                <th className="p-4 pr-6 font-semibold text-right">{t('admin_orders.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                    </td>
                                </tr>
                            ) : currentOrders.length > 0 ? (
                                currentOrders.map((order) => {
                                    const isNew = order.status === 'Pending' && (new Date() - new Date(order.created_at)) < 10 * 60 * 1000;
                                    return (
                                    <tr key={order.id} className={`border-b border-surface-container-low last:border-0 hover:bg-surface-container-lowest/50 transition-colors ${isNew ? 'bg-amber-50/50' : ''}`}>
                                        <td className="p-4 pl-6">
                                            <div className="font-black text-on-background">#{order.id} {isNew && <span className="text-[10px] bg-error text-white px-1.5 py-0.5 rounded ml-2 uppercase animate-pulse">{t('admin_orders.new_order')}</span>}</div>
                                            <div className="text-on-surface-variant font-medium mt-1 text-xs">
                                                {new Date(order.created_at).toLocaleString(i18n.language, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-on-background">{order.user_name || 'Guest'}</div>
                                            <div className="text-on-surface-variant font-medium mt-1 text-xs">{order.user_email || order.phone}</div>
                                            <div className="text-on-surface-variant font-medium text-xs mt-0.5 line-clamp-1 max-w-[200px]">{order.city}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-black text-on-background text-base">{new Intl.NumberFormat('vi-VN').format(order.total_amount)}đ</div>
                                            <div className="text-on-surface-variant font-medium mt-1 text-xs uppercase tracking-widest">{order.payment_method}</div>
                                        </td>
                                        <td className="p-4">
                                            {order.status === 'Delivered' || order.status === 'Cancelled' ? (
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${STATUS_COLORS[order.status]}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            ) : (
                                                <div className="relative inline-block">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold outline-none cursor-pointer border-2 border-transparent hover:border-current/20 transition-all ${STATUS_COLORS[order.status]}`}
                                                    >
                                                        {ALL_STATUSES.map(st => (
                                                            <option 
                                                                key={st} 
                                                                value={st} 
                                                                disabled={!getAllowedTransitions(order.status).includes(st)}
                                                            >
                                                                {getStatusLabel(st)} {!getAllowedTransitions(order.status).includes(st) && order.status !== st ? `(${t('admin_orders.locked')})` : ''}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => openOrderDetails(order)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 border border-surface-container-high rounded-lg text-xs font-bold text-on-background hover:bg-surface-container-low transition-colors"
                                                >
                                                    <Eye size={14} /> {t('admin_orders.view')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )})
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-on-surface-variant font-medium">
                                        {t('admin_orders.no_orders')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!loading && filteredOrders.length > 0 && (
                    <div className="p-4 border-t border-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest/50">
                        <div className="text-sm font-medium text-on-surface-variant">
                            Showing <span className="font-bold text-on-background">{indexOfFirstItem + 1}</span> to <span className="font-bold text-on-background">{Math.min(indexOfLastItem, filteredOrders.length)}</span> of <span className="font-bold text-on-background">{filteredOrders.length}</span> entries
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-surface-container-low text-sm font-bold text-on-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
                            >
                                Prev
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                                    let pageNum = idx + 1;
                                    if (totalPages > 5) {
                                        if (currentPage > 3) pageNum = currentPage - 2 + idx;
                                        if (currentPage > totalPages - 2) pageNum = totalPages - 4 + idx;
                                    }
                                    if (pageNum > totalPages) return null;

                                    return (
                                        <button 
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${currentPage === pageNum ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-background'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-surface-container-low text-sm font-bold text-on-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-surface-container-lowest">
                            <div>
                                <h2 className="text-xl font-black text-on-background flex items-center gap-3">
                                    {t('admin_orders.order_detail')} #{selectedOrder.id}
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${STATUS_COLORS[selectedOrder.status]}`}>
                                        {getStatusLabel(selectedOrder.status)}
                                    </span>
                                </h2>
                                <p className="text-sm font-medium text-on-surface-variant mt-1">
                                    {t('admin_orders.placed_on')} {new Date(selectedOrder.created_at).toLocaleString(i18n.language, { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-on-background rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-8 flex-1">
                            
                            {/* Customer & Shipping Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-surface-container-lowest rounded-xl p-5 border border-surface-container-low">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Truck size={18} className="text-primary" /> {t('admin_orders.customer_info')}</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center"><span className="w-24 text-on-surface-variant font-medium">{t('admin_orders.name')}:</span> <span className="font-bold text-on-background">{selectedOrder.user_name || 'Guest'}</span></div>
                                        <div className="flex items-center"><span className="w-24 text-on-surface-variant font-medium">{t('admin_orders.email')}:</span> <span className="font-bold text-on-background">{selectedOrder.user_email || 'N/A'}</span></div>
                                        <div className="flex items-center"><span className="w-24 text-on-surface-variant font-medium">{t('admin_orders.phone')}:</span> <span className="font-bold text-on-background">{selectedOrder.phone}</span></div>
                                    </div>
                                </div>
                                <div className="bg-surface-container-lowest rounded-xl p-5 border border-surface-container-low">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><CheckCircle2 size={18} className="text-primary" /> {t('admin_orders.shipping_details')}</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start"><span className="w-24 text-on-surface-variant font-medium">{t('admin_orders.address')}:</span> <span className="font-bold text-on-background flex-1">{selectedOrder.address}</span></div>
                                        <div className="flex items-center"><span className="w-24 text-on-surface-variant font-medium">{t('admin_orders.city')}:</span> <span className="font-bold text-on-background">{selectedOrder.city}</span></div>
                                        <div className="flex items-start"><span className="w-24 text-on-surface-variant font-medium">{t('admin_orders.notes')}:</span> <span className="font-medium text-amber-700 flex-1">{selectedOrder.note || t('admin_orders.no_notes')}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-bold text-lg mb-4">{t('admin_orders.order_items')} ({selectedOrder.items?.length || 0})</h3>
                                <div className="border border-surface-container-low rounded-xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-surface-container-lowest border-b">
                                            <tr className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                                                <th className="p-4">{t('admin_orders.product')}</th>
                                                <th className="p-4 text-center">{t('admin_orders.qty')}</th>
                                                <th className="p-4 text-right">{t('admin_orders.price')}</th>
                                                <th className="p-4 text-right">{t('admin_orders.total')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                                <tr key={idx} className="border-b last:border-0 hover:bg-surface-container-lowest/50">
                                                    <td className="p-4 flex items-center gap-4">
                                                        <img src={item.image_url || '/placeholder.png'} alt={getLocalizedText(item.name, i18n.language)} className="w-12 h-12 rounded-lg object-cover border" />
                                                        <span className="font-bold text-sm text-on-background line-clamp-2">{getLocalizedText(item.name, i18n.language)}</span>
                                                    </td>
                                                    <td className="p-4 text-center font-bold">{item.quantity}</td>
                                                    <td className="p-4 text-right font-medium text-on-surface-variant">{new Intl.NumberFormat('vi-VN').format(item.price)}đ</td>
                                                    <td className="p-4 text-right font-black text-on-background">{new Intl.NumberFormat('vi-VN').format(Number(item.price) * item.quantity)}đ</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="flex justify-end">
                                <div className="w-full max-w-sm bg-surface-container-lowest rounded-xl p-5 border border-surface-container-low">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-on-surface-variant font-medium">{t('admin_orders.payment_method')}</span>
                                        <span className="font-bold uppercase tracking-wide text-sm bg-surface-container px-2.5 py-1 rounded-md">{selectedOrder.payment_method}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t">
                                        <span className="text-lg font-bold text-on-background">{t('admin_orders.total_amount')}</span>
                                        <span className="text-2xl font-black text-primary">{new Intl.NumberFormat('vi-VN').format(selectedOrder.total_amount)}đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t bg-surface-container-lowest flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-on-surface-variant">{t('admin_orders.update_status')}:</span>
                                {selectedOrder.status === 'Delivered' || selectedOrder.status === 'Cancelled' ? (
                                    <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${STATUS_COLORS[selectedOrder.status]}`}>
                                        {getStatusLabel(selectedOrder.status)} ({t('admin_orders.final')})
                                    </span>
                                ) : (
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                        className={`pl-3 pr-8 py-1.5 rounded-lg text-sm font-bold outline-none cursor-pointer border ${STATUS_COLORS[selectedOrder.status]}`}
                                    >
                                        {ALL_STATUSES.map(st => (
                                            <option 
                                                key={st} 
                                                value={st} 
                                                disabled={!getAllowedTransitions(selectedOrder.status).includes(st)}
                                            >
                                                {getStatusLabel(st)} {!getAllowedTransitions(selectedOrder.status).includes(st) && selectedOrder.status !== st ? `(${t('admin_orders.locked')})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <button 
                                onClick={() => setShowDetailModal(false)}
                                className="px-6 py-2.5 bg-surface-container-highest text-on-background font-bold rounded-xl hover:bg-on-surface-variant hover:text-white transition-colors"
                            >
                                {t('admin.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
