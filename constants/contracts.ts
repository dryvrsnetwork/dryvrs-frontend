// constants/contracts.ts

// The V2 Local Anvil Deployments (Synced to your latest deployment)
export const MOCK_USDC_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const RIDE_ESCROW_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
export const FEE_SPLITTER_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const DGEN_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export const MOCK_USDC_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const RIDE_ESCROW_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "paymentToken", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "bytes32", "name": "payloadHash", "type": "bytes32" },
      { "internalType": "uint256", "name": "expiry", "type": "uint256" },
      { "internalType": "bytes", "name": "backendSignature", "type": "bytes" }
    ],
    "name": "requestRide",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "rideId", "type": "uint256" }],
    "name": "acceptRide",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "rideId", "type": "uint256" }],
    "name": "completeRide",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "rideId", "type": "uint256" }],
    "name": "cancelRide",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextRideId",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "rides",
    "outputs": [
      { "internalType": "address", "name": "rider", "type": "address" },
      { "internalType": "address", "name": "driver", "type": "address" },
      { "internalType": "address", "name": "paymentToken", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "feeAmount", "type": "uint256" },
      { "internalType": "bytes32", "name": "payloadHash", "type": "bytes32" },
      { "internalType": "uint8", "name": "status", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;