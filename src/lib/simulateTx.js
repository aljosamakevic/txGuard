import { sepolia } from "viem/chains";
import { tenderly } from "./tenderlyConfig";

export async function simulateTx({ from, to, value = "0x0", data }) {
  const { account, project, accessKey } = tenderly;

  const response = await fetch(`https://api.tenderly.co/api/v1/account/${account}/project/${project}/simulate`, {
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
}
