import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';

export function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/customers/${id}/`)
      .then(setCustomer)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-10 text-center text-gray-400">Cargando...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!customer) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900">{customer.full_name}</h1>
        <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
          {customer.phone && <div>📞 {customer.phone}</div>}
          {customer.email && <div>✉️ {customer.email}</div>}
          {customer.dni && <div>🆔 DNI: {customer.dni}</div>}
          {(customer.address || customer.city) && (
            <div>📍 {[customer.address, customer.city].filter(Boolean).join(', ')}</div>
          )}
        </div>
      </div>

      {/* Vehicles */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Vehiculos</h2>
        {customer.vehicles?.length === 0 && (
          <div className="text-xs text-gray-400">Sin vehiculos registrados</div>
        )}
        <div className="flex flex-col gap-2">
          {customer.vehicles?.map((v) => (
            <div key={v.id} className="rounded-lg border border-gray-100 p-3">
              <div className="text-sm font-bold text-gray-900">
                {v.license_plate}
              </div>
              <div className="text-xs text-gray-500">
                {v.brand} {v.model} {v.year && `(${v.year})`}
              </div>
              {v.color && <div className="text-xs text-gray-400">Color: {v.color}</div>}
              {v.insurance_company && (
                <div className="text-xs text-gray-400">Seguro: {v.insurance_company}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Back */}
      <Link
        to="/customers"
        className="rounded-lg bg-gray-100 py-2 text-center text-sm font-medium text-gray-700 active:bg-gray-200"
      >
        ← Volver a clientes
      </Link>
    </div>
  );
}
