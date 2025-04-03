import React from 'react';

export const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'default',
  icon: Icon,
  ...props
}) => {
  const baseClasses = 'btn flex items-center justify-center';
  const variantClasses = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    destructive: 'btn-primary bg-[#cc0f16] hover:bg-[#a50c12]', // Using Opera red
    success: 'btn-success'
  };
  const sizeClasses = {
    default: '',
    lg: 'btn-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={children ? 'mr-2' : ''} size={20} />}
      {children}
    </button>
  );
};
