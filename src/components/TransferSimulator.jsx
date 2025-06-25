import { useState } from "react";
import { encodeFunctionData } from "viem";
import { sepolia } from "viem/chains";
import { simulateTx } from "../lib/simulateTx";
import { getContract } from "../contracts";
import { useWallet } from "../hooks/useWallet";
import { parseSimulationResult } from "../lib/parseSimulationResult";

const TransferSimulator = () => {
  const { address, isConnected } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [parsedResult, setParsedResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTxSimulate = async () => {
    setError(null);
    setParsedResult(null);

    try {
      const { abi, address: tokenAddress } = getContract("token", sepolia.id);

      const data = encodeFunctionData({
        abi,
        functionName: "transfer",
        args: [recipient, BigInt(amount)],
      });

      const simulation = await simulateTx({
        from: address,
        to: tokenAddress,
        data,
      });

      const parsed = parseSimulationResult(simulation);
      setParsedResult(parsed);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Amount (wei)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleTxSimulate}
        disabled={!isConnected}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
      >
        Simulate Transfer
      </button>

      {error && <p className="text-red-600 bg-red-50 px-4 py-2 rounded">{error}</p>}

      {parsedResult && (
        <div className="p-4 bg-gray-600 rounded space-y-2">
          <p className="font-medium">
            ✅ Simulation:{" "}
            <span className={parsedResult.success ? "text-green-600" : "text-red-600"}>
              {parsedResult.success ? "Success" : "Failed"}
            </span>
          </p>
          <p>
            Function: <span className="font-mono">{parsedResult.functionSelector}</span>
          </p>
          <p>
            From: <span className="font-mono">{parsedResult.from}</span>
          </p>
          <p>
            To: <span className="font-mono">{parsedResult.to}</span>
          </p>
          <p>
            Amount:{" "}
            <span className="font-mono">
              {parsedResult.value} {parsedResult.tokenSymbol}
            </span>
          </p>
          <p>
            Gas Used: <span className="font-mono">{parsedResult.gasUsed}</span>
          </p>
          <a
            href={parsedResult.dashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View on Tenderly
          </a>
        </div>
      )}
    </div>
  );
};

export default TransferSimulator;
