import { createConfig, configureChains } from "wagmi";
import { sepolia } from "viem/chains";
import { publicProvider } from "wagmi/providers/public";
import { metaMask } from "wagmi/connectors";

const { publicClient } = configureChains([sepolia], [publicProvider()]);

export const config = createConfig({
  autoConnect: true,
  connectors: [metaMask()],
  publicClient,
});
