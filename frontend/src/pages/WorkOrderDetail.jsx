import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';

export function WorkOrderDetail() {
  const { id } = useParams();
  const [wo, setWo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/work-orders/${id}/`)
      .then(setWo)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-10 text-center text-gray-400">Cargando...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!wo) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">{wo.code}</h1>
          <StatusBadge status={wo.status} />
        </div>
        <div className="mt-2 text-sm text-gray-600">{wo.description}</div>
      </div>

      {/* Vehicle & Customer */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Vehiculo y Cliente</h2>
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {wo.vehicle?.license_plate} — {wo.vehicle?.brand} {wo.vehicle?.model}
          </div>
          <div className="text-gray-500">{wo.customer?.full_name}</div>
          <div className="text-gray-400">{wo.customer?.phone}</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Historial de estados</h2>
        <div className="flex flex-col gap-3">
          {wo.status_history?.length === 0 && (
            <div className="text-xs text-gray-400">Sin cambios de estado registrados</div>
          )}
          {wo.status_history?.map((h, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
              <div>
                <div className="text-xs font-medium text-gray-700">
                  {h.from_status} → {h.to_status}
                </div>
                <div className="text-xs text-gray-400">
                  {h.changed_by?.first_name} — {new Date(h.created_at).toLocaleDateString()}
                </div>
                {h.notes && <div className="text-xs text-gray-500">{h.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Trabajos</h2>
        {wo.items?.length === 0 && <div className="text-xs text-gray-400">Sin trabajos registrados</div>}
        {wo.items?.map((item) => (
          <div key={item.id} className="mb-2 border-b border-gray-100 pb-2 last:border-0">
            <div className="text-sm font-medium text-gray-800">{item.description}</div>
            <div className="text-xs text-gray-500">
              {item.item_type} — {item.estimated_hours}h estimadas
            </div>
          </div>
        ))}
      </div>

      {/* Costs */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Costos</h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estimado:</span>
          <span className="font-medium">{wo.estimated_cost}€</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Final:</span>
          <span className="font-medium">{wo.final_cost}€</span>
        </div>
      </div>
    </div>
  );
}
