import { createConfig } from "wagmi";
import { sepolia } from "viem/chains";
import { http } from "viem";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  autoConnect: true,
  connectors: [metaMask()],
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true,
});
