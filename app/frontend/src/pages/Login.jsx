import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, Eye, EyeOff, Mail, Lock, User as UserIcon } from 'lucide-react';
import { login as loginAPI, register as registerAPI, googleLogin as googleLoginAPI } from '../services/authService';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = isLogin
                ? await loginAPI(formData)
                : await registerAPI(formData);

            if (isLogin) {
                dispatch(loginSuccess({ 
                    user: response.data.user, 
                    token: response.data.token, 
                    refreshToken: response.data.refreshToken 
                }));
                if (response.data.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setIsLogin(true);
                setError(t('auth.success_register'));
            }
        } catch (err) {
            setError(err.response?.data?.message || t('auth.error_default'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (tokenResponse) => {
        setError('');
        setLoading(true);
        try {
            // tokenResponse.access_token is for implicit flow, but we need ID token or just send access_token if backend supports it.
            // However, @react-oauth/google's useGoogleLogin by default returns an access token.
            // If we want an ID token, we should use the GoogleLogin component or configure useGoogleLogin for it.
            // Let's use the simplest approach for now: custom button with useGoogleLogin.
            
            const response = await googleLoginAPI(tokenResponse.access_token);
            
            dispatch(loginSuccess({ 
                user: response.data.user, 
                token: response.data.token, 
                refreshToken: response.data.refreshToken 
            }));
            
            if (response.data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Google Login Error:', err);
            setError(err.response?.data?.message || 'Google Login failed');
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setError('Google Login Failed'),
    });

    return (
        <div className="min-h-[calc(100vh-68px)] bg-surface flex items-center justify-center py-12 px-6">
            <div className="max-w-5xl w-full flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.10)] border border-surface-container-low bg-surface-container-lowest md:h-[700px]">

                {/* Visual Section */}
                <div className="w-full md:w-5/12 relative overflow-hidden hidden md:block">
                    <img
                        alt="Happy Pets"
                        className="absolute inset-0 w-full h-full object-cover"
                        src="https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?q=80&w=2070&auto=format&fit=crop"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
                    <div className="relative h-full flex flex-col justify-end p-12 z-10">
                        <div className="mb-6 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                            <PawPrint className="text-white" size={32} />
                        </div>
                        <h2 className="font-display font-black text-white text-4xl lg:text-5xl leading-tight mb-4">
                            {isLogin ? t('auth.login_title') : t('auth.register_title')}
                        </h2>
                        <p className="text-white/90 text-lg font-medium max-w-sm">
                            {isLogin ? t('auth.login_desc') : t('auth.register_desc')}
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col md:overflow-y-auto custom-scrollbar">
                    <div className="max-w-md mx-auto w-full flex-grow flex flex-col justify-center">
                        <div className="text-center md:text-left mb-10">
                            <h1 className="font-display font-black text-3xl text-on-background mb-2">
                                {isLogin ? t('auth.sign_in') : t('auth.create_account')}
                            </h1>
                            <p className="text-on-surface-variant font-medium">
                                {isLogin ? t('auth.sign_in_desc') : t('auth.register_desc_short')}
                            </p>
                        </div>

                        {/* Switcher */}
                        <div className="inline-flex p-1 bg-surface-container-low rounded-xl mb-8 w-full">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${isLogin ? 'bg-white text-on-background shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                            >
                                {t('auth.sign_in')}
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${!isLogin ? 'bg-white text-on-background shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                            >
                                {t('auth.register')}
                            </button>
                        </div>

                        {error && (
                            <div className={`mb-8 p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${error.includes('successfully') || error === t('auth.success_register') ? 'bg-secondary-container text-on-secondary-container border border-secondary/20' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                <div className={`w-2 h-2 rounded-full ${error.includes('successfully') || error === t('auth.success_register') ? 'bg-secondary' : 'bg-red-500'}`} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                                        <UserIcon size={20} />
                                    </div>
                                    <input
                                        className="w-full pl-14 pr-6 py-4 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium text-on-background outline-none"
                                        name="name" placeholder={t('auth.full_name')} type="text"
                                        value={formData.name} onChange={handleInputChange} required
                                    />
                                </div>
                            )}

                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input
                                    className="w-full pl-14 pr-6 py-4 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium text-on-background outline-none"
                                    name="email" placeholder={t('auth.email')} type="email"
                                    value={formData.email} onChange={handleInputChange} required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    className="w-full pl-14 pr-14 py-4 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium text-on-background outline-none"
                                    name="password" placeholder={t('auth.password')} type={showPassword ? "text" : "password"}
                                    value={formData.password} onChange={handleInputChange} required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <Button type="submit" className="w-full py-4 text-lg mt-4 shadow-xl shadow-primary/20" disabled={loading}>
                                {loading ? t('auth.please_wait') : (isLogin ? t('auth.sign_in') : t('auth.create_account'))}
                            </Button>
                        </form>

                        <div className="relative my-10 text-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-surface-container-high"></div>
                            </div>
                            <span className="relative px-4 bg-surface-container-lowest text-xs font-bold uppercase tracking-widest text-on-surface-variant/40">{t('auth.or_connect')}</span>
                        </div>

                        <div className="flex justify-center">
                            <button 
                                onClick={() => loginWithGoogle()}
                                disabled={loading}
                                className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-surface-container-high bg-white hover:bg-surface-container-low transition-all active:scale-95 shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 group-hover:scale-110 transition-transform" alt="Google" />
                                <span className="text-sm font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">{t('auth.continue_google') || 'Continue with Google'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
