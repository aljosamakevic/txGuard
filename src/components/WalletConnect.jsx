import { useWallet } from "../hooks/useWallet";
import { sepolia } from "viem/chains";

const WalletConnect = () => {
  const {
    address,
    isConnected,
    connectWallet,
    disconnectWallet,
    chain,
    connectError,
    switchChain,
    isSwitchChainPending,
  } = useWallet();

  console.log("chain", chain);

  return (
    <section className="p-4 rounded-xl border border-gray-300 max-w-md">
      {isConnected ? (
        <>
          <p className="mb-2 text-sm text-gray-700">Connected:</p>
          <p className="mb-1 font-mono break-all text-green-700">{address}</p>
          <div className="p-4 flex items-center justify-center">
            <p className="p-2 text-xs text-gray-500">Chain: {chain ? chain?.name : "Unsupported chain"}</p>
            {chain?.id !== sepolia.id && (
              <button
                onClick={() => switchChain({ chainId: sepolia.id })}
                disabled={isSwitchChainPending}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                {isSwitchChainPending ? "Switching…" : "Switch to Sepolia"}
              </button>
            )}
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Disconnect
          </button>
        </>
      ) : (
        <>
          <button
            onClick={connectWallet}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Connect Wallet
          </button>
          {connectError && <p className="text-sm text-red-600 mt-2">Error: {connectError.message}</p>}
        </>
      )}
    </section>
  );
};

export default WalletConnect;
