// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // Get the contract factory for FileRegistry
  const FileRegistry = await hre.ethers.getContractFactory("FileRegistry");
  // Deploy the contract
  const fileRegistry = await FileRegistry.deploy();

  // Optional – you can wait until the deployment is fully completed
  if (fileRegistry.waitForDeployment) {
    await fileRegistry.waitForDeployment();
  }

  // Log the deployed contract address
  console.log("✅ FileRegistry deployed at:", fileRegistry.target || fileRegistry.address);
}

// Run the main deployment function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
