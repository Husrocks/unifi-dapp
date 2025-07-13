// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
/**
 * @title ScholarshipDAO
 * @dev Decentralized Autonomous Organization for managing scholarships
 */
contract ScholarshipDAO is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    struct Scholarship {
        uint256 scholarshipId;
        string title;
        string description;
        uint256 amount;
        uint256 deadline;
        address recipient;
        bool isFunded;
        bool isDistributed;
        uint256 votesFor;
        uint256 votesAgainst;
        mapping(address => bool) hasVoted;
        address[] voters;
    }

    struct Proposal {
        uint256 proposalId;
        string title;
        string description;
        uint256 amount;
        uint256 deadline;
        bool isExecuted;
        uint256 votesFor;
        uint256 votesAgainst;
        mapping(address => bool) hasVoted;
        address[] voters;
    }

    // State variables
    uint256 private _scholarshipIds;
    uint256 private _proposalIds;

    mapping(uint256 => Scholarship) public scholarships;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => bool) public members;
    mapping(address => uint256) public memberVotingPower;

    IERC20 public usdtToken;
    address public unifiCore;

    uint256 public constant MIN_SCHOLARSHIP_AMOUNT = 100 * 10**6; // 100 USDT
    uint256 public constant MAX_SCHOLARSHIP_AMOUNT = 10000 * 10**6; // 10,000 USDT
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_VOTES_REQUIRED = 3;

    // Events
    event ScholarshipCreated(uint256 indexed scholarshipId, string title, uint256 amount);
    event ScholarshipFunded(uint256 indexed scholarshipId, uint256 amount);
    event ScholarshipDistributed(uint256 indexed scholarshipId, address recipient);
    event ProposalCreated(uint256 indexed proposalId, string title, uint256 amount);
    event VoteCast(uint256 indexed id, address voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);
    event MemberAdded(address indexed member);
    event MemberRemoved(address indexed member);

    constructor(address _unifiCore) Ownable(msg.sender) {
        unifiCore = _unifiCore;
        usdtToken = IERC20(0xa0B86A33E6441b8C4c8C0C8c0c8C0C8C0c8c0c8C); // Mock address
    }

    modifier onlyMember() {
        require(members[msg.sender], "Not a member");
        _;
    }

    modifier onlyUniFiCore() {
        require(msg.sender == unifiCore, "Only UniFi Core can call this");
        _;
    }

    // Scholarship Functions
    function createScholarship(
        string memory _title,
        string memory _description,
        uint256 _amount,
        address _recipient
    ) external onlyMember returns (uint256) {
        require(_amount >= MIN_SCHOLARSHIP_AMOUNT, "Amount too low");
        require(_amount <= MAX_SCHOLARSHIP_AMOUNT, "Amount too high");
        require(_recipient != address(0), "Invalid recipient");

        _scholarshipIds++;
        uint256 scholarshipId = _scholarshipIds;

        Scholarship storage scholarship = scholarships[scholarshipId];
        scholarship.scholarshipId = scholarshipId;
        scholarship.title = _title;
        scholarship.description = _description;
        scholarship.amount = _amount;
        scholarship.deadline = block.timestamp + VOTING_PERIOD;
        scholarship.recipient = _recipient;

        emit ScholarshipCreated(scholarshipId, _title, _amount);
        return scholarshipId;
    }

    function voteOnScholarship(uint256 _scholarshipId, bool _support) external onlyMember {
        Scholarship storage scholarship = scholarships[_scholarshipId];
        require(block.timestamp < scholarship.deadline, "Voting period ended");
        require(!scholarship.hasVoted[msg.sender], "Already voted");

        scholarship.hasVoted[msg.sender] = true;
        scholarship.voters.push(msg.sender);

        if (_support) {
            scholarship.votesFor += memberVotingPower[msg.sender];
        } else {
            scholarship.votesAgainst += memberVotingPower[msg.sender];
        }

        emit VoteCast(_scholarshipId, msg.sender, _support);
    }

    function fundScholarship(uint256 _scholarshipId) external nonReentrant {
        Scholarship storage scholarship = scholarships[_scholarshipId];
        require(block.timestamp >= scholarship.deadline, "Voting period not ended");
        require(!scholarship.isFunded, "Already funded");
        require(scholarship.votesFor > scholarship.votesAgainst, "Proposal not approved");
        require(scholarship.votesFor + scholarship.votesAgainst >= MIN_VOTES_REQUIRED, "Not enough votes");

        usdtToken.safeTransferFrom(msg.sender, address(this), scholarship.amount);
        scholarship.isFunded = true;

        emit ScholarshipFunded(_scholarshipId, scholarship.amount);
    }

    function distributeScholarship(uint256 _scholarshipId) external nonReentrant {
        Scholarship storage scholarship = scholarships[_scholarshipId];
        require(scholarship.isFunded, "Not funded");
        require(!scholarship.isDistributed, "Already distributed");

        scholarship.isDistributed = true;
        usdtToken.safeTransfer(scholarship.recipient, scholarship.amount);

        emit ScholarshipDistributed(_scholarshipId, scholarship.recipient);
    }

    // Proposal Functions
    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _amount
    ) external onlyMember returns (uint256) {
        require(_amount > 0, "Amount must be greater than 0");

        _proposalIds++;
        uint256 proposalId = _proposalIds;

        Proposal storage proposal = proposals[proposalId];
        proposal.proposalId = proposalId;
        proposal.title = _title;
        proposal.description = _description;
        proposal.amount = _amount;
        proposal.deadline = block.timestamp + VOTING_PERIOD;

        emit ProposalCreated(proposalId, _title, _amount);
        return proposalId;
    }

    function voteOnProposal(uint256 _proposalId, bool _support) external onlyMember {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.deadline, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");

        proposal.hasVoted[msg.sender] = true;
        proposal.voters.push(msg.sender);

        if (_support) {
            proposal.votesFor += memberVotingPower[msg.sender];
        } else {
            proposal.votesAgainst += memberVotingPower[msg.sender];
        }

        emit VoteCast(_proposalId, msg.sender, _support);
    }

    function executeProposal(uint256 _proposalId) external onlyMember {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.deadline, "Voting period not ended");
        require(!proposal.isExecuted, "Already executed");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal not approved");
        require(proposal.votesFor + proposal.votesAgainst >= MIN_VOTES_REQUIRED, "Not enough votes");

        proposal.isExecuted = true;

        emit ProposalExecuted(_proposalId);
    }

    // Membership Functions
    function addMember(address _member, uint256 _votingPower) external onlyOwner {
        require(_member != address(0), "Invalid address");
        require(!members[_member], "Already a member");

        members[_member] = true;
        memberVotingPower[_member] = _votingPower;

        emit MemberAdded(_member);
    }

    function removeMember(address _member) external onlyOwner {
        require(members[_member], "Not a member");

        members[_member] = false;
        memberVotingPower[_member] = 0;

        emit MemberRemoved(_member);
    }

    function updateVotingPower(address _member, uint256 _newPower) external onlyOwner {
        require(members[_member], "Not a member");

        memberVotingPower[_member] = _newPower;
    }

    // View Functions
    function getScholarship(uint256 _scholarshipId) external view returns (
        uint256 scholarshipId,
        string memory title,
        string memory description,
        uint256 amount,
        uint256 deadline,
        address recipient,
        bool isFunded,
        bool isDistributed,
        uint256 votesFor,
        uint256 votesAgainst
    ) {
        Scholarship storage scholarship = scholarships[_scholarshipId];
        return (
            scholarship.scholarshipId,
            scholarship.title,
            scholarship.description,
            scholarship.amount,
            scholarship.deadline,
            scholarship.recipient,
            scholarship.isFunded,
            scholarship.isDistributed,
            scholarship.votesFor,
            scholarship.votesAgainst
        );
    }

    function getProposal(uint256 _proposalId) external view returns (
        uint256 proposalId,
        string memory title,
        string memory description,
        uint256 amount,
        uint256 deadline,
        bool isExecuted,
        uint256 votesFor,
        uint256 votesAgainst
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.proposalId,
            proposal.title,
            proposal.description,
            proposal.amount,
            proposal.deadline,
            proposal.isExecuted,
            proposal.votesFor,
            proposal.votesAgainst
        );
    }

    function hasVotedOnScholarship(uint256 _scholarshipId, address _voter) external view returns (bool) {
        return scholarships[_scholarshipId].hasVoted[_voter];
    }

    function hasVotedOnProposal(uint256 _proposalId, address _voter) external view returns (bool) {
        return proposals[_proposalId].hasVoted[_voter];
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = usdtToken.balanceOf(address(this));
        if (balance > 0) {
            usdtToken.safeTransfer(owner(), balance);
        }
    }
} 