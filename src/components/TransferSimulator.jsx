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
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Transfer Simulation</h2>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full px-3 py-2 text-sm border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="number"
          placeholder="Amount (wei)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 text-sm border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        onClick={handleTxSimulate}
        disabled={!isConnected}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded transition disabled:opacity-50"
      >
        Simulate Transfer
      </button>

      {error && <p className="text-sm text-red-600 bg-red-100 px-4 py-2 rounded border border-red-300">{error}</p>}

      {parsedResult && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded space-y-2 text-sm text-gray-800">
          <div>
            <span className="font-medium">✅ Simulation:</span>{" "}
            <span className={parsedResult.success ? "text-green-600" : "text-red-600"}>
              {parsedResult.success ? "Success" : "Failed"}
            </span>
          </div>
          <div>
            Function: <span className="font-mono text-gray-600">{parsedResult.functionSelector}</span>
          </div>
          <div>
            From: <span className="font-mono text-gray-600 break-all">{parsedResult.from}</span>
          </div>
          <div>
            To: <span className="font-mono text-gray-600 break-all">{parsedResult.to}</span>
          </div>
          <div>
            Amount:{" "}
            <span className="font-mono text-gray-600">
              {parsedResult.value} {parsedResult.tokenSymbol}
            </span>
          </div>
          <div>
            Gas Used: <span className="font-mono text-gray-600">{parsedResult.gasUsed}</span>
          </div>
          <a
            href={parsedResult.dashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-medium"
          >
            View on Tenderly
          </a>
        </div>
      )}
    </div>
  );
};

export default TransferSimulator;
