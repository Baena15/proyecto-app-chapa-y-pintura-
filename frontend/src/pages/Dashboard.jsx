import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { usePushNotifications } from '../hooks/usePushNotifications';

export function Dashboard() {
  const { isClient } = useAuth();
  const { supported, subscribed, loading: pushLoading, subscribe, unsubscribe, sendTest } = usePushNotifications();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const workOrders = await api.get('/work-orders/');
        const list = workOrders.results || workOrders;
        setRecent(list.slice(0, 5));
        setStats({
          total: list.length,
          pending: list.filter((w) => w.status === 'pending').length,
          ready: list.filter((w) => w.status === 'ready').length,
          delivered: list.filter((w) => w.status === 'delivered').length,
        });
      } catch {
        setStats({ total: 0, pending: 0, ready: 0, delivered: 0 });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="py-10 text-center text-gray-400">Cargando...</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Welcome */}
      <div className="rounded-xl bg-blue-600 p-4 text-white shadow-sm">
        <h2 className="text-lg font-bold">
          {isClient ? 'Bienvenido a tu taller' : 'Panel de control'}
        </h2>
        <p className="mt-1 text-sm opacity-90">
          {isClient
            ? 'Consulta el estado de tus reparaciones, presupuestos y facturas.'
            : 'Resumen rapido del taller.'}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-center">
          <div className="text-xl font-bold text-blue-700">{stats?.total || 0}</div>
          <div className="text-xs text-blue-600">Total</div>
        </div>
        <div className="rounded-xl bg-orange-50 p-3 text-center">
          <div className="text-xl font-bold text-orange-700">{stats?.pending || 0}</div>
          <div className="text-xs text-orange-600">Pend.</div>
        </div>
        <div className="rounded-xl bg-green-50 p-3 text-center">
          <div className="text-xl font-bold text-green-700">{stats?.ready || 0}</div>
          <div className="text-xs text-green-600">Listos</div>
        </div>
        <div className="rounded-xl bg-gray-100 p-3 text-center">
          <div className="text-xl font-bold text-gray-700">{stats?.delivered || 0}</div>
          <div className="text-xs text-gray-600">Entr.</div>
        </div>
      </div>

      {/* Push notifications */}
      {supported && (
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">Notificaciones push</div>
              <div className="text-xs text-gray-500">
                {subscribed ? 'Activadas' : 'Recibe alertas en tu dispositivo'}
              </div>
            </div>
            <div className="flex gap-2">
              {subscribed ? (
                <>
                  <button
                    onClick={sendTest}
                    className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 active:bg-blue-200"
                  >
                    Probar
                  </button>
                  <button
                    onClick={unsubscribe}
                    className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 active:bg-gray-200"
                  >
                    Desactivar
                  </button>
                </>
              ) : (
                <button
                  onClick={subscribe}
                  disabled={pushLoading}
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white active:bg-blue-700 disabled:opacity-50"
                >
                  {pushLoading ? '...' : 'Activar'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      {!isClient && (
        <div className="flex gap-2">
          <Link
            to="/work-orders/new"
            className="flex-1 rounded-xl bg-blue-600 py-3 text-center text-sm font-semibold text-white shadow active:bg-blue-700"
          >
            + Nueva OT
          </Link>
        </div>
      )}

      {/* Recent work orders */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-gray-700">
          {isClient ? 'Mis ordenes' : 'Ordenes recientes'}
        </h2>
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
