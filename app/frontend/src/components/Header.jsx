import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Button from './Button';

const Header = () => {
  const { totalQuantity } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const navLinkClass = ({ isActive }) =>
    `text-on-background transition-all duration-300 hover:text-primary ${isActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'opacity-80'}`;

  return (
    <header className="bg-white/80 dark:bg-surface-container-low/80 backdrop-blur-xl font-display font-bold tracking-tight shadow-sm w-full top-0 z-50 sticky">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Menu className="text-primary cursor-pointer md:hidden" />
          <Link to="/" className="text-2xl font-black text-primary-dark tracking-tighter">PetCare <span className="text-primary italic">🐾</span></Link>

          <nav className="hidden md:flex gap-8 ml-8">
            <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
            <NavLink to="/categories" className={navLinkClass}>Categories</NavLink>
            <NavLink to="/blog" className={navLinkClass} >Blog</NavLink>
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

          {user ? (
            <div className="flex items-center gap-3 ml-2 border-l border-surface-container-high pl-4">
              <Link to="/account" className="hidden lg:flex flex-col items-end hover:text-primary transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Welcome back</span>
                <span className="text-xs font-bold text-on-surface">{user.name}</span>
              </Link>

            </div>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button className="py-2.5 px-6 text-xs uppercase tracking-widest">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
