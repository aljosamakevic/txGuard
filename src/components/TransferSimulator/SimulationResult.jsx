import { formatUnits } from "viem";
import Spinner from "../../assets/Spinner";

const SimulationResult = ({ result, onExecute, isPending, isSuccess, error }) => {
  return (
    <div className="space-y-3 p-4 bg-gray-50 text-black rounded border">
      <div className="flex justify-between">
        <span>Status:</span>
        <span className={result.success ? "text-green-600" : "text-red-600"}>
          {result.success ? "Success" : "Failed"}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Amount:</span>
        <span>
          {formatUnits(result.value, 18)} {result.tokenSymbol}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Gas Used:</span>
        <span>{result.gasUsed}</span>
      </div>
      <div className="flex items-start">
        <a href={result.dashboardUrl} target="_blank" className="underline text-blue-600">
          View on Tenderly
        </a>
      </div>

      {result.success && (
        <>
          <button onClick={onExecute} disabled={isPending} className="w-full py-2 bg-green-600 text-white rounded">
            {isPending ? <Spinner /> : "Execute Transfer"}
          </button>
          {isSuccess && <p className="text-green-600">Transaction confirmed</p>}
          {error && <p className="text-red-600">{error.message}</p>}
        </>
      )}
    </div>
  );
};

export default SimulationResult;
