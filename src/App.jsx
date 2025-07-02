import WalletConnect from "./components/WalletConnect";
import TransferSimulator from "./components/TransferSimulator/index";
import TestnetManager from "./components/TestnetManager";

function App() {
  return (
    <div className="max-w-5xl mx-auto p-8 text-center min-h-screen bg-neutral-900">
      <h1 className="text-5xl font-bold mb-8 text-white">txGuard</h1>
      <div className="p-8 bg-neutral-800 rounded-lg shadow mb-8"></div>
      <div className="space-y-4 flex items-center justify-center flex-col">
        <h3 className="text-xl font-semibold text-neutral-200">Simulate tx here</h3>
        <WalletConnect />
        <TestnetManager />
        <TransferSimulator />
      </div>
    </div>
  );
}

export default App;
