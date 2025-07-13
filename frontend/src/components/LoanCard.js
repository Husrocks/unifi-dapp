import React, { memo } from 'react';
import { 
  CurrencyDollarIcon, 
  CalendarIcon, 
  UserIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

const LoanCard = memo(({ 
  loan = {},
  onAction,
  actionText = 'View Details',
  variant = 'default',
  className = ''
}) => {
  const {
    id,
    amount,
    interestRate,
    term,
    borrower,
    lender,
    status = 'active',
    dueDate,
    collateral,
    description,
    createdAt
  } = loan;

  const statusConfig = {
    active: {
      icon: CheckCircleIcon,
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-100',
      text: 'Active'
    },
    pending: {
      icon: ClockIcon,
      color: 'text-accent-500',
      bgColor: 'bg-accent-100',
      text: 'Pending'
    },
    defaulted: {
      icon: XCircleIcon,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      text: 'Defaulted'
    },
    completed: {
      icon: CheckCircleIcon,
      color: 'text-primary-500',
      bgColor: 'bg-primary-100',
      text: 'Completed'
    }
  };

  const variantConfig = {
    default: 'card-hover',
    compact: 'card p-4',
    detailed: 'card p-6'
  };

  const StatusIcon = statusConfig[status]?.icon || CheckCircleIcon;
  const statusColor = statusConfig[status]?.color || 'text-secondary-500';
  const statusBgColor = statusConfig[status]?.bgColor || 'bg-secondary-100';
  const statusText = statusConfig[status]?.text || 'Active';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAddress = (address) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={`${variantConfig[variant]} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold">Loan #{id || 'N/A'}</h3>
            <p className="text-sm text-dark-400">{description || 'No description'}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusBgColor}`}>
          <StatusIcon className={`w-4 h-4 ${statusColor}`} />
          <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
        </div>
      </div>

      {/* Loan Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-400">Amount:</span>
            <span className="font-semibold text-lg">{formatCurrency(amount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-400">Interest Rate:</span>
            <span className="font-medium">{interestRate || 0}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-400">Term:</span>
            <span className="font-medium">{term || 0} days</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-400">Borrower:</span>
            <div className="flex items-center space-x-1">
              <UserIcon className="w-4 h-4 text-dark-400" />
              <span className="font-mono text-sm">{formatAddress(borrower)}</span>
            </div>
          </div>
          {lender && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-400">Lender:</span>
              <div className="flex items-center space-x-1">
                <UserIcon className="w-4 h-4 text-dark-400" />
                <span className="font-mono text-sm">{formatAddress(lender)}</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-400">Due Date:</span>
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-4 h-4 text-dark-400" />
              <span className="text-sm">{formatDate(dueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collateral Info */}
      {collateral && (
        <div className="mb-4 p-3 bg-dark-800 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Collateral</h4>
          <p className="text-sm text-dark-400">{collateral}</p>
        </div>
      )}

      {/* Action Button */}
      {onAction && (
        <div className="flex justify-end">
          <button
            onClick={() => onAction(loan)}
            className="btn-outline text-sm py-2 px-4"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
});

LoanCard.displayName = 'LoanCard';

export default LoanCard; 