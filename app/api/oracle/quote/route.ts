import { NextResponse } from 'next/server';
import { keccak256, encodeAbiParameters, toBytes } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rider, paymentToken, amount, payloadHash, expiry } = body;

    if (!rider || !paymentToken || !amount || !payloadHash || !expiry) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const pk = process.env.BACKEND_PRIVATE_KEY;
    if (!pk) throw new Error("CRITICAL: Missing BACKEND_PRIVATE_KEY in environment");
    
    const cleanPk = pk.replace(/['"]/g, '').trim();
    const formattedPk = cleanPk.startsWith('0x') ? cleanPk : `0x${cleanPk}`;
    
    const account = privateKeyToAccount(formattedPk as `0x${string}`);

    // Encode variables exactly like Solidity's abi.encode
    const encodedData = encodeAbiParameters(
      [
        { type: 'address' },
        { type: 'address' },
        { type: 'uint256' },
        { type: 'bytes32' },
        { type: 'uint256' }
      ],
      [
        rider as `0x${string}`, 
        paymentToken as `0x${string}`, 
        BigInt(amount), 
        payloadHash as `0x${string}`, 
        BigInt(expiry)
      ]
    );

    // Hash the encoded bytes (This outputs a "0x..." string)
    const structHash = keccak256(encodedData);

    // CRITICAL FIX: toBytes() forces viem to sign the raw 32-byte array, 
    // completely preventing it from accidentally signing the ASCII text string.
    const signature = await account.signMessage({ message: { raw: toBytes(structHash) } });

    return NextResponse.json({ success: true, signature });

  } catch (error: any) {
    console.error("Quote Oracle Error:", error);
    return NextResponse.json({ error: error.message || "Oracle failed to sign quote" }, { status: 500 });
  }
}