import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '../../utils/i18nUtils';

const StatCard = ({ title, value, prevValue, icon: Icon, prefix = '' }) => {
    const isIncrease = value >= prevValue;
    const percentage = prevValue === 0 ? 100 : Math.round(Math.abs((value - prevValue) / prevValue) * 100);

    return (
        <div className="bg-white p-6 rounded-2xl border border-surface-container-low shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-bold ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncrease ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {percentage}%
                </div>
            </div>
            <h3 className="text-on-surface-variant font-medium text-sm mb-1">{title}</h3>
            <div className="text-3xl font-black text-on-background">
                {prefix}{value.toLocaleString()}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { i18n, t } = useTranslation();
    const [days, setDays] = useState(30);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/admin/dashboard?days=${days}`);
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch dashboard analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [days]);

    if (loading || !data) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { overview, chartData, bestSellers } = data;

    return (
        <div className="w-full space-y-8">
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-on-background mb-1">{t('admin.dashboard')}</h1>
                    <p className="text-on-surface-variant font-medium">{t('admin.dashboard_desc')}</p>
                </div>
                <div className="flex bg-white border border-surface-container-low rounded-lg p-1">
                    {[7, 30, 90].map(d => (
                        <button
                            key={d}
                            onClick={() => setDays(d)}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${days === d ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-background hover:bg-surface-container-lowest'}`}
                        >
                            {d} Days
                        </button>
                    ))}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('admin.revenue')} value={overview.revenue} prevValue={overview.prevRevenue} icon={DollarSign} prefix="$" />
                <StatCard title={t('admin.orders')} value={overview.orders} prevValue={overview.prevOrders} icon={ShoppingBag} />
                <StatCard title={t('admin.customers')} value={overview.users} prevValue={0} icon={Users} />
                <StatCard title={t('admin.active_products')} value={overview.activeProducts} prevValue={0} icon={Package} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-surface-container-low shadow-sm">
                    <h3 className="font-bold text-lg mb-6">{t('admin.revenue_trend')}</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `$${val}`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#f06126" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-surface-container-low shadow-sm">
                    <h3 className="font-bold text-lg mb-6">{t('admin.orders_volume')}</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <Tooltip 
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Best Sellers */}
            <div className="bg-white rounded-2xl border border-surface-container-low shadow-sm overflow-hidden">
                <div className="p-6 border-b border-surface-container-low flex justify-between items-center">
                    <h3 className="font-bold text-lg text-on-background">{t('admin.top_sellers')}</h3>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">Top 5</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-lowest border-b border-surface-container-low text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                                <th className="p-4 pl-6 font-semibold">{t('admin.products')}</th>
                                <th className="p-4 font-semibold">{t('product.price')}</th>
                                <th className="p-4 font-semibold">{t('product.stock')}</th>
                                <th className="p-4 pr-6 font-semibold text-right">{t('admin.total_sold')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                            {bestSellers.map((product) => (
                                <tr key={product.id} className="border-b border-surface-container-low last:border-0 hover:bg-surface-container-lowest/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-surface-container-low shrink-0 bg-white">
                                                <img src={product.image_url} alt={getLocalizedText(product.name, i18n.language)} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-bold text-on-background line-clamp-1">{getLocalizedText(product.name, i18n.language)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">${Number(product.price).toFixed(2)}</td>
                                    <td className="p-4">
                                        {product.stock_quantity > 10 ? (
                                            <span className="text-green-600">{product.stock_quantity}</span>
                                        ) : product.stock_quantity > 0 ? (
                                            <span className="text-amber-600 font-bold">{product.stock_quantity} ({t('product.low_stock')})</span>
                                        ) : (
                                            <span className="text-error font-bold">{t('product.out_of_stock')}</span>
                                        )}
                                    </td>
                                    <td className="p-4 pr-6 text-right font-black text-primary text-base">
                                        {product.total_sold}
                                    </td>
                                </tr>
                            ))}
                            {bestSellers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-on-surface-variant">No sales data for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
