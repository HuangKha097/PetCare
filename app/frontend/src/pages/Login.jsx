import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, ArrowLeft, Eye, EyeOff, Apple, Github, Mail, Lock, User as UserIcon } from 'lucide-react';
import { login as loginAPI, register as registerAPI } from '../services/authService';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import Button from '../components/Button';

const Login = () => {
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
                dispatch(loginSuccess({ user: response.data.user, token: response.data.token }));
                if (response.data.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setIsLogin(true);
                setError('Account created successfully! Please log in.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

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
                            {isLogin ? 'Good to see you again.' : 'Start your pet journey.'}
                        </h2>
                        <p className="text-white/90 text-lg font-medium max-w-sm">
                            {isLogin
                                ? 'Your pets are waiting! Log in to access your dashboard and rewards.'
                                : 'Join thousands of pet parents getting the best care for their furry friends.'}
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col md:overflow-y-auto custom-scrollbar">
                    <div className="max-w-md mx-auto w-full flex-grow flex flex-col justify-center">
                        <div className="text-center md:text-left mb-10">
                            <h1 className="font-display font-black text-3xl text-on-background mb-2">
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </h1>
                            <p className="text-on-surface-variant font-medium">
                                {isLogin ? "Enter your details to access your account" : "Sign up to start shopping for your pets"}
                            </p>
                        </div>

                        {/* Switcher */}
                        <div className="inline-flex p-1 bg-surface-container-low rounded-xl mb-8 w-full">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${isLogin ? 'bg-white text-on-background shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${!isLogin ? 'bg-white text-on-background shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
                            >
                                Register
                            </button>
                        </div>

                        {error && (
                            <div className={`mb-8 p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${error.includes('successfully') ? 'bg-secondary-container text-on-secondary-container border border-secondary/20' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                <div className={`w-2 h-2 rounded-full ${error.includes('successfully') ? 'bg-secondary' : 'bg-red-500'}`} />
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
                                        name="name" placeholder="Full Name" type="text"
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
                                    name="email" placeholder="Email Address" type="email"
                                    value={formData.email} onChange={handleInputChange} required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    className="w-full pl-14 pr-14 py-4 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium text-on-background outline-none"
                                    name="password" placeholder="Password" type={showPassword ? "text" : "password"}
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
                                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                            </Button>
                        </form>

                        <div className="relative my-10 text-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-surface-container-high"></div>
                            </div>
                            <span className="relative px-4 bg-surface-container-lowest text-xs font-bold uppercase tracking-widest text-on-surface-variant/40">Or connect with</span>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <button className="flex items-center justify-center p-4 rounded-xl border border-surface-container-high hover:bg-surface-container-low transition-all active:scale-95">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                            </button>
                            <button className="flex items-center justify-center p-4 rounded-xl border border-surface-container-high hover:bg-surface-container-low transition-all active:scale-95">
                                <Apple className="w-6 h-6" />
                            </button>
                            <button className="flex items-center justify-center p-4 rounded-xl border border-surface-container-high hover:bg-surface-container-low transition-all active:scale-95">
                                <Github className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
