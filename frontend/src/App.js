import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExpensePools from './pages/ExpensePools';
import Lending from './pages/Lending';
import Remittances from './pages/Remittances';
import CreditScore from './pages/CreditScore';
import Scholarships from './pages/Scholarships';
import Identity from './pages/Identity';
import ConnectWallet from './components/ConnectWallet';

// Context
import { WalletProvider } from './context/WalletContext';
import { ContractProvider } from './context/ContractContext';

// Styles
import './index.css';

// Web3 React configuration
function getLibrary(provider) {
  return new Web3Provider(provider);
}

// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <WalletProvider>
          <ContractProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#1e293b',
                      color: '#f8fafc',
                      border: '1px solid #334155',
                    },
                  }}
                />
                <Routes>
                  <Route path="/" element={<ConnectWallet />} />
                  <Route path="/dashboard" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="expense-pools" element={<ExpensePools />} />
                    <Route path="lending" element={<Lending />} />
                    <Route path="remittances" element={<Remittances />} />
                    <Route path="credit-score" element={<CreditScore />} />
                    <Route path="scholarships" element={<Scholarships />} />
                    <Route path="identity" element={<Identity />} />
                  </Route>
                </Routes>
              </div>
            </Router>
          </ContractProvider>
        </WalletProvider>
      </Web3ReactProvider>
    </QueryClientProvider>
  );
}

export default App; 