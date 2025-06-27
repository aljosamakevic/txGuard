import { tenderly } from "./tenderlyConfig";
import { sepolia } from "viem/chains";

export const createTestnet = async ({
  slug = "my_sepolia_virtual_testnet",
  display_name = "My Sepolia Virtual Testnet",
  chain_id = 73571,
}) => {
  const { baseApiUrl, accessKey } = tenderly;
  const payload = {
    slug,
    display_name,
    fork_config: {
      network_id: sepolia.id,
      block_number: "latest",
    },
    virtual_network_config: {
      chain_config: {
        chain_id: chain_id ?? 73571,
      },
    },
    sync_state_config: {
      enabled: false,
      commitment_level: "latest",
    },
    explorer_page_config: {
      enabled: false,
      verification_visibility: "abi",
    },
  };

  const res = await fetch(`${baseApiUrl}/vnets`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-Access-Key": accessKey,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Create Testnet failed", {
      status: res.status,
      body: err,
    });
    throw new Error(err.error || `Failed to create Virtual Testnet (status: ${res.status})`);
  }
  return await res.json();
};

export const deleteTestnet = async (testnetId) => {
  const { baseApiUrl, accessKey } = tenderly;

  const res = await fetch(`${baseApiUrl}/vnets/${testnetId}`, {
    method: "DELETE",
    headers: {
      "X-Access-Key": accessKey,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error("Failed to delete Virtual Testnet", err.error || "");
  }
  return true;
};
