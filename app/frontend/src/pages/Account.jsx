import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  User, Package, Heart, LogOut, Settings,
  ChevronRight, ShoppingBag, Clock, CheckCircle,
  MapPin, Phone, Mail, Calendar, Eye, QrCode
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import { logoutAPI } from '../services/authService';
import { useTranslation } from 'react-i18next';
import { getLocalizedText, formatVND } from '../utils/i18nUtils';
import ProductCard from '../components/ProductCard';
import BankTransferQR from '../components/BankTransferQR';


const Account = () => {
  const { i18n, t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const ordersRes = await getMyOrders();
        setOrders(ordersRes.data);
        // Add wishlist fetch if needed
      } catch (error) {
        console.error('Failed to fetch account data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) await logoutAPI(refreshToken);
    } catch (_) { /* ignore */ }
    dispatch(logout());
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: t('account.profile'), icon: User },
    { id: 'orders', label: t('account.orders'), icon: Package },
    { id: 'wishlist', label: t('account.wishlist'), icon: Heart },
    { id: 'settings', label: t('account.settings'), icon: Settings },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-500 bg-green-50';
      case 'pending': return 'text-amber-500 bg-amber-50';
      case 'processing': return 'text-blue-500 bg-blue-50';
      case 'cancelled': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="mt-28 mb-24 max-w-7xl mx-auto px-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">


        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl border border-surface-container-low p-6 shadow-sm overflow-hidden">
            <div className="mb-8 px-2">
              <h1 className="text-2xl font-bold tracking-tight mb-1">{user?.name}</h1>
              <p className="text-sm font-medium text-on-surface-variant opacity-60">{user?.email}</p>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${activeTab === tab.id
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-background'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={20} />
                      <span className="font-bold text-sm">{tab.label}</span>
                    </div>
                    <ChevronRight size={16} className={`transition-transform duration-300 ${activeTab === tab.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                  </button>
                );
              })}
              <div className="h-px bg-surface-container-low my-4 mx-2"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
              >
                <LogOut size={20} />
                <span>{t('nav.logout')}</span>
              </button>
            </nav>
          </div>
        </aside>


        <main className="lg:col-span-9 space-y-8 min-h-[600px]">


          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: t('account.total_orders'), value: orders.length, icon: Package, color: 'bg-blue-50 text-blue-600' },
                  { label: t('account.wishlist_items'), value: wishlistItems.length, icon: Heart, color: 'bg-red-50 text-red-600' },
                  { label: t('account.recent_spending'), value: formatVND(orders.reduce((acc, o) => acc + parseFloat(o.total_amount), 0)), icon: ShoppingBag, color: 'bg-primary/10 text-primary' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-xl border border-surface-container-low shadow-sm hover:shadow-xl transition-all duration-500 group">
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <stat.icon size={24} />
                    </div>
                    <p className="text-sm font-bold text-on-surface-variant opacity-60 mb-2 uppercase tracking-widest">{stat.label}</p>
                    <h3 className="text-3xl font-black">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-surface-container-low p-10 shadow-sm">
                <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
                  <User size={24} className="text-primary" /> {t('account.profile_info')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                      <User size={20} className="text-on-surface-variant group-hover:text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-50 mb-1">{t('account.full_name')}</p>
                      <p className="text-lg font-bold truncate">{user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Mail size={20} className="text-on-surface-variant group-hover:text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-50 mb-1">{t('account.email_address')}</p>
                      <p className="text-lg font-bold truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Phone size={20} className="text-on-surface-variant group-hover:text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-50 mb-1">{t('account.phone_number')}</p>
                      <p className="text-lg font-bold truncate">{user?.phone || t('account.not_provided')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                      <MapPin size={20} className="text-on-surface-variant group-hover:text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-50 mb-1">{t('account.default_address')}</p>
                      <p className="text-lg font-bold leading-tight truncate">{user?.address ? `${user.address}, ${user.city}` : t('account.not_provided')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-surface-container-low p-20 text-center shadow-sm">
                  <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="text-on-surface-variant opacity-30" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t('account.no_orders')}</h3>
                  <p className="text-on-surface-variant font-medium mb-8">{t('account.no_orders_desc')}</p>
                  <button onClick={() => navigate('/shop')} className="text-primary font-bold hover:underline flex items-center gap-2 mx-auto">
                    {t('account.go_shopping')} <ChevronRight size={18} />
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl border border-surface-container-low overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="bg-surface-container-low/30 p-6 flex flex-wrap items-center justify-between gap-6 border-b border-surface-container-low">
                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50 mb-1">{t('account.order_date')}</p>
                          <p className="text-sm font-bold">{new Date(order.created_at).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50 mb-1">{t('account.order_total')}</p>
                          <p className="text-sm font-black text-primary">{formatVND(order.total_amount)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50 mb-1">{t('account.order_number')}</p>
                          <p className="text-sm font-bold">ORD-{order.id}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {t(`admin_orders.${order.status.toLowerCase()}`)}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                          <MapPin size={14} className="text-primary" />
                          <span>{t('account.shipped_to')}: {order.city}</span>
                          <span className="mx-2 opacity-20">|</span>
                          <Package size={14} className="text-primary" />
                          <span>{order.items.length} {order.items.length === 1 ? t('product.item') : t('product.items')}</span>
                        </div>
                        <button
                          onClick={() => toggleOrderDetails(order.id)}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 bg-primary/5 px-4 py-2 rounded-xl transition-all"
                        >
                          {expandedOrderId === order.id ? <><Eye size={14} /> {t('account.hide_detail')}</> : <><Eye size={14} /> {t('account.view_detail')}</>}
                        </button>
                      </div>

                      {expandedOrderId === order.id && (
                        <div className="mt-8 pt-8 border-t border-surface-container-low space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-surface-container-low flex-shrink-0">
                                  <img src={item.image_url} alt={getLocalizedText(item.name, i18n.language)} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow min-w-0">
                                  <h4 className="text-sm font-bold truncate">{getLocalizedText(item.name, i18n.language)}</h4>
                                  <p className="text-xs font-medium text-on-surface-variant opacity-60">{t('product.stock')}: {item.quantity} × {formatVND(item.price)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-black">{formatVND(item.quantity * item.price)}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {order.note && (
                            <div className="bg-surface-container-low/50 p-4 rounded-xl border border-dashed border-surface-container-high">
                              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-50 mb-2">{t('account.order_note')}</p>
                              <p className="text-sm italic opacity-70">"{order.note}"</p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-surface-container-low">
                            <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50 mb-1">{t('account.shipping_details')}</p>
                              <p className="font-bold text-xs">{order.address}, {order.city}</p>
                              <p className="text-xs opacity-60">{order.phone}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-50 mb-1">{t('account.payment_method')}</p>
                              <p className="font-black text-xs uppercase text-primary">{order.payment_method}</p>
                            </div>
                          </div>

                          {/* VietQR for pending banking orders */}
                          {order.payment_method === 'banking' && order.status.toLowerCase() === 'pending' && (
                            <div className="pt-6 mt-6 border-t border-surface-container-low">
                              <div className="flex items-center gap-2 mb-4">
                                <QrCode size={18} className="text-amber-500" />
                                <p className="text-sm font-black text-amber-600">{t('bank_transfer.scan_to_pay')}</p>
                              </div>
                              <BankTransferQR
                                orderId={order.id}
                                totalAmount={parseFloat(order.total_amount)}
                                phone={order.phone}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}


          {activeTab === 'wishlist' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {wishlistItems.length === 0 ? (
                <div className="bg-white rounded-xl border border-surface-container-low p-20 text-center shadow-sm">
                  <Heart className="text-red-500 opacity-20 mx-auto mb-6" size={64} />
                  <h3 className="text-2xl font-bold mb-4">{t('account.empty_wishlist')}</h3>
                  <p className="text-on-surface-variant max-w-sm mx-auto mb-8">{t('account.empty_wishlist_desc')}</p>
                  <button onClick={() => navigate('/shop')} className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">{t('account.browse_collection')}</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {wishlistItems.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}


          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl border border-surface-container-low p-20 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Settings className="text-on-surface-variant opacity-20 mx-auto mb-6" size={64} />
              <h3 className="text-2xl font-bold mb-4">{t('admin.settings')}</h3>
              <p className="text-on-surface-variant max-w-sm mx-auto mb-8">{t('account.settings_desc')}</p>
              <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <button className="w-full py-4 rounded-xl bg-surface-container font-bold text-sm hover:bg-surface-container-high transition-colors">{t('account.change_password')}</button>
                <button className="w-full py-4 rounded-xl border-2 border-surface-container font-bold text-sm hover:border-primary/30 transition-colors">{t('account.manage_data')}</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Account;
