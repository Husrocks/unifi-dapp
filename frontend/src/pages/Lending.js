import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  HandRaisedIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Scenarios from '../components/Scenarios';

const Lending = () => {
  const { account, library } = useWallet();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [loanForm, setLoanForm] = useState({
    amount: '',
    interestRate: '',
    repaymentDate: '',
    purpose: '',
  });

  const [fundAmount, setFundAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');

  // Mock data - in real app, this would come from smart contracts
  const [loans, setLoans] = useState([
    {
      id: 1,
      borrower: '0x1234...5678',
      lender: null,
      amount: 1500,
      interestRate: 5,
      repaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      borrowedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      isRepaid: false,
      isDefaulted: false,
      purpose: 'Maria\'s Textbook and Supplies Loan',
      status: 'pending',
      scenario: 'International Student Journey',
      creditScore: 720,
    },
    {
      id: 2,
      borrower: '0x8765...4321',
      lender: '0x1111...2222',
      amount: 500,
      interestRate: 5,
      repaymentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      borrowedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      isRepaid: false,
      isDefaulted: false,
      purpose: 'Alex\'s Peer Lending - Lab Equipment',
      status: 'active',
      scenario: 'Domestic Engineering Student',
      creditScore: 780,
    },
    {
      id: 3,
      borrower: '0x3333...4444',
      lender: '0x5555...6666',
      amount: 10000,
      interestRate: 4,
      repaymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      borrowedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
      isRepaid: true,
      isDefaulted: false,
      purpose: 'Sarah\'s Research Emergency Credit Line',
      status: 'repaid',
      scenario: 'Graduate Student Complex Needs',
      creditScore: 820,
    },
    {
      id: 4,
      borrower: '0x7777...8888',
      lender: null,
      amount: 300,
      interestRate: 8,
      repaymentDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
      borrowedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRepaid: false,
      isDefaulted: false,
      purpose: 'Emergency laptop repair',
      status: 'pending',
      scenario: 'General Student Loan',
      creditScore: 650,
    },
  ]);

  const handleRequestLoan = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock transaction - in real app, this would call smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newLoan = {
        id: (loans?.length || 0) + 1,
        borrower: account,
        lender: null,
        amount: parseFloat(loanForm.amount),
        interestRate: parseFloat(loanForm.interestRate),
        repaymentDate: new Date(loanForm.repaymentDate),
        borrowedAt: new Date(),
        isRepaid: false,
        isDefaulted: false,
        purpose: loanForm.purpose,
        status: 'pending',
      };

      setLoans([newLoan, ...loans]);
      setShowRequestModal(false);
      setLoanForm({ amount: '', interestRate: '', repaymentDate: '', purpose: '' });
    } catch (error) {
      console.error('Error requesting loan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundLoan = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock transaction - in real app, this would call smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedLoans = loans.map(loan => {
        if (loan.id === selectedLoan.id) {
          return {
            ...loan,
            lender: account,
            status: 'active',
          };
        }
        return loan;
      });

      setLoans(updatedLoans);
      setShowFundModal(false);
      setSelectedLoan(null);
    } catch (error) {
      console.error('Error funding loan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepayLoan = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock transaction - in real app, this would call smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedLoans = loans.map(loan => {
        if (loan.id === selectedLoan.id) {
          return {
            ...loan,
            isRepaid: true,
            status: 'repaid',
          };
        }
        return loan;
      });

      setLoans(updatedLoans);
      setShowRepayModal(false);
      setSelectedLoan(null);
    } catch (error) {
      console.error('Error repaying loan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (loan) => {
    switch (loan.status) {
      case 'pending': return 'text-yellow-500';
      case 'active': return 'text-blue-500';
      case 'repaid': return 'text-green-500';
      case 'defaulted': return 'text-red-500';
      default: return 'text-dark-400';
    }
  };

  const getStatusIcon = (loan) => {
    switch (loan.status) {
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'active': return <CurrencyDollarIcon className="w-4 h-4" />;
      case 'repaid': return <CheckCircleIcon className="w-4 h-4" />;
      case 'defaulted': return <ExclamationCircleIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const calculateTotalRepayment = (loan) => {
    return loan.amount + (loan.amount * loan.interestRate) / 100;
  };

  const getMyLoans = () => {
    return loans?.filter(loan => loan.borrower === account) || [];
  };

  const getAvailableLoans = () => {
    return loans?.filter(loan => loan.status === 'pending' && loan.borrower !== account) || [];
  };

  return (
    <div className="space-y-6">
      {/* Feature Placeholder */}
      <div className="card bg-accent-100 text-accent-800 text-center">
        <h2 className="text-xl font-bold">Micro-Lending Page</h2>
        <p>This is the Micro-Lending feature. Here you will be able to request and fund peer-to-peer loans. (Demo content below)</p>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Peer-to-Peer Lending</h1>
          <p className="text-dark-400">
            Request loans or fund student loan requests with transparent terms
          </p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <HandRaisedIcon className="w-5 h-5" />
          <span>Request Loan</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <HandRaisedIcon className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {loans?.length || 0}
          </h3>
          <p className="text-dark-400">Total Loans</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ClockIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {loans?.filter(loan => loan.status === 'pending')?.length || 0}
          </h3>
          <p className="text-dark-400">Pending Requests</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {loans?.filter(loan => loan.status === 'active')?.length || 0}
          </h3>
          <p className="text-dark-400">Active Loans</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {loans?.filter(loan => loan.status === 'repaid')?.length || 0}
          </h3>
          <p className="text-dark-400">Repaid Loans</p>
        </div>
      </div>

      {/* My Loans */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">My Loans</h2>
        <div className="space-y-4">
          {getMyLoans().map((loan) => (
            <div key={loan.id} className="border border-dark-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold mb-1">{loan.purpose}</h3>
                  <p className="text-sm text-dark-400">Amount: ${loan.amount} USDT</p>
                  <p className="text-sm text-dark-400">Interest Rate: {loan.interestRate}%</p>
                </div>
                <div className={`flex items-center space-x-1 ${getStatusColor(loan)}`}>
                  {getStatusIcon(loan)}
                  <span className="text-sm font-medium capitalize">{loan.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-dark-400">Total Repayment</p>
                  <p className="font-semibold">${calculateTotalRepayment(loan)}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Due Date</p>
                  <p className="font-semibold">{format(loan.repaymentDate, 'MMM dd')}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Lender</p>
                  <p className="font-mono text-sm">{loan.lender || 'Pending'}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Days Left</p>
                  <p className="font-semibold">
                    {Math.max(0, Math.ceil((loan.repaymentDate - new Date()) / (1000 * 60 * 60 * 24)))}
                  </p>
                </div>
              </div>

              {loan.status === 'active' && (
                <button
                  onClick={() => {
                    setSelectedLoan(loan);
                    setRepayAmount(calculateTotalRepayment(loan).toString());
                    setShowRepayModal(true);
                  }}
                  className="btn-secondary w-full"
                >
                  Repay Loan
                </button>
              )}
            </div>
          ))}
          {(!getMyLoans() || getMyLoans().length === 0) && (
            <p className="text-dark-400 text-center py-8">No loans found</p>
          )}
        </div>
      </div>

      {/* Available Loans */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Available Loans to Fund</h2>
        <div className="space-y-4">
          {getAvailableLoans().map((loan) => (
            <div key={loan.id} className="border border-dark-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold mb-1">{loan.purpose}</h3>
                  <p className="text-sm text-dark-400">Borrower: {loan.borrower}</p>
                  <p className="text-sm text-dark-400">Amount: ${loan.amount} USDT</p>
                  <p className="text-sm text-dark-400">Interest Rate: {loan.interestRate}%</p>
                </div>
                <div className={`flex items-center space-x-1 ${getStatusColor(loan)}`}>
                  {getStatusIcon(loan)}
                  <span className="text-sm font-medium capitalize">{loan.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-dark-400">Total Repayment</p>
                  <p className="font-semibold">${calculateTotalRepayment(loan)}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Due Date</p>
                  <p className="font-semibold">{format(loan.repaymentDate, 'MMM dd')}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Requested</p>
                  <p className="font-semibold">{format(loan.borrowedAt, 'MMM dd')}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Days Left</p>
                  <p className="font-semibold">
                    {Math.max(0, Math.ceil((loan.repaymentDate - new Date()) / (1000 * 60 * 60 * 24)))}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedLoan(loan);
                  setFundAmount(loan.amount.toString());
                  setShowFundModal(true);
                }}
                className="btn-primary w-full"
              >
                Fund This Loan
              </button>
            </div>
          ))}
          {(!getAvailableLoans() || getAvailableLoans().length === 0) && (
            <p className="text-dark-400 text-center py-8">No available loans to fund</p>
          )}
        </div>
      </div>

      {/* Request Loan Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Request Loan</h2>
            <form onSubmit={handleRequestLoan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (USDT)</label>
                <input
                  type="number"
                  value={loanForm.amount}
                  onChange={(e) => setLoanForm({ ...loanForm, amount: e.target.value })}
                  className="input-field w-full"
                  placeholder="500"
                  min="50"
                  max="5000"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
                <input
                  type="number"
                  value={loanForm.interestRate}
                  onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })}
                  className="input-field w-full"
                  placeholder="5"
                  min="1"
                  max="15"
                  step="0.1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Repayment Date</label>
                <input
                  type="date"
                  value={loanForm.repaymentDate}
                  onChange={(e) => setLoanForm({ ...loanForm, repaymentDate: e.target.value })}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Purpose</label>
                <textarea
                  value={loanForm.purpose}
                  onChange={(e) => setLoanForm({ ...loanForm, purpose: e.target.value })}
                  className="input-field w-full"
                  rows="3"
                  placeholder="Describe what you need the loan for"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
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
                    'Request Loan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fund Loan Modal */}
      {showFundModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Fund Loan</h2>
            <div className="mb-4">
              <h3 className="font-semibold">{selectedLoan.purpose}</h3>
              <p className="text-sm text-dark-400">
                Amount: ${selectedLoan.amount} | Interest: {selectedLoan.interestRate}%
              </p>
              <p className="text-sm text-dark-400">
                Total Repayment: ${calculateTotalRepayment(selectedLoan)}
              </p>
            </div>
            <form onSubmit={handleFundLoan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Funding Amount (USDT)</label>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="input-field w-full"
                  placeholder={selectedLoan.amount.toString()}
                  min="1"
                  max={selectedLoan.amount}
                  step="0.01"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFundModal(false)}
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
                    'Fund Loan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Repay Loan Modal */}
      {showRepayModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Repay Loan</h2>
            <div className="mb-4">
              <h3 className="font-semibold">{selectedLoan.purpose}</h3>
              <p className="text-sm text-dark-400">
                Original Amount: ${selectedLoan.amount} | Interest: {selectedLoan.interestRate}%
              </p>
              <p className="text-sm text-dark-400">
                Total Due: ${calculateTotalRepayment(selectedLoan)}
              </p>
            </div>
            <form onSubmit={handleRepayLoan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Repayment Amount (USDT)</label>
                <input
                  type="number"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="input-field w-full"
                  placeholder={calculateTotalRepayment(selectedLoan).toString()}
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRepayModal(false)}
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
                    'Repay Loan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sample Scenarios */}
      <Scenarios title="Real-World Lending Examples" />
    </div>
  );
};

export default Lending; 