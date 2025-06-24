import { useAccount, useConnect, useDisconnect, useSwitchNetwork } from "wagmi";

export const useWallet = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, error: connectError, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();

  const connectWallet = async () => {
    try {
      await connect({ connector: connectors[0] });
    } catch (err) {
      console.error("Connection error: ", err);
    }
  };

  return {
    address,
    isConnected,
    chain,
    connectWallet,
    disconnectWallet: disconnect,
    connectError,
    pendingConnector,
    switchNetwork,
  };
};
