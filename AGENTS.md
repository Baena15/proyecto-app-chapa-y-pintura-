# AGENTS.md — App Taller Chapa y Pintura

> Este archivo contiene informacion esencial para agentes de codigo AI que trabajan en este proyecto.

---

## Project Overview

| Aspect | Detail |
|--------|--------|
| **Purpose** | App movil (PWA) para gestion integral de taller de chapa y pintura |
| **Type** | Fullstack web application (mobile-first PWA) |
| **Stack** | Django 5 + DRF (backend) | React 18 + Vite + Tailwind (frontend) | PostgreSQL 16 |
| **Target Users** | Recepcionistas, chapistas, pintores, clientes |
| **Status** | Active development |
| **Language** | UI en Español | Codigo en Ingles | Comentarios tecnicos en Ingles, negocio en Español |

**What this app provides:**
- Gestion de ordenes de trabajo (chapa, pintura, mecanica ligera)
- Presupuestos y facturacion
- Seguimiento de estados de reparacion
- Fotos de daños y progreso
- Notificaciones a clientes (SMS/WhatsApp/email)
- Panel de administracion

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Django 5.0+ + Django REST Framework |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis 7 (sessions, cache) |
| **Auth** | JWT (djangorestframework-simplejwt) |
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **PWA** | Vite PWA plugin (service worker, manifest, offline) |
| **DevOps** | Docker Compose, GitHub Actions |
| **Testing** | pytest (backend), Vitest (frontend) |

---

## Directory Structure

```
app-taller-chapa/
├── 📁 backend/
│   ├── config/               # Django settings, urls, wsgi
│   ├── apps/                 # Aplicaciones Django
│   │   ├── users/            # Autenticacion y perfiles
│   │   ├── customers/        # Clientes y vehiculos
│   │   ├── workorders/       # Ordenes de trabajo
│   │   ├── estimates/        # Presupuestos
│   │   ├── invoices/         # Facturas
│   │   └── photos/           # Fotos de daños y progreso
│   ├── requirements.txt
│   └── manage.py
│
├── 📁 frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/            # Vistas/paginas
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API client
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── 📁 scripts/
│   ├── seed.ps1              # Seed de datos de ejemplo
│   └── test-api.ps1          # Tests de endpoints API
│
├── 📁 docs/
│   └── CONVENTIONS.md        # Convenciones de codigo
│
├── 📁 .claude/skills/        # Skills SDD
├── 📁 .github/               # Workflows y templates
├── 📄 AGENTS.md              # Este archivo
├── 📄 README.md
├── 📄 Makefile
├── 📄 docker-compose.yml
├── 📄 .env.example
└── 📄 .gitignore
```

---

## Language Conventions

| Context | Language | Example |
|---------|----------|---------|
| **UI / User-facing** | Español | `<h1>Orden de Trabajo #123</h1>` |
| **Code / Variables** | Ingles | `const workOrderId = 123` |
| **Comments (tecnico)** | Ingles | `// Validate JWT token expiration` |
| **Comments (negocio)** | Español | `// Estado: En espera de piezas` |
| **Git Commits** | Ingles | `feat: add work order status transitions` |

---

## Code Style Guidelines

### Python (Django)

```python
# ─── Module Description ─────────────────
from django.db import models

class WorkOrder(models.Model):
    """Represents a vehicle repair work order."""

    STATUS_PENDING = "pending"
    STATUS_IN_PROGRESS = "in_progress"
    STATUS_WAITING_PARTS = "waiting_parts"
    STATUS_READY = "ready"
    STATUS_DELIVERED = "delivered"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pendiente"),
        (STATUS_IN_PROGRESS, "En progreso"),
        (STATUS_WAITING_PARTS, "Esperando piezas"),
        (STATUS_READY, "Listo para entrega"),
        (STATUS_DELIVERED, "Entregado"),
    ]

    customer = models.ForeignKey("customers.Customer", on_delete=models.PROTECT)
    vehicle = models.ForeignKey("customers.Vehicle", on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    description = models.TextField()
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "work_orders"
        ordering = ["-created_at"]

    def __str__(self):
        return f"OT-{self.id}: {self.vehicle.license_plate}"
```

### JavaScript (React)

```javascript
// ─── Component: WorkOrderCard ─────────────
import { useState } from 'react';

const STATUS_LABELS = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  waiting_parts: 'Esperando piezas',
  ready: 'Listo',
  delivered: 'Entregado',
};

export function WorkOrderCard({ workOrder }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">OT #{workOrder.id}</h3>
      <p className="text-sm text-gray-600">{STATUS_LABELS[workOrder.status]}</p>
    </div>
  );
}
```

### CSS (Tailwind)

```css
/* Mobile-first responsive */
@media (min-width: 768px) {
  .work-order-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## Build and Development Commands

```bash
# Backend
make backend-dev       # Django dev server
make backend-test      # pytest
make backend-migrate   # python manage.py migrate
make backend-shell     # python manage.py shell

# Frontend
make frontend-dev      # Vite dev server
make frontend-build    # Production build
make frontend-test     # Vitest

# Database
make db-up             # docker-compose up postgres redis
make db-seed           # Seed datos de ejemplo
make db-reset          # Reset database

# Full stack
make dev               # Backend + Frontend en paralelo
make build             # Build completo
make test              # Tests backend + frontend
make lint              # flake8 + black + eslint
make fmt               # black + prettier
make security-check    # Checklist pre-deploy
```

---

## Docker Compose (Development)

```bash
# Start all services
make db-up

# Services:
# - PostgreSQL (port 5433)
# - Redis (port 6380)
# - Django (port 8000)
```

---

## Critical Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SECRET_KEY` | Django SECRET_KEY | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `REDIS_URL` | Redis connection string | No |
| `EMAIL_BACKEND` | Django email backend | No |
| `FRONTEND_URL` | URL del frontend (CORS) | Yes |

---

## SDD Workflow

Este proyecto usa el workflow SDD de la plantilla madre:

| Phase | Skill | Purpose |
|-------|-------|---------|
| 1 | `/sdd-init` | Inicializar contexto |
| 2 | `/sdd-explore` | Investigar antes de cambios |
| 3 | `/sdd-spec` | Especificar requisitos |
| 4 | `/sdd-tasks` | Descomponer en tareas |
| 5 | `/sdd-apply` | Implementar |
| 6 | `/sdd-verify` | Verificar |
| 7 | `/sdd-archive` | Archivar |

---

## Contact

Proyecto privado — App Taller Chapa y Pintura.
