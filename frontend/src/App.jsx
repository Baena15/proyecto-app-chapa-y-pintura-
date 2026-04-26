import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-blue-900">
          Taller Chapa y Pintura
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          App movil para gestion de ordenes de trabajo
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow transition active:scale-95"
          >
            Contador: {count}
          </button>

          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center text-xs text-gray-400">
            Estado: En desarrollo
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
