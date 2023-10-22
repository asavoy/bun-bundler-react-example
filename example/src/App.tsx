import { useState } from "react";
import reactLogo from "./assets/react.svg";
import bunLogo from "./assets/bun.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={bunLogo} className="logo" alt="Bun logo" width="120" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className="logo react"
            alt="React logo"
            width="120"
          />
        </a>
      </div>
      <h1>Bun + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Bun and React logos to learn more
      </p>
    </>
  );
}

export default App;
