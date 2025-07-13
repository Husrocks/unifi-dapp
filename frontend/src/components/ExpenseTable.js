import React, { memo, useState, useMemo } from 'react';
import { 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  CalendarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const ExpenseTable = memo(({ 
  expenses = [],
  onRowClick,
  onAction,
  actionText = 'View Details',
  sortable = true,
  searchable = true,
  className = ''
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const statusConfig = {
    active: {
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-100',
      text: 'Active'
    },
    completed: {
      color: 'text-primary-500',
      bgColor: 'bg-primary-100',
      text: 'Completed'
    },
    pending: {
      color: 'text-accent-500',
      bgColor: 'bg-accent-100',
      text: 'Pending'
    },
    cancelled: {
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      text: 'Cancelled'
    }
  };

  const columns = [
    { key: 'name', label: 'Pool Name', sortable: true },
    { key: 'amount', label: 'Total Amount', sortable: true },
    { key: 'participants', label: 'Participants', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

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

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = expenses.filter(expense => {
      const matchesSearch = searchTerm === '' || 
        expense.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || expense.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });

    if (sortable && sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle different data types
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [expenses, searchTerm, filterStatus, sortConfig, sortable]);

  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (!sortable || !columns.find(col => col.key === key)?.sortable) return null;
    
    if (sortConfig.key !== key) {
      return <ChevronUpIcon className="w-4 h-4 text-dark-400" />;
    }
    
    return sortConfig.direction === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4 text-primary-500" /> : 
      <ChevronDownIcon className="w-4 h-4 text-primary-500" />;
  };

  const renderCell = (expense, column) => {
    switch (column.key) {
      case 'name':
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="font-medium">{expense.name}</p>
              <p className="text-sm text-dark-400">{expense.description}</p>
            </div>
          </div>
        );
      
      case 'amount':
        return (
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(expense.amount)}</p>
            <p className="text-sm text-dark-400">
              {expense.participants?.length || 0} contributors
            </p>
          </div>
        );
      
      case 'participants':
        return (
          <div className="flex items-center space-x-2">
            <UserGroupIcon className="w-4 h-4 text-dark-400" />
            <span>{expense.participants?.length || 0}</span>
          </div>
        );
      
      case 'status':
        const status = statusConfig[expense.status] || statusConfig.active;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
            {status.text}
          </span>
        );
      
      case 'createdAt':
        return (
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-dark-400" />
            <span className="text-sm">{formatDate(expense.createdAt)}</span>
          </div>
        );
      
      case 'actions':
        return (
          <div className="flex items-center space-x-2">
            {onRowClick && (
              <button
                onClick={() => onRowClick(expense)}
                className="btn-outline text-xs py-1 px-2"
              >
                View
              </button>
            )}
            {onAction && (
              <button
                onClick={() => onAction(expense)}
                className="btn-primary text-xs py-1 px-2"
              >
                {actionText}
              </button>
            )}
          </div>
        );
      
      default:
        return <span>{expense[column.key]}</span>;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filter */}
      {(searchable || filterStatus !== 'all') && (
        <div className="flex flex-col sm:flex-row gap-4">
          {searchable && (
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-dark-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left py-3 px-4 font-medium text-dark-300 ${
                    column.sortable && sortable ? 'cursor-pointer hover:text-white' : ''
                  }`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {filteredAndSortedData.map((expense, index) => (
              <tr
                key={expense.id || index}
                className={`hover:bg-dark-800 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick && onRowClick(expense)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="py-4 px-4">
                    {renderCell(expense, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredAndSortedData.length === 0 && (
        <div className="text-center py-12">
          <CurrencyDollarIcon className="w-12 h-12 text-dark-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No expenses found</h3>
          <p className="text-dark-400">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first expense pool to get started'
            }
          </p>
        </div>
      )}
    </div>
  );
});

ExpenseTable.displayName = 'ExpenseTable';

export default ExpenseTable; 