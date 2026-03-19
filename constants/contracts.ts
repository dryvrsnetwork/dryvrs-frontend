/// constants/contracts.ts

// The Live Base Sepolia Deployments
export const MOCK_USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || "0x6c95A604D44B05DAbC44C2f82Dc8Be142c61b3Fc";
export const RIDE_ESCROW_ADDRESS = process.env.NEXT_PUBLIC_RIDE_ESCROW_ADDRESS || "0x82A8a75BDFF0DbCAeF8a0Aa99b2D27df13924aF0";
export const FEE_SPLITTER_ADDRESS = process.env.NEXT_PUBLIC_FEE_SPLITTER_ADDRESS || "0x37633651998685637656279507AAB45177Db97dE";
export const DGEN_ADDRESS = process.env.NEXT_PUBLIC_DGEN_ADDRESS || "0xE5BEf5e3d4b72cDf8F78c46AE5A59680eEa4C9D6";

// ... Keep your existing RIDE_ESCROW_ABI and MOCK_USDC_ABI down below!

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
    "inputs": [
      { "internalType": "uint256", "name": "rideId", "type": "uint256" },
      { "internalType": "bytes32", "name": "telemetryHash", "type": "bytes32" },
      { "internalType": "bytes", "name": "oracleSignature", "type": "bytes" }
    ],
    "name": "completeRideGhostMode",
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