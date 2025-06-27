import { tenderly } from "./tenderlyConfig";
import { sepolia } from "viem/chains";

export const createFork = async () => {
  const { baseApiUrl, accessKey } = tenderly;
  const res = await fetch(`${baseApiUrl}/fork`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-Access-Key": accessKey,
    },
    body: JSON.stringify({ network_id: sepolia.id.toString() }),
  });
  if (!res.ok) throw new Error("Failed to create fork");
  const { simulation_fork } = await res.json();
  return simulation_fork;
};

export const deleteFork = async (forkId) => {
  const { baseApiUrl, accessKey } = tenderly;

  const res = await fetch(`${baseApiUrl}/fork/${forkId}`, {
    method: "DELETE",
    headers: {
      "X-Access-Key": accessKey,
    },
  });

  if (!res.ok) throw new Error("Failed to delete fork");
  return true;
};
