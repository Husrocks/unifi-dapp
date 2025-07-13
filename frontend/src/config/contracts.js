// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Hardhat local network
  31337: {
    unifiCore: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    scholarshipDAO: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
    identityVerification: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
    ipfsStorage: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    mockUSDT: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    mockUSDC: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    mockDAI: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  },
  // Sepolia testnet
  11155111: {
    unifiCore: '0x7890123456789012345678901234567890123456',
    scholarshipDAO: '0x8901234567890123456789012345678901234567',
    identityVerification: '0x9012345678901234567890123456789012345678',
    ipfsStorage: '0xA123456789012345678901234567890123456789',
  },
  // Polygon mainnet
  137: {
    unifiCore: '0x4567890123456789012345678901234567890123',
    scholarshipDAO: '0x5678901234567890123456789012345678901234',
    identityVerification: '0x6789012345678901234567890123456789012345',
    ipfsStorage: '0x7890123456789012345678901234567890123456',
  },
  // Ethereum mainnet
  1: {
    unifiCore: '0x1234567890123456789012345678901234567890',
    scholarshipDAO: '0x2345678901234567890123456789012345678901',
    identityVerification: '0x3456789012345678901234567890123456789012',
    ipfsStorage: '0x4567890123456789012345678901234567890123',
  },
};

// Network configuration
export const NETWORKS = {
  1: {
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    rpcUrl: process.env.REACT_APP_MAINNET_RPC_URL || 'https://eth-mainnet.alchemyapi.io/v2/your-api-key',
  },
  137: {
    name: 'Polygon',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    rpcUrl: process.env.REACT_APP_POLYGON_RPC_URL || 'https://polygon-rpc.com',
  },
  11155111: {
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    explorer: 'https://sepolia.etherscan.io',
    rpcUrl: process.env.REACT_APP_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/your-api-key',
  },
  31337: {
    name: 'Hardhat Local',
    symbol: 'ETH',
    explorer: 'http://localhost:8545',
    rpcUrl: 'http://localhost:8545',
  },
};

// Get contract addresses for a specific network
export const getContractAddresses = (chainId) => {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[11155111]; // Default to Sepolia
};

// Get network info for a specific chain ID
export const getNetworkInfo = (chainId) => {
  return NETWORKS[chainId] || NETWORKS[11155111]; // Default to Sepolia
}; 