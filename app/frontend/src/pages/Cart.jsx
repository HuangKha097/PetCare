import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck,
    RotateCcw, Headphones, MapPin, CreditCard as CardIcon,
    CheckCircle2, ChevronLeft, Truck, PackageCheck, AlertTriangle, X
} from 'lucide-react';
import { fetchCart, updateCartItem, removeFromCart, clearCartLocal, clearNotifications } from '../store/slices/cartSlice';
import { loginSuccess } from '../store/slices/authSlice';
import Button from '../components/Button';
import { updateProfile } from '../services/authService';
import { createOrder } from '../services/orderService';
import { getLocalizedText } from '../utils/i18nUtils';

const Cart = () => {
    const { i18n, t } = useTranslation();
    const { items, totalQuantity, totalAmount, status, notifications } = useSelector((state) => state.cart);
    const { user, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Cart, 2: Details, 3: Payment, 4: Success
    const [orderInfo, setOrderInfo] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        note: '',
        saveDefault: false,
        paymentMethod: 'cash', // cash | card | banking
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        dispatch(fetchCart());
        fetch('https://provinces.open-api.vn/api/?depth=3')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(console.error);
    }, [dispatch]);

    const handleUpdateQuantity = (cartItemId, currentQty, change) => {
        const newQty = Math.max(1, currentQty + change);
        if (newQty !== currentQty) {
            dispatch(updateCartItem({ cartItemId, quantity: newQty }));
        }
    };

    const handleRemove = (cartItemId) => {
        dispatch(removeFromCart(cartItemId));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOrderInfo({ ...orderInfo, [name]: type === 'checkbox' ? checked : value });
    };

    const handleCityChange = (e) => {
        const cityName = e.target.value;
        setOrderInfo({ ...orderInfo, city: cityName, district: '', ward: '' });
        const selectedProv = provinces.find(p => p.name === cityName);
        setDistricts(selectedProv ? selectedProv.districts : []);
        setWards([]);
    };

    const handleDistrictChange = (e) => {
        const districtName = e.target.value;
        setOrderInfo({ ...orderInfo, district: districtName, ward: '' });
        const selectedDist = districts.find(d => d.name === districtName);
        setWards(selectedDist ? selectedDist.wards : []);
    };

    const handleUseDefault = () => {
        if (!user) return;

        let street = user.address || '';
        let savedWard = '';
        let savedDistrict = '';

        if (user.address && user.address.includes(', ')) {
            const parts = user.address.split(', ');
            if (parts.length >= 3) {
                savedDistrict = parts.pop();
                savedWard = parts.pop();
                street = parts.join(', ');
            }
        }

        setOrderInfo({
            ...orderInfo,
            phone: user.phone || '',
            address: street,
            city: user.city || '',
            district: savedDistrict,
            ward: savedWard
        });

        if (user.city) {
            const selectedProv = provinces.find(p => p.name === user.city);
            const distList = selectedProv ? selectedProv.districts : [];
            setDistricts(distList);

            if (savedDistrict) {
                const selectedDist = distList.find(d => d.name === savedDistrict);
                setWards(selectedDist ? selectedDist.wards : []);
            } else {
                setWards([]);
            }
        }
    };

    const validateDetails = () => {
        const { name, email, phone, address, city, district, ward } = orderInfo;
        return name && email && phone && address && city && district && ward;
    };

    const validatePayment = () => {
        if (orderInfo.paymentMethod === 'cash') return true;
        const { cardNumber, expiry, cvv } = orderInfo;
        return cardNumber && expiry && cvv;
    };

    const handleNextStep = () => {
        if (step === 2 && !validateDetails()) {
            alert(t('checkout.place_order_failed')); // Use a better message if available
            return;
        }
        if (step === 3 && !validatePayment()) {
            alert(t('checkout.place_order_failed'));
            return;
        }
        setStep(step + 1);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!validatePayment()) {
            alert(t('checkout.place_order_failed'));
            return;
        }
        try {
            // Save as default if checked
            if (orderInfo.saveDefault) {
                const hasExistingData = user.phone || user.address || user.city;
                const isDifferent = orderInfo.phone !== user.phone || orderInfo.address !== user.address || orderInfo.city !== user.city;

                if (hasExistingData && isDifferent) {
                    const confirmOverride = window.confirm(t('cart.override_confirm'));
                    if (confirmOverride) {
                        const response = await updateProfile({
                            phone: orderInfo.phone,
                            address: `${orderInfo.address}, ${orderInfo.ward}, ${orderInfo.district}`,
                            city: orderInfo.city
                        });
                        dispatch(loginSuccess({ user: response.data, token }));
                    }
                } else if (!hasExistingData) {
                    const response = await updateProfile({
                        phone: orderInfo.phone,
                        address: `${orderInfo.address}, ${orderInfo.ward}, ${orderInfo.district}`,
                        city: orderInfo.city
                    });
                    dispatch(loginSuccess({ user: response.data, token }));
                }
            }

            // Place real order
            await createOrder({
                items: items,
                totalAmount: totalAmount * 1.08,
                paymentMethod: orderInfo.paymentMethod,
                address: `${orderInfo.address}, ${orderInfo.ward}, ${orderInfo.district}`,
                phone: orderInfo.phone,
                city: orderInfo.city,
                note: orderInfo.note
            });

            setStep(4);
            dispatch(clearCartLocal());
        } catch (error) {
            console.error(error);
            alert(t('checkout.place_order_failed'));
        }
    };

    if (status === 'loading' && items.length === 0 && step !== 4) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (items.length === 0 && step !== 4) {
        return (
            <div className="flex flex-col items-center justify-center py-32 px-6">
                <ShoppingBag size={64} className="text-on-surface-variant/20 mb-6" />
                <h2 className="text-2xl font-black mb-2">{t('cart.empty_title')}</h2>
                <p className="text-on-surface-variant mb-8 text-center max-w-xs">{t('cart.empty_desc')}</p>
                <Link to="/shop">
                    <Button>{t('cart.start_shopping')}</Button>
                </Link>
            </div>
        );
    }


    if (step === 4) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-6">
                <div className="max-w-lg w-full text-center bg-white p-12 rounded-[2.5rem] shadow-xl border border-surface-container-low">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <PackageCheck size={48} />
                    </div>
                    <h1 className="text-4xl font-black mb-4">{t('checkout.success_title')}</h1>
                    <p className="text-on-surface-variant font-medium text-lg mb-10 leading-relaxed">
                        {t('checkout.success_desc', { name: orderInfo.name, city: orderInfo.city })}
                    </p>
                    <div className="flex flex-col gap-4">
                        <NavLink to="/account">
                            <Button className="w-full py-4 text-base font-bold">{t('checkout.track_order')}</Button>
                        </NavLink>
                        <NavLink to="/shop">
                            <Button variant="outline" className="w-full py-4 text-base font-bold border-surface-container-high">{t('common.back_to_shop')}</Button>
                        </NavLink>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="mt-28 mb-24 max-w-7xl mx-auto w-full px-6">

            {notifications && notifications.length > 0 && (
                <div className="mb-8 space-y-3">
                    {notifications.map((notif, idx) => (
                        <div key={idx} className={`flex items-start gap-4 p-5 rounded-2xl border shadow-sm ${notif.type === 'removed' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                            <AlertTriangle size={22} className={notif.type === 'removed' ? 'text-red-500 mt-0.5 shrink-0' : 'text-amber-500 mt-0.5 shrink-0'} />
                            <div className="flex-1">
                                <p className={`font-bold text-sm ${notif.type === 'removed' ? 'text-red-800' : 'text-amber-800'}`}>
                                    {notif.type === 'removed' ? t('cart.items_removed') : t('cart.quantities_adjusted')}
                                </p>
                                <p className={`text-sm mt-1 ${notif.type === 'removed' ? 'text-red-600' : 'text-amber-600'}`}>
                                    {getLocalizedText(notif.message, i18n.language)}
                                </p>
                            </div>
                            <button onClick={() => dispatch(clearNotifications())} className="p-1 hover:bg-black/5 rounded-full transition-colors shrink-0">
                                <X size={18} className="text-on-surface-variant" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-background mb-4">
                        {step === 1 ? t('cart.title') : step === 2 ? t('checkout.details_title') : t('checkout.payment_title')}
                    </h1>
                    <p className="text-on-surface-variant font-medium text-lg opacity-70">
                        {step === 1 ? t('cart.review_selection', { count: totalQuantity }) : step === 2 ? t('checkout.details_desc') : t('checkout.payment_desc')}
                    </p>
                </div>


                <div className="flex items-center justify-center md:justify-start gap-2 md:gap-4 bg-white p-2 px-4 md:px-6 rounded-[2rem] md:rounded-full border border-surface-container-low shadow-sm w-full md:w-auto">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-500 ${step >= s ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 md:scale-110' : 'bg-surface-container text-on-surface-variant opacity-40'}`}>
                                    {step > s ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : s}
                                </div>
                                <span className={`font-bold text-xs md:text-sm transition-colors duration-500 ${step >= s ? 'text-on-background' : 'text-on-surface-variant opacity-40'} ${step === s ? 'block' : 'hidden md:block'}`}>
                                    {s === 1 ? t('checkout.step_cart') : s === 2 ? t('checkout.step_details') : t('checkout.step_pay')}
                                </span>
                            </div>
                            {s < 3 && <div className={`w-4 md:w-8 h-[2px] shrink-0 transition-colors duration-500 ${step > s ? 'bg-primary' : 'bg-surface-container-high'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">


                <div className="lg:col-span-8">


                    {step === 1 && (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.cart_item_id} className="bg-white border border-surface-container-low rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-sm group hover:shadow-xl transition-all duration-300">
                                    <div className="w-full md:w-40 aspect-square rounded-xl overflow-hidden bg-surface-container-low">
                                        <img alt={getLocalizedText(item.name, i18n.language)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={item.images ? item.images[0] : "https://static.vecteezy.com/system/resources/previews/058/788/346/non_2x/broken-or-missing-file-icon-with-sad-face-symbol-of-technical-issue-data-loss-system-failure-used-as-placeholder-when-content-is-unavailable-illustration-vector.jpg"} />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-on-background leading-tight">{getLocalizedText(item.name, i18n.language)}</h3>
                                                <p className="text-sm text-on-surface-variant mt-1 font-medium opacity-60">{getLocalizedText(item.category, i18n.language)}</p>
                                            </div>
                                            <Button variant="ghost" onClick={() => handleRemove(item.cart_item_id)} className="p-2 text-on-surface-variant hover:text-red-500 transition-colors">
                                                <Trash2 size={20} />
                                            </Button>
                                        </div>
                                        <div className="flex justify-between items-center mt-6">
                                            <div className="flex items-center bg-surface-container-low rounded-full p-1 border border-surface-container-high/50">
                                                <Button variant="custom" onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity, -1)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white hover:bg-primary hover:text-on-primary transition-all shadow-sm">
                                                    <Minus size={14} />
                                                </Button>
                                                <span className="px-6 font-bold text-sm">{item.quantity}</span>
                                                <Button variant="custom" onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity, 1)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white hover:bg-primary hover:text-on-primary transition-all shadow-sm">
                                                    <Plus size={14} />
                                                </Button>
                                            </div>
                                            <span className="text-2xl font-black text-on-background">${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                    {step === 2 && (
                        <div className="bg-white border border-surface-container-low rounded-xl p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <MapPin size={24} className="text-primary" /> {t('checkout.delivery_address')}
                                </h2>
                                {(user?.phone || user?.address) && (
                                    <button
                                        type="button"
                                        onClick={handleUseDefault}
                                        className="text-sm font-black text-primary bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-2xl transition-all border-2 border-primary/20 flex items-center gap-2 group active:scale-95"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-2 10h8l-2 10 2-10h-8z" /></svg>
                                        </div>
                                        {t('checkout.quick_fill')}
                                    </button>
                                )}
                            </div>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">{t('checkout.full_name')}</label>
                                    <input type="text" name="name" value={orderInfo.name} readOnly className="bg-surface-container-low px-6 py-4 rounded-xl border border-surface-container-high outline-none font-semibold text-base transition-all opacity-70 cursor-not-allowed" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">{t('checkout.email')}</label>
                                    <input type="email" name="email" value={orderInfo.email} readOnly className="bg-surface-container-low px-6 py-4 rounded-xl border border-surface-container-high outline-none font-semibold text-base transition-all opacity-70 cursor-not-allowed" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">{t('checkout.phone')}</label>
                                    <input type="tel" name="phone" value={orderInfo.phone} onChange={handleInputChange} className="bg-surface px-6 py-4 rounded-xl border border-surface-container-high focus:ring-4 focus:ring-primary/10 outline-none font-semibold text-base transition-all" placeholder="09xx xxx xxx" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">{t('checkout.city')}</label>
                                    <select name="city" value={orderInfo.city} onChange={handleCityChange} className="bg-surface px-6 py-4 rounded-xl border border-surface-container-high focus:ring-4 focus:ring-primary/10 outline-none font-semibold text-base transition-all appearance-none cursor-pointer">
                                        <option value="">{t('checkout.city')}</option>
                                        {provinces.map(p => (
                                            <option key={p.code} value={p.name}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">{t('checkout.district')}</label>
                                    <select name="district" value={orderInfo.district} onChange={handleDistrictChange} disabled={!orderInfo.city} className="bg-surface px-6 py-4 rounded-xl border border-surface-container-high focus:ring-4 focus:ring-primary/10 outline-none font-semibold text-base transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                        <option value="">{orderInfo.city ? t('checkout.district') : t('checkout.city')}</option>
                                        {districts.map(d => (
                                            <option key={d.code} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">{t('checkout.ward')}</label>
                                    <select name="ward" value={orderInfo.ward} onChange={handleInputChange} disabled={!orderInfo.district} className="bg-surface px-6 py-4 rounded-xl border border-surface-container-high focus:ring-4 focus:ring-primary/10 outline-none font-semibold text-base transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                        <option value="">{orderInfo.district ? t('checkout.ward') : t('checkout.district')}</option>
                                        {wards.map(w => (
                                            <option key={w.code} value={w.name}>{w.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">{t('checkout.address')}</label>
                                    <input type="text" name="address" value={orderInfo.address} onChange={handleInputChange} className="bg-surface px-6 py-4 rounded-xl border border-surface-container-high focus:ring-4 focus:ring-primary/10 outline-none font-semibold text-base transition-all" placeholder={t('checkout.address')} />
                                </div>
                                <div className="md:col-span-2 flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">{t('checkout.notes')}</label>
                                    <textarea name="note" value={orderInfo.note} onChange={handleInputChange} rows="3" className="bg-surface px-6 py-4 rounded-lg border border-surface-container-high focus:ring-4 focus:ring-primary/10 outline-none font-semibold text-base transition-all resize-none" placeholder={t('checkout.notes_placeholder')}></textarea>
                                </div>

                                <div className="md:col-span-2 pt-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" name="saveDefault" checked={orderInfo.saveDefault} onChange={handleInputChange} className="sr-only" />
                                            <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${orderInfo.saveDefault ? 'bg-primary border-primary' : 'border-surface-container-high bg-white'}`}>
                                                {orderInfo.saveDefault && <CheckCircle2 size={16} className="text-on-primary" />}
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-on-surface-variant group-hover:text-on-background transition-colors">{t('checkout.save_default')}</span>
                                    </label>
                                </div>
                            </form>
                        </div>
                    )}


                    {step === 3 && (
                        <div className="bg-white border border-surface-container-low rounded-xl p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <CardIcon size={24} className="text-primary" /> {t('checkout.choose_payment')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'cash', label: t('checkout.cash'), icon: Truck, desc: t('checkout.pay_on_receive') },
                                    { id: 'banking', label: t('checkout.banking'), icon: Headphones, desc: t('checkout.banking') },
                                    { id: 'card', label: t('checkout.card'), icon: CardIcon, desc: t('checkout.card') }
                                ].map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => setOrderInfo({ ...orderInfo, paymentMethod: method.id })}
                                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${orderInfo.paymentMethod === method.id ? 'border-primary bg-primary/5 shadow-md' : 'border-surface-container-high hover:border-primary/30'}`}
                                    >
                                        <method.icon className={`mb-4 ${orderInfo.paymentMethod === method.id ? 'text-primary' : 'text-on-surface-variant'}`} size={28} />
                                        <p className="font-bold text-sm mb-1">{method.label}</p>
                                        <p className="text-[10px] font-medium opacity-50 uppercase tracking-widest">{method.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {orderInfo.paymentMethod === 'card' && (
                                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="md:col-span-2 flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">{t('checkout.card_number')}</label>
                                        <input type="text" name="cardNumber" value={orderInfo.cardNumber} onChange={handleInputChange} className="bg-surface px-6 py-4 rounded-xl border border-surface-container-high focus:ring-4 focus:ring-primary/10 outline-none font-semibold text-base transition-all" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">{t('checkout.expiry')}</label>
                                        <input type="text" name="expiry" value={orderInfo.expiry} onChange={handleInputChange} className="bg-surface px-6 py-4 rounded-xl border border-surface-container-high focus:ring-4 focus:ring-primary/10 outline-none font-semibold text-base transition-all" placeholder="MM / YY" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 ml-1">{t('checkout.cvv')}</label>
                                        <input type="text" name="cvv" value={orderInfo.cvv} onChange={handleInputChange} className="bg-surface px-6 py-4 rounded-xl border border-surface-container-high focus:ring-4 focus:ring-primary/10 outline-none font-semibold text-base transition-all" placeholder="***" />
                                    </div>
                                </div>
                            )}

                            {orderInfo.paymentMethod === 'banking' && (
                                <div className="mt-10 p-8 rounded-xl bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <h4 className="font-bold mb-4">{t('checkout.bank_info')}</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-60">{t('checkout.bank_name')}:</span>
                                            <span className="font-bold">MB Bank</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-60">{t('checkout.acc_number')}:</span>
                                            <span className="font-bold text-primary">1234 5678 9999</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-60">{t('checkout.acc_holder')}:</span>
                                            <span className="font-bold uppercase">PETCARE VIETNAM</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="opacity-60">{t('checkout.transfer_content')}:</span>
                                            <span className="font-bold text-sm">ORD{Math.floor(Math.random() * 10000)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {orderInfo.paymentMethod === 'cash' && (
                                <div className="mt-10 p-6 rounded-xl bg-surface-container-low border border-surface-container-high flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Truck size={24} className="text-primary flex-shrink-0" />
                                    <p className="text-sm font-medium leading-relaxed text-on-surface-variant">
                                        {t('checkout.cash_desc')}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>


                <aside className="lg:col-span-4 sticky top-28">
                    <div className="bg-white border border-surface-container-low rounded-xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-8 tracking-tight">{t('cart.order_summary')}</h2>


                        {step > 1 && (
                            <div className="mb-8 space-y-4">
                                {items.map(item => (
                                    <div key={item.cart_item_id} className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-surface-container-low">
                                            <img src={item.images ? item.images[0] : "https://static.vecteezy.com/system/resources/previews/058/788/346/non_2x/broken-or-missing-file-icon-with-sad-face-symbol-of-technical-issue-data-loss-system-failure-used-as-placeholder-when-content-is-unavailable-illustration-vector.jpg"} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-sm font-bold truncate">{getLocalizedText(item.name, i18n.language)}</p>
                                            <p className="text-xs font-medium text-on-surface-variant">{t('product.stock')}: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-black">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                                <div className="h-px bg-surface-container-low my-4"></div>
                            </div>
                        )}

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-base">
                                <span className="text-on-surface-variant font-medium">{t('cart.subtotal')}</span>
                                <span className="font-bold text-on-surface">${totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base">
                                <span className="text-on-surface-variant font-medium">{t('cart.shipping')}</span>
                                <span className="text-green-500 font-black uppercase text-xs tracking-widest">{t('cart.free')}</span>
                            </div>
                            <div className="flex justify-between text-base">
                                <span className="text-on-surface-variant font-medium">{t('cart.taxes')}</span>
                                <span className="font-bold text-on-surface">${(totalAmount * 0.08).toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end mb-8 pt-6 border-t border-surface-container-low">
                            <span className="text-lg font-bold">{t('cart.total')}</span>
                            <div className="text-right">
                                <span className="text-3xl font-black text-on-background block leading-none">${(totalAmount * 1.08).toFixed(2)}</span>
                                <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest mt-1 block">{t('cart.currency_note')}</span>
                            </div>
                        </div>


                        <div className="flex flex-col gap-4">
                            {step === 1 && (
                                <Button className="w-full py-4 rounded-2xl text-base font-bold shadow-xl shadow-primary/30" onClick={() => setStep(2)}>
                                    {t('cart.checkout')} <ArrowRight size={20} />
                                </Button>
                            )}
                            {step === 2 && (
                                <Button
                                    className={`w-full py-4 rounded-2xl text-base font-bold shadow-xl transition-all ${validateDetails() ? 'shadow-primary/30 opacity-100' : 'opacity-60 cursor-not-allowed'}`}
                                    onClick={handleNextStep}
                                >
                                    {t('common.next')} <ArrowRight size={20} />
                                </Button>
                            )}
                            {step === 3 && (
                                <Button
                                    className={`w-full py-4 rounded-2xl text-base font-bold shadow-xl transition-all ${validatePayment() ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' : 'bg-green-500/50 cursor-not-allowed opacity-60'} text-white`}
                                    onClick={handlePlaceOrder}
                                >
                                    {t('checkout.confirm_order')} <CheckCircle2 size={20} />
                                </Button>
                            )}

                            {step > 1 && (
                                <button onClick={() => setStep(step - 1)} className="flex items-center justify-center gap-2 text-sm font-bold text-on-surface-variant hover:text-on-background transition-colors">
                                    <ChevronLeft size={16} /> {t('common.back')} {step === 2 ? t('checkout.step_cart') : t('checkout.step_details')}
                                </button>
                            )}
                        </div>
                    </div>


                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center p-4 bg-white/50 rounded-2xl border border-surface-container-low">
                            <ShieldCheck size={20} className="text-primary mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{t('cart.safe_secure')}</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white/50 rounded-2xl border border-surface-container-low">
                            <RotateCcw size={20} className="text-primary mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{t('cart.easy_returns')}</span>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default Cart;
