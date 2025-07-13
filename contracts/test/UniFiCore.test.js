const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UniFiCore", function () {
  let unifiCore;
  let mockUSDT;
  let mockUSDC;
  let mockDAI;
  let mockEthPriceFeed;
  let mockUsdtPriceFeed;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock tokens
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    mockUSDT = await MockUSDT.deploy("Mock USDT", "USDT");
    await mockUSDT.deployed();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy("Mock USDC", "USDC");
    await mockUSDC.deployed();

    const MockDAI = await ethers.getContractFactory("MockDAI");
    mockDAI = await MockDAI.deploy("Mock DAI", "DAI");
    await mockDAI.deployed();

    // Deploy mock price feeds
    const MockPriceFeed = await ethers.getContractFactory("MockPriceFeed");
    mockEthPriceFeed = await MockPriceFeed.deploy();
    await mockEthPriceFeed.deployed();

    mockUsdtPriceFeed = await MockPriceFeed.deploy();
    await mockUsdtPriceFeed.deployed();

    // Deploy UniFiCore
    const UniFiCore = await ethers.getContractFactory("UniFiCore");
    unifiCore = await UniFiCore.deploy(
      mockUSDT.address,
      mockUSDC.address,
      mockDAI.address,
      mockEthPriceFeed.address,
      mockUsdtPriceFeed.address
    );
    await unifiCore.deployed();

    // Mint some tokens to users for testing
    const mintAmount = ethers.utils.parseUnits("10000", 6);
    await mockUSDT.mint(user1.address, mintAmount);
    await mockUSDT.mint(user2.address, mintAmount);
  });

  describe("Deployment", function () {
    it("Should deploy with correct token addresses", async function () {
      expect(await unifiCore.usdtToken()).to.equal(mockUSDT.address);
      expect(await unifiCore.usdcToken()).to.equal(mockUSDC.address);
      expect(await unifiCore.daiToken()).to.equal(mockDAI.address);
    });

    it("Should deploy with correct price feed addresses", async function () {
      expect(await unifiCore.ethUsdPriceFeed()).to.equal(mockEthPriceFeed.address);
      expect(await unifiCore.usdtUsdPriceFeed()).to.equal(mockUsdtPriceFeed.address);
    });
  });

  describe("Expense Pools", function () {
    it("Should create an expense pool", async function () {
      const name = "Test Pool";
      const description = "Test Description";
      const targetAmount = ethers.utils.parseUnits("1000", 6);
      const deadline = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

      await expect(
        unifiCore.connect(user1).createExpensePool(name, description, targetAmount, deadline)
      ).to.emit(unifiCore, "ExpensePoolCreated");

      const pool = await unifiCore.getExpensePool(1);
      expect(pool.name).to.equal(name);
      expect(pool.description).to.equal(description);
      expect(pool.targetAmount).to.equal(targetAmount);
      expect(pool.creator).to.equal(user1.address);
    });

    it("Should allow contributions to expense pool", async function () {
      const targetAmount = ethers.utils.parseUnits("1000", 6);
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      
      await unifiCore.connect(user1).createExpensePool("Test", "Test", targetAmount, deadline);
      
      const contributionAmount = ethers.utils.parseUnits("100", 6);
      await mockUSDT.connect(user2).approve(unifiCore.address, contributionAmount);
      
      await expect(
        unifiCore.connect(user2).contributeToPool(1, contributionAmount)
      ).to.emit(unifiCore, "ContributionMade");
    });
  });

  describe("Lending", function () {
    it("Should allow loan requests", async function () {
      const amount = ethers.utils.parseUnits("500", 6);
      const interestRate = 5;
      const repaymentDate = Math.floor(Date.now() / 1000) + 86400 * 30; // 30 days
      const purpose = "Textbook Purchase";

      // Set initial credit score for user1
      await unifiCore.setInitialCreditScore(user1.address, 500);

      await expect(
        unifiCore.connect(user1).requestLoan(amount, interestRate, repaymentDate, purpose)
      ).to.emit(unifiCore, "LoanRequested");

      const loan = await unifiCore.getLoan(1);
      expect(loan.borrower).to.equal(user1.address);
      expect(loan.amount).to.equal(amount);
      expect(loan.interestRate).to.equal(interestRate);
      expect(loan.purpose).to.equal(purpose);
    });

    it("Should allow loan funding", async function () {
      const amount = ethers.utils.parseUnits("500", 6);
      const interestRate = 5;
      const repaymentDate = Math.floor(Date.now() / 1000) + 86400 * 30;
      const purpose = "Textbook Purchase";

      await unifiCore.setInitialCreditScore(user1.address, 500);
      await unifiCore.connect(user1).requestLoan(amount, interestRate, repaymentDate, purpose);
      
      await mockUSDT.connect(user2).approve(unifiCore.address, amount);
      
      await expect(
        unifiCore.connect(user2).fundLoan(1)
      ).to.emit(unifiCore, "LoanFunded");
    });
  });

  describe("Credit Profile", function () {
    it("Should set initial credit score", async function () {
      const creditScore = 500;
      await unifiCore.setInitialCreditScore(user1.address, creditScore);
      
      const profile = await unifiCore.getCreditProfile(user1.address);
      expect(profile.creditScore).to.equal(creditScore);
    });

    it("Should update credit score after loan repayment", async function () {
      const initialScore = 500;
      await unifiCore.setInitialCreditScore(user1.address, initialScore);
      
      const amount = ethers.utils.parseUnits("500", 6);
      const interestRate = 5;
      const repaymentDate = Math.floor(Date.now() / 1000) + 86400 * 30;
      
      await unifiCore.connect(user1).requestLoan(amount, interestRate, repaymentDate, "Test");
      await mockUSDT.connect(user2).approve(unifiCore.address, amount);
      await unifiCore.connect(user2).fundLoan(1);
      
      const totalRepayment = amount.add(amount.mul(interestRate).div(100));
      await mockUSDT.connect(user1).approve(unifiCore.address, totalRepayment);
      
      await expect(
        unifiCore.connect(user1).repayLoan(1)
      ).to.emit(unifiCore, "CreditScoreUpdated");
      
      const profile = await unifiCore.getCreditProfile(user1.address);
      expect(profile.creditScore).to.equal(initialScore + 10); // CREDIT_SCORE_INCREMENT
    });
  });

  describe("Remittances", function () {
    it("Should allow sending remittances", async function () {
      const amount = ethers.utils.parseUnits("100", 6);
      const currency = "USD";
      
      await mockUSDT.connect(user1).approve(unifiCore.address, amount);
      
      await expect(
        unifiCore.connect(user1).sendRemittance(user2.address, amount, currency)
      ).to.emit(unifiCore, "RemittanceSent");
    });
  });

  describe("Access Control", function () {
    it("Should allow only owner to set initial credit score", async function () {
      await expect(
        unifiCore.connect(user1).setInitialCreditScore(user2.address, 500)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to set initial credit score", async function () {
      await expect(
        unifiCore.setInitialCreditScore(user1.address, 500)
      ).to.not.be.reverted;
    });
  });
}); 