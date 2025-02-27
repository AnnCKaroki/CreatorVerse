async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const CreatorPlatform = await ethers.getContractFactory("CreatorPlatform");
    const contract = await CreatorPlatform.deploy();

    await contract.waitForDeployment();
    console.log("Contract deployed to:", await contract.getAddress());
  }

  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
