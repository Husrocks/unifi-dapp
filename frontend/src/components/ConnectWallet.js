import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { WalletIcon, ShieldCheckIcon, AcademicCapIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import WalletButton from './WalletButton';
import Layout from './Layout';

const ConnectWallet = () => {
  const { active, connectMetaMask, connectWalletConnect, isConnecting, account } = useWallet();
  const [connectionError, setConnectionError] = useState(null);
  const navigate = useNavigate();

  const handleMetaMaskConnect = async () => {
    try {
      setConnectionError(null);
      await connectMetaMask();
    } catch (error) {
      console.error('MetaMask connection error:', error);
      setConnectionError('Failed to connect MetaMask. Please make sure MetaMask is installed and unlocked.');
    }
  };

  const handleWalletConnect = async () => {
    try {
      setConnectionError(null);
      await connectWalletConnect();
    } catch (error) {
      console.error('WalletConnect connection error:', error);
      setConnectionError('Failed to connect WalletConnect. Please try again.');
    }
  };

  const features = [
    {
      icon: CurrencyDollarIcon,
      title: 'Expense Sharing',
      description: 'Create and manage shared expense pools with transparent tracking',
      color: 'primary',
      route: '/dashboard/expense-pools',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Micro-Lending',
      description: 'Access peer-to-peer loans with on-chain credit scoring',
      color: 'secondary',
      route: '/dashboard/lending',
    },
    {
      icon: AcademicCapIcon,
      title: 'Scholarships',
      description: 'Decentralized scholarship funding through community governance',
      color: 'accent',
      route: '/dashboard/scholarships',
    },
    {
      icon: WalletIcon,
      title: 'Global Remittances',
      description: 'Seamless international financial transfers with low fees',
      color: 'purple',
      route: '/dashboard/remittances',
    }
  ];

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Top Navbar only for homepage */}
      <nav className="w-full bg-dark-900 shadow-lg shadow-dark-900/10 border-b border-dark-700 px-6 py-3 flex items-center justify-between z-50 fixed top-0 left-0 right-0 transition-all duration-300">
        <Link to="/" className="flex items-center space-x-3 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-md">
            <AcademicCapIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm select-none" style={{ letterSpacing: '-0.02em' }}>UniFi</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/dashboard/expense-pools" className="nav-link">Expense Pools</Link>
          <Link to="/dashboard/lending" className="nav-link">Lending</Link>
          <Link to="/dashboard/remittances" className="nav-link">Remittances</Link>
          <Link to="/dashboard/scholarships" className="nav-link">Scholarships</Link>
          <Link to="/dashboard/credit-score" className="nav-link">Credit Score</Link>
          <Link to="/dashboard/identity" className="nav-link">Identity</Link>
        </div>
      </nav>
      <div className="min-h-screen flex items-center justify-center p-4 pt-24">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow">
                  <AcademicCapIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                  <CurrencyDollarIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 gradient-text">
              UniFi
            </h1>
            <p className="text-xl text-dark-300 mb-2">
              Decentralized Finance for Students
            </p>
            <p className="text-dark-400 max-w-2xl mx-auto">
              Empowering students with trustless, transparent financial tools including expense sharing, 
              micro-lending, international remittances, and scholarship funding.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`card text-center cursor-pointer transition-transform hover:scale-105 hover:shadow-glow border-2 border-transparent hover:border-${feature.color}-500`}
                onClick={() => handleFeatureClick(feature.route)}
                tabIndex={0}
                role="button"
                onKeyPress={e => { if (e.key === 'Enter') handleFeatureClick(feature.route); }}
              >
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Connect Wallet Section */}
          <div className="max-w-md mx-auto">
            <div className="card">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
                <p className="text-dark-400">
                  Choose your preferred wallet to access UniFi's DeFi features
                </p>
              </div>

              {/* Error Display */}
              {connectionError && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <p className="text-sm">{connectionError}</p>
                </div>
              )}

              <div className="space-y-4">
                <WalletButton
                  onClick={handleMetaMaskConnect}
                  isLoading={isConnecting}
                  isConnected={active && account}
                  account={account}
                  error={connectionError}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <span>Connect MetaMask</span>
                </WalletButton>

                <WalletButton
                  onClick={handleWalletConnect}
                  isLoading={isConnecting}
                  isConnected={active && account}
                  account={account}
                  error={connectionError}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">WC</span>
                  </div>
                  <span>Connect WalletConnect</span>
                </WalletButton>
              </div>

              <div className="mt-6 p-4 bg-dark-800 rounded-lg">
                <h3 className="text-sm font-semibold mb-2 text-dark-300">Supported Networks</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="status-success">Ethereum</span>
                  <span className="status-success">Polygon</span>
                  <span className="status-info">Sepolia</span>
                  <span className="status-info">Mumbai</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-dark-400 text-sm">
              By connecting your wallet, you agree to our{' '}
              <button className="text-primary-500 hover:text-primary-400 underline bg-transparent border-none p-0 cursor-pointer">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-primary-500 hover:text-primary-400 underline bg-transparent border-none p-0 cursor-pointer">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet; 