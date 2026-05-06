import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, LogOut, X } from 'lucide-react';
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
      <header className="bg-white/80 dark:bg-surface-container-low/80 backdrop-blur-xl font-display font-bold tracking-tight shadow-sm w-full top-0 z-50 sticky">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="md:hidden p-2.5 bg-primary/10 rounded-2xl hover:bg-primary/20 transition-all active:scale-90 group"
            >
              <Menu className="text-primary group-hover:scale-110 transition-transform" size={24} />
            </button>
            <Link to="/" className="text-2xl font-black text-primary-dark tracking-tighter">PetCare <span className="text-primary italic">🐾</span></Link>

            <nav className="hidden md:flex gap-8 ml-8">
              <NavLink to="/shop" className={navLinkClass}>{t('nav.shop')}</NavLink>
              <NavLink to="/blog" className={navLinkClass}>{t('nav.blog')}</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/search" className="p-2 hover:bg-surface-container rounded-full transition-colors">
              <Search size={20} className="text-on-surface" />
            </Link>

            <Link to="/cart" className="p-2 hover:bg-surface-container rounded-full transition-colors relative">
              <ShoppingCart size={20} className="text-on-surface" />
              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-on-primary text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black border-2 border-white shadow-sm">
                  {totalQuantity}
                </span>
              )}
            </Link>

            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center gap-3 ml-2 border-l border-surface-container-high pl-4">
                <Link to="/account" className="hidden lg:flex flex-col items-end hover:text-primary transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('nav.welcome_back')}</span>
                  <span className="text-xs font-bold text-on-surface">{user.name}</span>
                </Link>

              </div>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button className="py-2.5 px-6 text-xs uppercase tracking-widest">
                  {t('nav.sign_in')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Sidebar Menu (Outside header to escape backdrop filter stacking context) ── */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeMenu}
      >
        <div
          className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white dark:bg-surface-container-lowest p-8 shadow-2xl flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-12">
            <Link to="/" className="text-2xl font-black text-primary-dark tracking-tighter" onClick={closeMenu}>
              PetCare <span className="text-primary italic">🐾</span>
            </Link>
            <button 
              onClick={closeMenu} 
              className="p-3 bg-surface-container-low hover:bg-primary/10 hover:text-primary rounded-2xl text-on-surface-variant transition-all duration-300"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            <NavLink 
              to="/shop" 
              className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all duration-300 ${isActive ? 'bg-primary/10 text-primary translate-x-2' : 'text-on-background hover:bg-surface-container-low hover:translate-x-2'}`}
              onClick={closeMenu}
            >
              <div className={`w-2 h-2 rounded-full bg-primary transition-transform duration-300 ${isMobileMenuOpen ? 'scale-100' : 'scale-0'}`} />
              {t('nav.shop')}
            </NavLink>
            <NavLink 
              to="/blog" 
              className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all duration-300 ${isActive ? 'bg-primary/10 text-primary translate-x-2' : 'text-on-background hover:bg-surface-container-low hover:translate-x-2'}`}
              onClick={closeMenu}
            >
              <div className={`w-2 h-2 rounded-full bg-primary transition-transform duration-300 ${isMobileMenuOpen ? 'scale-100' : 'scale-0'}`} />
              {t('nav.blog')}
            </NavLink>
          </nav>

          <div className="mt-auto pt-8">
            {user ? (
              <div 
                className="flex items-center justify-between cursor-pointer group bg-surface-container-low p-4 rounded-3xl transition-all duration-300 hover:shadow-lg" 
                onClick={() => { closeMenu(); navigate('/account'); }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-on-surface leading-tight">{user.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary">{t('nav.welcome_back')}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleLogout(); closeMenu(); }} 
                  className="p-4 bg-white dark:bg-surface-container-lowest shadow-sm hover:bg-error hover:text-white rounded-2xl text-error transition-all duration-300 active:scale-90"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to="/login" onClick={closeMenu} className="w-full">
                  <Button className="w-full py-4 text-base font-black shadow-xl shadow-primary/20" variant="primary">
                    {t('nav.sign_in')}
                  </Button>
                </Link>
                <p className="text-center text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em] opacity-40">
                  {t('nav.welcome_to_petcare') || 'Welcome to PetCare'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
