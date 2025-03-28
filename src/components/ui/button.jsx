import React from 'react';

export const Button = ({ children, onClick, className, variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 rounded-md text-white transition-colors duration-300';
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-100',
    destructive: 'bg-red-600 hover:bg-red-700'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
