import { task } from "hardhat/config"
import { save } from "./utils/save"
import { verify } from "./utils/verify"

task("deploy", "📰 Deploys a contract, saves the artifact and verifies it.")
  .addParam("contract", "Name of the contract to deploy.", "FunFactory")
  .addOptionalVariadicPositionalParam(
    "args",
    "Constructor arguments for the contract"
  )
  .addFlag("save", "Flag to indicate whether to save the contract or not")
  .addFlag("verify", "Flag to indicate whether to verify the contract or not")
  .setAction(async (args, { ethers, network, run }) => {
    await run("compile")

    const constructorArgs = args.args || []

    console.log(`Deploying ${args.contract} to ${network.name}...`)

    try {
      const ContractFactory = await ethers.getContractFactory(args.contract)
      const Contract = await ContractFactory.deploy(...constructorArgs)

      console.log(
        `📰 Contract ${args.contract} deployed to ${network.name} at address: ${Contract.target}`
      )
    } catch (error) {
      console.error("Deployment failed:", error)
    }
  })
