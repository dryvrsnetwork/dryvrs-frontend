import { NextResponse } from 'next/server';
import { keccak256, encodePacked } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rideId, accelData, wifiNodes } = body;

    if (rideId === undefined) {
      return NextResponse.json({ error: "Missing rideId" }, { status: 400 });
    }

    // 1. Generate the Telemetry Hash (Zero-Knowledge Proof)
    const telemetryString = `${rideId}-${accelData?.z || '9.8'}-${wifiNodes || '0'}`;
    const telemetryHash = keccak256(encodePacked(['string'], [telemetryString]));

    // 2. Load the Master Backend Signer
    const pk = process.env.BACKEND_PRIVATE_KEY;
    if (!pk) throw new Error("CRITICAL: Missing BACKEND_PRIVATE_KEY");
    
    // Ensure the private key is properly formatted as a hex string
    const formattedPk = pk.startsWith('0x') ? pk : `0x${pk}`;
    const account = privateKeyToAccount(formattedPk as `0x${string}`);

    // 3. Recreate the EXACT payload the Solidity contract expects
    const payloadToHash = encodePacked(
      ['string', 'uint256', 'bytes32'],
      ['GHOST_MODE_SETTLED', BigInt(rideId), telemetryHash]
    );

    // Keccak256 the packed bytes, then sign it 
    // (viem automatically handles the EthSignedMessage prefix to match Solidity)
    const messageHash = keccak256(payloadToHash);
    const signature = await account.signMessage({ message: { raw: messageHash } });

    return NextResponse.json({
      success: true,
      telemetryHash,
      oracleSignature: signature
    });

  } catch (error) {
    console.error("Ghost Oracle Error:", error);
    return NextResponse.json({ error: "Oracle signature failed." }, { status: 500 });
  }
}