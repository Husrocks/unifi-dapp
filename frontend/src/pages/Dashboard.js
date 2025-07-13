import React, { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import {
  CurrencyDollarIcon,
  HandRaisedIcon,
  GlobeAltIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Scenarios from '../components/Scenarios';

const Dashboard = () => {
  const { account, userBalance, active, connectionError } = useWallet();
  const navigate = useNavigate();

  // Mock data for charts - memoized for performance
  const creditScoreData = useMemo(() => [
    { month: 'Jan', score: 650 },
    { month: 'Feb', score: 680 },
    { month: 'Mar', score: 720 },
    { month: 'Apr', score: 750 },
    { month: 'May', score: 780 },
    { month: 'Jun', score: 820 },
  ], []);

  const portfolioData = useMemo(() => [
    { name: 'Active Loans', value: 2500, color: '#3b82f6' },
    { name: 'Expense Pools', value: 1200, color: '#22c55e' },
    { name: 'Available', value: 800, color: '#f59e0b' },
  ], []);

  const recentTransactions = useMemo(() => [
    {
      id: 1,
      type: 'Loan Repayment',
      amount: 500,
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: 2,
      type: 'Expense Pool Contribution',
      amount: 200,
      date: '2024-01-14',
      status: 'completed',
    },
    {
      id: 3,
      type: 'Remittance Sent',
      amount: 300,
      date: '2024-01-13',
      status: 'pending',
    },
  ], []);

  const quickActions = useMemo(() => [
    {
      name: 'Create Expense Pool',
      description: 'Start a new shared expense pool',
      icon: CurrencyDollarIcon,
      href: '/dashboard/expense-pools',
      color: 'primary',
    },
    {
      name: 'Request Loan',
      description: 'Apply for a peer-to-peer loan',
      icon: HandRaisedIcon,
      href: '/dashboard/lending',
      color: 'secondary',
    },
    {
      name: 'Send Remittance',
      description: 'Transfer funds internationally',
      icon: GlobeAltIcon,
      href: '/dashboard/remittances',
      color: 'accent',
    },
    {
      name: 'Apply for Scholarship',
      description: 'Submit scholarship application',
      icon: AcademicCapIcon,
      href: '/dashboard/scholarships',
      color: 'purple',
    },
  ], []);

  const stats = useMemo(() => [
    {
      name: 'Total Balance',
      value: `$${userBalance || '0'}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Credit Score',
      value: '820',
      change: '+45',
      changeType: 'positive',
      icon: ChartBarIcon,
    },
    {
      name: 'Active Loans',
      value: '3',
      change: '-1',
      changeType: 'negative',
      icon: HandRaisedIcon,
    },
    {
      name: 'Expense Pools',
      value: '5',
      change: '+2',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
    },
  ], [userBalance]);

  const handleQuickAction = useCallback((action) => {
    navigate(action.href);
  }, [navigate]);

  const formatCurrency = useCallback((value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value || 0);
  }, []);

  const getStatusColor = useCallback((status) => {
    return status === 'completed' ? 'status-success' : 'status-warning';
  }, []);

  // Show connection error if wallet is not connected
  if (!active) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-accent-500" />
            <div>
              <h2 className="text-xl font-semibold">Wallet Not Connected</h2>
              <p className="text-dark-400">
                Please connect your wallet to access UniFi's features
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
            <p className="text-dark-400">
              Manage your student finances with UniFi's decentralized tools
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-dark-400">Connected as</p>
            <p className="font-mono text-sm">{account}</p>
          </div>
        </div>
      </div>

      {/* Connection Error Alert */}
      {connectionError && (
        <div className="card bg-red-100 border border-red-400">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-800">Connection Error</h3>
              <p className="text-red-700 text-sm">{connectionError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-400">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center mt-1">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpIcon className="w-4 h-4 text-secondary-500" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ml-1 ${
                      stat.changeType === 'positive' ? 'text-secondary-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credit Score Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Credit Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={creditScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Portfolio Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {portfolioData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.name}
              onClick={() => handleQuickAction(action)}
              className="card-hover p-4 text-center group"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center bg-${action.color}-100 group-hover:bg-${action.color}-200 transition-colors`}>
                <action.icon className={`w-6 h-6 text-${action.color}-600`} />
              </div>
              <h4 className="font-semibold mb-1">{action.name}</h4>
              <p className="text-sm text-dark-400">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <button className="btn-outline text-sm">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-dark-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">{transaction.type}</p>
                  <p className="text-sm text-dark-400">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Scenarios */}
      <Scenarios />
    </div>
  );
};

export default Dashboard; 