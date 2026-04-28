import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

/**
 * SearchInput
 * - The outer pill wrapper highlights to `border-primary` on focus-within
 * - The inner <input> has only a bottom border that transitions to primary when focused
 */
const SearchInput = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search...',
  buttonLabel = 'Search',
  className = '',
}) => {
  return (
    <form onSubmit={onSubmit} className={`w-full ${className}`}>
      <div
        className="
          flex items-center gap-2
          bg-surface-container-lowest
          rounded-full px-4 py-2
          shadow-sm
          border-2 border-outline-variant/25
          focus-within:border-primary
          focus-within:shadow-lg
          transition-all duration-200
        "
      >
        <SearchIcon className="shrink-0 text-outline" size={22} />

        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            flex-grow
            bg-transparent
            border-0 border-b-2
            border-outline-variant/40
            focus:border-primary
            focus:outline-none focus:ring-0
            text-base font-medium text-on-surface
            placeholder:text-on-surface-variant/50
            pb-0.5 px-1
            transition-colors duration-200
          "
        />

        <button
          type="submit"
          className="
            shrink-0
            bg-primary text-on-primary
            font-bold text-sm
            px-6 py-2.5
            rounded-full
            hover:brightness-105 hover:scale-105
            active:scale-95
            transition-all duration-150
          "
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
