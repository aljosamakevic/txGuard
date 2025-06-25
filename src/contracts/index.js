import { TOKEN_CONTRACT } from "./token";

const contracts = {
  token: TOKEN_CONTRACT,
};

export const getContract = (name, chainId) => {
  const contract = contracts[name];
  if (!contract) throw new Error(`Unknown contract: ${name}`);

  const address = contract.addresses[chainId];
  if (!address) throw new Error(`No address for chain on chain ID: ${chainId}`);

  return {
    abi: contract.abi,
    address,
  };
};
