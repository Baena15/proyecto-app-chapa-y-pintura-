# AGENTS.md — App Taller Chapa y Pintura

> Este archivo contiene informacion esencial para agentes de codigo AI que trabajan en este proyecto. El lector de este archivo no sabe nada sobre el proyecto; toda la informacion debe ser precisa y basarse unicamente en el contenido real del repositorio.

---

## Project Overview

| Aspect | Detail |
|--------|--------|
| **Purpose** | App movil (PWA) para gestion integral de taller de chapa y pintura |
| **Type** | Fullstack web application (mobile-first PWA) |
| **Stack** | Django 4.2 + DRF (backend) \| React 18 + Vite + Tailwind (frontend) \| PostgreSQL 16 / SQLite (dev) |
| **Target Users** | Recepcionistas, chapistas, pintores, clientes |
| **Status** | Active development |
| **Language** | UI en Espanol \| Codigo en Ingles \| Commits en Ingles \| Docs tecnicas en Espanol |

**What this app provides:**
- Gestion de ordenes de trabajo (chapa, pintura, mecanica ligera)
- Presupuestos y facturacion con IVA (21%)
- Seguimiento de estados de reparacion con maquina de estados
- Fotos de danos, progreso, resultado final y documentos
- Notificaciones a clientes (email/SMS/push)
- Panel de administracion Django
- Portal cliente para seguimiento de reparaciones

---

## Technology Stack

| Layer | Technology | Version / Details |
|-------|------------|-------------------|
| **Backend** | Django + Django REST Framework | Django >=4.2,<5.0, DRF >=3.14,<4.0 |
| **Database** | PostgreSQL 16 (prod) / SQLite (dev) | via `dj-database-url` |
| **Cache** | Redis 7 | `django-redis`, puerto 6380 en dev |
| **Auth** | JWT (djangorestframework-simplejwt) | Access 60min, Refresh 24h, con rotacion |
| **Frontend** | React + Vite + Tailwind CSS | React 18.2+, Vite 5.0+, Tailwind 3.4+ |
| **PWA** | Vite PWA Plugin | Service worker, manifest, offline support |
| **Testing Backend** | pytest + pytest-django + pytest-cov + factory-boy | |
| **Testing Frontend** | Vitest | v1.1+ |
| **Code Quality** | black, flake8, isort (Python); eslint, prettier (JS) | |
| **DevOps** | Docker Compose, GitHub Actions | |
| **Runtime** | Python 3.12+, Node.js 20+ | |

---

## Directory Structure

```
app-taller-chapa/
├── backend/
│   ├── config/               # Django settings, root urls, wsgi
│   │   ├── settings.py       # Config completa: DB, JWT, CORS, REST_FRAMEWORK
│   │   ├── urls.py           # Rutas API v1 + admin + media (debug)
│   │   └── wsgi.py
│   ├── apps/                 # Aplicaciones Django (modulares)
│   │   ├── core/             # Comandos utilidad (seed.py)
│   │   ├── users/            # Auth JWT, modelo User custom con roles
│   │   ├── customers/        # Clientes y Vehiculos
│   │   ├── workorders/       # Ordenes de trabajo, items, historial de estados
│   │   ├── estimates/        # Presupuestos y lineas
│   │   ├── invoices/         # Facturas y lineas (IVA auto-calculado)
│   │   ├── photos/           # Fotos vinculadas a OTs
│   │   └── notifications/    # Notificaciones multicanal
│   ├── media/                # Uploads de usuarios (avatars, fotos)
│   ├── requirements.txt      # Dependencias Python con rangos exactos
│   ├── pytest.ini            # Config pytest
│   ├── .flake8               # Config flake8 (max 100 chars)
│   ├── manage.py
│   └── venv/                 # Virtual environment (no commitear)
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js     # Cliente fetch con JWT refresh automatico
│   │   ├── components/
│   │   │   ├── Layout.jsx    # Layout con navegacion movil inferior
│   │   │   └── StatusBadge.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Contexto auth: login/logout/user/isAdmin
│   │   ├── hooks/            # Custom hooks (vacios por ahora)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── WorkOrderList.jsx
│   │   │   └── WorkOrderDetail.jsx
│   │   ├── App.jsx           # React Router + rutas protegidas
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Tailwind directives + custom styles
│   ├── public/               # Iconos PWA, favicon, etc.
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js        # Proxy /api y /media a :8000, PWA manifest
│   ├── tailwind.config.js    # Paleta custom `primary` (50-900)
│   ├── postcss.config.js
│   └── eslint.config.js      # Flat config: react-hooks, react-refresh
│
├── scripts/
│   ├── seed.ps1              # Wrapper PowerShell para `python manage.py seed`
│   └── test-api.ps1          # Smoke tests de endpoints (admin login, JWT token)
│
├── docs/
│   ├── CONVENTIONS.md        # Convenciones de codigo (heredadas de plantilla)
│   └── spec/                 # Especificacion funcional completa
│       ├── 01-domains.md     # Dominios y maquina de estados de OT
│       ├── 02-data-model.md  # Modelos Django detallados
│       ├── 03-api.md         # Endpoints REST con ejemplos
│       ├── 04-frontend.md    # Flujo de navegacion y pantallas
│       ├── 05-requirements.md# Requisitos Given/When/Then (MUST/SHOULD/MAY)
│       └── README.md         # Indice de specs
│
├── .claude/skills/           # Skills SDD (sdd-init, sdd-explore, etc.)
├── .github/
│   ├── workflows/ci.yml      # CI/CD: backend (pytest+flake8+black) + frontend (lint+test+build) + deploy
│   ├── ISSUE_TEMPLATE/       # bug_report.yml, feature_request.yml
│   └── pull_request_template.md
├── .cursorrules              # Reglas Cursor IDE (heredadas, parcialmente desfasadas)
├── .env.example              # Plantilla completa de variables de entorno
├── .gitignore
├── AGENTS.md                 # Este archivo
├── README.md                 # Guia rapida de inicio (Espanol)
├── SECURITY.md               # Checklist pre-deploy de seguridad
├── Makefile                  # Comandos de desarrollo (orientado a Windows/PowerShell)
└── docker-compose.yml        # PostgreSQL 16 (5433) + Redis 7 (6380)
```

---

## Language Conventions

| Context | Language | Example |
|---------|----------|---------|
| **UI / User-facing** | Espanol | `<h1>Orden de Trabajo #123</h1>` |
| **Code / Variables / Functions** | Ingles | `const workOrderId = 123` |
| **Comments (tecnico)** | Ingles | `// Validate JWT token expiration` |
| **Comments (negocio / estados)** | Espanol | `// Estado: En espera de piezas` |
| **Git Commits** | Ingles | `feat: add work order status transitions` |
| **Docs tecnicas** | Espanol | Este archivo, README, specs |

---

## Code Style Guidelines

### Python (Django)

- **Formateador**: `black` (excluye `migrations/`)
- **Import sorting**: `isort` (skip `*/migrations/*`)
- **Linter**: `flake8` (max line length 100, excluye migrations/settings.py, ignora E203/W503)
- **Modelos**: usar `db_table`, `ordering`, `indexes` explicitos. Status choices como constantes de clase.
- **Docstrings**: en ingles para descripcion de clases/funciones.

```python
# ─── Module Description ─────────────────
from django.db import models

class WorkOrder(models.Model):
    """Represents a vehicle repair work order."""

    STATUS_PENDING = "pending"
    STATUS_IN_PROGRESS = "in_progress"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pendiente"),
        (STATUS_IN_PROGRESS, "En progreso"),
    ]

    customer = models.ForeignKey("customers.Customer", on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)

    class Meta:
        db_table = "work_orders"
        ordering = ["-created_at"]

    def __str__(self):
        return f"OT-{self.id}: {self.vehicle.license_plate}"
```

### JavaScript / JSX (React)

- **Linter**: `eslint` flat config con `react-hooks` y `react-refresh`.
- **Formateador**: `prettier`.
- **Componentes**: funciones con nombre en PascalCase, export nombrado preferido.
- **Constantes**: UPPER_SNAKE_CASE para valores globales (ej. `STATUS_LABELS`).

```javascript
// ─── Component: WorkOrderCard ─────────────
import { useState } from 'react';

const STATUS_LABELS = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
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

- Mobile-first. Evitar CSS custom a menos que sea necesario; preferir utilidades de Tailwind.
- Paleta custom definida en `tailwind.config.js` con `primary: { 50..900 }`.

---

## Build and Development Commands

El proyecto incluye un `Makefile` orientado a entornos Windows/PowerShell. Los comandos asumen que el virtualenv de Python esta en `backend/venv/`.

### Setup inicial

```powershell
make setup              # Copia .env.example a .env, crea venv, instala deps Python y Node
```

### Desarrollo

```powershell
make dev                # Backend (:8000) + Frontend (:5173) en paralelo (PowerShell)
make backend-dev        # Django dev server (puerto 8000)
make frontend-dev       # Vite dev server (puerto 5173)
```

El frontend usa proxy de Vite: las peticiones a `/api` y `/media` se redirigen automaticamente a `http://127.0.0.1:8000`.

### Testing

```powershell
make test               # Tests backend + frontend
make backend-test       # pytest con cobertura (`--cov=apps --cov-report=term-missing`)
make frontend-test      # Vitest
```

Backend test config (`backend/pytest.ini`):
- `DJANGO_SETTINGS_MODULE = config.settings`
- Archivos de test: `tests.py`, `test_*.py`, `*_tests.py`
- `addopts = -v --tb=short`

### Build / Deploy

```powershell
make build              # Build de produccion del frontend (genera `frontend/dist/`)
make clean              # Elimina dist, node_modules, __pycache__, caches
```

### Base de datos

```powershell
make db-up              # Levanta PostgreSQL (5433) + Redis (6380) via Docker Compose
make db-down            # Detiene contenedores
make db-migrate         # Django migrate
make db-seed            # Puebla datos de demo (3 usuarios, 3 clientes, 4 vehiculos, 5 OTs, etc.)
make db-reset           # Reset completo de BD (elimina volumenes Docker)
make backend-shell      # Django shell
```

### Calidad de codigo

```powershell
make lint               # flake8 + black --check + eslint
make fmt                # black + isort + prettier
make security-check     # Checklist pre-deploy impreso en consola
```

---

## Docker Compose (Development)

Servicios definidos en `docker-compose.yml`:

| Servicio | Imagen | Puerto host | Variables |
|----------|--------|-------------|-----------|
| PostgreSQL | `postgres:16-alpine` | 5433 | `DB_USER`, `DB_PASSWORD`, `DB_NAME` (defaults: talleruser/tallerpass/tallerdb) |
| Redis | `redis:7-alpine` | 6380 | `REDIS_PORT` (default: 6380) |

Uso:
```powershell
make db-up
# O manualmente:
docker-compose up -d postgres redis
```

Para usar PostgreSQL en desarrollo, configura `DATABASE_URL` en `.env`:
```
DATABASE_URL=postgresql://talleruser:tallerpass@localhost:5433/tallerdb?sslmode=disable
```

Sin Docker, Django usa SQLite por defecto (`sqlite:///db.sqlite3`).

---

## Critical Environment Variables

Todas las variables se cargan desde `.env` en la raiz (via `python-dotenv` en backend). El archivo `.env.example` contiene la plantilla completa.

| Variable | Descripcion | Requerido | Default |
|----------|-------------|-----------|---------|
| `SECRET_KEY` | Django SECRET_KEY (min 50 chars en prod) | Si | `dev-secret-key-change-in-production` |
| `DEBUG` | Modo debug Django | No | `True` |
| `ALLOWED_HOSTS` | Hosts permitidos (coma-separados) | No | `localhost,127.0.0.1` |
| `DATABASE_URL` | PostgreSQL connection string | No | `sqlite:///db.sqlite3` |
| `REDIS_URL` | Redis connection string | No | `redis://127.0.0.1:6379/1` |
| `JWT_SECRET` | Secret para firmar JWT (min 32 chars) | Si | - |
| `JWT_ACCESS_TOKEN_LIFETIME` | Minutos de vida del access token | No | `60` |
| `JWT_REFRESH_TOKEN_LIFETIME` | Minutos de vida del refresh token | No | `1440` |
| `CORS_ALLOWED_ORIGINS` | Origenes CORS permitidos (coma-separados) | Si | `http://localhost:5173,...` |
| `FRONTEND_URL` | URL del frontend (CORS) | Si | `http://localhost:5173` |
| `VITE_API_URL` | URL base de la API para el frontend | Si | `http://localhost:8000/api/v1` |
| `MEDIA_ROOT` | Ruta absoluta para uploads | No | `backend/media` |
| `MEDIA_URL` | URL publica para media | No | `/media/` |
| `EMAIL_BACKEND` | Backend de email Django | No | `console.EmailBackend` |
| `ENV` | Entorno (`development` / `production`) | No | `development` |

**Nunca commitear `.env`.** Esta en `.gitignore`.

---

## Testing Strategy

### Backend

- **Framework**: `pytest` con `pytest-django`.
- **Cobertura**: `pytest-cov`, target minimo implicito via CI (`--cov=apps --cov-report=xml`).
- **Factories**: `factory-boy` disponible para generar datos de test.
- **Ubicacion**: tests dentro de cada app (`tests.py`, `test_*.py`, `*_tests.py`).
- **CI**: corre sobre PostgreSQL 16 (puerto 5433) con usuario `test/test` y base de datos `testdb`.

### Frontend

- **Framework**: `Vitest`.
- **Comando**: `npm run test` (o `make frontend-test`).
- **Estado actual**: no hay archivos de test en `frontend/src/` todavia.

### Scripts de utilidad

- `scripts/test-api.ps1`: Smoke tests en PowerShell que verifican `/admin/login/` y `/api/v1/auth/token/`.

---

## CI/CD Pipeline

Archivo: `.github/workflows/ci.yml`

**Triggers**: push a `main`/`develop`, PRs a `main`.

**Jobs**:

1. **backend** (Ubuntu):
   - PostgreSQL 16 como service container (puerto 5433).
   - Python 3.12, cache de pip.
   - Instala deps desde `backend/requirements.txt`.
   - Lint: `flake8` + `black --check`.
   - Test: `pytest --cov=apps --cov-report=xml`.
   - Subida de cobertura a Codecov.

2. **frontend** (Ubuntu):
   - Node 20, cache de npm via `package-lock.json`.
   - `npm ci`, `npm run lint`, `npm run test -- --run`, `npm run build`.

3. **deploy** (Ubuntu, solo rama `main`):
   - Depende de `backend` y `frontend`.
   - Paso placeholder; requiere secreto `DEPLOY_TOKEN`.

---

## Security Considerations

Archivo dedicado: `SECURITY.md`.

Principales puntos a considerar antes de desplegar:

- **Secrets**: `SECRET_KEY` y `JWT_SECRET` deben ser unicos, largos (>50 y >32 chars respectivamente) y nunca hardcodeados.
- **Debug**: `DEBUG = False` en produccion.
- **Hosts**: `ALLOWED_HOSTS` configurado explicitamente.
- **CORS**: `CORS_ALLOWED_ORIGINS` restringido a los dominios de produccion.
- **HTTPS**: forzado cuando `DEBUG=False` (`SECURE_SSL_REDIRECT`, cookies seguras).
- **Base de datos**: usar SSL/TLS en conexiones PostgreSQL de produccion.
- **JWT**: expiracion corta, rotacion de refresh tokens, blacklist despues de rotacion.
- **Rate limiting**: recomendado en endpoints publicos (aun no implementado por defecto).
- **Dependencias**: auditar con `pip audit` / `npm audit` antes de deploy.
- **Headers de seguridad**: HSTS, CSP, X-Frame-Options en produccion.
- **Backups**: configurar backups automaticos de PostgreSQL.
- **PII**: logs no deben exponer datos personales.

Si se expone un secret:
1. Rotar inmediatamente.
2. Revocar tokens antiguos.
3. Revisar logs de acceso.
4. Notificar a usuarios si aplica.

---

## Backend Architecture Details

### Aplicaciones Django (`backend/apps/`)

| App | Responsabilidad | Modelos principales |
|-----|-----------------|---------------------|
| `core` | Comandos de management utilidad | - |
| `users` | Autenticacion JWT, roles, perfiles | `User` (AbstractUser custom) |
| `customers` | Clientes y vehiculos | `Customer`, `Vehicle` |
| `workorders` | Ordenes de trabajo (dominio central) | `WorkOrder`, `WorkOrderItem`, `WorkOrderStatusHistory` |
| `estimates` | Presupuestos | `Estimate`, `EstimateItem` |
| `invoices` | Facturacion | `Invoice`, `InvoiceItem` |
| `photos` | Fotos vinculadas a OTs | `Photo` |
| `notifications` | Notificaciones multicanal | `Notification` |

### Convenciones de backend

- Cada app sigue la estructura estandar Django: `models.py`, `views.py`, `serializers.py`, `urls.py`, `admin.py`, `apps.py`, `migrations/`.
- Rutas API: todas bajo `/api/v1/`, definidas en `config/urls.py`.
- Auth: endpoints JWT en `/api/v1/auth/` (provistos por `apps.users.urls`).
- Auto-generacion de codigos:
  - OT: `OT-{YYYY}-{NNNN}` (ej. `OT-2024-0001`)
  - Factura: `FAC-{YYYY}-{NNNN}`
- Maquina de estados de WorkOrder: transiciones validadas en `workorders/views.py` (`change_status`).
- Demo data: comando `python manage.py seed` crea 3 usuarios, 3 clientes, 4 vehiculos, 5 OTs con historial, 7 items, 2 presupuestos y 1 factura pagada.

---

## Frontend Architecture Details

### Estructura de rutas (`frontend/src/App.jsx`)

| Ruta | Componente | Protegida | Descripcion |
|------|------------|-----------|-------------|
| `/login` | `Login` | No | Formulario JWT login |
| `/` | `Dashboard` | Si | Resumen con stats y OTs recientes |
| `/work-orders` | `WorkOrderList` | Si | Listado de ordenes de trabajo |
| `/work-orders/:id` | `WorkOrderDetail` | Si | Detalle de una OT |
| `/profile` | `Profile` | Si | Perfil de usuario |
| `*` | redirect `/` | - | Catch-all |

### Cliente API (`frontend/src/api/client.js`)

- Fetch wrapper con:
  - Automatic JWT `Authorization: Bearer <token>` header.
  - Persistencia de tokens en `localStorage`.
  - Refresh automatico del access token cuando expira.
  - Base URL tomada del entorno (via proxy en dev).

### AuthContext (`frontend/src/context/AuthContext.jsx`)

- Provee: `user`, `login(credentials)`, `logout()`, `isAdmin`.
- Persistencia: token en `localStorage`, user en memoria.
- Integracion: `PrivateRoute` wrapper que redirige a `/login` si no hay sesion.

---

## Demo Credentials

Tras ejecutar `make db-seed` (o `python manage.py seed`):

| Usuario | Password | Rol |
|---------|----------|-----|
| `admin` | `admin123` | Administrador |
| `mecanico1` | `pass123` | Mecanico / Chapista |
| `recepcion` | `pass123` | Recepcionista |

Admin Django: `http://127.0.0.1:8000/admin/`

---

## SDD Workflow

Este proyecto usa el flujo de trabajo SDD (Spec-Driven Development) de la plantilla madre. Las skills estan en `.claude/skills/`.

| Phase | Skill | Proposito |
|-------|-------|-----------|
| 1 | `/sdd-init` | Inicializar contexto del proyecto |
| 2 | `/sdd-explore` | Investigar requisitos y codigo antes de cambios |
| 3 | `/sdd-spec` | Especificar funcionalidades con escenarios |
| 4 | `/sdd-tasks` | Descomponer en tareas implementables |
| 5 | `/sdd-apply` | Implementar cambios |
| 6 | `/sdd-verify` | Verificar que la implementacion cumple specs |
| 7 | `/sdd-archive` | Archivar change completado |

Las especificaciones del dominio estan en `docs/spec/`:
- `01-domains.md` — Dominios y maquina de estados
- `02-data-model.md` — Modelos Django
- `03-api.md` — Endpoints REST
- `04-frontend.md` — Flujo de navegacion y pantallas
- `05-requirements.md` — Requisitos funcionales Given/When/Then

---

## Quick Start Checklist

1. **Requisitos**: Python 3.12+, Node.js 20+, (opcional) Docker Desktop.
2. **Entorno**: `cp .env.example .env` y ajusta variables.
3. **Backend**:
   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py seed
   python manage.py runserver
   ```
4. **Frontend** (otra terminal):
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
5. **Abrir**: Frontend en `http://localhost:5173`, Backend en `http://127.0.0.1:8000`.
6. **Probar en movil** (misma WiFi): usa la IP local de la maquina (`ipconfig`) y puerto `5173`.

---

## Contact

Proyecto privado — App Taller Chapa y Pintura.
