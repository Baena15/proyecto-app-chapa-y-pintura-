import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';
    setLoading(true);
    api
      .get(`/customers/${params}`)
      .then((data) => {
        setCustomers(data.results || data);
      })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-bold text-gray-900">Clientes</h1>

      {/* Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre, telefono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>

      {loading && <div className="py-10 text-center text-gray-400">Cargando...</div>}

      <div className="flex flex-col gap-2">
        {customers.length === 0 && !loading && (
          <div className="rounded-lg bg-white p-6 text-center text-sm text-gray-400">
            No hay clientes
          </div>
        )}
        {customers.map((c) => (
          <Link
            key={c.id}
            to={`/customers/${c.id}`}
            className="rounded-xl bg-white p-4 shadow-sm active:bg-gray-50"
          >
            <div className="text-sm font-bold text-gray-900">{c.full_name}</div>
            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
              <span>📞 {c.phone || '—'}</span>
              {c.email && <span>✉️ {c.email}</span>}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              {c.vehicles?.length || 0} vehiculo{c.vehicles?.length === 1 ? '' : 's'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
