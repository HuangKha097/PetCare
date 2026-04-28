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
      <nav className="bg-white dark:bg-[#2c2f2f] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden rounded-t-[3rem] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-20 py-2 rounded-full font-sans text-[10px] font-medium uppercase tracking-widest transition-colors ${
                isActive
                  ? 'bg-[#fcdb65] text-[#6e5a00]'
                  : 'text-on-background opacity-60 hover:opacity-100'
              }`
            }
          >
            <Icon size={20} className="mb-1 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      {/* Margin for bottom nav on mobile */}
      <div className="h-20 md:hidden"></div>
    </>
  );
};

export default MobileNav;
