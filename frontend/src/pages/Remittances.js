import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  GlobeAltIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Scenarios from '../components/Scenarios';

const Remittances = () => {
  const { account, library } = useWallet();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedRemittance, setSelectedRemittance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [remittanceForm, setRemittanceForm] = useState({
    recipient: '',
    amount: '',
    currency: 'USD',
    message: '',
  });

  // Mock data - in real app, this would come from smart contracts
  const [remittances, setRemittances] = useState([
    {
      id: 1,
      sender: '0x1234...5678',
      recipient: '0x8765...4321',
      amount: 300,
      currency: 'USD',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isProcessed: true,
      message: 'Maria\'s family support - Colombia',
      status: 'completed',
      exchangeRate: 1.0,
      fees: 2,
      scenario: 'International Student Journey',
      savings: '80% lower fees',
    },
    {
      id: 2,
      sender: '0x8765...4321',
      recipient: '0x1111...2222',
      amount: 500,
      currency: 'EUR',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      isProcessed: false,
      message: 'Alex\'s research collaboration - Germany',
      status: 'pending',
      exchangeRate: 0.85,
      fees: 3,
      scenario: 'Domestic Engineering Student',
      savings: '75% lower fees',
    },
    {
      id: 3,
      sender: '0x3333...4444',
      recipient: '0x5555...6666',
      amount: 2500,
      currency: 'GBP',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      isProcessed: true,
      message: 'Sarah\'s international conference funding - UK',
      status: 'completed',
      exchangeRate: 0.73,
      fees: 8,
      scenario: 'Graduate Student Complex Needs',
      savings: '85% lower fees',
    },
  ]);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  ];

  const handleSendRemittance = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock transaction - in real app, this would call smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newRemittance = {
        id: (remittances?.length || 0) + 1,
        sender: account,
        recipient: remittanceForm.recipient,
        amount: parseFloat(remittanceForm.amount),
        currency: remittanceForm.currency,
        timestamp: new Date(),
        isProcessed: false,
        message: remittanceForm.message,
        status: 'pending',
        exchangeRate: 1.0, // Mock exchange rate
        fees: Math.floor(Math.random() * 10) + 1, // Mock fees
      };

      setRemittances([newRemittance, ...remittances]);
      setShowSendModal(false);
      setRemittanceForm({ recipient: '', amount: '', currency: 'USD', message: '' });
    } catch (error) {
      console.error('Error sending remittance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessRemittance = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock transaction - in real app, this would call smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedRemittances = remittances.map(remittance => {
        if (remittance.id === selectedRemittance.id) {
          return {
            ...remittance,
            isProcessed: true,
            status: 'completed',
          };
        }
        return remittance;
      });

      setRemittances(updatedRemittances);
      setShowProcessModal(false);
      setSelectedRemittance(null);
    } catch (error) {
      console.error('Error processing remittance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'completed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      default: return 'text-dark-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'failed': return <ExclamationCircleIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const getMyRemittances = () => {
    return remittances?.filter(remittance => remittance.sender === account) || [];
  };

  const getIncomingRemittances = () => {
    return remittances?.filter(remittance => remittance.recipient === account && !remittance.isProcessed) || [];
  };

  const calculateTotalAmount = (remittance) => {
    return remittance.amount + remittance.fees;
  };

  return (
    <div className="space-y-6">
      {/* Feature Placeholder */}
      <div className="card bg-accent-100 text-accent-800 text-center">
        <h2 className="text-xl font-bold">Remittances Page</h2>
        <p>This is the Global Remittances feature. Here you will be able to send and receive international transfers. (Demo content below)</p>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">International Remittances</h1>
          <p className="text-dark-400">
            Send and receive international transfers with low fees and real-time tracking
          </p>
        </div>
        <button
          onClick={() => setShowSendModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <GlobeAltIcon className="w-5 h-5" />
          <span>Send Remittance</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ArrowUpIcon className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            ${remittances?.filter(r => r.sender === account)?.reduce((sum, r) => sum + r.amount, 0) || 0}
          </h3>
          <p className="text-dark-400">Total Sent</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ArrowDownIcon className="w-6 h-6 text-secondary-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            ${remittances?.filter(r => r.recipient === account)?.reduce((sum, r) => sum + r.amount, 0) || 0}
          </h3>
          <p className="text-dark-400">Total Received</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CurrencyDollarIcon className="w-6 h-6 text-accent-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            ${remittances?.reduce((sum, r) => sum + r.fees, 0) || 0}
          </h3>
          <p className="text-dark-400">Total Fees</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <GlobeAltIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {remittances?.length || 0}
          </h3>
          <p className="text-dark-400">Total Transactions</p>
        </div>
      </div>

      {/* Outgoing Remittances */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Outgoing Remittances</h2>
        <div className="space-y-4">
          {getMyRemittances().map((remittance) => (
            <div key={remittance.id} className="border border-dark-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <ArrowUpIcon className="w-4 h-4 text-red-500" />
                    <h3 className="font-semibold">Sent to {remittance.recipient}</h3>
                  </div>
                  <p className="text-sm text-dark-400">{remittance.message}</p>
                </div>
                <div className={`flex items-center space-x-1 ${getStatusColor(remittance.status)}`}>
                  {getStatusIcon(remittance.status)}
                  <span className="text-sm font-medium capitalize">{remittance.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-dark-400">Amount</p>
                  <p className="font-semibold">
                    {currencies.find(c => c.code === remittance.currency)?.symbol}{remittance.amount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Fees</p>
                  <p className="font-semibold">${remittance.fees}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Exchange Rate</p>
                  <p className="font-semibold">{remittance.exchangeRate}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Date</p>
                  <p className="font-semibold">{format(remittance.timestamp, 'MMM dd')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">
                  Total: ${calculateTotalAmount(remittance)}
                </span>
                <span className="text-xs text-dark-400">
                  {format(remittance.timestamp, 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
            </div>
          ))}
          {(!getMyRemittances() || getMyRemittances().length === 0) && (
            <p className="text-dark-400 text-center py-8">No outgoing remittances found</p>
          )}
        </div>
      </div>

      {/* Incoming Remittances */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Incoming Remittances</h2>
        <div className="space-y-4">
          {getIncomingRemittances().map((remittance) => (
            <div key={remittance.id} className="border border-dark-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <ArrowDownIcon className="w-4 h-4 text-green-500" />
                    <h3 className="font-semibold">From {remittance.sender}</h3>
                  </div>
                  <p className="text-sm text-dark-400">{remittance.message}</p>
                </div>
                <div className={`flex items-center space-x-1 ${getStatusColor(remittance.status)}`}>
                  {getStatusIcon(remittance.status)}
                  <span className="text-sm font-medium capitalize">{remittance.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-dark-400">Amount</p>
                  <p className="font-semibold">
                    {currencies.find(c => c.code === remittance.currency)?.symbol}{remittance.amount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Fees</p>
                  <p className="font-semibold">${remittance.fees}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Exchange Rate</p>
                  <p className="font-semibold">{remittance.exchangeRate}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Date</p>
                  <p className="font-semibold">{format(remittance.timestamp, 'MMM dd')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">
                  Total: ${calculateTotalAmount(remittance)}
                </span>
                <button
                  onClick={() => {
                    setSelectedRemittance(remittance);
                    setShowProcessModal(true);
                  }}
                  className="btn-secondary text-sm"
                >
                  Process Remittance
                </button>
              </div>
            </div>
          ))}
          {(!getIncomingRemittances() || getIncomingRemittances().length === 0) && (
            <p className="text-dark-400 text-center py-8">No incoming remittances found</p>
          )}
        </div>
      </div>

      {/* Send Remittance Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4">Send Remittance</h2>
            <form onSubmit={handleSendRemittance} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Address</label>
                <input
                  type="text"
                  value={remittanceForm.recipient}
                  onChange={(e) => setRemittanceForm({ ...remittanceForm, recipient: e.target.value })}
                  className="input-field w-full"
                  placeholder="0x..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={remittanceForm.amount}
                  onChange={(e) => setRemittanceForm({ ...remittanceForm, amount: e.target.value })}
                  className="input-field w-full"
                  placeholder="100"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select
                  value={remittanceForm.currency}
                  onChange={(e) => setRemittanceForm({ ...remittanceForm, currency: e.target.value })}
                  className="input-field w-full"
                  required
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                <textarea
                  value={remittanceForm.message}
                  onChange={(e) => setRemittanceForm({ ...remittanceForm, message: e.target.value })}
                  className="input-field w-full"
                  rows="3"
                  placeholder="Add a message for the recipient"
                />
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Estimated Fee:</span>
                  <span>$3-8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Processing Time:</span>
                  <span>1-3 minutes</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
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
                    'Send Remittance'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Process Remittance Modal */}
      {showProcessModal && selectedRemittance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4">Process Remittance</h2>
            <div className="mb-4">
              <h3 className="font-semibold">From {selectedRemittance.sender}</h3>
              <p className="text-sm text-dark-400 mb-2">{selectedRemittance.message}</p>
              <div className="bg-dark-700 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>
                    {currencies.find(c => c.code === selectedRemittance.currency)?.symbol}{selectedRemittance.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fees:</span>
                  <span>${selectedRemittance.fees}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${calculateTotalAmount(selectedRemittance)}</span>
                </div>
              </div>
            </div>
            <form onSubmit={handleProcessRemittance} className="space-y-4">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowProcessModal(false)}
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
                    'Process Remittance'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sample Scenarios */}
      <Scenarios title="Real-World Remittance Examples" />
    </div>
  );
};

export default Remittances; 