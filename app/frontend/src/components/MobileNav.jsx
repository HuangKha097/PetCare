import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, ShoppingCart, User } from 'lucide-react';

const MobileNav = () => {
  return (
    <>
      <nav className="bg-white dark:bg-[#2c2f2f] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden rounded-t-[3rem] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Link to="/shop" className="bg-[#fcdb65] text-[#6e5a00] rounded-full px-6 py-2 flex flex-col items-center justify-center">
          <Store size={20} />
          <span className="font-sans text-[10px] font-medium uppercase tracking-widest mt-1">Shop</span>
        </Link>
        <Link to="/best-sellers" className="text-on-background opacity-60 hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
          <Star size={20} />
          <span className="font-sans text-[10px] font-medium uppercase tracking-widest mt-1">Best</span>
        </Link>
        <Link to="/cart" className="text-on-background opacity-60 hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
          <ShoppingCart size={20} />
          <span className="font-sans text-[10px] font-medium uppercase tracking-widest mt-1">Cart</span>
        </Link>
        <Link to="/login" className="text-on-background opacity-60 hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
          <User size={20} />
          <span className="font-sans text-[10px] font-medium uppercase tracking-widest mt-1">Account</span>
        </Link>
      </nav>
      {/* Margin for bottom nav on mobile */}
      <div className="h-20 md:hidden"></div>
    </>
  );
};

export default MobileNav;
