# 04 — Frontend: Pantallas y Flujos

## Principios de UI

- **Mobile-first**: Diseñado para movil, usable en tablet/desktop
- **Touch-friendly**: Botones grandes (min 44x44px), gestos simples
- **Offline-capable**: PWA con cache de assets y datos basicos
- **Tematica taller**: Colores industriales (azul oscuro, gris, naranja alerta)

---

## Flujo de Navegacion

```
LOGIN
  ├─ Admin / Recepcion / Mecanico
  │   ├─ DASHBOARD (home)
  │   ├─ ORDENES DE TRABAJO
  │   │   ├─ Lista de OTs (filtros por estado)
  │   │   ├─ Detalle de OT
  │   │   │   ├─ Info general + vehiculo + cliente
  │   │   │   ├─ ESTADOS (timeline vertical)
  │   │   │   ├─ ITEMS (trabajos)
  │   │   │   ├─ FOTOS (galeria + subir)
  │   │   │   ├─ PRESUPUESTO (crear/ver)
  │   │   │   └─ FACTURA (generar/ver)
  │   │   └─ Nueva OT (wizard: buscar cliente → buscar/crear vehiculo → descripcion)
  │   ├─ CLIENTES
  │   │   ├─ Lista (busqueda rapida)
  │   │   ├─ Ficha cliente + vehiculos
  │   │   └─ Nuevo cliente
  │   ├─ PRESUPUESTOS
  │   │   ├─ Lista
  │   │   └─ Detalle (aprobar/rechazar)
  │   ├─ FACTURAS
  │   │   ├─ Lista
  │   │   └─ Detalle + registrar pago
  │   └─ PERFIL
  │
  └─ Cliente
      ├─ MIS VEHICULOS
      │   └─ Ver estado de reparacion (timeline)
      ├─ MIS PRESUPUESTOS
      │   └─ Aprobar / rechazar
      └─ MIS FACTURAS
```

---

## Pantallas Detalladas

### 1. Login
- Logo del taller
- Campos: usuario, contraseña
- Link "Soy cliente" → login simplificado (telefono + codigo SMS)

### 2. Dashboard (Home)
**Para admin/recepcion:**
- Tarjetas: OTs pendientes, listas hoy, ingresos mes
- Lista rapida: OTs en progreso (swipe para cambiar estado)
- Acceso rapido: "Nueva OT", "Buscar cliente"

**Para mecanico/pintor:**
- Mis OTs asignadas (hoy y esta semana)
- Boton flotante para subir foto rapida

### 3. Lista de OTs
- Filtros por estado (tabs horizontales scrolleables)
- Cada tarjeta muestra: codigo, matricula, cliente, estado (color), fecha
- Search bar arriba
- Pull-to-refresh

### 4. Detalle de OT
- Header: matricula + modelo + estado (badge de color)
- Tabs:
  - **Info**: cliente, telefono, descripcion, tecnico asignado, fechas
  - **Estados**: timeline vertical con puntos de colores
    - Boton "Cambiar estado" → modal con selector + notas
  - **Trabajos**: lista de items con horas y costos
    - Boton "+ Agregar trabajo"
  - **Fotos**: grid 2 columnas, click para ampliar
    - Boton flotante "📷" para subir foto (camara o galeria)
  - **Presupuesto**: si existe, mostrar resumen + items
    - Si no existe: boton "Generar presupuesto"
  - **Factura**: si existe, mostrar total + estado de pago
    - Si no existe (y estado = delivered): boton "Generar factura"

### 5. Nueva OT (Wizard)
**Paso 1:** Buscar cliente
- Search por telefono, nombre o DNI
- Si no existe: boton "Crear cliente" (nombre, telefono, email)

**Paso 2:** Buscar/crear vehiculo
- Search por matricula
- Si existe: seleccionar
- Si no: formulario (matricula, marca, modelo, color, año)

**Paso 3:** Detalles
- Descripcion de danos (textarea)
- Fotos de danos (opcional, camara)
- Fecha estimada de entrega (date picker)
- Tecnico asignado (dropdown)

**Paso 4:** Resumen → Confirmar

### 6. Cliente (ficha)
- Datos personales
- Lista de vehiculos (click para ver historial)
- Historial de OTs del cliente

### 7. Presupuesto
- Lista de items (descripcion, cantidad, precio unitario, total)
- Totales: mano de obra, piezas, total
- Estado: badge (Borrador, Enviado, Aprobado, Rechazado)
- Si esta en borrador: boton "Enviar al cliente" → envia email/SMS
- Acciones segun estado

### 8. Factura
- Datos del taller (nombre, CIF, direccion)
- Datos del cliente
- Items detallados
- Subtotal, IVA, Total
- Estado de pago + boton "Registrar pago"
- Boton "Descargar PDF"

### 9. Perfil
- Foto, nombre, rol
- Telefono (editable)
- Cerrar sesion

---

## Estados de OT (Colores UI)

| Estado | Color | Icono |
|--------|-------|-------|
| Pendiente | Gris | ⏸️ |
| En progreso | Azul | 🔧 |
| En chapa | Naranja | 🔨 |
| Esperando piezas | Amarillo | 📦 |
| En pintura | Morado | 🎨 |
| Control calidad | Cyan | 🔍 |
| Listo | Verde | ✅ |
| Entregado | Verde oscuro | 🚗 |
| Cancelado | Rojo | ❌ |

---

## Componentes Reusables

- `<WorkOrderCard>` — Tarjeta de OT para listas
- `<StatusBadge>` — Badge de estado con color
- `<StatusTimeline>` — Timeline vertical de estados
- `<PhotoGrid>` — Grid de fotos con lightbox
- `<CustomerSearch>` — Busqueda de cliente con autocomplete
- `<VehicleSearch>` — Busqueda de vehiculo por matricula
- `<EstimateForm>` — Formulario de items de presupuesto
- `<PaymentModal>` — Modal para registrar pago
