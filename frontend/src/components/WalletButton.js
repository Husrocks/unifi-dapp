import React, { memo } from 'react';
import { WalletIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const WalletButton = memo(({ 
  onClick, 
  isLoading = false, 
  isConnected = false, 
  account = null, 
  error = null,
  variant = 'primary',
  size = 'md',
  className = '',
  children 
}) => {
  const baseClasses = 'flex items-center justify-center space-x-2 font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500',
    outline: 'border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white focus:ring-primary-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg',
  };

  const formatAddress = (address) => {
    if (!address) return 'Connect Wallet';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <div className="spinner" />
          <span>Connecting...</span>
        </>
      );
    }

    if (error) {
      return (
        <>
          <ExclamationTriangleIcon className="w-5 h-5" />
          <span>Connection Failed</span>
        </>
      );
    }

    if (isConnected && account) {
      return (
        <>
          <WalletIcon className="w-5 h-5" />
          <span>{formatAddress(account)}</span>
        </>
      );
    }

    return children || (
      <>
        <WalletIcon className="w-5 h-5" />
        <span>Connect Wallet</span>
      </>
    );
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${error ? 'bg-red-600 hover:bg-red-700' : ''}
      `}
    >
      {getButtonContent()}
    </button>
  );
});

WalletButton.displayName = 'WalletButton';

export default WalletButton; 