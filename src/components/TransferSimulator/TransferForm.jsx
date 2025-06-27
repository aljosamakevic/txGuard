import { parseUnits, isAddress } from "viem";

const TransferForm = ({ recipient, setRecipient, amount, setAmount, onSubmit, balance, error, setError }) => {
  const validate = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return setError("Enter a token amount > 0");
    }
    if (!recipient || !isAddress(recipient)) {
      return setError("Enter a valid recipient address");
    }
    if (balance != null && parseUnits(amount, 18) > balance) {
      return setError("Insufficient balance");
    }
    setError(null);
    onSubmit();
  };

  return (
    <div className="space-y-2">
      <input
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full px-3 py-2 border text-black rounded focus:ring-purple-500"
      />
      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-3 py-2 border text-black rounded focus:ring-purple-500"
      />
      <button onClick={validate} className="w-full py-2 bg-purple-600 text-white rounded disabled:opacity-50">
        Simulate Transfer
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TransferForm;
