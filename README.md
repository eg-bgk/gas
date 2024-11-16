# 💊 World.fun

World.fun is a sybil-resistant social token platform built on Worldcoin. Create, trade, and discover personal tokens with automated market making - like pump.fun but with human verification to prevent manipulation.

## How It Works

World.fun is a social token platform that provides:

1. **Token Creation**: Create your own ERC20 social tokens with customizable name, symbol, and metadata
2. **Sybil Resistance**: Integrated with World ID to ensure one-person-one-token creation
3. **Automated Market Maker**: Built-in bonding curve for token pricing
4. **Token Trading**: Buy and sell tokens directly through the platform
5. **Token Discovery**: Browse and search all created tokens

The application consists of:

- Smart contracts deployed on Worldchain
- Next.js frontend with Wagmi for web3 integration
- World ID integration for sybil resistance

## Directory Structure

- `app`: Next.js frontend application
- `contracts`: Solidity smart contracts
- `scripts`: Deployment and test scripts
- `test`: Contract test files

## Setup

1. Install dependencies:

```sh
pnpm install
cd app
pnpm install
```

2. Configure environment variables:

```sh
cp .env.template .env
cd app
cp .env.template .env
```

## Running

1. Start the frontend development server:

```sh
cd app
pnpm dev
```

2. Deploy contracts:

```sh
npx hardhat deploy --network worldchain
```

3. Change the `FUN_FACTORY_ADDRESS` in `app/src/lib/addresses.ts` to the address of the deployed `FunFactory` contract.
