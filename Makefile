# Makefile — App Taller Chapa y Pintura
# Backend: Django + DRF | Frontend: React + Vite | DB: PostgreSQL + Redis

.PHONY: help dev build test lint fmt clean db-up db-down db-migrate db-seed db-reset backend-dev backend-test backend-shell frontend-dev frontend-build frontend-test security-check setup

# ─── Default: muestra ayuda ─────────────────
help:
	@echo "🔧 Comandos disponibles:"
	@echo ""
	@echo "  make dev              - Iniciar backend + frontend"
	@echo "  make backend-dev      - Django dev server (puerto 8000)"
	@echo "  make frontend-dev     - Vite dev server (puerto 5173)"
	@echo "  make test             - Tests backend + frontend"
	@echo "  make backend-test     - pytest con cobertura"
	@echo "  make frontend-test    - Vitest"
	@echo "  make build            - Build de produccion (frontend)"
	@echo "  make lint             - flake8, black check, eslint"
	@echo "  make fmt              - black + isort + prettier"
	@echo "  make clean            - Limpiar caches/builds"
	@echo "  make db-up            - Levantar PostgreSQL + Redis"
	@echo "  make db-down          - Detener PostgreSQL + Redis"
	@echo "  make db-migrate       - Django migrations"
	@echo "  make db-seed          - Seed datos de ejemplo"
	@echo "  make db-reset         - Resetear BD (elimina datos)"
	@echo "  make setup            - Setup inicial del proyecto"
	@echo "  make security-check   - Checklist pre-deploy"
	@echo ""

# ─── Setup inicial ──────────────────────────
setup:
	@echo "⚙️  Setup inicial..."
	@cp .env.example .env 2>/dev/null || echo "⚠️  .env.example no existe"
	@cd backend && python -m venv venv 2>/dev/null || echo "⚠️  venv ya existe"
	@cd backend && .\venv\Scripts\pip install -r requirements.txt
	@cd frontend && npm install
	@echo "✅ Setup completo. Configura .env y ejecuta: make db-up"

# ─── Desarrollo ─────────────────────────────
dev:
	@echo "🚀 Iniciando backend + frontend en paralelo..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:5173"
	@start powershell -NoExit -Command "cd backend; .\venv\Scripts\python manage.py runserver"
	@cd frontend && npm run dev

backend-dev:
	@echo "🐍 Iniciando Django dev server..."
	@cd backend && .\venv\Scripts\python manage.py runserver

frontend-dev:
	@echo "⚛️  Iniciando Vite dev server..."
	@cd frontend && npm run dev

# ─── Testing ────────────────────────────────
test: backend-test frontend-test

backend-test:
	@echo "🧪 Ejecutando tests backend (pytest)..."
	@cd backend && .\venv\Scripts\pytest --cov=apps --cov-report=term-missing

frontend-test:
	@echo "🧪 Ejecutando tests frontend (Vitest)..."
	@cd frontend && npm run test

# ─── Build ──────────────────────────────────
build:
	@echo "🔨 Build de produccion frontend..."
	@cd frontend && npm run build
	@echo "✅ Build completo en frontend/dist/"

# ─── Clean ──────────────────────────────────
clean:
	@echo "🧹 Limpiando..."
	@cd frontend && rm -rf dist node_modules .coverage
	@cd backend && rm -rf __pycache__ .pytest_cache *.pyc
	@echo "✅ Limpieza completa"

# ─── Code Quality ───────────────────────────
lint:
	@echo "🔍 Linting backend..."
	@cd backend && .\venv\Scripts\flake8 apps config --max-line-length=100 --exclude=migrations
	@cd backend && .\venv\Scripts\black --check apps config --exclude migrations
	@echo "🔍 Linting frontend..."
	@cd frontend && npm run lint

fmt:
	@echo "✨ Formateando backend..."
	@cd backend && .\venv\Scripts\black apps config --exclude migrations
	@cd backend && .\venv\Scripts\isort apps config --skip-glob="*/migrations/*"
	@echo "✨ Formateando frontend..."
	@cd frontend && npm run format

# ─── Database ───────────────────────────────
db-up:
	@echo "🐘 Levantando PostgreSQL + Redis..."
	@docker-compose up -d postgres redis

db-down:
	@echo "🛑 Deteniendo PostgreSQL + Redis..."
	@docker-compose down

db-migrate:
	@echo "🗄️  Ejecutando migraciones..."
	@cd backend && .\venv\Scripts\python manage.py migrate

db-seed:
	@echo "🌱 Poblando datos de ejemplo..."
	@powershell -ExecutionPolicy Bypass -File .\scripts\seed.ps1

db-reset:
	@echo "⚠️  ATENCION: Esto eliminara TODOS los datos de la base de datos."
	@read -p "¿Estas seguro? (y/N): " confirm; \
	if [ "$$confirm" = "y" ]; then \
		docker-compose down -v; \
		docker-compose up -d postgres redis; \
		sleep 5; \
		cd backend && .\venv\Scripts\python manage.py migrate; \
		echo "✅ Base de datos reseteada"; \
	else \
		echo "❌ Cancelado"; \
	fi

backend-shell:
	@echo "🐚 Abriendo Django shell..."
	@cd backend && .\venv\Scripts\python manage.py shell

# ─── Seguridad pre-deploy ───────────────────
security-check:
	@echo "🔐 Security checklist:"
	@echo "  ☐ SECRET_KEY cambiada (no la default de desarrollo)"
	@echo "  ☐ DEBUG = False en produccion"
	@echo "  ☐ ALLOWED_HOSTS configurado"
	@echo "  ☐ CORS_ALLOWED_ORIGINS restringido"
	@echo "  ☐ DATABASE_URL usa SSL"
	@echo "  ☐ No hay secrets en el codigo (.env solo)"
	@echo "  ☐ Dependencias auditadas (pip audit)"
	@echo "  ☐ Tests pasando"
	@echo ""
	@echo "Ejecuta: make lint && make test"
