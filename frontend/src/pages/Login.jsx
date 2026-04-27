import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('api_url') || '');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Credenciales invalidas');
    } finally {
      setLoading(false);
    }
  };

  const saveApiUrl = () => {
    if (apiUrl.trim()) {
      localStorage.setItem('api_url', apiUrl.trim());
    } else {
      localStorage.removeItem('api_url');
    }
    setShowConfig(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl">🔧</div>
          <h1 className="text-xl font-bold text-blue-900">Taller Chapa y Pintura</h1>
          <p className="text-sm text-gray-500">Inicia sesion para continuar</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition active:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="mt-4 text-xs text-gray-400 underline"
        >
          {showConfig ? 'Ocultar configuracion' : 'Configurar servidor'}
        </button>

        {showConfig && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              URL del servidor backend
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://tu-servidor.com/api/v1"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">
              Deja vacio para usar el servidor por defecto.
            </p>
            <button
              onClick={saveApiUrl}
              className="mt-2 rounded-lg bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 active:bg-gray-300"
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
