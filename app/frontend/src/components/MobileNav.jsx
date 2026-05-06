import React from 'react';
import { NavLink } from 'react-router-dom';
import { Store, LayoutGrid, Search } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/shop', icon: Store, label: 'Shop' },
  { to: '/categories', icon: LayoutGrid, label: 'Categories' },
  { to: '/search', icon: Search, label: 'Search' },
];

const MobileNav = () => {
  return (
    <>
      <nav className="bg-white/90 dark:bg-surface-container-low/90 backdrop-blur-xl fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 flex justify-around items-center px-4 py-3 md:hidden rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-white/20">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-20 py-2.5 rounded-2xl font-sans text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20 scale-110 -translate-y-1'
                  : 'text-on-background opacity-40 hover:opacity-100 hover:bg-surface-container-low'
              }`
            }
          >
            <Icon size={20} className="mb-1 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      {/* Margin for bottom nav on mobile */}
      <div className="h-24 md:hidden"></div>
    </>
  );
};

export default MobileNav;
