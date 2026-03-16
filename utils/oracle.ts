// utils/oracle.ts
import { ethers } from 'ethers';

export async function generateQuoteSignature(
  riderAddress: string,
  paymentTokenAddress: string,
  amountWei: string,
  payloadHash: string,
  expiryTimestamp: number,
  backendPrivateKey: string
) {
  const wallet = new ethers.Wallet(backendPrivateKey);
  
  const message = ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'address', 'uint256', 'bytes32', 'uint256'],
    [riderAddress, paymentTokenAddress, amountWei, payloadHash, expiryTimestamp]
  );
  
  const messageHash = ethers.keccak256(message);
  return await wallet.signMessage(ethers.getBytes(messageHash));
}