import React from "react";
import { JSX, useState } from "react";
import "./App.css";

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="app">
      <h1 className="text-red-500">Welcome to Newsstream</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
