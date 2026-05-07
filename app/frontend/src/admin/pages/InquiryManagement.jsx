import React, { useState, useEffect } from 'react';
import { Search, Mail, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAllInquiries, updateInquiryStatus } from '../../services/inquiryService';

const InquiryManagement = () => {
    const { t } = useTranslation();
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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
        const matchesSearch = inq.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (inq.service_type && inq.service_type.toLowerCase().includes(searchTerm.toLowerCase()));
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
                <p className="text-on-surface-variant font-medium">Manage email submissions and service inquiries from users.</p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-container-low shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-surface-container-low flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-lowest/50">
                    <div className="relative w-full sm:w-80">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
                        <input 
                            type="text" 
                            placeholder="Search by email or service..."
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
                                <th className="p-4">Email Address</th>
                                <th className="p-4">Service Type</th>
                                <th className="p-4">Submitted Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                    </td>
                                </tr>
                            ) : filteredInquiries.length > 0 ? (
                                filteredInquiries.map((inq) => (
                                    <tr key={inq.id} className="border-b border-surface-container-low last:border-0 hover:bg-surface-container-lowest/50 transition-colors">
                                        <td className="p-4 pl-6 font-bold text-on-surface-variant">#{inq.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                    {inq.email[0].toUpperCase()}
                                                </div>
                                                <span className="font-bold text-on-background">{inq.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-lg bg-surface-container-low text-on-surface-variant font-bold text-xs uppercase tracking-wider">
                                                {inq.service_type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-on-surface-variant font-medium">
                                            {new Date(inq.created_at).toLocaleDateString()} {new Date(inq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${getStatusStyle(inq.status)}`}>
                                                {getStatusIcon(inq.status)}
                                                {inq.status}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <select 
                                                    value={inq.status}
                                                    onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                                                    className="bg-surface-container-low border-none rounded-lg px-2 py-1 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                                                >
                                                    <option value="pending">Mark Pending</option>
                                                    <option value="contacted">Mark Contacted</option>
                                                    <option value="resolved">Mark Resolved</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-on-surface-variant font-medium">
                                        No inquiries found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InquiryManagement;
