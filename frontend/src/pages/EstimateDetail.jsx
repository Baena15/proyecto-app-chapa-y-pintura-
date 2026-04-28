import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';

export function EstimateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/estimates/${id}/`)
      .then(setEstimate)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action) => {
    setActionLoading(true);
    try {
      await api.post(`/estimates/${id}/${action}/`, {});
      const updated = await api.get(`/estimates/${id}/`);
      setEstimate(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWhatsApp = async () => {
    setActionLoading(true);
    try {
      const res = await api.post(`/estimates/${id}/whatsapp/`, {});
      alert(res.success ? 'Mensaje de WhatsApp enviado' : 'Error: ' + res.error);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="py-10 text-center text-gray-400">Cargando...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!estimate) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Presupuesto</h1>
          <StatusBadge status={estimate.status} />
        </div>
        <div className="mt-2 text-sm text-gray-600">OT {estimate.work_order_code}</div>
        <button
          onClick={() => navigate(`/estimates/${id}/print`)}
          className="mt-3 w-full rounded-lg border border-blue-200 bg-blue-50 py-2 text-sm font-medium text-blue-700 active:bg-blue-100"
        >
          📄 Ver PDF / Imprimir
        </button>
      </div>

      {/* Totals */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Totales</h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Mano de obra:</span>
          <span className="font-medium">{estimate.total_labor}€</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Piezas:</span>
          <span className="font-medium">{estimate.total_parts}€</span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2 text-sm">
          <span className="font-semibold text-gray-800">Total:</span>
          <span className="font-bold text-blue-700">{estimate.total}€</span>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Items</h2>
        {estimate.items?.length === 0 && <div className="text-xs text-gray-400">Sin items</div>}
        {estimate.items?.map((item) => (
          <div key={item.id} className="mb-2 border-b border-gray-100 pb-2 last:border-0">
            <div className="text-sm font-medium text-gray-800">{item.description}</div>
            <div className="text-xs text-gray-500">
              {item.quantity} x {item.unit_price}€ = <span className="font-medium">{item.total}€</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Fechas</h2>
        {estimate.valid_until && (
          <div className="text-sm text-gray-600">
            Valido hasta: {new Date(estimate.valid_until).toLocaleDateString()}
          </div>
        )}
        {estimate.sent_at && (
          <div className="text-sm text-gray-600">
            Enviado: {new Date(estimate.sent_at).toLocaleDateString()}
          </div>
        )}
        {estimate.approved_at && (
          <div className="text-sm text-green-600">
            Aprobado: {new Date(estimate.approved_at).toLocaleDateString()}
          </div>
        )}
        {estimate.rejected_at && (
          <div className="text-sm text-red-600">
            Rechazado: {new Date(estimate.rejected_at).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Actions */}
      {estimate.status === 'draft' && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleAction('send')}
            disabled={actionLoading}
            className="w-full rounded-lg bg-purple-600 py-2 text-sm font-medium text-white active:bg-purple-700 disabled:opacity-50"
          >
            {actionLoading ? '...' : '📧 Enviar por email'}
          </button>
          <button
            onClick={handleWhatsApp}
            disabled={actionLoading}
            className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white active:bg-green-700 disabled:opacity-50"
          >
            {actionLoading ? '...' : '💬 Enviar por WhatsApp'}
          </button>
        </div>
      )}
      {estimate.status === 'sent' && (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('approve')}
            disabled={actionLoading}
            className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-medium text-white active:bg-green-700 disabled:opacity-50"
          >
            {actionLoading ? '...' : '✅ Aprobar'}
          </button>
          <button
            onClick={() => handleAction('reject')}
            disabled={actionLoading}
            className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white active:bg-red-700 disabled:opacity-50"
          >
            {actionLoading ? '...' : '❌ Rechazar'}
          </button>
        </div>
      )}

      {/* Back */}
      <Link
        to="/estimates"
        className="rounded-lg bg-gray-100 py-2 text-center text-sm font-medium text-gray-700 active:bg-gray-200"
      >
        ← Volver a presupuestos
      </Link>
    </div>
  );
}
