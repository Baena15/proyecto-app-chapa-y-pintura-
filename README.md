# App Taller Chapa y Pintura

App movil (PWA) para la gestion integral de un taller de chapa y pintura.

## 🚀 Stack Tecnologico

| Capa | Tecnologia |
|------|------------|
| **Backend** | Django 5 + Django REST Framework |
| **Frontend** | React 18 + Vite + Tailwind CSS |
| **PWA** | Vite PWA Plugin (offline, manifest, service worker) |
| **Database** | PostgreSQL 16 |
| **Cache** | Redis 7 |
| **Auth** | JWT (djangorestframework-simplejwt) |
| **Testing** | pytest (backend), Vitest (frontend) |

## 📁 Estructura

```
app-taller-chapa/
├── backend/          # Django API
│   ├── config/       # Settings, URLs, WSGI
│   ├── apps/         # Aplicaciones Django
│   └── requirements.txt
├── frontend/         # React PWA
│   ├── src/          # Componentes y paginas
│   └── package.json
├── scripts/          # Seed y test API
├── docs/             # Documentacion
├── Makefile          # Comandos de desarrollo
└── docker-compose.yml
```

## 🛠️ Quick Start

### 1. Requisitos
- Python 3.12+
- Node.js 20+
- Docker Desktop (para PostgreSQL + Redis)

### 2. Setup inicial

```powershell
# Clonar / entrar al proyecto
cd app-taller-chapa

# Instalar dependencias y configurar
make setup
```

### 3. Configurar variables de entorno

```powershell
cp .env.example .env
# Editar .env con tus valores
```

### 4. Levantar base de datos

```powershell
make db-up
```

### 5. Migraciones y seed

```powershell
make db-migrate
make db-seed
```

### 6. Iniciar desarrollo

```powershell
# Backend + Frontend en paralelo
make dev
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

## 📱 Uso como PWA

1. Abre http://localhost:5173 en tu movil (misma red WiFi)
2. Chrome/Safari → "Agregar a pantalla de inicio"
3. Listo, funciona como app nativa

## 🧪 Testing

```powershell
# Tests backend
make backend-test

# Tests frontend
make frontend-test

# Todos
make test
```

## 📋 Comandos utiles

```powershell
make lint        # flake8 + black + eslint
make fmt         # Formatear codigo
make build       # Build de produccion
make clean       # Limpiar caches
make security-check   # Checklist pre-deploy
```

## 🔄 Workflow SDD

Este proyecto usa el flujo de trabajo SDD de la plantilla madre:

1. `/sdd-init` — Inicializar contexto
2. `/sdd-explore` — Investigar requisitos
3. `/sdd-spec` — Especificar funcionalidades
4. `/sdd-tasks` — Descomponer en tareas
5. `/sdd-apply` — Implementar
6. `/sdd-verify` — Verificar
7. `/sdd-archive` — Archivar

## 🔐 Seguridad

Revisa `SECURITY.md` antes de cada deploy.
