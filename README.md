# App Taller Chapa y Pintura

App movil (PWA) para la gestion integral de un taller de chapa y pintura.

## 🚀 Stack Tecnologico

| Capa | Tecnologia |
|------|------------|
| **Backend** | Django 5 + Django REST Framework |
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **PWA** | Vite PWA Plugin (offline, manifest, service worker) |
| **Database** | PostgreSQL 16 (prod) / SQLite (dev rapido) |
| **Cache** | Redis 7 |
| **Auth** | JWT (djangorestframework-simplejwt) |
| **Testing** | pytest (backend), Vitest (frontend) |

## 📁 Estructura

```
app-taller-chapa/
├── backend/          # Django API
│   ├── config/       # Settings, URLs, WSGI
│   ├── apps/         # Aplicaciones Django
│   │   ├── core/     # Comandos utilidad (seed)
│   │   ├── users/    # Auth y roles
│   │   ├── customers/# Clientes y vehiculos
│   │   ├── workorders/  # Ordenes de trabajo
│   │   ├── estimates/   # Presupuestos
│   │   ├── invoices/    # Facturas
│   │   ├── photos/      # Fotos
│   │   └── notifications/  # Notificaciones
│   ├── requirements.txt
│   └── manage.py
├── frontend/         # React PWA
│   ├── src/
│   │   ├── api/      # Cliente API
│   │   ├── context/  # AuthContext
│   │   ├── components/ # UI reutilizable
│   │   └── pages/    # Pantallas
│   └── package.json
├── Makefile
├── docker-compose.yml
└── docs/spec/        # Especificacion completa
```

## 🛠️ Quick Start — Demo Local

### Requisitos
- Python 3.12+
- Node.js 20+
- (Opcional) Docker Desktop — solo si quieres PostgreSQL/Redis

### 1. Clonar / entrar al proyecto

```powershell
cd app-taller-chapa
```

### 2. Backend

```powershell
# Crear virtualenv
cd backend
python -m venv venv

# Activar (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Migraciones (usa SQLite por defecto en desarrollo)
python manage.py migrate

# Seed de datos de demo (usuarios, clientes, coches, OTs, presupuestos, facturas)
python manage.py seed

# Crear superusuario (opcional, el seed ya creo uno)
# python manage.py createsuperuser

# Levantar servidor
python manage.py runserver
```

El backend estara en: http://127.0.0.1:8000

**Credenciales de demo:**
| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | Administrador |
| mecanico1 | pass123 | Mecanico |
| recepcion | pass123 | Recepcionista |

**Admin Django:** http://127.0.0.1:8000/admin/

### 3. Frontend (en otra terminal)

```powershell
cd frontend

# Instalar dependencias
npm install

# Levantar dev server
npm run dev
```

El frontend estara en: http://localhost:5173

### 4. Probar en tu movil (misma WiFi)

1. Averigua la IP local de tu PC: `ipconfig` (ej: `192.168.1.35`)
2. Abre en tu movil: `http://192.168.1.35:5173`
3. Login con `admin` / `admin123`
4. Agrega a pantalla de inicio para probar la PWA

> ⚠️ Si usas SQLite (sin Docker), no necesitas `make db-up`. Si prefieres PostgreSQL, ejecuta `make db-up` antes y cambia `DATABASE_URL` en `.env`.

---

## 🐳 Con Docker (PostgreSQL + Redis)

```powershell
# 1. Copiar y editar variables de entorno
cp .env.example .env

# 2. Levantar PostgreSQL y Redis
docker-compose up -d

# 3. En backend/.env (o variables de entorno):
# DATABASE_URL=postgresql://talleruser:tallerpass@localhost:5433/tallerdb?sslmode=disable

# 4. Migrar y seed
python manage.py migrate
python manage.py seed

# 5. Levantar backend
python manage.py runserver
```

---

## 📱 Uso como PWA

1. Abre la app en Chrome/Safari del movil
2. Menu → "Agregar a pantalla de inicio"
3. Listo, funciona como app nativa con icono propio

---

## 🧪 Testing

```powershell
# Backend
make backend-test

# Frontend
make frontend-test
```

---

## 📋 Comandos utiles (Makefile)

```powershell
make dev              # Backend + Frontend (no implementado en paralelo en Windows)
make backend-dev      # Django dev server
make frontend-dev     # Vite dev server
make test             # Tests backend + frontend
make lint             # flake8 + black + eslint
make fmt              # Formatear codigo
make db-up            # PostgreSQL + Redis
make db-seed          # Ejecuta python manage.py seed
make security-check   # Checklist pre-deploy
```

---

## 🔐 Seguridad

Revisa `SECURITY.md` antes de cada deploy. En produccion:
- Cambia `SECRET_KEY`
- `DEBUG = False`
- Configura `ALLOWED_HOSTS`
- Usa HTTPS
- Configura email real para notificaciones

---

## 🔄 Workflow SDD

Este proyecto usa el flujo de trabajo SDD de la plantilla madre:

1. `/sdd-init` — Inicializar contexto
2. `/sdd-explore` — Investigar requisitos
3. `/sdd-spec` — Especificar funcionalidades
4. `/sdd-tasks` — Descomponer en tareas
5. `/sdd-apply` — Implementar
6. `/sdd-verify` — Verificar
7. `/sdd-archive` — Archivar
