# UniFi DeFi Platform

A decentralized finance (DeFi) platform for students, featuring:
- React frontend
- Smart contracts (Solidity, Hardhat)
- Local blockchain development

## Features
- Expense Sharing
- Micro-Lending
- Scholarships
- Remittances
- Credit Score
- Identity Verification

## Getting Started

### Prerequisites
- Node.js & npm
- MetaMask extension
- (Optional) Hardhat for local blockchain

### Setup
```bash
# Install dependencies for contracts
cd contracts
npm install

# Compile and deploy contracts (local Hardhat node)
npx hardhat node # in one terminal
npx hardhat run scripts/deploy.js --network localhost # in another terminal

# Install dependencies for frontend
cd ../frontend
npm install

# Start the frontend
npm start
```

### Usage
- Open [http://localhost:3000](http://localhost:3000) in your browser
- Connect MetaMask (use Localhost 8545 network for local dev)

## Project Structure
- `contracts/` — Solidity smart contracts & deployment scripts
- `frontend/` — React app (UI, pages, components)

## License
MIT #   u n i f i - d a p p  
 