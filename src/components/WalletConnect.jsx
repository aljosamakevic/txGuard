import { useState, useEffect } from "react";
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

const WalletConnect = () => {
  const [address, setAddress] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window === "undefined" || !window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        initializeClient();
      }
    } catch (error) {
      console.error("failed to check wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("No wallet found");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        initializeClient();
      }
    } catch (error) {
      console.error("User rejected wallet connection:", error);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setClient(null);
  };

  const initializeClient = () => {
    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum),
    });

    setClient(walletClient);
  };

  return (
    <section className="p-4 rounded-xl border border-gray-300 max-w-md">
      {address ? (
        <>
          <p className="mb-2 text-sm text-gray-700">Connected wallet:</p>
          <p className="mb-4 font-mono break-all text-green-700">{address}</p>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Connect Wallet
        </button>
      )}
    </section>
  );
};

export default WalletConnect;
