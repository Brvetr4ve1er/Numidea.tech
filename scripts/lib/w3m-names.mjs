/**
 * The names law of « Le web3, sans fumée » vol. 2, the nine modules (web3x SPEC X5/X7, approved as the default on
 * 2026-11-22, OWNER-CONTENT §45): every product, project, chain or case name the modules print, the stops that may
 * print it ("M.S"; "*" any stop; "shared" = web3c.* outside the modules), and why. scripts/check.mjs (block 8f-3)
 * fails on a watched name outside its stops and on any name of NEVER anywhere in the volume. The source lists
 * (hub/src/lanterne/ex/web3-modules/_sources.html) cite documents by their publishers and are not read.
 */
export const NAMES = [
  { label: "Bitcoin · Ethereum · Solana", rx: "\\b(Bitcoin|Ethereum|Solana)\\b", allow: "*", kind: "chain", why: "the curriculum's base chains (2.4) and the chains whose own documents the course cites" },
  { label: "TRON", rx: "\\bTRON\\b", allow: "2.2", kind: "chain", why: "an example of delegated proof of stake" },
  { label: "CometBFT · Cosmos SDK", rx: "\\b(CometBFT|Cosmos)\\b", allow: "2.2 5.1", kind: "software", why: "an example of BFT consensus; where CosmWasm runs" },
  { label: "Lightning", rx: "\\bLightning\\b", allow: "2.4", kind: "network", why: "an example of a state channel" },
  { label: "ENS", rx: "\\bENS\\b", allow: "3.3", kind: "naming system", why: "the curriculum's naming system (ERC-137)" },
  { label: "OpenZeppelin", rx: "\\bOpenZeppelin\\b", allow: "4.1 4.3 5.3 8.1 8.2 8.3", kind: "library", why: "the curriculum's library; its docs define token creation, vesting and governor parameters" },
  { label: "Solidity · Vyper · Rust · Move · Anchor · CosmWasm", rx: "\\b(Solidity|Vyper|Rust|Move|Anchor|CosmWasm)\\b", allow: "5.1 5.2 5.3 5.4 9.1 9.2", kind: "language / VM", why: "the curriculum's languages and virtual machines" },
  { label: "Hardhat · Foundry (Forge, Cast, Anvil, Chisel) · Remix", rx: "\\b(Hardhat|Foundry|Forge|Cast|Anvil|Chisel|Remix)\\b", allow: "5.3 9.2", kind: "tool", why: "the curriculum's development tooling" },
  { label: "Sepolia · Hoodi", rx: "\\b(Sepolia|Hoodi)\\b", allow: "5.3", kind: "test network", why: "the test networks ethereum.org lists" },
  { label: "ethers · Viem · Wagmi · WalletConnect", rx: "\\b(ethers(\\.js)?|Viem|Wagmi|WalletConnect)\\b", allow: "6.1", kind: "library / protocol", why: "the curriculum's frontend integration" },
  { label: "Alchemy · Infura · QuickNode", rx: "\\b(Alchemy|Infura|QuickNode)\\b", allow: "6.2", kind: "node provider", why: "the curriculum's RPC providers" },
  { label: "IPFS · Filecoin · Arweave", rx: "\\b(IPFS|Filecoin|Arweave)\\b", allow: "6.3", kind: "storage network", why: "the curriculum's decentralized storage" },
  { label: "The Graph · Chainlink · Pyth", rx: "\\b(The Graph|Chainlink|Pyth)\\b", allow: "6.4 9.3", kind: "indexer / oracle", why: "the curriculum's indexing and oracles (Chainlink again as CCIP's author)" },
  { label: "Uniswap", rx: "\\bUniswap\\b", allow: "7.1", kind: "exchange protocol (DEX)", why: "the author of the documented x · y = k formula and of the impermanent-loss explanation" },
  { label: "dYdX", rx: "\\bdYdX\\b", allow: "7.1 7.4", kind: "exchange protocol (order book)", why: "a documented example of an order book kept by a chain's nodes, and of a funding mechanism" },
  { label: "Aave", rx: "\\bAave\\b", allow: "7.2", kind: "lending protocol", why: "the documented example of a health factor, liquidation rules, a rate curve and flash loans" },
  { label: "TerraUSD", rx: "\\bTerraUSD\\b", allow: "7.3", kind: "stablecoin (case)", why: "the SEC's case: an algorithmic stablecoin that lost its peg in May 2022" },
  { label: "Snapshot", rx: "\\bSnapshot\\b", allow: "8.1 8.2", kind: "voting service", why: "the curriculum's off-chain voting" },
  { label: "Safe", rx: "\\bSafe\\b", allow: "8.1", kind: "multisig account", why: "the curriculum's multisig execution" },
  { label: "Coordinape", rx: "\\bCoordinape\\b", allow: "8.3", kind: "tool", why: "a documented example of peer-split pay" },
  { label: "Ooki DAO", rx: "\\bOoki\\b", allow: "8.3", kind: "case", why: "the CFTC's case" },
  { label: "Wyoming (DAO LLC, DUNA)", rx: "\\b(Wyoming|DUNA)\\b", allow: "8.3 shared", kind: "law", why: "the two DAO laws the course cites" },
  { label: "a16z", rx: "\\ba16z\\b", allow: "8.3", kind: "investor (author)", why: "the author of the progressive-decentralization guide" },
  { label: "The DAO", rx: "« ?The DAO ?»", allow: "9.1", kind: "case", why: "ethereum.org's 2016 reentrancy incident" },
  { label: "Slither", rx: "\\bSlither\\b", allow: "9.2", kind: "tool", why: "the curriculum's static analyser" },
  { label: "LayerZero · CCIP · IBC", rx: "\\b(LayerZero|CCIP|IBC)\\b", allow: "9.3", kind: "messaging protocol", why: "the curriculum's messaging protocols" },
  { label: "Wormhole", rx: "\\bWormhole\\b", allow: "9.3", kind: "bridge (case)", why: "ethereum.org's bridge incident" },
];
// never printed anywhere in the modules: staking and yield products, stablecoin issuers other than the SEC case, layer-2
// brands, plus wallet, exchange and explorer brands
export const NEVER = "\\b(Lido|Rocket Pool|EigenLayer|Eigen|Compound|MakerDAO|USDC|USDT|Tether|Circle|Hyperliquid|Yearn|Curve|Balancer|GMX|Synthetix|Ronin|Polygon|Arbitrum|Optimism|zkSync|Starknet|Tally|Cactus|MetaMask|Trezor|Binance|Coinbase|Kraken|Phantom|Rabby|Etherscan|revoke\\.cash|Uniswap Labs)\\b";
