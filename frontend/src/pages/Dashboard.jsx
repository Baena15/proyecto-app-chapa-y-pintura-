import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Mock stats until backend endpoint is ready
        const workOrders = await api.get('/work-orders/');
        const list = workOrders.results || workOrders;
        setRecent(list.slice(0, 5));
        setStats({
          total: list.length,
          pending: list.filter((w) => w.status === 'pending').length,
          ready: list.filter((w) => w.status === 'ready').length,
        });
      } catch {
        setStats({ total: 0, pending: 0, ready: 0 });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="py-10 text-center text-gray-400">Cargando...</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-center">
          <div className="text-xl font-bold text-blue-700">{stats?.total || 0}</div>
          <div className="text-xs text-blue-600">Total OTs</div>
        </div>
        <div className="rounded-xl bg-orange-50 p-3 text-center">
          <div className="text-xl font-bold text-orange-700">{stats?.pending || 0}</div>
          <div className="text-xs text-orange-600">Pendientes</div>
        </div>
        <div className="rounded-xl bg-green-50 p-3 text-center">
          <div className="text-xl font-bold text-green-700">{stats?.ready || 0}</div>
          <div className="text-xs text-green-600">Listos</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <Link
          to="/work-orders"
          className="flex-1 rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow active:bg-blue-700"
        >
          + Nueva OT
        </Link>
      </div>

      {/* Recent work orders */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Ordenes recientes</h2>
        <div className="flex flex-col gap-2">
          {recent.length === 0 && (
            <div className="rounded-lg bg-white p-4 text-center text-sm text-gray-400">
              No hay ordenes de trabajo
            </div>
          )}
          {recent.map((wo) => (
            <Link
              key={wo.id}
              to={`/work-orders/${wo.id}`}
              className="rounded-xl bg-white p-3 shadow-sm active:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{wo.code}</div>
                  <div className="text-xs text-gray-500">
                    {wo.vehicle?.license_plate} — {wo.customer?.full_name}
                  </div>
                </div>
                <StatusBadge status={wo.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
