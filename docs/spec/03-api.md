# 03 — API REST

Base URL: `/api/v1/`

Autenticacion: JWT Bearer token en header `Authorization`

---

## Auth

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/auth/token/` | Obtener access + refresh token |
| POST | `/auth/token/refresh/` | Refrescar access token |
| POST | `/auth/token/verify/` | Verificar validez de token |
| POST | `/auth/register/` | Registro de cliente |
| GET | `/auth/me/` | Perfil del usuario logueado |
| PATCH | `/auth/me/` | Actualizar perfil |

**Login Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Login Response:**
```json
{
  "access": "eyJ0...",
  "refresh": "eyJ0...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin",
    "first_name": "Juan",
    "last_name": "Garcia"
  }
}
```

---

## Users (admin only)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/users/` | Listar usuarios (paginado) |
| POST | `/users/` | Crear usuario interno |
| GET | `/users/{id}/` | Detalle de usuario |
| PATCH | `/users/{id}/` | Actualizar usuario |
| DELETE | `/users/{id}/` | Desactivar usuario |

---

## Customers

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/customers/` | Listar clientes (busqueda por nombre, telefono, email) |
| POST | `/customers/` | Crear cliente |
| GET | `/customers/{id}/` | Detalle del cliente + vehiculos |
| PATCH | `/customers/{id}/` | Actualizar cliente |
| DELETE | `/customers/{id}/` | Eliminar (soft delete) |

**Search query params:** `?search=ana&phone=555`

---

## Vehicles

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/vehicles/` | Listar vehiculos (busqueda por matricula) |
| POST | `/vehicles/` | Crear vehiculo |
| GET | `/vehicles/{id}/` | Detalle + historial de OTs |
| PATCH | `/vehicles/{id}/` | Actualizar |
| DELETE | `/vehicles/{id}/` | Eliminar |

**Search:** `?search=1234ABC&customer=5`

---

## Work Orders

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/work-orders/` | Listar OTs (filtros: status, assigned_to, date) |
| POST | `/work-orders/` | Crear OT |
| GET | `/work-orders/{id}/` | Detalle completo (items, fotos, historial) |
| PATCH | `/work-orders/{id}/` | Actualizar datos basicos |
| POST | `/work-orders/{id}/status/` | Cambiar estado (+ notas) |
| POST | `/work-orders/{id}/assign/` | Asignar tecnico |

**Filtros:** `?status=ready&assigned_to=3&date_from=2024-01-01&date_to=2024-12-31`

**Crear OT Request:**
```json
{
  "vehicle_id": 5,
  "description": "Golpe en parachoques delantero + abolladura puerta izquierda",
  "estimated_cost": 450.00,
  "estimated_completion": "2024-02-15"
}
```

**Cambiar Estado Request:**
```json
{
  "to_status": "in_progress",
  "notes": "Piezas recibidas, se empieza trabajo"
}
```

---

## Work Order Items

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/work-orders/{id}/items/` | Agregar item a OT |
| PATCH | `/work-order-items/{id}/` | Actualizar item (horas reales, costos) |
| DELETE | `/work-order-items/{id}/` | Eliminar item |

---

## Estimates

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/estimates/` | Listar presupuestos |
| POST | `/estimates/` | Crear presupuesto desde OT |
| GET | `/estimates/{id}/` | Detalle + items |
| PATCH | `/estimates/{id}/` | Actualizar (solo borrador) |
| POST | `/estimates/{id}/send/` | Enviar al cliente |
| POST | `/estimates/{id}/approve/` | Aprobar (cliente o admin) |
| POST | `/estimates/{id}/reject/` | Rechazar |

---

## Invoices

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/invoices/` | Listar facturas |
| POST | `/invoices/` | Crear factura desde OT entregada |
| GET | `/invoices/{id}/` | Detalle |
| POST | `/invoices/{id}/send/` | Enviar al cliente |
| POST | `/invoices/{id}/pay/` | Registrar pago |
| GET | `/invoices/{id}/pdf/` | Descargar PDF |

**Pago Request:**
```json
{
  "amount": 544.50,
  "payment_method": "card",
  "notes": "Pagado con tarjeta en recepcion"
}
```

---

## Photos

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/work-orders/{id}/photos/` | Listar fotos de una OT |
| POST | `/work-orders/{id}/photos/` | Subir foto (multipart/form-data) |
| DELETE | `/photos/{id}/` | Eliminar foto |

**Upload:** `Content-Type: multipart/form-data`, campo `image`, opcional `photo_type` y `description`.

---

## Dashboard / Stats

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/dashboard/stats/` | KPIs del taller (admin) |
| GET | `/dashboard/my-work/` | OTs asignadas al usuario logueado (mecanico) |
| GET | `/dashboard/today/` | OTs de hoy |

**Stats Response:**
```json
{
  "total_work_orders_this_month": 45,
  "pending": 5,
  "in_progress": 12,
  "ready": 3,
  "delivered_this_month": 25,
  "revenue_this_month": 12450.00
}
```

---

## Client Portal (client role)

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/my-work-orders/` | Mis vehiculos y sus OTs |
| GET | `/my-work-orders/{id}/` | Detalle de mi OT (status, fotos, presupuesto) |
| GET | `/my-estimates/` | Mis presupuestos pendientes |
| POST | `/my-estimates/{id}/approve/` | Aprobar presupuesto |
| GET | `/my-invoices/` | Mis facturas |

Los clientes SOLO ven sus propios datos.
