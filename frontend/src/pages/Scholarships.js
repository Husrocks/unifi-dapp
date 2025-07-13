import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  AcademicCapIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Scenarios from '../components/Scenarios';

const Scholarships = () => {
  const { account } = useWallet();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [applicationForm, setApplicationForm] = useState({
    title: '',
    description: '',
    amount: '',
    university: '',
    degree: '',
    graduationYear: '',
    gpa: '',
    essay: '',
  });

  const [voteChoice, setVoteChoice] = useState('approve');

  // Mock data - in real app, this would come from smart contracts
  const [scholarships, setScholarships] = useState([
    {
      id: 1,
      title: 'Maria\'s International Student Scholarship',
      description: 'Supporting international students with tuition and living expenses',
      amount: 2000,
      recipient: '0x1234...5678',
      university: 'MIT',
      degree: 'Computer Science',
      graduationYear: 2025,
      gpa: 3.8,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      isFunded: false,
      isDistributed: false,
      votesFor: 15,
      votesAgainst: 3,
      status: 'voting',
      essay: 'As an international student from Colombia, I face unique challenges with high tuition costs and limited access to traditional banking. This scholarship would help me continue my studies in computer science...',
      scenario: 'International Student Journey',
    },
    {
      id: 2,
      title: 'Alex\'s Engineering Excellence Scholarship',
      description: 'Supporting outstanding engineering students with multiple scholarships',
      amount: 15000,
      recipient: '0x8765...4321',
      university: 'Stanford University',
      degree: 'Electrical Engineering',
      graduationYear: 2026,
      gpa: 3.9,
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isFunded: true,
      isDistributed: true,
      votesFor: 20,
      votesAgainst: 2,
      status: 'completed',
      essay: 'I am managing three different scholarships and need help consolidating them through the DAO governance system...',
      scenario: 'Domestic Engineering Student',
    },
    {
      id: 3,
      title: 'Sarah\'s Research Conference Funding',
      description: 'Supporting graduate students for international conference attendance',
      amount: 2500,
      recipient: '0x1111...2222',
      university: 'UC Berkeley',
      degree: 'PhD in Data Science',
      graduationYear: 2025,
      gpa: 3.9,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      isFunded: false,
      isDistributed: false,
      votesFor: 18,
      votesAgainst: 4,
      status: 'voting',
      essay: 'I need funding to attend an international conference for my research on machine learning applications...',
      scenario: 'Graduate Student Complex Needs',
    },
  ]);

  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: 'Increase Scholarship Fund Allocation',
      description: 'Proposal to increase the total scholarship fund by 50%',
      amount: 50000,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      isExecuted: false,
      votesFor: 25,
      votesAgainst: 8,
      status: 'voting',
    },
    {
      id: 2,
      title: 'Add New Scholarship Categories',
      description: 'Create scholarships for arts and humanities students',
      amount: 25000,
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isExecuted: true,
      votesFor: 30,
      votesAgainst: 5,
      status: 'executed',
    },
  ]);

  const handleApplyScholarship = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock transaction - in real app, this would call smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newScholarship = {
        id: (scholarships?.length || 0) + 1,
        title: applicationForm.title,
        description: applicationForm.description,
        amount: parseFloat(applicationForm.amount),
        recipient: account,
        university: applicationForm.university,
        degree: applicationForm.degree,
        graduationYear: parseInt(applicationForm.graduationYear),
        gpa: parseFloat(applicationForm.gpa),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isFunded: false,
        isDistributed: false,
        votesFor: 0,
        votesAgainst: 0,
        status: 'voting',
        essay: applicationForm.essay,
      };

      setScholarships([newScholarship, ...scholarships]);
      setShowApplyModal(false);
      setApplicationForm({
        title: '',
        description: '',
        amount: '',
        university: '',
        degree: '',
        graduationYear: '',
        gpa: '',
        essay: '',
      });
    } catch (error) {
      console.error('Error applying for scholarship:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock transaction - in real app, this would call smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedScholarships = scholarships.map(scholarship => {
        if (scholarship.id === selectedScholarship.id) {
          return {
            ...scholarship,
            votesFor: voteChoice === 'approve' ? scholarship.votesFor + 1 : scholarship.votesFor,
            votesAgainst: voteChoice === 'reject' ? scholarship.votesAgainst + 1 : scholarship.votesAgainst,
          };
        }
        return scholarship;
      });

      setScholarships(updatedScholarships);
      setShowVoteModal(false);
      setSelectedScholarship(null);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'voting': return 'text-yellow-500';
      case 'completed': return 'text-green-500';
      case 'executed': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-dark-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'voting': return <ClockIcon className="w-4 h-4" />;
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'executed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'rejected': return <ExclamationCircleIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const getVotingProgress = (scholarship) => {
    const total = scholarship.votesFor + scholarship.votesAgainst;
    return total > 0 ? (scholarship.votesFor / total) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Feature Placeholder */}
      <div className="card bg-accent-100 text-accent-800 text-center">
        <h2 className="text-xl font-bold">Scholarships Page</h2>
        <p>This is the Scholarships feature. Here you will be able to apply for and vote on scholarships. (Demo content below)</p>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Scholarship DAO</h1>
          <p className="text-dark-400">
            Decentralized scholarship funding and governance for students
          </p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Apply for Scholarship</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AcademicCapIcon className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {scholarships?.length || 0}
          </h3>
          <p className="text-dark-400">Total Scholarships</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CurrencyDollarIcon className="w-6 h-6 text-secondary-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            ${scholarships?.reduce((sum, s) => sum + s.amount, 0) || 0}
          </h3>
          <p className="text-dark-400">Total Funding</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-6 h-6 text-accent-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {scholarships?.filter(s => s.status === 'voting')?.length || 0}
          </h3>
          <p className="text-dark-400">Active Voting</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {scholarships?.filter(s => s.status === 'completed')?.length || 0}
          </h3>
          <p className="text-dark-400">Completed</p>
        </div>
      </div>

      {/* Active Scholarships */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Active Scholarships</h2>
        <div className="space-y-4">
          {scholarships?.filter(s => s.status === 'voting')?.map((scholarship) => (
            <div key={scholarship.id} className="border border-dark-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold mb-1">{scholarship.title}</h3>
                  <p className="text-sm text-dark-400 mb-2">{scholarship.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-dark-400">Recipient:</span>
                    <span className="font-mono">{scholarship.recipient}</span>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 ${getStatusColor(scholarship.status)}`}>
                  {getStatusIcon(scholarship.status)}
                  <span className="text-sm font-medium capitalize">{scholarship.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-dark-400">Amount</p>
                  <p className="font-semibold">${scholarship.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">University</p>
                  <p className="font-semibold">{scholarship.university}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">GPA</p>
                  <p className="font-semibold">{scholarship.gpa}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Deadline</p>
                  <p className="font-semibold">{format(scholarship.deadline, 'MMM dd')}</p>
                </div>
              </div>

              {/* Voting Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span>Voting Progress</span>
                  <span>{getVotingProgress(scholarship).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getVotingProgress(scholarship)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-dark-400 mt-1">
                  <span>For: {scholarship.votesFor}</span>
                  <span>Against: {scholarship.votesAgainst}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedScholarship(scholarship);
                  setShowVoteModal(true);
                }}
                className="btn-primary w-full"
              >
                Vote on Scholarship
              </button>
            </div>
          ))}
          {(!scholarships || scholarships.filter(s => s.status === 'voting')?.length === 0) && (
            <p className="text-dark-400 text-center py-8">No active scholarships</p>
          )}
        </div>
      </div>

      {/* DAO Proposals */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">DAO Proposals</h2>
        <div className="space-y-4">
          {proposals?.map((proposal) => (
            <div key={proposal.id} className="border border-dark-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold mb-1">{proposal.title}</h3>
                  <p className="text-sm text-dark-400">{proposal.description}</p>
                </div>
                <div className={`flex items-center space-x-1 ${getStatusColor(proposal.status)}`}>
                  {getStatusIcon(proposal.status)}
                  <span className="text-sm font-medium capitalize">{proposal.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-dark-400">Amount</p>
                  <p className="font-semibold">${proposal.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Votes For</p>
                  <p className="font-semibold text-green-500">{proposal.votesFor}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Votes Against</p>
                  <p className="font-semibold text-red-500">{proposal.votesAgainst}</p>
                </div>
                <div>
                  <p className="text-xs text-dark-400">Deadline</p>
                  <p className="font-semibold">{format(proposal.deadline, 'MMM dd')}</p>
                </div>
              </div>

              {proposal.status === 'voting' && (
                <button className="btn-secondary w-full">
                  Vote on Proposal
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Apply for Scholarship Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Apply for Scholarship</h2>
            <form onSubmit={handleApplyScholarship} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Scholarship Title</label>
                  <input
                    type="text"
                    value={applicationForm.title}
                    onChange={(e) => setApplicationForm({ ...applicationForm, title: e.target.value })}
                    className="input-field w-full"
                    placeholder="e.g., Computer Science Excellence Scholarship"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Requested Amount (USDT)</label>
                  <input
                    type="number"
                    value={applicationForm.amount}
                    onChange={(e) => setApplicationForm({ ...applicationForm, amount: e.target.value })}
                    className="input-field w-full"
                    placeholder="2000"
                    min="100"
                    max="10000"
                    step="100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={applicationForm.description}
                  onChange={(e) => setApplicationForm({ ...applicationForm, description: e.target.value })}
                  className="input-field w-full"
                  rows="3"
                  placeholder="Describe the scholarship and its purpose"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">University</label>
                  <input
                    type="text"
                    value={applicationForm.university}
                    onChange={(e) => setApplicationForm({ ...applicationForm, university: e.target.value })}
                    className="input-field w-full"
                    placeholder="MIT"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Degree</label>
                  <input
                    type="text"
                    value={applicationForm.degree}
                    onChange={(e) => setApplicationForm({ ...applicationForm, degree: e.target.value })}
                    className="input-field w-full"
                    placeholder="Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Graduation Year</label>
                  <input
                    type="number"
                    value={applicationForm.graduationYear}
                    onChange={(e) => setApplicationForm({ ...applicationForm, graduationYear: e.target.value })}
                    className="input-field w-full"
                    placeholder="2025"
                    min="2024"
                    max="2030"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GPA</label>
                <input
                  type="number"
                  value={applicationForm.gpa}
                  onChange={(e) => setApplicationForm({ ...applicationForm, gpa: e.target.value })}
                  className="input-field w-full"
                  placeholder="3.8"
                  min="0"
                  max="4.0"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Personal Essay</label>
                <textarea
                  value={applicationForm.essay}
                  onChange={(e) => setApplicationForm({ ...applicationForm, essay: e.target.value })}
                  className="input-field w-full"
                  rows="6"
                  placeholder="Tell us about your academic achievements, goals, and why you deserve this scholarship..."
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
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
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vote Modal */}
      {showVoteModal && selectedScholarship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Vote on Scholarship</h2>
            <div className="mb-4">
              <h3 className="font-semibold">{selectedScholarship.title}</h3>
              <p className="text-sm text-dark-400 mb-2">{selectedScholarship.description}</p>
              <div className="bg-dark-700 rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>${selectedScholarship.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>University:</span>
                  <span>{selectedScholarship.university}</span>
                </div>
                <div className="flex justify-between">
                  <span>GPA:</span>
                  <span>{selectedScholarship.gpa}</span>
                </div>
              </div>
            </div>
            <form onSubmit={handleVote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Vote</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="vote"
                      value="approve"
                      checked={voteChoice === 'approve'}
                      onChange={(e) => setVoteChoice(e.target.value)}
                      className="text-primary-500"
                    />
                    <span>Approve</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="vote"
                      value="reject"
                      checked={voteChoice === 'reject'}
                      onChange={(e) => setVoteChoice(e.target.value)}
                      className="text-primary-500"
                    />
                    <span>Reject</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowVoteModal(false)}
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
                    'Submit Vote'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sample Scenarios */}
      <Scenarios title="Real-World Scholarship Examples" />
    </div>
  );
};

export default Scholarships; 