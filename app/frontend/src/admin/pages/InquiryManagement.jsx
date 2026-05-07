import React, { useState, useEffect } from 'react';
import { Search, Mail, Filter, CheckCircle, Clock, AlertCircle, Eye, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAllInquiries, updateInquiryStatus } from '../../services/inquiryService';

const InquiryManagement = () => {
    const { t } = useTranslation();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const res = await getAllInquiries();
            setInquiries(res.data);
        } catch (error) {
            console.error('Failed to fetch inquiries', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateInquiryStatus(id, newStatus);
            setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };

    const filteredInquiries = inquiries.filter(inq => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = inq.email.toLowerCase().includes(searchLower) || 
                             (inq.service_type && inq.service_type.toLowerCase().includes(searchLower)) ||
                             (inq.name && inq.name.toLowerCase().includes(searchLower)) ||
                             (inq.message && inq.message.toLowerCase().includes(searchLower));
        const matchesStatus = statusFilter === 'all' ? true : inq.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700';
            case 'contacted': return 'bg-blue-100 text-blue-700';
            case 'resolved': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={14} />;
            case 'contacted': return <Mail size={14} />;
            case 'resolved': return <CheckCircle size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tight text-on-background mb-1">User Inquiries</h1>
                <p className="text-on-surface-variant font-medium">Manage email submissions, contact messages, and service inquiries.</p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-container-low shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-surface-container-low flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-lowest/50">
                    <div className="relative w-full sm:w-80">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
                        <input 
                            type="text" 
                            placeholder="Search by name, email or service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-surface-container-low rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-white border border-surface-container-low rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-lowest border-b border-surface-container-low text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                                <th className="p-4 pl-6">ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Source / Service</th>
                                <th className="p-4">Message Preview</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                    </td>
                                </tr>
                            ) : filteredInquiries.length > 0 ? (
                                filteredInquiries.map((inq) => (
                                    <tr key={inq.id} className="border-b border-surface-container-low last:border-0 hover:bg-surface-container-lowest/50 transition-colors group">
                                        <td className="p-4 pl-6 font-bold text-on-surface-variant">#{inq.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                    {(inq.name || inq.email)[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-on-background">{inq.name || 'Subscriber'}</div>
                                                    <div className="text-xs text-on-surface-variant font-medium">{inq.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${
                                                inq.service_type === 'Contact Form' 
                                                ? 'bg-primary-container text-on-primary-container' 
                                                : 'bg-surface-container-low text-on-surface-variant'
                                            }`}>
                                                {inq.service_type}
                                            </span>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <div className="text-xs text-on-surface-variant font-medium truncate italic">
                                                {inq.message ? `"${inq.message.substring(0, 40)}${inq.message.length > 40 ? '...' : ''}"` : 'No message'}
                                            </div>
                                        </td>
                                        <td className="p-4 text-on-surface-variant font-medium text-xs">
                                            {new Date(inq.created_at).toLocaleDateString()}<br/>
                                            {new Date(inq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(inq.status)}`}>
                                                {getStatusIcon(inq.status)}
                                                {inq.status}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                {inq.message && (
                                                    <button 
                                                        onClick={() => setSelectedInquiry(inq)}
                                                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors shadow-sm bg-white"
                                                        title="Read Message"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                <select 
                                                    value={inq.status}
                                                    onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                                                    className="bg-white border border-surface-container-low rounded-lg px-2 py-1 text-[10px] font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="resolved">Resolved</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-on-surface-variant font-medium">
                                        No inquiries found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Message Details Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black">Inquiry Details</h2>
                            <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Customer</p>
                                    <p className="font-bold">{selectedInquiry.name || 'Anonymous'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Service</p>
                                    <p className="font-bold">{selectedInquiry.service_type}</p>
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Email</p>
                                <p className="font-bold">{selectedInquiry.email}</p>
                            </div>

                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Message</p>
                                <div className="bg-surface-container-low p-4 rounded-xl text-sm font-medium leading-relaxed max-h-60 overflow-y-auto">
                                    {selectedInquiry.message}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-surface-container-low flex justify-between items-center">
                                <span className="text-xs text-on-surface-variant font-medium">
                                    Submitted on {new Date(selectedInquiry.created_at).toLocaleString()}
                                </span>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyle(selectedInquiry.status)}`}>
                                    {selectedInquiry.status}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InquiryManagement;
