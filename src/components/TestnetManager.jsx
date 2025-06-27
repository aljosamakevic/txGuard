import { useState } from "react";
import { sepolia } from "viem/chains";
import { useWallet } from "../hooks/useWallet";
import { createTestnet, deleteTestnet } from "../lib/tenderlyVirtualTestnet";

const TestnetManager = () => {
  const { address } = useWallet();

  const [testnet, setTestnet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("pre-testnet");
      const slug = `my-testnet-${Date.now()}`;
      const display_name = "My Virtual Sepolia TestNet";
      const chain_id = sepolia.id * 10 + 2;
      console.log("createTestnet params", slug, display_name, chain_id);
      const result = await createTestnet({ slug, display_name, chain_id });
      console.log("post-testnet", result);
      setTestnet(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!testnet?.id) return;
    setLoading(true);
    setError(null);

    try {
      await deleteTestnet(testnet.id);
      setTestnet(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    address && (
      <div className="max-w-md mx-auto p-4 bg-white border rounded-lg space-y-4">
        {testnet ? (
          <>
            <p className="text-sm">
              TestNet ID: <span className="font-mono">{testnet.id}</span>
            </p>
            <p className="text-sm">
              RPC URL:
              <a
                href={testnet.rpcs?.[0]?.url || testnet.rpc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                {testnet.rpcs?.[0]?.url || testnet.rpc_url}
              </a>
            </p>
            <button
              onClick={handleDelete}
              disabled={loading || !testnet}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Deleting…" : "Delete Virtual TestNet"}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleCreate}
              disabled={loading || testnet}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create Virtual TestNet"}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </>
        )}
      </div>
    )
  );
};

export default TestnetManager;
