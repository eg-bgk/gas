import fs from "fs"
import path from "path"
import prettier from "prettier"
import { Abi } from "viem"

export const save = async (chainId: number, address: string, abi: Abi) => {
  const contractsDir = path.join(__dirname, "..", "..", "app", "src", "lib")
  const filePath = path.join(contractsDir, "abi.ts")

  if (!fs.existsSync(contractsDir)) fs.mkdirSync(contractsDir)

  let existingContracts = {}
  if (fs.existsSync(filePath)) {
    try {
      const { Contracts } = await import(filePath)
      existingContracts = Contracts
    } catch (error) {
      console.error("Error importing existing contracts:", error)
    }
  }

  const fileContent = `import { Abi } from "viem"
  
export const ABI: Abi = ${JSON.stringify(abi, null, 2)}`

  fs.writeFileSync(
    filePath,
    await prettier.format(fileContent, { parser: "typescript" })
  )

  console.log(`💾 Contract artifact has been saved to ${filePath}`)
}