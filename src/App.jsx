import "./App.css";
import WalletConnect from "./components/WalletConnect";
import TransferSimulator from "./components/TransferSimulator/index";
import ForkManager from "./components/ForkManager";

function App() {
  return (
    <>
      <h1>txGuard</h1>
      <div className="card"></div>
      <div className="space-y-2">
        <h3>Simulate tx here</h3>

        <WalletConnect />
        <ForkManager />
        <TransferSimulator />
      </div>
    </>
  );
}

export default App;
