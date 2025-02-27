const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreatorPlatform", function () {
  let creatorPlatform;
  let owner, creator;

  beforeEach(async () => {
    [owner, creator] = await ethers.getSigners();
    const CreatorPlatform = await ethers.getContractFactory("CreatorPlatform");
    creatorPlatform = await CreatorPlatform.deploy();
  });

  it("Should create a profile", async () => {
    await creatorPlatform.connect(creator).createProfile("Alice", "Artist");
    const profile = await creatorPlatform.creators(creator.address);
    expect(profile.name).to.equal("Alice");
  });

  it("Should add a product", async () => {
    await creatorPlatform.connect(creator).createProfile("Bob", "Developer");
    await creatorPlatform.connect(creator).addProduct("Solidity Course", "Learn Solidity", 100);
    const product = await creatorPlatform.getProduct(creator.address, 0);
    expect(product.title).to.equal("Solidity Course");
  });
});
