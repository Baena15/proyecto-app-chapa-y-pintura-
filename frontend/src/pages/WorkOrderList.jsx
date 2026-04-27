import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';

const NewWorkOrderButton = () => (
  <Link
    to="/work-orders/new"
    className="flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg active:bg-blue-700"
  >
    + Nueva OT
  </Link>
);

const TABS = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'in_progress', label: 'En progreso' },
  { key: 'ready', label: 'Listos' },
];

export function WorkOrderList() {
  const [workOrders, setWorkOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/work-orders/')
      .then((data) => {
        setWorkOrders(data.results || data);
      })
      .catch(() => setWorkOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? workOrders : workOrders.filter((w) => w.status === filter);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Ordenes de Trabajo</h1>
        <NewWorkOrderButton />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
              filter === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 shadow-sm'
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
            No hay ordenes en este filtro
          </div>
        )}
        {filtered.map((wo) => (
          <Link
            key={wo.id}
            to={`/work-orders/${wo.id}`}
            className="rounded-xl bg-white p-4 shadow-sm active:bg-gray-50"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-bold text-gray-900">{wo.code}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {wo.vehicle?.license_plate} — {wo.vehicle?.brand} {wo.vehicle?.model}
                </div>
                <div className="text-xs text-gray-400">{wo.customer?.full_name}</div>
              </div>
              <StatusBadge status={wo.status} />
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Estimado: {wo.estimated_cost}€
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
