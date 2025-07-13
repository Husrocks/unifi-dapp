import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { getContractAddresses } from '../config/contracts';

const ContractContext = createContext();

// Contract ABIs (simplified for demo)
const UNIFI_CORE_ABI = [
  'function createExpensePool(string name, string description, uint256 targetAmount, uint256 deadline) external returns (uint256)',
  'function contributeToPool(uint256 poolId, uint256 amount) external',
  'function requestLoan(uint256 amount, uint256 interestRate, uint256 repaymentDate, string purpose) external returns (uint256)',
  'function fundLoan(uint256 loanId) external',
  'function repayLoan(uint256 loanId) external',
  'function sendRemittance(address recipient, uint256 amount, string currency) external returns (uint256)',
  'function getCreditProfile(address user) external view returns (uint256, uint256, uint256, uint256, uint256, uint256, uint256)',
  'event ExpensePoolCreated(uint256 indexed poolId, address indexed creator, string name, uint256 targetAmount)',
  'event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount, string purpose)',
  'event RemittanceSent(uint256 indexed remittanceId, address indexed sender, address indexed recipient, uint256 amount)',
];

const SCHOLARSHIP_DAO_ABI = [
  'function createScholarship(string title, string description, uint256 amount, address recipient) external returns (uint256)',
  'function voteOnScholarship(uint256 scholarshipId, bool support) external',
  'function getScholarship(uint256 scholarshipId) external view returns (uint256, string, string, uint256, uint256, address, bool, bool, uint256, uint256)',
];

const IDENTITY_VERIFICATION_ABI = [
  'function createIdentity(string studentId, string university, string degree, uint256 graduationYear, string ipfsHash) external returns (uint256)',
  'function isIdentityVerified(address user) external view returns (bool)',
];

export const ContractProvider = ({ children }) => {
  const { library, chainId } = useWallet();
  const [contracts, setContracts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddresses, setContractAddresses] = useState({});

  // Get contract addresses for the current network
  const getContractAddressesForNetwork = (networkId) => {
    return getContractAddresses(networkId);
  };

  // Initialize contracts
  useEffect(() => {
    if (library && chainId) {
      const addresses = getContractAddressesForNetwork(chainId);
      setContractAddresses(addresses);

      const signer = library.getSigner();
      
      const unifiCore = new ethers.Contract(addresses.unifiCore, UNIFI_CORE_ABI, signer);
      const scholarshipDAO = new ethers.Contract(addresses.scholarshipDAO, SCHOLARSHIP_DAO_ABI, signer);
      const identityVerification = new ethers.Contract(addresses.identityVerification, IDENTITY_VERIFICATION_ABI, signer);

      setContracts({
        unifiCore,
        scholarshipDAO,
        identityVerification,
      });
    }
  }, [library, chainId]);

  // Contract interaction functions
  const createExpensePool = async (name, description, targetAmount, deadline) => {
    if (!contracts.unifiCore) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contracts.unifiCore.createExpensePool(
        name,
        description,
        ethers.utils.parseUnits(targetAmount.toString(), 6), // USDT has 6 decimals
        deadline
      );
      
      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'ExpensePoolCreated');
      
      toast.success('Expense pool created successfully!');
      return event?.args?.poolId;
    } catch (error) {
      console.error('Error creating expense pool:', error);
      toast.error('Failed to create expense pool');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contributeToPool = async (poolId, amount) => {
    if (!contracts.unifiCore) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contracts.unifiCore.contributeToPool(
        poolId,
        ethers.utils.parseUnits(amount.toString(), 6)
      );
      
      await tx.wait();
      toast.success('Contribution successful!');
    } catch (error) {
      console.error('Error contributing to pool:', error);
      toast.error('Failed to contribute to pool');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestLoan = async (amount, interestRate, repaymentDate, purpose) => {
    if (!contracts.unifiCore) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contracts.unifiCore.requestLoan(
        ethers.utils.parseUnits(amount.toString(), 6),
        interestRate,
        repaymentDate,
        purpose
      );
      
      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'LoanRequested');
      
      toast.success('Loan request submitted successfully!');
      return event?.args?.loanId;
    } catch (error) {
      console.error('Error requesting loan:', error);
      toast.error('Failed to request loan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fundLoan = async (loanId) => {
    if (!contracts.unifiCore) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contracts.unifiCore.fundLoan(loanId);
      await tx.wait();
      toast.success('Loan funded successfully!');
    } catch (error) {
      console.error('Error funding loan:', error);
      toast.error('Failed to fund loan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const repayLoan = async (loanId) => {
    if (!contracts.unifiCore) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contracts.unifiCore.repayLoan(loanId);
      await tx.wait();
      toast.success('Loan repaid successfully!');
    } catch (error) {
      console.error('Error repaying loan:', error);
      toast.error('Failed to repay loan');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendRemittance = async (recipient, amount, currency) => {
    if (!contracts.unifiCore) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contracts.unifiCore.sendRemittance(
        recipient,
        ethers.utils.parseUnits(amount.toString(), 6),
        currency
      );
      
      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'RemittanceSent');
      
      toast.success('Remittance sent successfully!');
      return event?.args?.remittanceId;
    } catch (error) {
      console.error('Error sending remittance:', error);
      toast.error('Failed to send remittance');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCreditProfile = async (userAddress) => {
    if (!contracts.unifiCore) throw new Error('Contract not initialized');

    try {
      const profile = await contracts.unifiCore.getCreditProfile(userAddress);
      return {
        creditScore: profile[0].toNumber(),
        totalBorrowed: ethers.utils.formatUnits(profile[1], 6),
        totalRepaid: ethers.utils.formatUnits(profile[2], 6),
        activeLoans: profile[3].toNumber(),
        completedLoans: profile[4].toNumber(),
        defaultedLoans: profile[5].toNumber(),
        lastActivity: profile[6].toNumber(),
      };
    } catch (error) {
      console.error('Error getting credit profile:', error);
      throw error;
    }
  };

  const createScholarship = async (title, description, amount, recipient) => {
    if (!contracts.scholarshipDAO) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contracts.scholarshipDAO.createScholarship(
        title,
        description,
        ethers.utils.parseUnits(amount.toString(), 6),
        recipient
      );
      
      const receipt = await tx.wait();
      toast.success('Scholarship application submitted!');
      return receipt;
    } catch (error) {
      console.error('Error creating scholarship:', error);
      toast.error('Failed to create scholarship');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const voteOnScholarship = async (scholarshipId, support) => {
    if (!contracts.scholarshipDAO) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contracts.scholarshipDAO.voteOnScholarship(scholarshipId, support);
      await tx.wait();
      toast.success('Vote submitted successfully!');
    } catch (error) {
      console.error('Error voting on scholarship:', error);
      toast.error('Failed to submit vote');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createIdentity = async (studentId, university, degree, graduationYear, ipfsHash) => {
    if (!contracts.identityVerification) throw new Error('Contract not initialized');

    setIsLoading(true);
    try {
      const tx = await contracts.identityVerification.createIdentity(
        studentId,
        university,
        degree,
        graduationYear,
        ipfsHash
      );
      
      await tx.wait();
      toast.success('Identity verification submitted!');
    } catch (error) {
      console.error('Error creating identity:', error);
      toast.error('Failed to submit identity verification');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkIdentityVerification = async (userAddress) => {
    if (!contracts.identityVerification) throw new Error('Contract not initialized');

    try {
      return await contracts.identityVerification.isIdentityVerified(userAddress);
    } catch (error) {
      console.error('Error checking identity verification:', error);
      throw error;
    }
  };

  const value = {
    contracts,
    contractAddresses,
    isLoading,
    createExpensePool,
    contributeToPool,
    requestLoan,
    fundLoan,
    repayLoan,
    sendRemittance,
    getCreditProfile,
    createScholarship,
    voteOnScholarship,
    createIdentity,
    checkIdentityVerification,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContracts = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContracts must be used within a ContractProvider');
  }
  return context;
}; 