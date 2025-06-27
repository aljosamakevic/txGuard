import { useWallet } from "../hooks/useWallet";

const ForkManager = () => {
  const { address } = useWallet();
  return address && <div>Fork Manager</div>;
};

export default ForkManager;
