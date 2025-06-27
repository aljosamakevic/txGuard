import { formatUnits } from "viem";
import Spinner from "../../assets/Spinner";
import { RefreshCcw } from "lucide-react";

const BalanceSection = ({ balance, error, isPending, onRefresh }) => {
  return (
    <div className="flex items-center justify-between">
      {balance && (
        <div className="flex flex-col items-start">
          <p className="text-xs text-gray-800">Your token balance is</p>
          <p className="text-xs text-gray-800">{formatUnits(balance, 18)}</p>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
      <button
        onClick={() => onRefresh()}
        className="w-8 h-8 !p-2  rounded-full bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
        disabled={isPending}
        title="Refresh balance"
      >
        {isPending ? <Spinner /> : <RefreshCcw className="w-4 h-4 text-white" />}
      </button>
    </div>
  );
};

export default BalanceSection;
