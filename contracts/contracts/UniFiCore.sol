// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title UniFiCore
 * @dev Main contract for UniFi DeFi platform - Student Financial Ecosystem
 */
contract UniFiCore is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Structs
    struct ExpensePool {
        uint256 poolId;
        string name;
        string description;
        address creator;
        uint256 totalAmount;
        uint256 targetAmount;
        uint256 deadline;
        bool isActive;
        mapping(address => uint256) contributions;
        address[] contributors;
    }

    struct Loan {
        uint256 loanId;
        address borrower;
        address lender;
        uint256 amount;
        uint256 interestRate;
        uint256 repaymentDate;
        uint256 borrowedAt;
        bool isRepaid;
        bool isDefaulted;
        string purpose;
    }

    struct CreditProfile {
        uint256 creditScore;
        uint256 totalBorrowed;
        uint256 totalRepaid;
        uint256 activeLoans;
        uint256 completedLoans;
        uint256 defaultedLoans;
        uint256 lastActivity;
    }

    struct Remittance {
        uint256 remittanceId;
        address sender;
        address recipient;
        uint256 amount;
        uint256 timestamp;
        string currency;
        bool isProcessed;
    }

    // State variables
    uint256 private _poolIds;
    uint256 private _loanIds;
    uint256 private _remittanceIds;

    mapping(uint256 => ExpensePool) public expensePools;
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => Remittance) public remittances;
    mapping(address => CreditProfile) public creditProfiles;
    mapping(address => uint256[]) public userPools;
    mapping(address => uint256[]) public userLoans;
    mapping(address => uint256[]) public userRemittances;

    // Supported tokens
    IERC20 public usdtToken;
    IERC20 public usdcToken;
    IERC20 public daiToken;

    // Chainlink price feeds
    AggregatorV3Interface public ethUsdPriceFeed;
    AggregatorV3Interface public usdtUsdPriceFeed;

    // Constants
    uint256 public constant MIN_LOAN_AMOUNT = 50 * 10**6; // 50 USDT
    uint256 public constant MAX_LOAN_AMOUNT = 5000 * 10**6; // 5000 USDT
    uint256 public constant MAX_INTEREST_RATE = 15; // 15%
    uint256 public constant CREDIT_SCORE_INCREMENT = 10;
    uint256 public constant CREDIT_SCORE_DECREMENT = 20;

    // Events
    event ExpensePoolCreated(uint256 indexed poolId, address indexed creator, string name, uint256 targetAmount);
    event ContributionMade(uint256 indexed poolId, address indexed contributor, uint256 amount);
    event PoolFunded(uint256 indexed poolId, uint256 totalAmount);
    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount, string purpose);
    event LoanFunded(uint256 indexed loanId, address indexed lender, uint256 amount);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);
    event RemittanceSent(uint256 indexed remittanceId, address indexed sender, address indexed recipient, uint256 amount);
    event CreditScoreUpdated(address indexed user, uint256 newScore);

    constructor(
        address _usdtToken,
        address _usdcToken,
        address _daiToken,
        address _ethUsdPriceFeed,
        address _usdtUsdPriceFeed
    ) Ownable(msg.sender) {
        usdtToken = IERC20(_usdtToken);
        usdcToken = IERC20(_usdcToken);
        daiToken = IERC20(_daiToken);
        ethUsdPriceFeed = AggregatorV3Interface(_ethUsdPriceFeed);
        usdtUsdPriceFeed = AggregatorV3Interface(_usdtUsdPriceFeed);
    }

    // Expense Pool Functions
    function createExpensePool(
        string memory _name,
        string memory _description,
        uint256 _targetAmount,
        uint256 _deadline
    ) external returns (uint256) {
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        _poolIds++;
        uint256 poolId = _poolIds;

        ExpensePool storage pool = expensePools[poolId];
        pool.poolId = poolId;
        pool.name = _name;
        pool.description = _description;
        pool.creator = msg.sender;
        pool.targetAmount = _targetAmount;
        pool.deadline = _deadline;
        pool.isActive = true;

        userPools[msg.sender].push(poolId);

        emit ExpensePoolCreated(poolId, msg.sender, _name, _targetAmount);
        return poolId;
    }

    function contributeToPool(uint256 _poolId, uint256 _amount) external nonReentrant {
        ExpensePool storage pool = expensePools[_poolId];
        require(pool.isActive, "Pool is not active");
        require(block.timestamp < pool.deadline, "Pool deadline has passed");
        require(_amount > 0, "Contribution amount must be greater than 0");

        // Transfer USDT from user to contract
        usdtToken.safeTransferFrom(msg.sender, address(this), _amount);

        if (pool.contributions[msg.sender] == 0) {
            pool.contributors.push(msg.sender);
        }
        pool.contributions[msg.sender] += _amount;
        pool.totalAmount += _amount;

        emit ContributionMade(_poolId, msg.sender, _amount);

        // Check if pool is fully funded
        if (pool.totalAmount >= pool.targetAmount) {
            pool.isActive = false;
            emit PoolFunded(_poolId, pool.totalAmount);
        }
    }

    function withdrawFromPool(uint256 _poolId) external nonReentrant {
        ExpensePool storage pool = expensePools[_poolId];
        require(!pool.isActive, "Pool is still active");
        require(pool.contributions[msg.sender] > 0, "No contributions found");

        uint256 userContribution = pool.contributions[msg.sender];
        pool.contributions[msg.sender] = 0;

        // Calculate user's share of the total amount
        uint256 userShare = (userContribution * pool.totalAmount) / pool.targetAmount;
        
        usdtToken.safeTransfer(msg.sender, userShare);
    }

    // Lending Functions
    function requestLoan(
        uint256 _amount,
        uint256 _interestRate,
        uint256 _repaymentDate,
        string memory _purpose
    ) external returns (uint256) {
        require(_amount >= MIN_LOAN_AMOUNT, "Amount below minimum");
        require(_amount <= MAX_LOAN_AMOUNT, "Amount above maximum");
        require(_interestRate <= MAX_INTEREST_RATE, "Interest rate too high");
        require(_repaymentDate > block.timestamp, "Repayment date must be in the future");

        CreditProfile storage profile = creditProfiles[msg.sender];
        require(profile.creditScore >= 300, "Credit score too low");

        _loanIds++;
        uint256 loanId = _loanIds;

        Loan storage loan = loans[loanId];
        loan.loanId = loanId;
        loan.borrower = msg.sender;
        loan.amount = _amount;
        loan.interestRate = _interestRate;
        loan.repaymentDate = _repaymentDate;
        loan.borrowedAt = block.timestamp;
        loan.purpose = _purpose;

        userLoans[msg.sender].push(loanId);

        emit LoanRequested(loanId, msg.sender, _amount, _purpose);
        return loanId;
    }

    function fundLoan(uint256 _loanId) external nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.lender == address(0), "Loan already funded");
        require(loan.borrower != msg.sender, "Cannot fund your own loan");

        uint256 totalRepayment = loan.amount + (loan.amount * loan.interestRate) / 100;
        
        usdtToken.safeTransferFrom(msg.sender, address(this), loan.amount);
        usdtToken.safeTransfer(loan.borrower, loan.amount);

        loan.lender = msg.sender;
        loan.borrowedAt = block.timestamp;

        CreditProfile storage profile = creditProfiles[loan.borrower];
        profile.activeLoans++;
        profile.lastActivity = block.timestamp;

        emit LoanFunded(_loanId, msg.sender, loan.amount);
    }

    function repayLoan(uint256 _loanId) external nonReentrant {
        Loan storage loan = loans[_loanId];
        require(msg.sender == loan.borrower, "Only borrower can repay");
        require(!loan.isRepaid, "Loan already repaid");
        require(loan.lender != address(0), "Loan not funded");

        uint256 totalRepayment = loan.amount + (loan.amount * loan.interestRate) / 100;
        
        usdtToken.safeTransferFrom(msg.sender, address(this), totalRepayment);
        usdtToken.safeTransfer(loan.lender, totalRepayment);

        loan.isRepaid = true;

        // Update credit profile
        CreditProfile storage profile = creditProfiles[msg.sender];
        profile.totalRepaid += totalRepayment;
        profile.activeLoans--;
        profile.completedLoans++;
        profile.creditScore += CREDIT_SCORE_INCREMENT;
        profile.lastActivity = block.timestamp;

        emit LoanRepaid(_loanId, msg.sender, totalRepayment);
        emit CreditScoreUpdated(msg.sender, profile.creditScore);
    }

    function checkLoanDefaults() external {
        uint256 currentTime = block.timestamp;
        
        for (uint256 i = 1; i <= _loanIds; i++) {
            Loan storage loan = loans[i];
            if (!loan.isRepaid && !loan.isDefaulted && 
                loan.lender != address(0) && 
                currentTime > loan.repaymentDate) {
                
                loan.isDefaulted = true;
                
                CreditProfile storage profile = creditProfiles[loan.borrower];
                profile.activeLoans--;
                profile.defaultedLoans++;
                profile.creditScore = profile.creditScore > CREDIT_SCORE_DECREMENT ? 
                    profile.creditScore - CREDIT_SCORE_DECREMENT : 0;

                emit LoanDefaulted(i, loan.borrower);
                emit CreditScoreUpdated(loan.borrower, profile.creditScore);
            }
        }
    }

    // Remittance Functions
    function sendRemittance(
        address _recipient,
        uint256 _amount,
        string memory _currency
    ) external nonReentrant returns (uint256) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_recipient != address(0), "Invalid recipient");

        usdtToken.safeTransferFrom(msg.sender, address(this), _amount);

        _remittanceIds++;
        uint256 remittanceId = _remittanceIds;

        Remittance storage remittance = remittances[remittanceId];
        remittance.remittanceId = remittanceId;
        remittance.sender = msg.sender;
        remittance.recipient = _recipient;
        remittance.amount = _amount;
        remittance.timestamp = block.timestamp;
        remittance.currency = _currency;

        userRemittances[msg.sender].push(remittanceId);
        userRemittances[_recipient].push(remittanceId);

        emit RemittanceSent(remittanceId, msg.sender, _recipient, _amount);
        return remittanceId;
    }

    function processRemittance(uint256 _remittanceId) external nonReentrant {
        Remittance storage remittance = remittances[_remittanceId];
        require(msg.sender == remittance.recipient, "Only recipient can process");
        require(!remittance.isProcessed, "Already processed");

        remittance.isProcessed = true;
        usdtToken.safeTransfer(msg.sender, remittance.amount);
    }

    // Credit Profile Functions
    function getCreditProfile(address _user) external view returns (
        uint256 creditScore,
        uint256 totalBorrowed,
        uint256 totalRepaid,
        uint256 activeLoans,
        uint256 completedLoans,
        uint256 defaultedLoans,
        uint256 lastActivity
    ) {
        CreditProfile storage profile = creditProfiles[_user];
        return (
            profile.creditScore,
            profile.totalBorrowed,
            profile.totalRepaid,
            profile.activeLoans,
            profile.completedLoans,
            profile.defaultedLoans,
            profile.lastActivity
        );
    }

    // View Functions
    function getExpensePool(uint256 _poolId) external view returns (
        uint256 poolId,
        string memory name,
        string memory description,
        address creator,
        uint256 totalAmount,
        uint256 targetAmount,
        uint256 deadline,
        bool isActive,
        address[] memory contributors
    ) {
        ExpensePool storage pool = expensePools[_poolId];
        return (
            pool.poolId,
            pool.name,
            pool.description,
            pool.creator,
            pool.totalAmount,
            pool.targetAmount,
            pool.deadline,
            pool.isActive,
            pool.contributors
        );
    }

    function getLoan(uint256 _loanId) external view returns (
        uint256 loanId,
        address borrower,
        address lender,
        uint256 amount,
        uint256 interestRate,
        uint256 repaymentDate,
        uint256 borrowedAt,
        bool isRepaid,
        bool isDefaulted,
        string memory purpose
    ) {
        Loan storage loan = loans[_loanId];
        return (
            loan.loanId,
            loan.borrower,
            loan.lender,
            loan.amount,
            loan.interestRate,
            loan.repaymentDate,
            loan.borrowedAt,
            loan.isRepaid,
            loan.isDefaulted,
            loan.purpose
        );
    }

    function getUserPools(address _user) external view returns (uint256[] memory) {
        return userPools[_user];
    }

    function getUserLoans(address _user) external view returns (uint256[] memory) {
        return userLoans[_user];
    }

    function getUserRemittances(address _user) external view returns (uint256[] memory) {
        return userRemittances[_user];
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        uint256 usdtBalance = usdtToken.balanceOf(address(this));
        if (usdtBalance > 0) {
            usdtToken.safeTransfer(owner(), usdtBalance);
        }
    }
} 