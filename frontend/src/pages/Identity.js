import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  IdentificationIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  DocumentIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const Identity = () => {
  const { account } = useWallet();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [verificationForm, setVerificationForm] = useState({
    studentId: '',
    university: '',
    degree: '',
    graduationYear: '',
    ipfsHash: '',
  });

  const [documentForm, setDocumentForm] = useState({
    documentType: 'student_id',
    description: '',
    ipfsHash: '',
  });

  // Mock identity data
  const [identity, setIdentity] = useState({
    isVerified: true,
    studentId: 'STU2024001',
    university: 'MIT',
    degree: 'Computer Science',
    graduationYear: 2025,
    verificationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    creditScore: 820,
    worldcoinVerified: true,
    gitcoinPassport: 15,
  });

  // Mock documents
  const [documents, setDocuments] = useState([
    {
      id: 1,
      type: 'student_id',
      description: 'MIT Student ID Card',
      ipfsHash: 'QmX...abc123',
      uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isVerified: true,
      isActive: true,
    },
    {
      id: 2,
      type: 'university_transcript',
      description: 'MIT Academic Transcript',
      ipfsHash: 'QmY...def456',
      uploadDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      isVerified: true,
      isActive: true,
    },
    {
      id: 3,
      type: 'identity_verification',
      description: 'Government ID Verification',
      ipfsHash: 'QmZ...ghi789',
      uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      isVerified: false,
      isActive: true,
    },
  ]);

  const documentTypes = [
    { value: 'student_id', label: 'Student ID', icon: AcademicCapIcon },
    { value: 'university_transcript', label: 'University Transcript', icon: DocumentIcon },
    { value: 'government_id', label: 'Government ID', icon: IdentificationIcon },
    { value: 'passport', label: 'Passport', icon: GlobeAltIcon },
    { value: 'drivers_license', label: 'Driver\'s License', icon: IdentificationIcon },
  ];

  const handleVerifyIdentity = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock transaction - in real app, this would call smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIdentity({
        ...identity,
        studentId: verificationForm.studentId,
        university: verificationForm.university,
        degree: verificationForm.degree,
        graduationYear: parseInt(verificationForm.graduationYear),
        verificationDate: new Date(),
      });

      setShowVerifyModal(false);
      setVerificationForm({
        studentId: '',
        university: '',
        degree: '',
        graduationYear: '',
        ipfsHash: '',
      });
    } catch (error) {
      console.error('Error verifying identity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock transaction - in real app, this would call smart contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newDocument = {
        id: (documents?.length || 0) + 1,
        type: documentForm.documentType,
        description: documentForm.description,
        ipfsHash: documentForm.ipfsHash,
        uploadDate: new Date(),
        isVerified: false,
        isActive: true,
      };

      setDocuments([newDocument, ...documents]);
      setShowUploadModal(false);
      setDocumentForm({
        documentType: 'student_id',
        description: '',
        ipfsHash: '',
      });
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentTypeIcon = (type) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.icon : DocumentIcon;
  };

  const getDocumentTypeLabel = (type) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.label : 'Unknown';
  };

  const getStatusColor = (isVerified) => {
    return isVerified ? 'text-green-500' : 'text-yellow-500';
  };

  const getStatusIcon = (isVerified) => {
    return isVerified ? <CheckCircleIcon className="w-4 h-4" /> : <ClockIcon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Feature Placeholder */}
      <div className="card bg-accent-100 text-accent-800 text-center">
        <h2 className="text-xl font-bold">Identity Page</h2>
        <p>This is the Identity feature. Here you will be able to verify your student identity and upload documents. (Demo content below)</p>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Identity Verification</h1>
          <p className="text-dark-400">
            Verify your student identity and manage documents securely
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-outline flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
          {!identity.isVerified && (
            <button
              onClick={() => setShowVerifyModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <IdentificationIcon className="w-4 h-4" />
              <span>Verify Identity</span>
            </button>
          )}
        </div>
      </div>

      {/* Identity Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identity Overview */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Identity Status</h2>
            <div className={`flex items-center space-x-1 ${identity.isVerified ? 'text-green-500' : 'text-yellow-500'}`}>
              {identity.isVerified ? <CheckCircleIcon className="w-5 h-5" /> : <ClockIcon className="w-5 h-5" />}
              <span className="font-medium">{identity.isVerified ? 'Verified' : 'Pending Verification'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Student Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-dark-400">Student ID:</span>
                  <span className="font-medium">{identity.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">University:</span>
                  <span className="font-medium">{identity.university}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Degree:</span>
                  <span className="font-medium">{identity.degree}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Graduation Year:</span>
                  <span className="font-medium">{identity.graduationYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Verification Date:</span>
                  <span className="font-medium">{identity.verificationDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Verification Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                    <span>Worldcoin Verification</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-500">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span className="text-sm">Verified</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AcademicCapIcon className="w-5 h-5 text-purple-500" />
                    <span>Gitcoin Passport</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-500">
                    <span className="text-sm font-medium">{identity.gitcoinPassport} stamps</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DocumentIcon className="w-5 h-5 text-green-500" />
                    <span>Document Verification</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-500">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span className="text-sm">Complete</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Score Impact */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Credit Score Impact</h3>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-green-500 mb-1">+50</div>
            <p className="text-sm text-dark-400">Points from verification</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Worldcoin Verification</span>
              <span className="text-green-500">+20</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Gitcoin Passport</span>
              <span className="text-green-500">+15</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Document Verification</span>
              <span className="text-green-500">+15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Documents</h2>
        <div className="space-y-4">
          {documents.map((document) => {
            const IconComponent = getDocumentTypeIcon(document.type);
            return (
              <div key={document.id} className="border border-dark-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{getDocumentTypeLabel(document.type)}</h3>
                      <p className="text-sm text-dark-400">{document.description}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 ${getStatusColor(document.isVerified)}`}>
                    {getStatusIcon(document.isVerified)}
                    <span className="text-sm font-medium">
                      {document.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-dark-400">IPFS Hash</p>
                    <p className="font-mono text-sm">{document.ipfsHash}</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-400">Upload Date</p>
                    <p className="font-semibold">{document.uploadDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-400">Status</p>
                    <p className={`font-semibold ${document.isVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                      {document.isVerified ? 'Verified' : 'Pending'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-400">Actions</p>
                    <button className="text-sm text-primary-500 hover:text-primary-400">
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Worldcoin Verification</h3>
          <p className="text-dark-400 mb-4">
            Verify your humanity using Worldcoin's privacy-preserving identity system.
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>Privacy-preserving verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>No personal data stored</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>Global accessibility</span>
            </div>
          </div>
          <button className="btn-primary w-full mt-4">
            Verify with Worldcoin
          </button>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Gitcoin Passport</h3>
          <p className="text-dark-400 mb-4">
            Build your reputation with Gitcoin Passport stamps and increase your credit score.
          </p>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>15 stamps collected</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>High trust score</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span>Verified contributor</span>
            </div>
          </div>
          <button className="btn-secondary w-full mt-4">
            View Passport
          </button>
        </div>
      </div>

      {/* Verify Identity Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Verify Identity</h2>
            <form onSubmit={handleVerifyIdentity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Student ID</label>
                <input
                  type="text"
                  value={verificationForm.studentId}
                  onChange={(e) => setVerificationForm({ ...verificationForm, studentId: e.target.value })}
                  className="input-field w-full"
                  placeholder="STU2024001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">University</label>
                <input
                  type="text"
                  value={verificationForm.university}
                  onChange={(e) => setVerificationForm({ ...verificationForm, university: e.target.value })}
                  className="input-field w-full"
                  placeholder="MIT"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Degree</label>
                <input
                  type="text"
                  value={verificationForm.degree}
                  onChange={(e) => setVerificationForm({ ...verificationForm, degree: e.target.value })}
                  className="input-field w-full"
                  placeholder="Computer Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Graduation Year</label>
                <input
                  type="number"
                  value={verificationForm.graduationYear}
                  onChange={(e) => setVerificationForm({ ...verificationForm, graduationYear: e.target.value })}
                  className="input-field w-full"
                  placeholder="2025"
                  min="2024"
                  max="2030"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">IPFS Hash (Optional)</label>
                <input
                  type="text"
                  value={verificationForm.ipfsHash}
                  onChange={(e) => setVerificationForm({ ...verificationForm, ipfsHash: e.target.value })}
                  className="input-field w-full"
                  placeholder="QmX...abc123"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowVerifyModal(false)}
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
                    'Verify Identity'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Document</h2>
            <form onSubmit={handleUploadDocument} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Document Type</label>
                <select
                  value={documentForm.documentType}
                  onChange={(e) => setDocumentForm({ ...documentForm, documentType: e.target.value })}
                  className="input-field w-full"
                  required
                >
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={documentForm.description}
                  onChange={(e) => setDocumentForm({ ...documentForm, description: e.target.value })}
                  className="input-field w-full"
                  placeholder="e.g., MIT Student ID Card"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">IPFS Hash</label>
                <input
                  type="text"
                  value={documentForm.ipfsHash}
                  onChange={(e) => setDocumentForm({ ...documentForm, ipfsHash: e.target.value })}
                  className="input-field w-full"
                  placeholder="QmX...abc123"
                  required
                />
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <p className="text-sm text-dark-400 mb-2">Document Requirements:</p>
                <ul className="text-xs text-dark-400 space-y-1">
                  <li>• Upload document to IPFS first</li>
                  <li>• Ensure document is clear and readable</li>
                  <li>• Include all relevant information</li>
                  <li>• Documents are encrypted and secure</li>
                </ul>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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
                    'Upload Document'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Identity; 