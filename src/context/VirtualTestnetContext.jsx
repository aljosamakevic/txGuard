import { useState, useMemo, createContext } from "react";
import { createConfig, WagmiProvider } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { http } from "viem";
import { sepolia } from "viem/chains";
import { config } from "../wagmiConfig";

export const VirtualTestnetContext = createContext({
  testnet: {},
  setTestnet: () => {},
});
//   TODO figure out how to dynamically remake wagmiprovider when a VirtualTestnet is built, so that the whole dapp and its components support not only sepolia but also that virtual testnet network as well - I realize this is potentially just a bad idea, but I wanted to try
export function VirtualTestnetProvider({ children }) {
  const [testnet, setTestnet] = useState(null);

  const activeRpcUrl = useMemo(() => {
    if (testnet) {
      const rpc = testnet.rpcs.find((rpc) => rpc.name === "Public RPC");
      return rpc.url || testnet.rpcs[2].url || testnet.rpcs[0].url;
    }
    return sepolia.rpcUrls.default.http;
  }, [testnet]);

  const wagmiConfig = useMemo(() => {
    if (testnet) {
      return createConfig({
        autoConnect: true,
        connectors: [metaMask()],
        chains: [sepolia, testnet],
        transports: {
          [sepolia.id]: http(),
          [Number(testnet.id)]: activeRpcUrl,
        },
        ssr: true,
      });
    } else {
      return config;
    }
  }, [activeRpcUrl, testnet]);

  return (
    <VirtualTestnetContext.Provider value={{ testnet, setTestnet }}>
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </VirtualTestnetContext.Provider>
  );
}

export default VirtualTestnetProvider;
