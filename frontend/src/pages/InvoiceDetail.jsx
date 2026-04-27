import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';

export function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('cash');

  useEffect(() => {
    api
      .get(`/invoices/${id}/`)
      .then(setInvoice)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePay = async (e) => {
    e.preventDefault();
    setPayLoading(true);
    try {
      await api.post(`/invoices/${id}/pay/`, {
        amount: parseFloat(payAmount),
        payment_method: payMethod,
      });
      const updated = await api.get(`/invoices/${id}/`);
      setInvoice(updated);
      setShowPayForm(false);
      setPayAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) return <div className="py-10 text-center text-gray-400">Cargando...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!invoice) return null;

  const remaining = invoice.total - (invoice.paid_amount || 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">{invoice.code}</h1>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="mt-2 text-sm text-gray-600">OT {invoice.work_order_code}</div>
        <button
          onClick={() => navigate(`/invoices/${id}/print`)}
          className="mt-3 w-full rounded-lg border border-blue-200 bg-blue-50 py-2 text-sm font-medium text-blue-700 active:bg-blue-100"
        >
          📄 Ver PDF / Imprimir
        </button>
      </div>

      {/* Totals */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Importes</h2>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">{invoice.subtotal}€</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">IVA ({invoice.tax_rate}%):</span>
          <span className="font-medium">{invoice.tax_amount}€</span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2 text-sm">
          <span className="font-semibold text-gray-800">Total:</span>
          <span className="font-bold text-blue-700">{invoice.total}€</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Pagado:</span>
          <span className="font-medium text-green-600">{invoice.paid_amount || 0}€</span>
        </div>
        {remaining > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pendiente:</span>
            <span className="font-medium text-orange-600">{remaining.toFixed(2)}€</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold text-gray-700">Conceptos</h2>
        {invoice.items?.length === 0 && <div className="text-xs text-gray-400">Sin items</div>}
        {invoice.items?.map((item) => (
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
        {invoice.due_date && (
          <div className="text-sm text-gray-600">
            Vencimiento: {new Date(invoice.due_date).toLocaleDateString()}
          </div>
        )}
        {invoice.paid_at && (
          <div className="text-sm text-green-600">
            Pagado el: {new Date(invoice.paid_at).toLocaleDateString()}
          </div>
        )}
        {invoice.payment_method && (
          <div className="text-sm text-gray-600">
            Metodo: {invoice.payment_method === 'cash' ? 'Efectivo' : invoice.payment_method === 'card' ? 'Tarjeta' : invoice.payment_method === 'transfer' ? 'Transferencia' : invoice.payment_method}
          </div>
        )}
      </div>

      {/* Pay button */}
      {invoice.status !== 'paid' && remaining > 0 && (
        <>
          {!showPayForm ? (
            <button
              onClick={() => setShowPayForm(true)}
              className="rounded-lg bg-green-600 py-2 text-sm font-medium text-white active:bg-green-700"
            >
              💳 Registrar pago
            </button>
          ) : (
            <form onSubmit={handlePay} className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Registrar pago</h3>
              <div className="flex flex-col gap-2">
                <input
                  type="number"
                  step="0.01"
                  max={remaining}
                  placeholder={`Importe (max ${remaining.toFixed(2)}€)`}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  required
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                >
                  <option value="cash">Efectivo</option>
                  <option value="card">Tarjeta</option>
                  <option value="transfer">Transferencia</option>
                </select>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={payLoading}
                    className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-medium text-white active:bg-green-700 disabled:opacity-50"
                  >
                    {payLoading ? 'Guardando...' : 'Confirmar pago'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPayForm(false)}
                    className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 active:bg-gray-200"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          )}
        </>
      )}

      {/* Back */}
      <Link
        to="/invoices"
        className="rounded-lg bg-gray-100 py-2 text-center text-sm font-medium text-gray-700 active:bg-gray-200"
      >
        ← Volver a facturas
      </Link>
    </div>
  );
}
