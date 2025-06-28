import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { encodeFunctionData, parseUnits } from "viem";
import { sepolia } from "viem/chains";
import { simulateTx } from "../../lib/simulateTx";
import { getContract } from "../../contracts";
import { useWallet } from "../../hooks/useWallet";
import { parseSimulationResult } from "../../lib/parseSimulationResult.js";

import BalanceSection from "./BalanceSection";
import TransferForm from "./TransferForm";
import SimulationResult from "./SimulationResult";

const TransferSimulator = () => {
  const { address } = useWallet();
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
    query: { enabled: true },
  });

  const {
    data: writeData,
    writeContract,
    isPending: transferIsPending,
    isSuccess: transferIsSuccess,
    error: transferError,
  } = useWriteContract({
    address: tokenAddress,
    abi,
    functionName: "transfer",
    args: [recipient, parseUnits(amount, 18)],
  });

  const { isSuccess: txConfirmed } = useWaitForTransactionReceipt({ hash: writeData?.hash });

  useEffect(() => {
    if (txConfirmed) balanceRefetch();
  }, [txConfirmed, balanceRefetch]);
  //   TODO figure out why balanceRefetch doesn't refresh UI with newest balance amount after the TX from handleTransfer succesfully went through

  const handleSimulate = async () => {
    setParsedResult(null);
    const data = encodeFunctionData({ abi, functionName: "transfer", args: [recipient, parseUnits(amount, 18)] });
    const simulation = await simulateTx({ from: address, to: tokenAddress, data });

    setParsedResult(parseSimulationResult(simulation));
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

  return (
    address && (
      <div className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow space-y-6">
        <h2 className="text-xl text-black font-semibold">Transfer Simulation</h2>
        <BalanceSection
          balance={balance}
          error={balanceError}
          isPending={balanceIsPending}
          onRefresh={balanceRefetch}
        />
        <TransferForm
          recipient={recipient}
          setRecipient={setRecipient}
          amount={amount}
          setAmount={setAmount}
          onSubmit={handleSimulate}
          balance={balance}
          error={error}
          setError={setError}
        />
        {parsedResult && (
          <SimulationResult
            result={parsedResult}
            onExecute={() => handleTransfer()}
            isPending={transferIsPending}
            isSuccess={transferIsSuccess}
            error={transferError}
          />
        )}
      </div>
    )
  );
};

export default TransferSimulator;
