import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Expense Pools', href: '/dashboard/expense-pools', icon: CurrencyDollarIcon },
    { name: 'Lending', href: '/dashboard/lending', icon: HandRaisedIcon },
    { name: 'Remittances', href: '/dashboard/remittances', icon: GlobeAltIcon },
    { name: 'Scholarships', href: '/dashboard/scholarships', icon: AcademicCapIcon },
    { name: 'Credit Score', href: '/dashboard/credit-score', icon: ChartBarIcon },
    { name: 'Identity', href: '/dashboard/identity', icon: IdentificationIcon },
  ];

  const handleDisconnect = () => {
    disconnect();
    navigate('/');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
    // In a real app, you would toggle a 'dark' class on the HTML element here
  };

  const formatAddress = (address) => {
    if (!address) return 'Not connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDarkMode ? 'bg-dark-900 text-white' : 'bg-gray-50 text-gray-900'}`} style={{ fontFamily: 'Inter, Roboto, "SF Pro", Arial, sans-serif' }}>
      
      {/* 🌟 Top Animated Navbar 🌟 */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled 
            ? isDarkMode ? 'bg-dark-900/80 backdrop-blur-lg shadow-lg shadow-black/20 border-b border-white/10' : 'bg-white/80 backdrop-blur-lg shadow-lg shadow-gray-200/50 border-b border-gray-200'
            : 'bg-transparent pt-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center ${scrolled ? 'h-16' : 'h-20'} transition-all duration-300`}>
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div 
                  whileHover={{ rotate: 180, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
                >
                  <AcademicCapIcon className="w-6 h-6 text-white" />
                </motion.div>
                <span className={`text-2xl font-extrabold tracking-tight select-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ letterSpacing: '-0.02em' }}>
                  UniFi
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex md:items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="relative px-3 py-2 rounded-lg text-sm font-medium transition-colors group"
                  >
                    <span className={`relative z-10 flex items-center space-x-2 ${
                      isActive 
                        ? (isDarkMode ? 'text-white' : 'text-blue-700') 
                        : (isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-blue-600')
                    }`}>
                      <item.icon className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                      <span>{item.name}</span>
                    </span>
                    
                    {/* Active Tab Indicator (Framer Motion) */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className={`absolute inset-0 rounded-lg ${isDarkMode ? 'bg-white/10' : 'bg-blue-50'}`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              >
                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </motion.button>

              {/* Wallet Info Pill */}
              {account && (
                <div className={`flex items-center p-1 rounded-full border ${isDarkMode ? 'border-white/10 bg-dark-800/50' : 'border-gray-200 bg-white/50'}`}>
                  {/* Balance */}
                  <div className={`px-3 py-1 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {userBalance || '0.00'} ETH
                  </div>
                  {/* Address */}
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full px-3 py-1 shadow-inner">
                    <WalletIcon className="w-4 h-4 text-white/90" />
                    <span className="text-sm font-mono text-white font-medium">
                      {formatAddress(account)}
                    </span>
                  </div>
                </div>
              )}

              {/* Disconnect */}
              {account && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDisconnect}
                  className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'text-red-400 hover:bg-red-400/10 border border-red-400/20' 
                      : 'text-red-600 hover:bg-red-50 border border-red-200'
                  }`}
                >
                  Disconnect
                </motion.button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${isDarkMode ? 'text-yellow-400 bg-white/10' : 'text-gray-600 bg-gray-100'}`}
              >
                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
              >
                {mobileMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
              </button>
            </div>

          </div>
        </div>
      </motion.nav>

      {/* 📱 Mobile Menu Overlay 📱 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`lg:hidden fixed inset-x-0 top-[72px] z-40 overflow-hidden ${isDarkMode ? 'bg-dark-900/95 backdrop-blur-xl border-b border-white/10' : 'bg-white/95 backdrop-blur-xl border-b border-gray-200'}`}
          >
            <div className="px-4 pt-2 pb-6 space-y-1 shadow-2xl">
              {/* Wallet Info Mobile */}
              {account && (
                <div className={`mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} flex flex-col space-y-3`}>
                  <div className="flex justify-between items-center">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Balance</span>
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userBalance || '0.00'} ETH</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Network</span>
                    <span className="text-blue-500 font-medium">{networkName || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-500/20 pt-3">
                    <div className="flex items-center space-x-2 text-blue-500">
                      <WalletIcon className="w-5 h-5" />
                      <span className="font-mono">{formatAddress(account)}</span>
                    </div>
                    <button onClick={handleDisconnect} className="text-red-500 text-sm font-medium">Disconnect</button>
                  </div>
                </div>
              )}

              {/* Nav Links Mobile */}
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                        : isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📄 Main Content 📄 */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>

    </div>
  );
};

export default Layout;