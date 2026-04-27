import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export function EstimatePrint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/estimates/${id}/`)
      .then(setEstimate)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) return <div className="py-20 text-center text-gray-400">Cargando...</div>;
  if (!estimate) return <div className="py-20 text-center text-gray-400">No encontrado</div>;

  const c = estimate.customer;
  const v = estimate.vehicle;

  return (
    <div className="min-h-screen bg-white">
      {/* Toolbar (hidden when printing) */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
        <button onClick={() => navigate(-1)} className="text-sm font-medium text-gray-700">
          ← Volver
        </button>
        <button
          onClick={handlePrint}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white active:bg-blue-700"
        >
          🖨️ Imprimir / PDF
        </button>
      </div>

      {/* Document */}
      <div className="mx-auto max-w-2xl p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between border-b-2 border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TALLER CHAPA Y PINTURA</h1>
            <p className="text-sm text-gray-600">Calle Mayor 123, 28001 Madrid</p>
            <p className="text-sm text-gray-600">Tel: 910 123 456 | taller@email.com</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">PRESUPUESTO</div>
            <div className="text-sm text-gray-600">Nº {estimate.id}</div>
            <div className="text-sm text-gray-600">
              Fecha: {new Date(estimate.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Client & Vehicle */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Cliente</h3>
            <p className="font-medium text-gray-900">
              {c?.first_name} {c?.last_name}
            </p>
            <p className="text-sm text-gray-600">{c?.phone}</p>
            <p className="text-sm text-gray-600">{c?.email}</p>
            <p className="text-sm text-gray-600">{c?.address}</p>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Vehiculo</h3>
            <p className="font-medium text-gray-900">
              {v?.brand} {v?.model}
            </p>
            <p className="text-sm text-gray-600">Matricula: {v?.license_plate}</p>
            <p className="text-sm text-gray-600">Año: {v?.year}</p>
            <p className="text-sm text-gray-600">Color: {v?.color}</p>
          </div>
        </div>

        {/* Items table */}
        <div className="mb-8">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Conceptos</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="py-2 text-left">Descripcion</th>
                <th className="py-2 text-right">Cant.</th>
                <th className="py-2 text-right">P.Unit</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {estimate.items?.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2">
                    {item.description}
                    <span className="ml-1 text-xs text-gray-400">({item.item_type_display || item.item_type})</span>
                  </td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{item.unit_price}€</td>
                  <td className="py-2 text-right font-medium">{item.total}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mb-8 ml-auto w-64">
          <div className="flex justify-between border-b border-gray-200 py-2 text-sm">
            <span className="text-gray-600">Mano de obra:</span>
            <span className="font-medium">{estimate.total_labor}€</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 py-2 text-sm">
            <span className="text-gray-600">Piezas / Material:</span>
            <span className="font-medium">{estimate.total_parts}€</span>
          </div>
          <div className="flex justify-between py-3 text-lg font-bold">
            <span>Total:</span>
            <span>{estimate.total}€</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-800 pt-4 text-xs text-gray-500">
          <p>Presupuesto valido hasta: {estimate.valid_until ? new Date(estimate.valid_until).toLocaleDateString() : 'No especificado'}</p>
          <p className="mt-2">Este presupuesto no incluye trabajos adicionales no reflejados en el mismo.</p>
          <p className="mt-4 text-center font-medium text-gray-700">
            Gracias por confiar en nosotros
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}
