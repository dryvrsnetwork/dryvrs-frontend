import { NextResponse } from 'next/server';
import { keccak256, encodeAbiParameters, parseAbiParameters } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rider, paymentToken, amount, payloadHash, expiry } = body;

    if (!rider || !paymentToken || !amount || !payloadHash || !expiry) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Load the Master Treasury Signer from Vercel Environment Variables
    const pk = process.env.BACKEND_PRIVATE_KEY;
    if (!pk) throw new Error("CRITICAL: Missing BACKEND_PRIVATE_KEY");
    
    // Ensure formatting
    const formattedPk = pk.startsWith('0x') ? pk : `0x${pk}`;
    const account = privateKeyToAccount(formattedPk as `0x${string}`);

    // EXACT MATCH to Solidity's abi.encode(msg.sender, paymentToken, amount, payloadHash, expiry)
    const encodedData = encodeAbiParameters(
      parseAbiParameters('address, address, uint256, bytes32, uint256'),
      [
        rider as `0x${string}`, 
        paymentToken as `0x${string}`, 
        BigInt(amount), 
        payloadHash as `0x${string}`, 
        BigInt(expiry)
      ]
    );

    // Hash the encoded data
    const structHash = keccak256(encodedData);

    // Sign the hash (viem automatically adds the EthSignedMessage prefix)
    const signature = await account.signMessage({ message: { raw: structHash } });

    return NextResponse.json({
      success: true,
      signature
    });

  } catch (error) {
    console.error("Quote Oracle Error:", error);
    return NextResponse.json({ error: "Oracle failed to sign quote" }, { status: 500 });
  }
}