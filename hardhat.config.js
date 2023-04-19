require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

// @type import('hardhat/config').HardhatUserConfig

module.exports = {
  solidity: "0.8.18",

  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/FlXc1GV6448rw5v9mgA1sqZkYdrBRtX_",
      accounts: [
        "32806b88289298e466623781e21d937a4e30c4616ac46b4bd1bb62a0d05ce7a1",
      ],
    },
  },
};
