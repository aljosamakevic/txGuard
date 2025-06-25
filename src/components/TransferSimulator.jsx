import { useState } from "react";
import { encodeFunctionData } from "viem";
import { sepolia } from "viem/chains";
import { simulateTx } from "../lib/simulateTx";
import { getContract } from "../contracts";
import { useWallet } from "../hooks/useWallet";

const TransferSimulator = () => {
  const { address, isConnected } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTxSimulate = async () => {
    setError(null);
    setResult(null);

    try {
      const { abi, address: tokenAddress } = getContract("TOKEN_CONTRACT", sepolia.id);

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

      setResult(simulation);
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

      {result && (
        <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
};

export default TransferSimulator;
