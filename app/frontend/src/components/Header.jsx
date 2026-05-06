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
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden">
              <Menu className="text-primary cursor-pointer" />
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
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeMenu}
      >
        <div
          className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white p-6 shadow-2xl flex flex-col transition-all duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0 opacity-100 visible' : '-translate-x-full opacity-0 invisible'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="text-2xl font-black text-primary-dark tracking-tighter" onClick={closeMenu}>
              PetCare <span className="text-primary italic">🐾</span>
            </Link>
            <button onClick={closeMenu} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-xl">
            <NavLink to="/shop" className={navLinkClass} onClick={closeMenu}>{t('nav.shop')}</NavLink>
            <NavLink to="/blog" className={navLinkClass} onClick={closeMenu}>{t('nav.blog')}</NavLink>
          </nav>

          <div className="mt-auto pt-8 border-t border-surface-container-high">
            {user ? (
              <div 
                className="flex items-center justify-between cursor-pointer group hover:bg-surface-container-low p-2 -mx-2 rounded-xl transition-colors" 
                onClick={() => { closeMenu(); navigate('/account'); }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-on-surface">{user.name}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60">{t('nav.welcome_back')}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleLogout(); closeMenu(); }} 
                  className="p-3 hover:bg-error/10 rounded-full text-error transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={closeMenu}>
                  <Button className="w-full py-3" variant="primary">{t('nav.sign_in')}</Button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button className="w-full py-3 bg-surface-container hover:bg-surface-container-high text-on-surface" variant="secondary">{t('nav.create_account') || 'Create Account'}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
