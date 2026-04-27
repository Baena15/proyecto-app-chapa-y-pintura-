const STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  in_bodywork: 'bg-orange-100 text-orange-700',
  waiting_parts: 'bg-yellow-100 text-yellow-700',
  in_painting: 'bg-purple-100 text-purple-700',
  quality_control: 'bg-cyan-100 text-cyan-700',
  ready: 'bg-green-100 text-green-700',
  delivered: 'bg-green-200 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
  // estimate statuses
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  // invoice statuses
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-orange-100 text-orange-700',
};

const STATUS_LABELS = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  in_bodywork: 'En chapa',
  waiting_parts: 'Esperando piezas',
  in_painting: 'En pintura',
  quality_control: 'Control calidad',
  ready: 'Listo',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  // estimate
  draft: 'Borrador',
  sent: 'Enviado',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  // invoice
  paid: 'Pagado',
  overdue: 'Vencido',
};

export function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
