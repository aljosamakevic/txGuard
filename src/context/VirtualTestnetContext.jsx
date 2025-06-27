import { useState, useMemo } from "react";
import { createContext } from "react";
import { createConfig } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { http } from "viem";
import { sepolia } from "viem/chains";

const VirutalTestnetContext = createContext({
  testnet: {},
  setTestnet: () => {},
});

export const VirtualTestnetProvider = ({ children }) => {
  const [testnet, setTestnet] = useState(null);

  const activeRpcUrl = useMemo(() => {
    if (testnet) {
      const rpc = testnet.rpcs.find((rpc) => rpc.name === "Public RPC");
      return rpc.url || testnet.rpcs[2].url || testnet.rpcs[0].url;
    }
    return sepolia.repcUrls.default.http;
  }, [testnet]);

  const wagmiConfig = useMemo(() => {
    createConfig({
      autoConnect: true,
      connectors: [metaMask()],
      chains: [sepolia, testnet],
      transports: {
        [sepolia.id]: http(),
        [Number(testnet.id)]: activeRpcUrl,
      },
      ssr: true,
    });
  }, [activeRpcUrl, testnet]);

  return (
    <VirutalTestnetContext.Provider value={{ testnet, setTestnet }}>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
    </VirutalTestnetContext.Provider>
  );
};
