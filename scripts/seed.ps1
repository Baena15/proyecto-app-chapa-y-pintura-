# Script para poblar la base de datos con datos de ejemplo (PowerShell)
# App Taller Chapa y Pintura

Write-Host "🌱 Seeding database for App Taller Chapa y Pintura..." -ForegroundColor Green

# Verificar que PostgreSQL esta corriendo
$containerRunning = docker-compose ps | Select-String "postgres.*Up"

if (-not $containerRunning) {
    Write-Host "⚠️  PostgreSQL no esta corriendo. Iniciando..." -ForegroundColor Yellow
    docker-compose up -d postgres
    Start-Sleep -Seconds 5
}

# Configuracion
$dbUser = if ($env:DB_USER) { $env:DB_USER } else { "talleruser" }
$dbName = if ($env:DB_NAME) { $env:DB_NAME } else { "tallerdb" }

$seedSQL = @"
-- Crear usuario admin
INSERT INTO auth_user (username, email, password, is_superuser, is_staff, is_active, first_name, last_name, date_joined)
VALUES (
    'admin',
    'admin@tallerchapa.com',
    'pbkdf2_sha256$...', -- cambiar por hash real via Django
    true,
    true,
    true,
    'Admin',
    'Taller',
    NOW()
)
ON CONFLICT (username) DO NOTHING;

-- TODO: Agrega seed de clientes, vehiculos y ordenes de trabajo
"@

Write-Host "⚠️  Nota: Este seed es un template. Usa 'python manage.py loaddata' o Django shell para seed robusto." -ForegroundColor Yellow
Write-Host "✅ Seed template listo. Adapta el SQL a tus modelos Django." -ForegroundColor Green
