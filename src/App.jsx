import { useState } from "react";
import "./App.css";
import WalletConnect from "./components/WalletConnect";
import TransferSimulator from "./components/TransferSimulator";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>txGuard</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
      </div>
      <div>
        <h3>Simulate tx here</h3>
        <WalletConnect />
        {/* {account ? <p>Connected address: {account}</p> : <button onClick={() => handleConnect()}>Connect</button>} */}

        <TransferSimulator />
      </div>
    </>
  );
}

export default App;
