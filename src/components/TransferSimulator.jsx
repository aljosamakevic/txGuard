import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { encodeFunctionData, formatUnits, parseUnits, isAddress } from "viem";
import { sepolia } from "viem/chains";
import { simulateTx } from "../lib/simulateTx";
import { getContract } from "../contracts";
import { useWallet } from "../hooks/useWallet";
import { parseSimulationResult } from "../lib/parseSimulationResult.js";

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
    data: writeData,
    writeContract,
    isPending: transferIsPending,
    isSuccess: transferIsSuccess,
    error: transferError,
  } = useWriteContract();

  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({
    hash: writeData?.hash,
  });

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
    const parsedAmount = parseUnits(amount, 18);

    await writeContract({
      address: tokenAddress,
      abi,
      functionName: "transfer",
      args: [recipient, parsedAmount],
    });
  };

  useEffect(() => {
    console.log("useEffect");
    if (txConfirmed) {
      console.log("balanceRefetch");
      balanceRefetch();
    }
  }, [txConfirmed, balanceRefetch]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Transfer Simulation</h2>
      <BalanceSection balance={balance} error={balanceError} isPending={balanceIsPending} onRefresh={balanceRefetch} />
      <TransferForm
        recipient={recipient}
        setRecipient={setRecipient}
        amount={amount}
        setAmount={setAmount}
        onSubmit={handleTxSimulate}
        balance={balance}
        error={error}
        setError={setError}
      />
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
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 text-sm border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
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
              Amount:
              <span className="font-mono text-gray-600">
                {formatUnits(parsedResult.value, 18)} {parsedResult.tokenSymbol}
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
