"use client";

import {
  SignProtocolClient,
  SpMode,
  decodeOnChainData,
  DataLocationOnChain,
  OffChainSignType,
} from "@ethsign/sp-sdk";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { env } from "@/env.mjs";

// Separate component for better organization
function SignActions() {
  const [result, setResult] = useState("");
  const [formData, setFormData] = useState({
    schemaId: "",
    attestationId: "",
    attestationData: "",
    schemaData: "",
  });

  const address = "0xB53a639152c7BACBDC79b1aB263643EB25609E53";

  // const chainId = useChainId();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const createSchema = async () => {
    try {
      const client = new SignProtocolClient(SpMode.OffChain, {
        signType: OffChainSignType.EvmEip712,
        account: privateKeyToAccount(env.NEXT_PUBLIC_SIGNER as Hex),
      });

      const res = await client.createSchema({
        name: "SDK Test",
        data: [
          { name: "contractDetails", type: "string" },
          { name: "signer", type: "address" },
        ],
      });

      setResult(JSON.stringify(res, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  const createAttestation = async () => {
    try {
      const client = new SignProtocolClient(SpMode.OffChain, {
        signType: OffChainSignType.EvmEip712,
        account: privateKeyToAccount(env.NEXT_PUBLIC_SIGNER as Hex),
      });

      const res = await client.createAttestation({
        schemaId: formData.schemaId,
        data: {
          contractDetails: "contract details",
          signer: address,
        },
        indexingValue: address?.toLowerCase() ?? "",
      });

      setResult(JSON.stringify(res, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <ConnectButton />

      <div className="space-y-4">
        <button
          className="w-full rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          onClick={createSchema}
        >
          Create Schema
        </button>

        <input
          className="w-full rounded border bg-background px-4 py-2"
          id="schemaId"
          placeholder="Schema ID"
          value={formData.schemaId}
          onChange={handleInputChange}
        />

        <button
          className="w-full rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          onClick={createAttestation}
        >
          Create Attestation
        </button>

        <input
          className="w-full rounded border bg-background px-4 py-2"
          id="attestationId"
          placeholder="Attestation ID"
          value={formData.attestationId}
          onChange={handleInputChange}
        />
        <button
          className="w-full rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          onClick={async () => {
            const client = new SignProtocolClient(SpMode.OffChain, {
              signType: OffChainSignType.EvmEip712,
              account: privateKeyToAccount(env.NEXT_PUBLIC_SIGNER as Hex),
            });

            const res = await client.getAttestation(formData.attestationId);

            setResult(JSON.stringify(res, null, 2));
          }}
        >
          Get Attestation
        </button>

        <input
          className="w-full rounded border bg-background px-4 py-2"
          id="attestationData"
          placeholder="Attestation Data"
          value={formData.attestationData}
          onChange={handleInputChange}
        />
        <input
          className="w-full rounded border bg-background px-4 py-2"
          id="schemaData"
          placeholder="Schema Data"
          value={formData.schemaData}
          onChange={handleInputChange}
        />
        <button
          className="w-full rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          onClick={async () => {
            setResult(
              JSON.stringify(
                decodeOnChainData(
                  formData.attestationData,
                  DataLocationOnChain.ONCHAIN,
                  JSON.parse(formData.schemaData),
                ),
              ),
            );
          }}
        >
          Decode Attestation Data
        </button>

        <pre className="max-h-[200px] overflow-auto rounded bg-muted p-4 text-sm">{result}</pre>
      </div>
    </div>
  );
}

export default function SignPage() {
  return (
    <div className="min-h-screen p-8">
      <main className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-2xl font-bold">Sign Protocol Interface</h1>
        <SignActions />
      </main>
    </div>
  );
}
