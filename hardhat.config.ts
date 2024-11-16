import "@nomicfoundation/hardhat-toolbox-viem"
import "@nomicfoundation/hardhat-viem"
import "dotenv/config"
import "hardhat-contract-sizer"
import "./scripts/generate"
import "./scripts/deploy"
import { HardhatUserConfig } from "hardhat/config"
import { HDAccountsUserConfig } from "hardhat/types"

const mnemonic = process.env.MNEMONIC
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file")
}

const accounts: HDAccountsUserConfig = {
  mnemonic,
  count: 100,
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.24" }],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    worldchain_sepolia: {
      url: process.env.WORLDCHAIN_SEPOLIA_RPC_URL || "https://worldchain-sepolia.g.alchemy.com/public",
      accounts,
    },
    worldchain: {
      url: process.env.WORLDCHAIN_RPC_URL || "https://worldchain-mainnet.g.alchemy.com/public",
      accounts,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  mocha: {
    timeout: 20000,
  },
  sourcify: {
    enabled: true,
  },
}

export default config
