import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * FilterSelect
 * A pill-styled <select> with a custom chevron icon.
 * Highlights with the primary color when an option other than the placeholder is selected.
 */
const FilterSelect = ({
  value,
  onChange,
  children,
  className = '',
}) => {
  const isActive = value !== '';

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className={`
          appearance-none
          pl-4 pr-8 py-2.5
          rounded-xl
          text-sm font-semibold
          border-2
          cursor-pointer
          focus:outline-none focus:ring-0
          transition-all duration-200
          ${isActive
            ? 'bg-primary text-on-primary border-primary'
            : 'bg-surface-container-high text-on-surface-variant border-transparent hover:border-outline-variant/40'
          }
        `}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className={`
          absolute right-2.5 pointer-events-none
          ${isActive ? 'text-on-primary' : 'text-on-surface-variant'}
        `}
      />
    </div>
  );
};

export default FilterSelect;
