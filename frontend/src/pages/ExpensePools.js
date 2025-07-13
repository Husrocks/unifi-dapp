import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  PlusIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Scenarios from '../components/Scenarios';

const ExpensePools = () => {
  const { account, library } = useWallet();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [poolForm, setPoolForm] = useState({
    name: '',
    description: '',
    targetAmount: '',
    deadline: '',
  });

  const [contributionAmount, setContributionAmount] = useState('');

  // Mock data - in real app, this would come from smart contracts
  const [expensePools, setExpensePools] = useState([
    {
      id: 1,
      name: 'Maria\'s International Student Housing',
      description: 'Monthly rent and utilities for international students - reduced costs through shared expenses',
      creator: '0x1234...5678',
      targetAmount: 2000,
      currentAmount: 1800,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      contributorsCount: 5,
      isActive: true,
      scenario: 'International Student Journey',
      savings: '$400/month',
      contributors: [
        { address: '0x1234...5678', amount: 400 },
        { address: '0x8765...4321', amount: 400 },
        { address: '0x1111...2222', amount: 400 },
        { address: '0x3333...4444', amount: 400 },
        { address: '0x5555...6666', amount: 200 },
      ],
    },
    {
      id: 2,
      name: 'Alex\'s Engineering Lab Equipment',
      description: 'Shared laboratory equipment and materials for Electrical Engineering projects',
      creator: '0x8765...4321',
      targetAmount: 3000,
      currentAmount: 2400,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      contributorsCount: 8,
      isActive: true,
      scenario: 'Domestic Engineering Student',
      savings: '$1,200/semester',
      contributors: [
        { address: '0x8765...4321', amount: 400 },
        { address: '0x1111...2222', amount: 300 },
        { address: '0x3333...4444', amount: 300 },
        { address: '0x7777...8888', amount: 300 },
        { address: '0x9999...0000', amount: 300 },
        { address: '0xaaaa...bbbb', amount: 200 },
        { address: '0xcccc...dddd', amount: 200 },
        { address: '0xeeee...ffff', amount: 200 },
      ],
    },
    {
      id: 3,
      name: 'Sarah\'s International Research Collaboration',
      description: 'Joint research funding pool for international academic collaborations',
      creator: '0x1111...2222',
      targetAmount: 5000,
      currentAmount: 3800,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      contributorsCount: 12,
      isActive: true,
      scenario: 'Graduate Student Complex Needs',
      savings: '$2,500/year',
      contributors: [
        { address: '0x1111...2222', amount: 500 },
        { address: '0x3333...4444', amount: 400 },
        { address: '0x7777...8888', amount: 300 },
        { address: '0x9999...0000', amount: 300 },
        { address: '0xaaaa...bbbb', amount: 300 },
        { address: '0xcccc...dddd', amount: 300 },
        { address: '0xeeee...ffff', amount: 300 },
        { address: '0x1111...3333', amount: 200 },
        { address: '0x4444...5555', amount: 200 },
        { address: '0x6666...7777', amount: 200 },
        { address: '0x8888...9999', amount: 200 },
        { address: '0xaaaa...cccc', amount: 200 },
      ],
    },
    {
      id: 4,
      name: 'Textbook Fund',
      description: 'Shared textbook costs for Computer Science courses',
      creator: '0x3333...4444',
      targetAmount: 800,
      currentAmount: 800,
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      contributorsCount: 3,
      isActive: false,
      scenario: 'General Student Pool',
      savings: '$200/semester',
      contributors: [
        { address: '0x8765...4321', amount: 300 },
        { address: '0x1111...2222', amount: 250 },
        { address: '0x3333...4444', amount: 250 },
      ],
    },
  ]);

  const handleCreatePool = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock transaction - in real app, this would call smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newPool = {
        id: (expensePools?.length || 0) + 1,
        name: poolForm.name,
        description: poolForm.description,
        creator: account,
        targetAmount: parseFloat(poolForm.targetAmount),
        currentAmount: 0,
        deadline: new Date(poolForm.deadline),
        contributorsCount: 0,
        isActive: true,
        contributors: [],
      };

      setExpensePools([newPool, ...expensePools]);
      setShowCreateModal(false);
      setPoolForm({ name: '', description: '', targetAmount: '', deadline: '' });
    } catch (error) {
      console.error('Error creating pool:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock transaction - in real app, this would call smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedPools = expensePools.map(pool => {
        if (pool.id === selectedPool.id) {
          return {
            ...pool,
            currentAmount: pool.currentAmount + parseFloat(contributionAmount),
            contributorsCount: pool.contributorsCount + 1,
          };
        }
        return pool;
      });

      setExpensePools(updatedPools);
      setShowContributeModal(false);
      setContributionAmount('');
      setSelectedPool(null);
    } catch (error) {
      console.error('Error contributing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (pool) => {
    if (!pool.isActive) return 'text-green-500';
    if (pool.currentAmount >= pool.targetAmount) return 'text-green-500';
    if (new Date() > pool.deadline) return 'text-red-500';
    return 'text-yellow-500';
  };

  const getStatusText = (pool) => {
    if (!pool.isActive) return 'Completed';
    if (pool.currentAmount >= pool.targetAmount) return 'Funded';
    if (new Date() > pool.deadline) return 'Expired';
    return 'Active';
  };

  return (
    <div className="space-y-6">
      {/* Feature Placeholder */}
      <div className="card bg-accent-100 text-accent-800 text-center">
        <h2 className="text-xl font-bold">Expense Pools Page</h2>
        <p>This is the Expense Pools feature. Here you will be able to create and manage shared expense pools. (Demo content below)</p>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Expense Pools</h1>
          <p className="text-dark-400">
            Create and manage shared expense pools with transparent tracking
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Create Pool</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CurrencyDollarIcon className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {expensePools?.length || 0}
          </h3>
          <p className="text-dark-400">Total Pools</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserGroupIcon className="w-6 h-6 text-secondary-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {expensePools?.reduce((sum, pool) => sum + pool.contributorsCount, 0) || 0}
          </h3>
          <p className="text-dark-400">Total Contributors</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-6 h-6 text-accent-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {expensePools?.filter(pool => !pool.isActive)?.length || 0}
          </h3>
          <p className="text-dark-400">Completed Pools</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ClockIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {expensePools?.filter(pool => pool.isActive && new Date() < pool.deadline)?.length || 0}
          </h3>
          <p className="text-dark-400">Active Pools</p>
        </div>
      </div>

      {/* Pools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {expensePools?.map((pool) => (
          <div key={pool.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{pool.name}</h3>
                <p className="text-dark-400 text-sm mb-2">{pool.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-dark-400">Created by:</span>
                  <span className="font-mono">{pool.creator}</span>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${getStatusColor(pool)}`}>
                {getStatusText(pool) === 'Completed' && <CheckCircleIcon className="w-4 h-4" />}
                {getStatusText(pool) === 'Expired' && <ExclamationCircleIcon className="w-4 h-4" />}
                <span className="text-sm font-medium">{getStatusText(pool)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{getProgressPercentage(pool.currentAmount, pool.targetAmount).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(pool.currentAmount, pool.targetAmount)}%` }}
                />
              </div>
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-dark-400">Target Amount</p>
                <p className="text-lg font-semibold">${pool.targetAmount}</p>
              </div>
              <div>
                <p className="text-sm text-dark-400">Current Amount</p>
                <p className="text-lg font-semibold">${pool.currentAmount}</p>
              </div>
            </div>

            {/* Contributors */}
            <div className="mb-4">
              <p className="text-sm text-dark-400 mb-2">Contributors ({pool.contributorsCount || pool.contributors?.length || 0})</p>
              <div className="space-y-1">
                {pool.contributors?.slice(0, 3)?.map((contributor, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="font-mono">{contributor.address}</span>
                    <span>${contributor.amount}</span>
                  </div>
                ))}
                {pool.contributors?.length > 3 && (
                  <p className="text-xs text-dark-400">+{(pool.contributors.length - 3)} more</p>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4 text-dark-400" />
                <span className="text-sm text-dark-400">Deadline</span>
              </div>
              <span className="text-sm font-medium">
                {format(pool.deadline, 'MMM dd, yyyy')}
              </span>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              {pool.isActive && pool.currentAmount < pool.targetAmount && (
                <button
                  onClick={() => {
                    setSelectedPool(pool);
                    setShowContributeModal(true);
                  }}
                  className="btn-primary flex-1"
                >
                  Contribute
                </button>
              )}
              {!pool.isActive && pool.currentAmount >= pool.targetAmount && (
                <button className="btn-secondary flex-1">
                  Withdraw
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Pool Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Expense Pool</h2>
            <form onSubmit={handleCreatePool} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pool Name</label>
                <input
                  type="text"
                  value={poolForm.name}
                  onChange={(e) => setPoolForm({ ...poolForm, name: e.target.value })}
                  className="input-field w-full"
                  placeholder="e.g., Apartment Rent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={poolForm.description}
                  onChange={(e) => setPoolForm({ ...poolForm, description: e.target.value })}
                  className="input-field w-full"
                  rows="3"
                  placeholder="Describe the expense and how it will be used"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Amount (USDT)</label>
                <input
                  type="number"
                  value={poolForm.targetAmount}
                  onChange={(e) => setPoolForm({ ...poolForm, targetAmount: e.target.value })}
                  className="input-field w-full"
                  placeholder="1000"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <input
                  type="datetime-local"
                  value={poolForm.deadline}
                  onChange={(e) => setPoolForm({ ...poolForm, deadline: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex-1"
                >
                  {isLoading ? (
                    <div className="spinner" />
                  ) : (
                    'Create Pool'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {showContributeModal && selectedPool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Contribute to Pool</h2>
            <div className="mb-4">
              <h3 className="font-semibold">{selectedPool.name}</h3>
              <p className="text-sm text-dark-400">
                Target: ${selectedPool.targetAmount} | Current: ${selectedPool.currentAmount}
              </p>
            </div>
            <form onSubmit={handleContribute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (USDT)</label>
                <input
                  type="number"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="input-field w-full"
                  placeholder="100"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContributeModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex-1"
                >
                  {isLoading ? (
                    <div className="spinner" />
                  ) : (
                    'Contribute'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sample Scenarios */}
      <Scenarios title="Real-World Expense Pool Examples" />
    </div>
  );
};

export default ExpensePools; 