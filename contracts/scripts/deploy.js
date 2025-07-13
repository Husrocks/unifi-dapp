const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying UniFi DeFi Platform...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy mock tokens for testing (in production, use real token addresses)
  console.log("\n📦 Deploying mock tokens...");
  
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy("Mock USDT", "USDT");
  await mockUSDT.waitForDeployment();
  console.log("Mock USDT deployed to:", await mockUSDT.getAddress());

  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy("Mock USDC", "USDC");
  await mockUSDC.waitForDeployment();
  console.log("Mock USDC deployed to:", await mockUSDC.getAddress());

  const MockDAI = await ethers.getContractFactory("MockDAI");
  const mockDAI = await MockDAI.deploy("Mock DAI", "DAI");
  await mockDAI.waitForDeployment();
  console.log("Mock DAI deployed to:", await mockDAI.getAddress());

  // Deploy mock price feeds for testing
  console.log("\n📊 Deploying mock price feeds...");
  
  const MockPriceFeed = await ethers.getContractFactory("MockPriceFeed");
  const mockEthUsdPriceFeed = await MockPriceFeed.deploy();
  await mockEthUsdPriceFeed.waitForDeployment();
  console.log("Mock ETH/USD Price Feed deployed to:", await mockEthUsdPriceFeed.getAddress());

  const mockUsdtUsdPriceFeed = await MockPriceFeed.deploy();
  await mockUsdtUsdPriceFeed.waitForDeployment();
  console.log("Mock USDT/USD Price Feed deployed to:", await mockUsdtUsdPriceFeed.getAddress());

  // Deploy the main UniFi Core contract
  console.log("\n🏦 Deploying UniFi Core contract...");
  
  const UniFiCore = await ethers.getContractFactory("UniFiCore");
  const unifiCore = await UniFiCore.deploy(
    await mockUSDT.getAddress(),
    await mockUSDC.getAddress(),
    await mockDAI.getAddress(),
    await mockEthUsdPriceFeed.getAddress(),
    await mockUsdtUsdPriceFeed.getAddress()
  );
  await unifiCore.waitForDeployment();
  console.log("UniFi Core deployed to:", await unifiCore.getAddress());

  // Deploy Scholarship DAO contract
  console.log("\n🎓 Deploying Scholarship DAO contract...");
  
  const ScholarshipDAO = await ethers.getContractFactory("ScholarshipDAO");
  const scholarshipDAO = await ScholarshipDAO.deploy(await unifiCore.getAddress());
  await scholarshipDAO.waitForDeployment();
  console.log("Scholarship DAO deployed to:", await scholarshipDAO.getAddress());

  // Deploy Identity Verification contract
  console.log("\n🆔 Deploying Identity Verification contract...");
  
  const IdentityVerification = await ethers.getContractFactory("IdentityVerification");
  const identityVerification = await IdentityVerification.deploy();
  await identityVerification.waitForDeployment();
  console.log("Identity Verification deployed to:", await identityVerification.getAddress());

  // Mint some tokens to deployer for testing
  console.log("\n💰 Minting test tokens...");
  
  const mintAmount = ethers.parseUnits("10000", 6); // 10,000 USDT
  await mockUSDT.mint(deployer.address, mintAmount);
  await mockUSDC.mint(deployer.address, mintAmount);
  await mockDAI.mint(deployer.address, ethers.parseUnits("10000", 18));
  
  console.log("Minted 10,000 USDT, USDC, and DAI to deployer");

  // Set up initial credit scores for testing
  console.log("\n📈 Setting up initial credit scores...");
  
  console.log("Credit scores will be initialized when users interact with the platform");

  // Deploy IPFS metadata storage contract
  console.log("\n📁 Deploying IPFS Metadata Storage...");
  
  const IPFSStorage = await ethers.getContractFactory("IPFSStorage");
  const ipfsStorage = await IPFSStorage.deploy();
  await ipfsStorage.waitForDeployment();
  console.log("IPFS Storage deployed to:", await ipfsStorage.getAddress());

  console.log("\n✅ Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("UniFi Core:", await unifiCore.getAddress());
  console.log("Scholarship DAO:", await scholarshipDAO.getAddress());
  console.log("Identity Verification:", await identityVerification.getAddress());
  console.log("IPFS Storage:", await ipfsStorage.getAddress());
  console.log("Mock USDT:", await mockUSDT.getAddress());
  console.log("Mock USDC:", await mockUSDC.getAddress());
  console.log("Mock DAI:", await mockDAI.getAddress());
  console.log("Mock ETH/USD Price Feed:", await mockEthUsdPriceFeed.getAddress());
  console.log("Mock USDT/USD Price Feed:", await mockUsdtUsdPriceFeed.getAddress());

  // Save deployment info to file
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    contracts: {
      unifiCore: await unifiCore.getAddress(),
      scholarshipDAO: await scholarshipDAO.getAddress(),
      identityVerification: await identityVerification.getAddress(),
      ipfsStorage: await ipfsStorage.getAddress(),
      mockUSDT: await mockUSDT.getAddress(),
      mockUSDC: await mockUSDC.getAddress(),
      mockDAI: await mockDAI.getAddress(),
      mockEthUsdPriceFeed: await mockEthUsdPriceFeed.getAddress(),
      mockUsdtUsdPriceFeed: await mockUsdtUsdPriceFeed.getAddress()
    },
    timestamp: new Date().toISOString()
  };

  const fs = require('fs');
  fs.writeFileSync(
    `deployment-${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`\n📄 Deployment info saved to deployment-${hre.network.name}.json`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 