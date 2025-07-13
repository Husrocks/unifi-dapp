import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { NETWORKS } from '../config/contracts';

const WalletContext = createContext();

// Connector configurations
const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 137, 80001, 11155111], // Mainnet, Ropsten, Rinkeby, Goerli, Kovan, Polygon, Mumbai, Sepolia
});

const walletconnect = new WalletConnectConnector({
  rpc: {
    1: process.env.REACT_APP_MAINNET_RPC_URL || 'https://eth-mainnet.alchemyapi.io/v2/your-api-key',
    137: process.env.REACT_APP_POLYGON_RPC_URL || 'https://polygon-rpc.com',
    11155111: process.env.REACT_APP_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/your-api-key',
  },
  qrcode: true,
  pollingInterval: 15000,
});

export const WalletProvider = ({ children }) => {
  const { account, library, chainId, activate, deactivate, active } = useWeb3React();
  const [isConnecting, setIsConnecting] = useState(false);
  const [userBalance, setUserBalance] = useState('0');
  const [networkName, setNetworkName] = useState('');
  const [connectionError, setConnectionError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Network configuration
  const networks = useMemo(() => NETWORKS, []);

  // Connect wallet functions with improved error handling
  const connectMetaMask = useCallback(async () => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask and try again.');
      }

      // Try to get accounts
      let accounts = await window.ethereum.request({ method: 'eth_accounts' });

      // If not connected, request connection
      if (accounts.length === 0) {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      }

      if (accounts.length === 0) {
        throw new Error('Please unlock MetaMask and try again.');
      }

      await activate(injected);
      toast.success('MetaMask connected successfully!');
    } catch (error) {
      console.error('MetaMask connection error:', error);
      const errorMessage = error.message || 'Failed to connect MetaMask';
      setConnectionError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [activate]);

  const connectWalletConnect = useCallback(async () => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      await activate(walletconnect);
      toast.success('WalletConnect connected successfully!');
    } catch (error) {
      console.error('WalletConnect connection error:', error);
      const errorMessage = error.message || 'Failed to connect WalletConnect';
      setConnectionError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [activate]);

  const disconnect = useCallback(() => {
    try {
      deactivate();
      setConnectionError(null);
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error('Failed to disconnect wallet');
    }
  }, [deactivate]);

  // Switch network with improved error handling
  const switchNetwork = useCallback(async (targetChainId) => {
    if (!library) {
      toast.error('No wallet connected');
      return;
    }

    try {
      if (library.provider.request) {
        await library.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        });
        toast.success(`Switched to ${networks[targetChainId]?.name || 'Unknown Network'}`);
      }
    } catch (error) {
      console.error('Network switch error:', error);
      
      // Handle specific MetaMask errors
      if (error.code === 4902) {
        toast.error('Please add this network to MetaMask first');
      } else {
        toast.error('Failed to switch network');
      }
    }
  }, [library, networks]);

  // Get user balance with error handling
  const getBalance = useCallback(async () => {
    if (!account || !library) {
      setUserBalance('0');
      return;
    }

    try {
      const balance = await library.getBalance(account);
      const formattedBalance = ethers.utils.formatEther(balance);
      setUserBalance(parseFloat(formattedBalance).toFixed(4));
    } catch (error) {
      console.error('Balance fetch error:', error);
      setUserBalance('0');
      toast.error('Failed to fetch balance');
    }
  }, [account, library]);

  // Get network name
  const getNetworkName = useCallback(() => {
    if (!chainId) return '';
    return networks[chainId]?.name || `Chain ID: ${chainId}`;
  }, [chainId, networks]);

  // Check if network is supported
  const isNetworkSupported = useCallback((chainId) => {
    return Object.keys(networks).includes(chainId?.toString());
  }, [networks]);

  // Get current network info
  const currentNetwork = useMemo(() => {
    if (!chainId) return null;
    return networks[chainId] || null;
  }, [chainId, networks]);

  // Effects
  useEffect(() => {
    if (active && account) {
      getBalance();
      setNetworkName(getNetworkName());
      setConnectionError(null);
    } else {
      setUserBalance('0');
      setNetworkName('');
    }
  }, [active, account, library, chainId, getBalance, getNetworkName]);

  // Auto-connect on page load
  useEffect(() => {
    const connectWalletOnLoad = async () => {
      try {
        setIsInitializing(true);
        const isAuthorized = await injected.isAuthorized();
        if (isAuthorized) {
          await activate(injected);
        }
      } catch (error) {
        console.error('Auto-connect error:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    connectWalletOnLoad();
  }, [activate]);

  // Check for network changes
  useEffect(() => {
    if (chainId && !isNetworkSupported(chainId)) {
      toast.error('Unsupported network. Please switch to a supported network.');
    }
  }, [chainId, isNetworkSupported]);

  const value = useMemo(() => ({
    account,
    library,
    chainId,
    active,
    isConnecting,
    isInitializing,
    userBalance,
    networkName,
    connectionError,
    networks,
    currentNetwork,
    isNetworkSupported,
    connectMetaMask,
    connectWalletConnect,
    disconnect,
    switchNetwork,
    getBalance,
    clearError: () => setConnectionError(null),
  }), [
    account,
    library,
    chainId,
    active,
    isConnecting,
    isInitializing,
    userBalance,
    networkName,
    connectionError,
    networks,
    currentNetwork,
    isNetworkSupported,
    connectMetaMask,
    connectWalletConnect,
    disconnect,
    switchNetwork,
    getBalance,
  ]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}; 