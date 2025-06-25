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
    <section className="p-6 rounded-lg border border-gray-200 max-w-md space-y-4 bg-white shadow-sm">
      {isConnected ? (
        <>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Connected</p>
            <p className="text-sm font-mono text-green-600 break-all">{address}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Network: {chain?.name || "Unsupported"}</span>
            {chain?.id !== sepolia.id && (
              <button
                onClick={() => switchChain({ chainId: sepolia.id })}
                disabled={isSwitchChainPending}
                className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSwitchChainPending ? "Switching…" : "Switch to Sepolia"}
              </button>
            )}
          </div>

          <button
            onClick={disconnectWallet}
            className="w-full py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600"
          >
            Disconnect
          </button>
        </>
      ) : (
        <>
          <button
            onClick={connectWallet}
            className="w-full py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Connect Wallet
          </button>
          {connectError && <p className="text-sm text-red-600 text-center">{connectError.message}</p>}
        </>
      )}
    </section>
  );
};

export default WalletConnect;
