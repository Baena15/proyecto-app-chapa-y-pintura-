import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

const STATUS_LABELS = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  in_bodywork: 'En chapa',
  waiting_parts: 'Esperando piezas',
  in_painting: 'En pintura',
  quality_control: 'Control de calidad',
  ready: 'Listo',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export function WorkOrderDetail() {
  const { id } = useParams();
  const { user, isClient } = useAuth();
  const [wo, setWo] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [changingStatus, setChangingStatus] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const fileInputRef = useRef(null);
  const commentsEndRef = useRef(null);

  const loadWorkOrder = async () => {
    try {
      const data = await api.get(`/work-orders/${id}/`);
      setWo(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadPhotos = async () => {
    try {
      const data = await api.get(`/work-orders/${id}/photos/`);
      setPhotos(data.results || data || []);
    } catch {
      setPhotos([]);
    }
  };

  const loadComments = async () => {
    try {
      const data = await api.get(`/work-orders/${id}/comments/`);
      setComments(data.results || data || []);
    } catch {
      setComments([]);
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      await loadWorkOrder();
      await loadPhotos();
      await loadComments();
      setLoading(false);
    }
    load();
  }, [id]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('photo_type', 'progress');
    setUploading(true);
    try {
      await api.postMultipart(`/work-orders/${id}/photos/`, formData);
      await loadPhotos();
    } catch (err) {
      alert('Error al subir foto: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleChangeStatus = async () => {
    if (!newStatus) return;
    setChangingStatus(true);
    try {
      await api.post(`/work-orders/${id}/status/`, { to_status: newStatus, notes: statusNote });
      setShowStatusModal(false);
      setNewStatus('');
      setStatusNote('');
      await loadWorkOrder();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setChangingStatus(false);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setSendingComment(true);
    try {
      await api.post(`/work-orders/${id}/comments/`, {
        text: newComment.trim(),
        is_internal: isInternal,
      });
      setNewComment('');
      setIsInternal(false);
      await loadComments();
    } catch (err) {
      alert('Error al enviar comentario: ' + err.message);
    } finally {
      setSendingComment(false);
    }
  };

  const getValidTransitions = (current) => {
    const map = {
      pending: ['in_progress', 'cancelled'],
      in_progress: ['in_bodywork', 'waiting_parts', 'cancelled'],
      in_bodywork: ['waiting_parts', 'in_painting', 'cancelled'],
      waiting_parts: ['in_bodywork', 'cancelled'],
      in_painting: ['quality_control', 'cancelled'],
      quality_control: ['ready', 'in_painting', 'cancelled'],
      ready: ['delivered', 'cancelled'],
      delivered: [],
      cancelled: [],
    };
    return map[current] || [];
  };

  if (loading) return <div className="py-10 text-center text-gray-400">Cargando...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!wo) return null;

  const validNext = getValidTransitions(wo.status);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">{wo.code}</h1>
          <StatusBadge status={wo.status} />
        </div>
        <div className="mt-2 text-sm text-gray-600">{wo.description}</div>
        {!isClient && validNext.length > 0 && (
          <button
            onClick={() => setShowStatusModal(true)}
            className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white active:bg-blue-700"
          >
            Cambiar estado
          </button>
        )}
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
                  {STATUS_LABELS[h.from_status] || h.from_status} → {STATUS_LABELS[h.to_status] || h.to_status}
                </div>
                <div className="text-xs text-gray-400">
                  {h.changed_by?.first_name || h.changed_by?.username} — {new Date(h.created_at).toLocaleDateString()}
                </div>
                {h.notes && <div className="mt-1 text-xs text-gray-500 italic">“{h.notes}”</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat / Comments */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-700">Chat</h2>
        </div>
        <div className="max-h-80 overflow-y-auto p-4">
          {comments.length === 0 && (
            <div className="py-4 text-center text-xs text-gray-400">Sin mensajes todavia</div>
          )}
          <div className="flex flex-col gap-3">
            {comments.map((c) => {
              const isMe = c.author?.id === user?.id;
              return (
                <div key={c.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      isMe
                        ? 'bg-blue-600 text-white'
                        : c.is_internal
                          ? 'bg-orange-50 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {!isMe && (
                      <div className="mb-0.5 text-xs font-medium opacity-80">
                        {c.author?.first_name || c.author?.username}
                        {c.is_internal && ' · Interno'}
                      </div>
                    )}
                    <div>{c.text}</div>
                    <div
                      className={`mt-1 text-right text-[10px] ${
                        isMe ? 'text-blue-200' : 'text-gray-400'
                      }`}
                    >
                      {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={commentsEndRef} />
          </div>
        </div>
        <div className="border-t border-gray-100 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
              placeholder="Escribe un mensaje..."
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSendComment}
              disabled={sendingComment || !newComment.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white active:bg-blue-700 disabled:opacity-50"
            >
              {sendingComment ? '...' : 'Enviar'}
            </button>
          </div>
          {!isClient && (
            <label className="mt-2 flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border-gray-300"
              />
              Nota interna (solo personal del taller)
            </label>
          )}
        </div>
      </div>

      {/* Photos */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Fotos</h2>
          {!isClient && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 active:bg-gray-200 disabled:opacity-50"
            >
              {uploading ? 'Subiendo...' : '+ Foto'}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        {photos.length === 0 && <div className="text-xs text-gray-400">Sin fotos</div>}
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <a
              key={photo.id}
              href={photo.image}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-square overflow-hidden rounded-lg bg-gray-100"
            >
              <img
                src={photo.image}
                alt={photo.description || 'Foto'}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </a>
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

      {/* Status change modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h3 className="mb-3 text-base font-bold text-gray-900">Cambiar estado</h3>
            <div className="mb-3 text-sm text-gray-500">
              Estado actual: <span className="font-medium text-gray-700">{STATUS_LABELS[wo.status]}</span>
            </div>
            <div className="mb-3 flex flex-col gap-2">
              {validNext.map((s) => (
                <button
                  key={s}
                  onClick={() => setNewStatus(s)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm ${
                    newStatus === s
                      ? 'border-blue-500 bg-blue-50 font-medium text-blue-700'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {STATUS_LABELS[s] || s}
                </button>
              ))}
            </div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Nota (opcional)</label>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
              rows={2}
              placeholder="Motivo del cambio..."
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setNewStatus('');
                  setStatusNote('');
                }}
                className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 active:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangeStatus}
                disabled={!newStatus || changingStatus}
                className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white active:bg-blue-700 disabled:opacity-50"
              >
                {changingStatus ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
