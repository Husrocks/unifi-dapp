// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title IPFSStorage
 * @dev IPFS metadata storage for UniFi DeFi platform
 */
contract IPFSStorage is Ownable {


    struct IPFSDocument {
        uint256 documentId;
        address owner;
        string ipfsHash;
        string documentType;
        string description;
        uint256 uploadDate;
        bool isVerified;
        bool isActive;
    }

    struct DocumentType {
        string name;
        string description;
        bool isActive;
        uint256 maxSize; // in bytes
    }

    // State variables
    uint256 private _documentIds;

    mapping(uint256 => IPFSDocument) public documents;
    mapping(address => uint256[]) public userDocuments;
    mapping(string => DocumentType) public documentTypes;
    mapping(string => bool) public verifiedHashes;

    string[] public supportedDocumentTypes;

    // Events
    event DocumentUploaded(uint256 indexed documentId, address indexed owner, string ipfsHash, string documentType);
    event DocumentVerified(uint256 indexed documentId, address indexed owner);
    event DocumentDeactivated(uint256 indexed documentId, address indexed owner);
    event DocumentTypeAdded(string indexed documentType, string description);
    event DocumentTypeDeactivated(string indexed documentType);

    constructor() Ownable(msg.sender) {
        // Initialize default document types
        _addDocumentType("student_id", "Student ID Document", 1024 * 1024); // 1MB
        _addDocumentType("university_transcript", "University Transcript", 5 * 1024 * 1024); // 5MB
        _addDocumentType("loan_agreement", "Loan Agreement", 2 * 1024 * 1024); // 2MB
        _addDocumentType("expense_receipt", "Expense Receipt", 1024 * 1024); // 1MB
        _addDocumentType("scholarship_application", "Scholarship Application", 3 * 1024 * 1024); // 3MB
        _addDocumentType("identity_verification", "Identity Verification", 2 * 1024 * 1024); // 2MB
    }

    // Document Management Functions
    function uploadDocument(
        string memory _ipfsHash,
        string memory _documentType,
        string memory _description
    ) external returns (uint256) {
        return _uploadDocument(_ipfsHash, _documentType, _description);
    }

    function _uploadDocument(
        string memory _ipfsHash,
        string memory _documentType,
        string memory _description
    ) internal returns (uint256) {
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");
        require(documentTypes[_documentType].isActive, "Document type not supported");
        require(bytes(_description).length > 0, "Description required");

        _documentIds++;
        uint256 documentId = _documentIds;

        IPFSDocument storage document = documents[documentId];
        document.documentId = documentId;
        document.owner = msg.sender;
        document.ipfsHash = _ipfsHash;
        document.documentType = _documentType;
        document.description = _description;
        document.uploadDate = block.timestamp;
        document.isActive = true;

        userDocuments[msg.sender].push(documentId);

        emit DocumentUploaded(documentId, msg.sender, _ipfsHash, _documentType);
        return documentId;
    }

    function verifyDocument(uint256 _documentId) external onlyOwner {
        IPFSDocument storage document = documents[_documentId];
        require(document.owner != address(0), "Document does not exist");
        require(document.isActive, "Document not active");

        document.isVerified = true;
        verifiedHashes[document.ipfsHash] = true;

        emit DocumentVerified(_documentId, document.owner);
    }

    function deactivateDocument(uint256 _documentId) external {
        IPFSDocument storage document = documents[_documentId];
        require(document.owner == msg.sender, "Not document owner");
        require(document.isActive, "Document already deactivated");

        document.isActive = false;

        emit DocumentDeactivated(_documentId, msg.sender);
    }

    function reactivateDocument(uint256 _documentId) external onlyOwner {
        IPFSDocument storage document = documents[_documentId];
        require(document.owner != address(0), "Document does not exist");
        require(!document.isActive, "Document already active");

        document.isActive = true;
    }

    // Document Type Management Functions
    function addDocumentType(
        string memory _name,
        string memory _description,
        uint256 _maxSize
    ) external onlyOwner {
        require(bytes(_name).length > 0, "Name required");
        require(!documentTypes[_name].isActive, "Document type already exists");

        _addDocumentType(_name, _description, _maxSize);
    }

    function _addDocumentType(
        string memory _name,
        string memory _description,
        uint256 _maxSize
    ) internal {
        DocumentType storage docType = documentTypes[_name];
        docType.name = _name;
        docType.description = _description;
        docType.isActive = true;
        docType.maxSize = _maxSize;

        supportedDocumentTypes.push(_name);

        emit DocumentTypeAdded(_name, _description);
    }

    function deactivateDocumentType(string memory _name) external onlyOwner {
        require(documentTypes[_name].isActive, "Document type not active");

        documentTypes[_name].isActive = false;

        emit DocumentTypeDeactivated(_name);
    }

    // View Functions
    function getDocument(uint256 _documentId) external view returns (
        uint256 documentId,
        address owner,
        string memory ipfsHash,
        string memory documentType,
        string memory description,
        uint256 uploadDate,
        bool isVerified,
        bool isActive
    ) {
        IPFSDocument storage document = documents[_documentId];
        return (
            document.documentId,
            document.owner,
            document.ipfsHash,
            document.documentType,
            document.description,
            document.uploadDate,
            document.isVerified,
            document.isActive
        );
    }

    function getUserDocuments(address _user) external view returns (uint256[] memory) {
        return userDocuments[_user];
    }

    function getDocumentType(string memory _name) external view returns (
        string memory name,
        string memory description,
        bool isActive,
        uint256 maxSize
    ) {
        DocumentType storage docType = documentTypes[_name];
        return (
            docType.name,
            docType.description,
            docType.isActive,
            docType.maxSize
        );
    }

    function getSupportedDocumentTypes() external view returns (string[] memory) {
        return supportedDocumentTypes;
    }

    function isHashVerified(string memory _ipfsHash) external view returns (bool) {
        return verifiedHashes[_ipfsHash];
    }

    function getDocumentCount() external view returns (uint256) {
        return _documentIds;
    }

    // Batch Operations
    function uploadMultipleDocuments(
        string[] memory _ipfsHashes,
        string[] memory _documentTypes,
        string[] memory _descriptions
    ) external returns (uint256[] memory) {
        require(
            _ipfsHashes.length == _documentTypes.length &&
            _documentTypes.length == _descriptions.length,
            "Arrays must have same length"
        );

        uint256[] memory documentIds = new uint256[](_ipfsHashes.length);

        for (uint256 i = 0; i < _ipfsHashes.length; i++) {
            documentIds[i] = _uploadDocument(_ipfsHashes[i], _documentTypes[i], _descriptions[i]);
        }

        return documentIds;
    }

    // Search Functions
    function getDocumentsByType(string memory _documentType) external view returns (uint256[] memory) {
        uint256[] memory tempDocs = new uint256[](_documentIds);
        uint256 count = 0;

        for (uint256 i = 1; i <= _documentIds; i++) {
            if (
                keccak256(bytes(documents[i].documentType)) == keccak256(bytes(_documentType)) &&
                documents[i].isActive
            ) {
                tempDocs[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tempDocs[i];
        }

        return result;
    }

    function getVerifiedDocuments() external view returns (uint256[] memory) {
        uint256[] memory tempDocs = new uint256[](_documentIds);
        uint256 count = 0;

        for (uint256 i = 1; i <= _documentIds; i++) {
            if (documents[i].isVerified && documents[i].isActive) {
                tempDocs[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tempDocs[i];
        }

        return result;
    }
} 