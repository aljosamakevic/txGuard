import { useState, useEffect } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { encodeFunctionData, formatUnits, parseUnits, isAddress } from "viem";
import { sepolia } from "viem/chains";
import { simulateTx } from "../lib/simulateTx";
import { getContract } from "../contracts";
import { useWallet } from "../hooks/useWallet";
import { parseSimulationResult } from "../lib/parseSimulationResult";

import { RefreshCcw } from "lucide-react";
import Spinner from "../assets/Spinner";

const TransferSimulator = () => {
  const { address, isConnected } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [parsedResult, setParsedResult] = useState(null);
  const [error, setError] = useState(null);
  const { abi, address: tokenAddress } = getContract("token", sepolia.id);
  const {
    data: balance,
    error: balanceError,
    isPending: balanceIsPending,
    refetch: balanceRefetch,
  } = useReadContract({
    address: tokenAddress,
    abi,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: true,
    },
  });
  const {
    writeContract,
    isPending: transferIsPending,
    isSuccess: transferIsSuccess,
    error: transferError,
  } = useWriteContract();

  const handleTxSimulate = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return setError("Please provide a valid token amount greater than 0.");
    }
    if (!recipient || !isAddress(recipient)) {
      return setError("Please provide a valid recipient address.");
    }
    if (recipient.toLowerCase() === address.toLowerCase()) {
      return setError("You cannot send tokens to yourself.");
    }
    if (BigInt(amount) > balance) {
      return setError("You do not have enough tokens.");
    }
    setError(null);
    setParsedResult(null);

    const parsedAmount = parseUnits(amount, 18);

    try {
      const { abi, address: tokenAddress } = getContract("token", sepolia.id);

      const data = encodeFunctionData({
        abi,
        functionName: "transfer",
        args: [recipient, parsedAmount],
      });

      const simulation = await simulateTx({
        from: address,
        to: tokenAddress,
        data,
      });

      const parsed = parseSimulationResult(simulation);
      setParsedResult(parsed);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleTransfer = async () => {
    await writeContract({
      address: tokenAddress,
      abi,
      functionName: "transfer",
      args: [recipient, BigInt(amount)],
    });
  };

  useEffect(() => {
    balanceRefetch();
  }, [transferIsSuccess, balanceRefetch]);

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
        <div className="flex items-center justify-between">
          {balance && (
            <div className="flex flex-col items-start">
              <p className="text-xs text-gray-800">Your token balance is</p>
              <p className="text-xs text-gray-800">{formatUnits(balance, 18)}</p>
              {/* TODO format amount input so user types whole tokens and I calculate in wei */}
            </div>
          )}
          {balanceError && <p className="text-sm text-red-600">{balanceError.message}</p>}
          <button
            onClick={() => {
              balanceRefetch();
            }}
            className="w-8 h-8 !p-2  rounded-full bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
            disabled={balanceIsPending}
            title="Refresh balance"
          >
            {balanceIsPending ? <Spinner /> : <RefreshCcw className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>

      <button
        onClick={handleTxSimulate}
        disabled={!isConnected || !recipient || !amount}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded transition disabled:opacity-50"
      >
        Simulate Transfer
      </button>

      {error && <p className="text-sm text-red-600 bg-red-100 px-4 py-2 rounded border border-red-300">{error}</p>}

      {parsedResult && (
        <>
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
          {/* Buttons for executing transfer and reading balance, only if simulation passes */}
          {parsedResult?.success && (
            <div className="space-y-2 mt-4">
              <button
                onClick={handleTransfer}
                disabled={transferIsPending}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded w-full"
              >
                {transferIsPending ? <Spinner /> : "Execute Transfer"}
              </button>
              {transferIsSuccess && <p className="mt-2 text-sm text-green-600">✅ Transfer successful!</p>}
              {transferError && <p className="mt-2 text-sm text-red-600">❌ {transferError.message}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransferSimulator;
