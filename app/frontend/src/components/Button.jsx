import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
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

  return (
    <button
      type={type}
      onClick={onClick}
      className={computedClassName.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
