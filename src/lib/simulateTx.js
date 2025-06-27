import { sepolia } from "viem/chains";
import { tenderly } from "./tenderlyConfig";

export const simulateTx = async ({ from, to, value = "0x0", data }) => {
  const { accessKey, baseApiUrl } = tenderly;

  const response = await fetch(`${baseApiUrl}/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Access-Key": accessKey,
    },
    body: JSON.stringify({
      network_id: sepolia.id.toString(),
      from,
      to,
      input: data,
      value,
      save_if_fails: true,
      save: true,
      simulation_type: "quick",
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error || "Simulation failed");
  }

  return result;
};
