import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, LogOut, X, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../store/slices/authSlice';
import { logoutAPI } from '../services/authService';
import Button from './Button';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) await logoutAPI(refreshToken);
    } catch (_) { /* ignore */ }
    dispatch(logout());
  };

  const navLinkClass = ({ isActive }) =>
    `text-on-background transition-all duration-300 hover:text-primary ${isActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'opacity-80'}`;

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 p-3 md:p-6 pointer-events-none flex justify-center bg-transparent">
        <div className="bg-white/90 backdrop-blur-[40px] rounded-[2rem] md:rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] w-full max-w-[1400px] px-4 md:px-10 py-2.5 md:py-3.5 flex justify-between items-center pointer-events-auto border border-white/50 transition-all duration-700 ease-out-expo">
          
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="md:hidden p-3 bg-primary/10 rounded-2xl hover:bg-primary/20 transition-all active:scale-90 group"
            >
              <Menu className="text-primary group-hover:rotate-12 transition-transform" size={20} />
            </button>
            
            <Link to="/" className="group flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black text-on-background tracking-tighter hover:text-primary transition-colors">
                PetCare
              </span>
              <div className="hidden sm:flex w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-primary items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <span className="text-xs">🐾</span>
              </div>
            </Link>

            <nav className="hidden md:flex gap-10 ml-10">
              {[
                { to: '/shop', label: t('nav.shop') },
                { to: '/blog', label: t('nav.blog') }
              ].map((link) => (
                <NavLink 
                  key={link.to} 
                  to={link.to} 
                  className={({ isActive }) => `
                    relative py-2 text-sm font-black tracking-widest uppercase transition-all duration-500 group
                    ${isActive ? 'text-on-background' : 'text-on-background/40 hover:text-on-background'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.label}</span>
                      <span className={`
                        absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-primary transition-all duration-500 ease-out-expo
                        ${isActive ? 'w-full' : 'w-0 group-hover:w-1/2'}
                      `}></span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Only Tools - Moved to Burger Menu on Mobile to save space */}
            <div className="hidden md:flex items-center gap-1 pr-6 border-r border-on-background/5">
              <Link to="/search" className="p-2.5 hover:bg-surface-container-low rounded-xl transition-all duration-500 hover:shadow-ambient-glow group">
                <Search size={18} className="text-on-background/60 group-hover:text-primary transition-colors" />
              </Link>

              <Link to="/cart" className="p-2.5 hover:bg-surface-container-low rounded-xl transition-all duration-500 hover:shadow-ambient-glow group relative">
                <ShoppingCart size={18} className="text-on-background/60 group-hover:text-primary transition-colors" />
                {totalQuantity > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-on-primary text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black border-2 border-white shadow-lg">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </div>

            <div className="md:pl-4">
              <LanguageSwitcher />
            </div>

            {user ? (
              <Link to="/account" className="flex items-center gap-3 md:gap-4 md:pl-6 group">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{t('nav.welcome_back')}</span>
                  <span className="text-xs font-black text-on-background group-hover:text-primary transition-colors">{user.name}</span>
                </div>
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-on-background text-white flex items-center justify-center font-black text-xs md:text-sm group-hover:bg-primary group-hover:text-on-background transition-all duration-500 shadow-xl group-hover:shadow-primary/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
            ) : (
              <Link to="/login" className="ml-2">
                <button className="bg-on-background text-white px-5 md:px-8 py-2.5 md:py-3 rounded-full font-black text-[9px] md:text-[10px] tracking-widest uppercase hover:bg-primary hover:text-on-background transition-all duration-500 shadow-xl active:scale-95">
                  {t('nav.sign_in')}
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Sidebar Menu: Choreographed Sanctuary ── */}
      <div
        className={`fixed inset-0 z-[100] bg-on-background/20 backdrop-blur-md transition-all duration-700 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeMenu}
      >
        <div
          className={`fixed top-4 left-4 bottom-4 w-[calc(100%-2rem)] max-w-sm bg-white rounded-[2.5rem] shadow-2xl flex flex-col transition-all duration-700 ease-out-expo ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Area */}
          <div className="flex items-center justify-between p-8">
            <Link to="/" className="group flex items-center gap-2" onClick={closeMenu}>
              <span className="text-2xl font-black text-on-background tracking-tighter">PetCare</span>
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-xs">🐾</span>
              </div>
            </Link>
            <button 
              onClick={closeMenu} 
              className="p-4 bg-surface-container-low hover:bg-primary/10 hover:text-primary rounded-2xl text-on-surface-variant transition-all duration-300 active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-2 px-6">
            {[
              { to: '/shop', label: t('nav.shop'), delay: 'delay-100' },
              { to: '/blog', label: t('nav.blog'), delay: 'delay-150' }
            ].map((link) => (
              <NavLink 
                key={link.to}
                to={link.to} 
                className={({ isActive }) => `
                  flex items-center justify-between p-6 rounded-3xl text-2xl font-black transition-all duration-500 transform
                  ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}
                  ${link.delay}
                  ${isActive ? 'bg-primary text-on-background' : 'text-on-background/40 hover:bg-surface-container-low'}
                `}
                onClick={closeMenu}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    <ChevronRight size={24} className={isActive ? 'opacity-100' : 'opacity-20'} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto p-8 space-y-6">
            {user ? (
              <div 
                className={`
                  flex items-center justify-between bg-[#f9faf9] p-6 rounded-[2rem] border border-on-background/5 transition-all duration-700 transform
                  ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} delay-300
                `}
                onClick={() => { closeMenu(); navigate('/account'); }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-on-background text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-on-surface leading-tight">{user.name}</span>
                    <span className="text-[10px] uppercase font-black tracking-widest text-primary">{t('nav.welcome_back')}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleLogout(); closeMenu(); }} 
                  className="p-4 bg-white shadow-sm hover:bg-error hover:text-white rounded-2xl text-error transition-all duration-500 active:scale-90"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className={`space-y-4 transition-all duration-700 transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} delay-300`}>
                <Link to="/login" onClick={closeMenu} className="w-full">
                  <button className="w-full py-6 rounded-[2rem] bg-on-background text-white font-black text-[10px] tracking-widest uppercase hover:bg-primary hover:text-on-background transition-all shadow-2xl active:scale-95">
                    {t('nav.sign_in')}
                  </button>
                </Link>
                <div className="text-center">
                  <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em] opacity-30">
                    PetCare Sanctuary
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
