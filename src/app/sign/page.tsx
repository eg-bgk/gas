'use client';

import {
  SignProtocolClient,
  SpMode,
  EvmChains,
  IndexService,
  decodeOnChainData,
  DataLocationOnChain
} from "@ethsign/sp-sdk";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useAccount, useChainId } from "wagmi";

// Separate component for better organization
function SignActions() {
  const [result, setResult] = useState("");
  const [formData, setFormData] = useState({
    schemaId: "",
    attestationId: "",
    attestationData: "",
    schemaData: ""
  });
  
  const { address } = useAccount();
  const chainId = useChainId();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const createSchema = async () => {
    try {
      const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.baseSepolia
      });

      const res = await client.createSchema({
        name: "SDK Test",
        data: [
          { name: "contractDetails", type: "string" },
          { name: "signer", type: "address" }
        ]
      });

      setResult(JSON.stringify(res, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const createAttestation = async () => {
    try {
      const client = new SignProtocolClient(SpMode.OnChain, {
        chain: EvmChains.baseSepolia
      });

      const res = await client.createAttestation({
        schemaId: formData.schemaId,
        data: {
          contractDetails: "contract details",
          signer: address
        },
        indexingValue: address?.toLowerCase() ?? ""
      });

      setResult(JSON.stringify(res, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-md">
      <ConnectButton />
      
      <div className="space-y-4">
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={createSchema}
        >
          Create Schema
        </button>

        <input
          className="w-full px-4 py-2 border rounded text-black"
          id="schemaId"
          placeholder="Schema ID"
          value={formData.schemaId}
          onChange={handleInputChange}
        />
        
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={createAttestation}
        >
          Create Attestation
        </button>

        <input
          className="w-full px-4 py-2 border rounded text-black"
          id="attestationId"
          placeholder="Attestation ID"
          value={formData.attestationId}
          onChange={handleInputChange}
        />
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={async () => {
            const indexService = new IndexService("testnet");

            const attId = `onchain_evm_${chainId}_${formData.attestationId}`;
            const res = await indexService.queryAttestationList(attId);

            setResult(JSON.stringify(res, null, 2));
          }}
        >
          Get Attestation
        </button>

        <input
          className="w-full px-4 py-2 border rounded text-black"
          id="attestationData"
          placeholder="Attestation Data"
          value={formData.attestationData}
          onChange={handleInputChange}
        />
        <input
          className="w-full px-4 py-2 border rounded text-black"
          id="schemaData"
          placeholder="Schema Data"
          value={formData.schemaData}
          onChange={handleInputChange}
        />
        <button
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={async () => {
            setResult(
              JSON.stringify(decodeOnChainData(formData.attestationData, DataLocationOnChain.ONCHAIN, JSON.parse(formData.schemaData)))
            );
          }}
        >
          Decode Attestation Data
        </button>

        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[200px] text-sm">
          {result}
        </pre>
      </div>
    </div>
  );
}

export default function SignPage() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Sign Protocol Interface</h1>
        <SignActions />
      </main>
    </div>
  );
}