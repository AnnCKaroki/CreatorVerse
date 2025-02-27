require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    edu: {
      url: process.env.EDU_RPC_URL,
      chainId: parseInt(process.env.EDU_CHAIN_ID),
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
