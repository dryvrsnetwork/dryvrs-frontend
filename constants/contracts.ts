// constants/contracts.ts

// The Live Base Sepolia Deployments
export const MOCK_USDC_ADDRESS = "0x1410609B6cD93C6fbF8720c03B36779E706a9ae2";
export const FEE_SPLITTER_ADDRESS = "0xC9560d7A8b306E62Fbb8C52A334B9697A368df75";
export const DGEN_ADDRESS = "0xb984CbA58269B2b51DaB2C0B67436f914b7ac1d5";
export const RIDE_ESCROW_ADDRESS = "0x7371ED62b67BE9DA1EC0bE5A8B8e6b189e99ddaf";

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