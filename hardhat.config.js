/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require('solidity-coverage')
require("dotenv").config()


module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {},
    rinkeby: {
      url: process.env.API_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}
