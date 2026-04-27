import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';

const TABS = [
  { key: 'all', label: 'Todos' },
  { key: 'draft', label: 'Borradores' },
  { key: 'sent', label: 'Enviados' },
  { key: 'approved', label: 'Aprobados' },
  { key: 'rejected', label: 'Rechazados' },
];

export function EstimateList() {
  const [estimates, setEstimates] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/estimates/')
      .then((data) => {
        setEstimates(data.results || data);
      })
      .catch(() => setEstimates([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? estimates : estimates.filter((e) => e.status === filter);

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-bold text-gray-900">Presupuestos</h1>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
              filter === tab.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <div className="py-10 text-center text-gray-400">Cargando...</div>}

      <div className="flex flex-col gap-2">
        {filtered.length === 0 && !loading && (
          <div className="rounded-lg bg-white p-6 text-center text-sm text-gray-400">
            No hay presupuestos en este filtro
          </div>
        )}
        {filtered.map((e) => (
          <Link
            key={e.id}
            to={`/estimates/${e.id}`}
            className="rounded-xl bg-white p-4 shadow-sm active:bg-gray-50"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-bold text-gray-900">OT {e.work_order_code}</div>
                <div className="mt-1 text-xs text-gray-500">
                  Total: <span className="font-medium">{e.total}€</span>
                </div>
                {e.valid_until && (
                  <div className="text-xs text-gray-400">
                    Valido hasta: {new Date(e.valid_until).toLocaleDateString()}
                  </div>
                )}
              </div>
              <StatusBadge status={e.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
