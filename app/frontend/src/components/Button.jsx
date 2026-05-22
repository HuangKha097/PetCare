import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  loading = false,
  disabled = false,
  ...props
}) => {
  let computedClassName = className;

  if (variant === 'primary') {
    computedClassName = `btn-primary ${className}`;
  } else if (variant === 'outline') {
    computedClassName = `bg-surface-container-lowest text-on-surface border-2 border-surface-container-high hover:border-primary-container hover:bg-surface-container-low rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${className}`;
  } else if (variant === 'secondary') {
    computedClassName = `bg-surface-container-high text-on-background hover:bg-surface-container-highest rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${className}`;
  } else if (variant === 'ghost') {
    computedClassName = `text-on-surface-variant hover:text-primary transition-colors font-bold active:scale-95 flex items-center justify-center gap-2 ${className}`;
  } else if (variant === 'custom') {
    computedClassName = `transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${className}`;
  }

  // Handle loading and disabled states
  const isDisabled = disabled || loading;
  if (isDisabled) {
    computedClassName = `${computedClassName} opacity-60 cursor-not-allowed pointer-events-none`;
  }

  return (
    <button
      type={type}
      onClick={!isDisabled ? onClick : undefined}
      className={computedClassName.trim()}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
