import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import {
  HomeIcon,
  CurrencyDollarIcon,
  HandRaisedIcon,
  GlobeAltIcon,
  ChartBarIcon,
  AcademicCapIcon,
  IdentificationIcon,
  Bars3Icon,
  XMarkIcon,
  WalletIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';

const Layout = () => {
  const { account, disconnect, userBalance, networkName } = useWallet();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Expense Pools', href: '/dashboard/expense-pools', icon: CurrencyDollarIcon },
    { name: 'Lending', href: '/dashboard/lending', icon: HandRaisedIcon },
    { name: 'Remittances', href: '/dashboard/remittances', icon: GlobeAltIcon },
    { name: 'Credit Score', href: '/dashboard/credit-score', icon: ChartBarIcon },
    { name: 'Scholarships', href: '/dashboard/scholarships', icon: AcademicCapIcon },
    { name: 'Identity', href: '/dashboard/identity', icon: IdentificationIcon },
  ];

  const handleDisconnect = () => {
    disconnect();
    navigate('/');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add logic to persist theme preference
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const formatAddress = (address) => {
    if (!address) return 'Not connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`} style={{ fontFamily: 'Inter, Roboto, "SF Pro", Arial, sans-serif' }}>
      {/* Top Navbar */}
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
        <div className="md:hidden flex items-center">
          <button onClick={() => setSidebarOpen(true)} className="text-dark-300 hover:text-white transition-colors p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <Bars3Icon className="w-7 h-7" />
          </button>
        </div>
      </nav>
      {/* Add padding to push content below navbar */}
      <div className="pt-20">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-dark-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-dark-800 border-r border-dark-700">
            <div className="flex items-center justify-between p-4 border-b border-dark-700">
              <Link to="/" className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">UniFi</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-dark-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <nav className="mt-4 px-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-dark-300 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-dark-800 border-r border-dark-700">
            <div className="flex items-center p-4 border-b border-dark-700">
              <Link to="/" className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">UniFi</span>
              </Link>
            </div>
            <nav className="mt-4 px-4 flex-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-dark-300 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Header */}
          <header className="bg-dark-800 border-b border-dark-700">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-dark-400 hover:text-white mr-4"
                >
                  <Bars3Icon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Theme toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
                >
                  {isDarkMode ? (
                    <SunIcon className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <MoonIcon className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {/* Network info */}
                <div className="hidden md:flex items-center space-x-2 text-sm">
                  <span className="text-dark-400">Network:</span>
                  <span className="status-info">{networkName || 'Unknown'}</span>
                </div>

                {/* Balance */}
                <div className="hidden md:flex items-center space-x-2 text-sm">
                  <span className="text-dark-400">Balance:</span>
                  <span className="text-white font-medium">{userBalance || '0'} ETH</span>
                </div>

                {/* Wallet info */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-dark-700 rounded-lg px-3 py-2">
                    <WalletIcon className="w-4 h-4 text-primary-500" />
                    <span className="text-sm font-mono text-dark-300">
                      {formatAddress(account)}
                    </span>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="btn-outline text-sm py-1 px-3"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout; 