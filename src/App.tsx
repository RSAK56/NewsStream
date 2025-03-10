import React, { useState } from "react";
import type { JSX } from "react/jsx-runtime";
import "./App.css";

const App = (): JSX.Element => {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <div className="app">
        <h1 className="text-red-500">Welcome to Newsstream</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  );
};

export default App;
