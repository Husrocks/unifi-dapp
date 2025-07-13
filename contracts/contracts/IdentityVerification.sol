// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title IdentityVerification
 * @dev Identity verification system for UniFi DeFi platform
 */
contract IdentityVerification is Ownable {


    struct Identity {
        uint256 identityId;
        address user;
        string studentId;
        string university;
        string degree;
        uint256 graduationYear;
        bool isVerified;
        bool isActive;
        uint256 verificationDate;
        string ipfsHash;
    }

    struct VerificationRequest {
        uint256 requestId;
        address user;
        string studentId;
        string university;
        string degree;
        uint256 graduationYear;
        string ipfsHash;
        bool isApproved;
        bool isRejected;
        uint256 requestDate;
    }

    // State variables
    uint256 private _identityIds;
    uint256 private _requestIds;

    mapping(uint256 => Identity) public identities;
    mapping(uint256 => VerificationRequest) public verificationRequests;
    mapping(address => uint256) public userIdentityId;
    mapping(address => uint256[]) public userRequests;
    mapping(address => bool) public verifiers;
    mapping(string => bool) public verifiedStudentIds;

    uint256 public constant VERIFICATION_FEE = 10 * 10**6; // 10 USDT
    uint256 public constant VERIFICATION_EXPIRY = 365 days;

    // Events
    event IdentityCreated(uint256 indexed identityId, address indexed user, string studentId);
    event IdentityVerified(uint256 indexed identityId, address indexed user);
    event IdentityDeactivated(uint256 indexed identityId, address indexed user);
    event VerificationRequested(uint256 indexed requestId, address indexed user, string studentId);
    event VerificationApproved(uint256 indexed requestId, address indexed user);
    event VerificationRejected(uint256 indexed requestId, address indexed user, string reason);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    modifier onlyVerifier() {
        require(verifiers[msg.sender] || msg.sender == owner(), "Not authorized verifier");
        _;
    }

    constructor() Ownable(msg.sender) {
        verifiers[msg.sender] = true;
    }

    // Identity Management Functions
    function createIdentity(
        string memory _studentId,
        string memory _university,
        string memory _degree,
        uint256 _graduationYear,
        string memory _ipfsHash
    ) external returns (uint256) {
        require(bytes(_studentId).length > 0, "Student ID required");
        require(bytes(_university).length > 0, "University required");
        require(_graduationYear > 0, "Graduation year required");
        require(userIdentityId[msg.sender] == 0, "Identity already exists");

        _identityIds++;
        uint256 identityId = _identityIds;

        Identity storage identity = identities[identityId];
        identity.identityId = identityId;
        identity.user = msg.sender;
        identity.studentId = _studentId;
        identity.university = _university;
        identity.degree = _degree;
        identity.graduationYear = _graduationYear;
        identity.ipfsHash = _ipfsHash;
        identity.isActive = true;
        identity.verificationDate = block.timestamp;

        userIdentityId[msg.sender] = identityId;

        emit IdentityCreated(identityId, msg.sender, _studentId);
        return identityId;
    }

    function requestVerification(
        string memory _studentId,
        string memory _university,
        string memory _degree,
        uint256 _graduationYear,
        string memory _ipfsHash
    ) external returns (uint256) {
        require(bytes(_studentId).length > 0, "Student ID required");
        require(bytes(_university).length > 0, "University required");
        require(_graduationYear > 0, "Graduation year required");
        require(!verifiedStudentIds[_studentId], "Student ID already verified");

        _requestIds++;
        uint256 requestId = _requestIds;

        VerificationRequest storage request = verificationRequests[requestId];
        request.requestId = requestId;
        request.user = msg.sender;
        request.studentId = _studentId;
        request.university = _university;
        request.degree = _degree;
        request.graduationYear = _graduationYear;
        request.ipfsHash = _ipfsHash;
        request.requestDate = block.timestamp;

        userRequests[msg.sender].push(requestId);

        emit VerificationRequested(requestId, msg.sender, _studentId);
        return requestId;
    }

    function approveVerification(uint256 _requestId) external onlyVerifier {
        VerificationRequest storage request = verificationRequests[_requestId];
        require(request.user != address(0), "Request does not exist");
        require(!request.isApproved && !request.isRejected, "Request already processed");

        request.isApproved = true;

        // Create or update identity
        uint256 identityId = userIdentityId[request.user];
        if (identityId == 0) {
            _identityIds++;
            identityId = _identityIds;
            userIdentityId[request.user] = identityId;
        }

        Identity storage identity = identities[identityId];
        identity.identityId = identityId;
        identity.user = request.user;
        identity.studentId = request.studentId;
        identity.university = request.university;
        identity.degree = request.degree;
        identity.graduationYear = request.graduationYear;
        identity.ipfsHash = request.ipfsHash;
        identity.isVerified = true;
        identity.isActive = true;
        identity.verificationDate = block.timestamp;

        verifiedStudentIds[request.studentId] = true;

        emit VerificationApproved(_requestId, request.user);
        emit IdentityVerified(identityId, request.user);
    }

    function rejectVerification(uint256 _requestId, string memory _reason) external onlyVerifier {
        VerificationRequest storage request = verificationRequests[_requestId];
        require(request.user != address(0), "Request does not exist");
        require(!request.isApproved && !request.isRejected, "Request already processed");

        request.isRejected = true;

        emit VerificationRejected(_requestId, request.user, _reason);
    }

    function deactivateIdentity() external {
        uint256 identityId = userIdentityId[msg.sender];
        require(identityId > 0, "No identity found");

        Identity storage identity = identities[identityId];
        identity.isActive = false;

        emit IdentityDeactivated(identityId, msg.sender);
    }

    function reactivateIdentity() external onlyVerifier {
        uint256 identityId = userIdentityId[msg.sender];
        require(identityId > 0, "No identity found");

        Identity storage identity = identities[identityId];
        identity.isActive = true;
    }

    // Verifier Management Functions
    function addVerifier(address _verifier) external onlyOwner {
        require(_verifier != address(0), "Invalid address");
        require(!verifiers[_verifier], "Already a verifier");

        verifiers[_verifier] = true;

        emit VerifierAdded(_verifier);
    }

    function removeVerifier(address _verifier) external onlyOwner {
        require(verifiers[_verifier], "Not a verifier");

        verifiers[_verifier] = false;

        emit VerifierRemoved(_verifier);
    }

    // View Functions
    function getIdentity(uint256 _identityId) external view returns (
        uint256 identityId,
        address user,
        string memory studentId,
        string memory university,
        string memory degree,
        uint256 graduationYear,
        bool isVerified,
        bool isActive,
        uint256 verificationDate,
        string memory ipfsHash
    ) {
        Identity storage identity = identities[_identityId];
        return (
            identity.identityId,
            identity.user,
            identity.studentId,
            identity.university,
            identity.degree,
            identity.graduationYear,
            identity.isVerified,
            identity.isActive,
            identity.verificationDate,
            identity.ipfsHash
        );
    }

    function getVerificationRequest(uint256 _requestId) external view returns (
        uint256 requestId,
        address user,
        string memory studentId,
        string memory university,
        string memory degree,
        uint256 graduationYear,
        string memory ipfsHash,
        bool isApproved,
        bool isRejected,
        uint256 requestDate
    ) {
        VerificationRequest storage request = verificationRequests[_requestId];
        return (
            request.requestId,
            request.user,
            request.studentId,
            request.university,
            request.degree,
            request.graduationYear,
            request.ipfsHash,
            request.isApproved,
            request.isRejected,
            request.requestDate
        );
    }

    function getUserIdentity(address _user) external view returns (uint256) {
        return userIdentityId[_user];
    }

    function getUserRequests(address _user) external view returns (uint256[] memory) {
        return userRequests[_user];
    }

    function isIdentityVerified(address _user) external view returns (bool) {
        uint256 identityId = userIdentityId[_user];
        if (identityId == 0) return false;
        return identities[identityId].isVerified && identities[identityId].isActive;
    }

    function isStudentIdVerified(string memory _studentId) external view returns (bool) {
        return verifiedStudentIds[_studentId];
    }

    // Worldcoin/Gitcoin Passport Integration
    function verifyWithPassport(
        address _user,
        string memory _studentId,
        string memory _university,
        string memory _degree,
        uint256 _graduationYear,
        string memory _ipfsHash,
        bytes memory _proof
    ) external onlyVerifier {
        // In a real implementation, this would verify the proof against Worldcoin/Gitcoin Passport
        // For now, we'll create the identity directly
        
        uint256 identityId = userIdentityId[_user];
        if (identityId == 0) {
            _identityIds++;
            identityId = _identityIds;
            userIdentityId[_user] = identityId;
        }

        Identity storage identity = identities[identityId];
        identity.identityId = identityId;
        identity.user = _user;
        identity.studentId = _studentId;
        identity.university = _university;
        identity.degree = _degree;
        identity.graduationYear = _graduationYear;
        identity.ipfsHash = _ipfsHash;
        identity.isVerified = true;
        identity.isActive = true;
        identity.verificationDate = block.timestamp;

        verifiedStudentIds[_studentId] = true;

        emit IdentityVerified(identityId, _user);
    }
} 