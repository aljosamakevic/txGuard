import "./App.css";
import WalletConnect from "./components/WalletConnect";
import TransferSimulator from "./components/TransferSimulator/index";

function App() {
  return (
    <>
      <h1>txGuard</h1>
      <div className="card"></div>
      <div>
        <h3>Simulate tx here</h3>
        <WalletConnect />
        <TransferSimulator />
      </div>
    </>
  );
}

export default App;
