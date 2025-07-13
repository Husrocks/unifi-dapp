import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  HandRaisedIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const CreditScore = () => {
  const { account } = useWallet();
  const [selectedTimeframe, setSelectedTimeframe] = useState('6m');

  // Mock credit profile data
  const creditProfile = {
    creditScore: 820,
    totalBorrowed: 2500,
    totalRepaid: 2500,
    activeLoans: 0,
    completedLoans: 3,
    defaultedLoans: 0,
    lastActivity: new Date(),
    scoreChange: 45,
    scoreTrend: 'up',
  };

  // Mock credit score history
  const creditHistory = [
    { month: 'Jan', score: 650 },
    { month: 'Feb', score: 680 },
    { month: 'Mar', score: 720 },
    { month: 'Apr', score: 750 },
    { month: 'May', score: 780 },
    { month: 'Jun', score: 820 },
  ];

  // Mock loan history
  const loanHistory = [
    {
      id: 1,
      amount: 500,
      purpose: 'Textbook Purchase',
      status: 'completed',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      repaid: true,
    },
    {
      id: 2,
      amount: 800,
      purpose: 'Laptop Repair',
      status: 'completed',
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      repaid: true,
    },
    {
      id: 3,
      amount: 1200,
      purpose: 'Summer Internship Relocation',
      status: 'completed',
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      repaid: true,
    },
  ];

  // Mock factors affecting credit score
  const creditFactors = [
    { factor: 'Payment History', impact: 'positive', points: 25, description: 'All loans repaid on time' },
    { factor: 'Credit Utilization', impact: 'positive', points: 20, description: 'Low credit utilization ratio' },
    { factor: 'Loan Diversity', impact: 'positive', points: 15, description: 'Varied loan purposes' },
    { factor: 'Account Age', impact: 'neutral', points: 10, description: '6 months of credit history' },
    { factor: 'Recent Inquiries', impact: 'negative', points: -5, description: '2 loan applications this month' },
  ];

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-green-500';
    if (score >= 650) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  const getScoreDescription = (score) => {
    if (score >= 750) return 'You have excellent credit and qualify for the best loan terms.';
    if (score >= 650) return 'You have good credit and qualify for most loan products.';
    if (score >= 550) return 'You have fair credit and may face some restrictions.';
    return 'You have poor credit and may need to improve your score before borrowing.';
  };

  return (
    <div className="space-y-6">
      {/* Feature Placeholder */}
      <div className="card bg-accent-100 text-accent-800 text-center">
        <h2 className="text-xl font-bold">Credit Score Page</h2>
        <p>This is the Credit Score feature. Here you will be able to track your blockchain-based credit history. (Demo content below)</p>
      </div>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Credit Score</h1>
        <p className="text-dark-400">
          Track your financial reputation and credit history on the blockchain
        </p>
      </div>

      {/* Credit Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Credit Score Card */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-1">Your Credit Score</h2>
              <p className="text-dark-400 text-sm">Updated in real-time</p>
            </div>
            <div className="flex items-center space-x-2">
              {creditProfile.scoreTrend === 'up' ? (
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
              ) : (
                <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />
              )}
              <span className={`text-sm font-medium ${creditProfile.scoreTrend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                +{creditProfile.scoreChange}
              </span>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(creditProfile.creditScore)}`}>
              {creditProfile.creditScore}
            </div>
            <div className="text-lg font-semibold mb-2">{getScoreLabel(creditProfile.creditScore)}</div>
            <p className="text-dark-400">{getScoreDescription(creditProfile.creditScore)}</p>
          </div>

          {/* Credit Score Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={creditHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={[600, 850]} />
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
        </div>

        {/* Credit Stats */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Credit Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-dark-400">Total Borrowed</span>
                <span className="font-semibold">${creditProfile.totalBorrowed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Total Repaid</span>
                <span className="font-semibold">${creditProfile.totalRepaid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Active Loans</span>
                <span className="font-semibold">{creditProfile.activeLoans}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Completed Loans</span>
                <span className="font-semibold">{creditProfile.completedLoans}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Defaulted Loans</span>
                <span className="font-semibold">{creditProfile.defaultedLoans}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Credit Score Range</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Excellent (750-850)</span>
                <div className="w-16 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Good (650-749)</span>
                <div className="w-16 h-2 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Fair (550-649)</span>
                <div className="w-16 h-2 bg-orange-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Poor (300-549)</span>
                <div className="w-16 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Factors */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Factors Affecting Your Score</h2>
        <div className="space-y-3">
          {creditFactors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div className="flex items-center space-x-3">
                {factor.impact === 'positive' && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                {factor.impact === 'negative' && <ExclamationCircleIcon className="w-5 h-5 text-red-500" />}
                {factor.impact === 'neutral' && <ClockIcon className="w-5 h-5 text-yellow-500" />}
                <div>
                  <p className="font-medium">{factor.factor}</p>
                  <p className="text-sm text-dark-400">{factor.description}</p>
                </div>
              </div>
              <div className={`font-semibold ${factor.impact === 'positive' ? 'text-green-500' : factor.impact === 'negative' ? 'text-red-500' : 'text-yellow-500'}`}>
                {factor.points > 0 ? '+' : ''}{factor.points}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loan History */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Loan History</h2>
        <div className="space-y-4">
          {loanHistory.map((loan) => (
            <div key={loan.id} className="border border-dark-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold mb-1">{loan.purpose}</h3>
                  <p className="text-sm text-dark-400">Amount: ${loan.amount}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-500">Completed</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-dark-400">Amount</p>
                  <p className="font-semibold">${loan.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Status</p>
                  <p className="font-semibold text-green-500">Repaid</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Date</p>
                  <p className="font-semibold">{loan.date.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Impact</p>
                  <p className="font-semibold text-green-500">+25 points</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Score Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">How to Improve Your Score</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Repay loans on time</p>
                <p className="text-sm text-dark-400">Timely payments are the most important factor</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Keep credit utilization low</p>
                <p className="text-sm text-dark-400">Don't borrow more than you can afford</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Build credit history</p>
                <p className="text-sm text-dark-400">Longer credit history improves your score</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Score Benefits</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CurrencyDollarIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Lower interest rates</p>
                <p className="text-sm text-dark-400">Better scores mean better loan terms</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <HandRaisedIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Higher loan limits</p>
                <p className="text-sm text-dark-400">Access to larger loan amounts</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <ChartBarIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Faster approval</p>
                <p className="text-sm text-dark-400">Quick loan processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScore; 