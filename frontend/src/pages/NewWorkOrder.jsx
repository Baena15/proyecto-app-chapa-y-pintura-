import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export function NewWorkOrder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Customer
  const [customerSearch, setCustomerSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    dni: '',
    address: '',
    city: '',
  });

  // Step 2: Vehicle
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showNewVehicle, setShowNewVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    license_plate: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    vin: '',
    insurance_company: '',
    insurance_policy: '',
  });

  // Step 3: Details
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [estimatedCompletion, setEstimatedCompletion] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [technicians, setTechnicians] = useState([]);

  // Load technicians on step 3
  useEffect(() => {
    if (step === 3) {
      api.get('/users/').then((data) => {
        const list = data.results || data;
        setTechnicians(list.filter((u) => u.role === 'mechanic' || u.role === 'admin'));
      }).catch(() => setTechnicians([]));
    }
  }, [step]);

  // Search customers
  const searchCustomers = () => {
    if (!customerSearch.trim()) return;
    setLoading(true);
    api
      .get(`/customers/?search=${encodeURIComponent(customerSearch.trim())}`)
      .then((data) => setCustomers(data.results || data))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  };

  // Search vehicles for selected customer
  const searchVehicles = () => {
    setLoading(true);
    const customerId = selectedCustomer?.id;
    const params = new URLSearchParams();
    if (vehicleSearch.trim()) params.append('search', vehicleSearch.trim());
    if (customerId) params.append('customer', customerId);
    api
      .get(`/vehicles/?${params.toString()}`)
      .then((data) => setVehicles(data.results || data))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  };

  // Create customer
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await api.post('/customers/', newCustomer);
      setSelectedCustomer(created);
      setShowNewCustomer(false);
      setCustomers([created]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create vehicle
  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...newVehicle, customer: selectedCustomer.id };
      const created = await api.post('/vehicles/', payload);
      setSelectedVehicle(created);
      setShowNewVehicle(false);
      setVehicles([created]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create work order
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        vehicle_id: selectedVehicle.id,
        description,
        estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
        estimated_completion: estimatedCompletion || null,
        assigned_to: assignedTo || null,
      };
      const created = await api.post('/work-orders/', payload);
      navigate(`/work-orders/${created.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const canNext = () => {
    if (step === 1) return !!selectedCustomer;
    if (step === 2) return !!selectedVehicle;
    if (step === 3) return description.trim().length > 0;
    return true;
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold text-gray-900">Nueva Orden de Trabajo</h1>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                s === step
                  ? 'bg-blue-600 text-white'
                  : s < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
            {s < 4 && <div className={`h-1 w-6 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Step 1: Customer */}
      {step === 1 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-700">1. Cliente</h2>

          {!showNewCustomer && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Buscar por nombre, telefono o DNI"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchCustomers()}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
                <button
                  onClick={searchCustomers}
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white active:bg-blue-700 disabled:opacity-50"
                >
                  Buscar
                </button>
              </div>

              <button
                onClick={() => setShowNewCustomer(true)}
                className="rounded-lg border border-dashed border-gray-300 py-2 text-sm font-medium text-gray-600 active:bg-gray-50"
              >
                + Crear cliente nuevo
              </button>

              <div className="flex flex-col gap-2">
                {customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className={`rounded-xl p-4 text-left shadow-sm ${
                      selectedCustomer?.id === c.id
                        ? 'bg-blue-50 ring-2 ring-blue-400'
                        : 'bg-white'
                    }`}
                  >
                    <div className="text-sm font-bold text-gray-900">{c.full_name}</div>
                    <div className="text-xs text-gray-500">
                      {c.phone} {c.dni && `· DNI: ${c.dni}`}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {showNewCustomer && (
            <form onSubmit={handleCreateCustomer} className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-gray-700">Nuevo cliente</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Nombre *"
                  value={newCustomer.first_name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, first_name: e.target.value })}
                  required
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
                <input
                  placeholder="Apellidos *"
                  value={newCustomer.last_name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, last_name: e.target.value })}
                  required
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <input
                placeholder="Telefono *"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                required
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <input
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <input
                placeholder="DNI"
                value={newCustomer.dni}
                onChange={(e) => setNewCustomer({ ...newCustomer, dni: e.target.value })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <input
                placeholder="Direccion"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <input
                placeholder="Ciudad"
                value={newCustomer.city}
                onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-medium text-white active:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar cliente'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCustomer(false)}
                  className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 active:bg-gray-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Step 2: Vehicle */}
      {step === 2 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-700">2. Vehiculo</h2>
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            Cliente: <span className="font-bold">{selectedCustomer?.full_name}</span>
          </div>

          {!showNewVehicle && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Buscar por matricula"
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchVehicles()}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
                <button
                  onClick={searchVehicles}
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white active:bg-blue-700 disabled:opacity-50"
                >
                  Buscar
                </button>
              </div>

              <button
                onClick={() => setShowNewVehicle(true)}
                className="rounded-lg border border-dashed border-gray-300 py-2 text-sm font-medium text-gray-600 active:bg-gray-50"
              >
                + Añadir vehiculo nuevo
              </button>

              <div className="flex flex-col gap-2">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`rounded-xl p-4 text-left shadow-sm ${
                      selectedVehicle?.id === v.id
                        ? 'bg-blue-50 ring-2 ring-blue-400'
                        : 'bg-white'
                    }`}
                  >
                    <div className="text-sm font-bold text-gray-900">
                      {v.license_plate} — {v.brand} {v.model}
                    </div>
                    <div className="text-xs text-gray-500">
                      {v.color} {v.year && `· ${v.year}`}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {showNewVehicle && (
            <form onSubmit={handleCreateVehicle} className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-gray-700">Nuevo vehiculo</h3>
              <input
                placeholder="Matricula *"
                value={newVehicle.license_plate}
                onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                required
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Marca *"
                  value={newVehicle.brand}
                  onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                  required
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
                <input
                  placeholder="Modelo *"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  required
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Año"
                  type="number"
                  value={newVehicle.year}
                  onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
                <input
                  placeholder="Color"
                  value={newVehicle.color}
                  onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <input
                placeholder="VIN / Bastidor"
                value={newVehicle.vin}
                onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <input
                placeholder="Compañia de seguros"
                value={newVehicle.insurance_company}
                onChange={(e) => setNewVehicle({ ...newVehicle, insurance_company: e.target.value })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <input
                placeholder="Poliza de seguros"
                value={newVehicle.insurance_policy}
                onChange={(e) => setNewVehicle({ ...newVehicle, insurance_policy: e.target.value })}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-medium text-white active:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar vehiculo'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewVehicle(false)}
                  className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 active:bg-gray-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-700">3. Detalles de la reparacion</h2>
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            {selectedVehicle?.license_plate} — {selectedVehicle?.brand} {selectedVehicle?.model}
            <br />
            <span className="text-xs">{selectedCustomer?.full_name}</span>
          </div>

          <label className="text-xs font-medium text-gray-600">Descripcion de daños *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe los daños y trabajos a realizar..."
            rows={4}
            required
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
          />

          <label className="text-xs font-medium text-gray-600">Coste estimado (€)</label>
          <input
            type="number"
            step="0.01"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="Ej: 450.00"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
          />

          <label className="text-xs font-medium text-gray-600">Fecha estimada de entrega</label>
          <input
            type="date"
            value={estimatedCompletion}
            onChange={(e) => setEstimatedCompletion(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
          />

          <label className="text-xs font-medium text-gray-600">Tecnico asignado</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400"
          >
            <option value="">Sin asignar</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>
                {t.first_name} {t.last_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 4 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-700">4. Resumen</h2>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">Cliente</h3>
            <div className="text-sm font-bold text-gray-900">{selectedCustomer?.full_name}</div>
            <div className="text-xs text-gray-500">{selectedCustomer?.phone}</div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">Vehiculo</h3>
            <div className="text-sm font-bold text-gray-900">
              {selectedVehicle?.license_plate} — {selectedVehicle?.brand} {selectedVehicle?.model}
            </div>
            <div className="text-xs text-gray-500">
              {selectedVehicle?.color} {selectedVehicle?.year && `(${selectedVehicle?.year})`}
            </div>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-xs font-bold uppercase text-gray-400">Trabajo</h3>
            <div className="text-sm text-gray-800">{description}</div>
            {estimatedCost && (
              <div className="mt-1 text-sm text-gray-600">
                Coste estimado: <span className="font-medium">{estimatedCost}€</span>
              </div>
            )}
            {estimatedCompletion && (
              <div className="text-sm text-gray-600">
                Entrega estimada: {new Date(estimatedCompletion).toLocaleDateString()}
              </div>
            )}
            {assignedTo && (
              <div className="text-sm text-gray-600">
                Tecnico:{' '}
                {technicians.find((t) => t.id.toString() === assignedTo)?.first_name || 'Asignado'}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-green-600 py-3 text-sm font-bold text-white active:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Creando...' : '✅ Crear Orden de Trabajo'}
          </button>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-2">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 active:bg-gray-200"
          >
            ← Anterior
          </button>
        )}
        {step < 4 && (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext()}
            className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white active:bg-blue-700 disabled:opacity-50"
          >
            Siguiente →
          </button>
        )}
      </div>
    </div>
  );
}
