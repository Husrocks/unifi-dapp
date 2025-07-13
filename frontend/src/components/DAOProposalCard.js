import React, { memo } from 'react';
import { 
  AcademicCapIcon, 
  UserIcon, 
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const DAOProposalCard = memo(({ 
  proposal = {},
  onVote,
  onView,
  variant = 'default',
  className = ''
}) => {
  const {
    id,
    title,
    description,
    amount,
    applicant,
    status = 'active',
    votesFor = 0,
    votesAgainst = 0,
    totalVotes = 0,
    deadline,
    category,
    createdAt,
    requirements
  } = proposal;

  const statusConfig = {
    active: {
      icon: ClockIcon,
      color: 'text-accent-500',
      bgColor: 'bg-accent-100',
      text: 'Active'
    },
    approved: {
      icon: CheckCircleIcon,
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-100',
      text: 'Approved'
    },
    rejected: {
      icon: XCircleIcon,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      text: 'Rejected'
    },
    executed: {
      icon: CheckCircleIcon,
      color: 'text-primary-500',
      bgColor: 'bg-primary-100',
      text: 'Executed'
    }
  };

  const variantConfig = {
    default: 'card-hover',
    compact: 'card p-4',
    detailed: 'card p-6'
  };

  const StatusIcon = statusConfig[status]?.icon || ClockIcon;
  const statusColor = statusConfig[status]?.color || 'text-accent-500';
  const statusBgColor = statusConfig[status]?.bgColor || 'bg-accent-100';
  const statusText = statusConfig[status]?.text || 'Active';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAddress = (address) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const calculateVotePercentage = (votes, total) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const getVoteProgress = () => {
    const forPercentage = calculateVotePercentage(votesFor, totalVotes);
    const againstPercentage = calculateVotePercentage(votesAgainst, totalVotes);
    
    return {
      for: forPercentage,
      against: againstPercentage,
      remaining: 100 - forPercentage - againstPercentage
    };
  };

  const handleVote = (vote) => {
    if (onVote && status === 'active') {
      onVote(proposal.id, vote);
    }
  };

  const voteProgress = getVoteProgress();

  return (
    <div className={`${variantConfig[variant]} ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
            <AcademicCapIcon className="w-5 h-5 text-accent-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-dark-400 line-clamp-2">{description}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusBgColor}`}>
          <StatusIcon className={`w-4 h-4 ${statusColor}`} />
          <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
        </div>
      </div>

      {/* Proposal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-400">Amount:</span>
            <span className="font-semibold text-lg text-accent-600">{formatCurrency(amount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-400">Category:</span>
            <span className="font-medium">{category || 'General'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-400">Applicant:</span>
            <div className="flex items-center space-x-1">
              <UserIcon className="w-4 h-4 text-dark-400" />
              <span className="font-mono text-sm">{formatAddress(applicant)}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-400">Created:</span>
            <div className="flex items-center space-x-1">
              <CalendarIcon className="w-4 h-4 text-dark-400" />
              <span className="text-sm">{formatDate(createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-400">Deadline:</span>
            <span className="text-sm">{formatDate(deadline)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-dark-400">Total Votes:</span>
            <span className="font-medium">{totalVotes}</span>
          </div>
        </div>
      </div>

      {/* Requirements */}
      {requirements && (
        <div className="mb-4 p-3 bg-dark-800 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Requirements</h4>
          <p className="text-sm text-dark-400">{requirements}</p>
        </div>
      )}

      {/* Vote Progress */}
      {status === 'active' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Vote Progress</span>
            <span className="text-sm text-dark-400">{totalVotes} votes</span>
          </div>
          <div className="flex h-2 bg-dark-700 rounded-full overflow-hidden">
            <div 
              className="bg-secondary-500 h-full transition-all duration-300"
              style={{ width: `${voteProgress.for}%` }}
            />
            <div 
              className="bg-red-500 h-full transition-all duration-300"
              style={{ width: `${voteProgress.against}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-dark-400 mt-1">
            <span>For: {votesFor} ({voteProgress.for}%)</span>
            <span>Against: {votesAgainst} ({voteProgress.against}%)</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {status === 'active' && onVote && (
            <>
              <button
                onClick={() => handleVote('for')}
                className="flex items-center space-x-1 px-3 py-1 bg-secondary-600 hover:bg-secondary-700 text-white text-xs rounded-lg transition-colors"
              >
                <HandThumbUpIcon className="w-3 h-3" />
                <span>Vote For</span>
              </button>
              <button
                onClick={() => handleVote('against')}
                className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
              >
                <HandThumbDownIcon className="w-3 h-3" />
                <span>Vote Against</span>
              </button>
            </>
          )}
        </div>
        
        {onView && (
          <button
            onClick={() => onView(proposal)}
            className="flex items-center space-x-1 btn-outline text-xs py-1 px-2"
          >
            <EyeIcon className="w-3 h-3" />
            <span>View Details</span>
          </button>
        )}
      </div>
    </div>
  );
});

DAOProposalCard.displayName = 'DAOProposalCard';

export default DAOProposalCard; 