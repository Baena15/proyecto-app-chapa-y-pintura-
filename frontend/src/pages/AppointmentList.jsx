import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

export function AppointmentList() {
  const { isClient } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    customer: '',
    vehicle: '',
    date: '',
    time: '',
    description: '',
  });
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await api.get('/appointments/');
      setAppointments(data.results || data || []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    if (!isClient) {
      api.get('/customers/').then((d) => setCustomers(d.results || d || [])).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (formData.customer) {
      api.get(`/customers/${formData.customer}/`).then((c) => setVehicles(c.vehicles || [])).catch(() => {});
    } else {
      setVehicles([]);
    }
  }, [formData.customer]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/appointments/', {
        ...formData,
        customer: parseInt(formData.customer),
        vehicle: formData.vehicle ? parseInt(formData.vehicle) : null,
      });
      setShowForm(false);
      setFormData({ title: '', customer: '', vehicle: '', date: '', time: '', description: '' });
      await load();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/appointments/${id}/`, { status: newStatus });
      await load();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Group by date
  const grouped = appointments.reduce((acc, ap) => {
    const date = ap.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(ap);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  if (loading) return <div className="py-10 text-center text-gray-400">Cargando...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Calendario de citas</h1>
        {!isClient && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white active:bg-blue-700"
          >
            + Cita
          </button>
        )}
      </div>

      {sortedDates.length === 0 && (
        <div className="rounded-xl bg-white p-6 text-center text-sm text-gray-400">
          No hay citas programadas
        </div>
      )}

      {sortedDates.map((date) => (
        <div key={date} className="rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-700">
              {new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {grouped[date].map((ap) => (
              <div key={ap.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">
                  {ap.time ? ap.time.slice(0, 5) : '--:--'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-gray-900">{ap.title}</div>
                  <div className="truncate text-xs text-gray-500">
                    {ap.customer?.full_name} — {ap.vehicle?.license_plate}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[ap.status]}`}>
                    {STATUS_LABELS[ap.status]}
                  </span>
                  {!isClient && ap.status !== 'completed' && ap.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(ap.id, ap.status === 'pending' ? 'confirmed' : 'completed')}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 active:bg-gray-200"
                    >
                      {ap.status === 'pending' ? 'Confirmar' : 'Completar'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* New appointment modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <form onSubmit={handleSave} className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-base font-bold text-gray-900">Nueva cita</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Titulo"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <select
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value, vehicle: '' })}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Seleccionar cliente</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name}
                  </option>
                ))}
              </select>
              <select
                value={formData.vehicle}
                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Seleccionar vehiculo</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.license_plate} — {v.brand} {v.model}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
              <textarea
                placeholder="Descripcion"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
