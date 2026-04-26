# 01 — Dominios

## 1. Usuarios (`users`)

Autenticacion JWT, gestion de roles y perfiles.

**Roles:**
- `admin` — Jefe de taller, acceso total
- `receptionist` — Recepcion, crea OTs y presupuestos
- `mechanic` — Chapista / mecanico, actualiza estados y fotos
- `painter` — Pintor, actualiza estados y fotos
- `client` — Cliente externo, ve estado de su coche

**Responsabilidades:**
- Login / logout JWT
- Perfil de usuario (avatar, telefono, especialidad)
- Solo `admin` puede crear usuarios internos
- Los `client` se registran solos o son creados por `receptionist`

---

## 2. Clientes (`customers`)

Fichas de clientes y sus vehiculos.

**Responsabilidades:**
- CRUD de clientes (nombre, telefono, email, DNI/NIF, direccion)
- CRUD de vehiculos vinculados a un cliente
- Busqueda por matricula, nombre o telefono
- Un cliente puede tener varios vehiculos
- Un vehiculo pertenece a un solo cliente

**Datos del vehiculo:**
- Matricula (unica)
- Marca, modelo, version
- Ano, color, numero de bastidor (VIN)
- Compania aseguradora y numero de poliza (opcional)

---

## 3. Ordenes de Trabajo (`workorders`)

El nucleo del sistema. Representa la entrada de un vehiculo al taller.

**Responsabilidades:**
- Crear OT desde recepcion
- Asignar mecanico / pintor responsable
- Gestionar estados de reparacion con historial
- Calcular tiempo estimado vs real
- Relacionar con presupuesto y factura

**Estados de una OT (maquina de estados):**
```
PENDING → IN_PROGRESS → IN_BODYWORK → IN_PAINTING
                                            ↓
WAITING_PARTS ← (loop)                      ↓
                                            ↓
QUALITY_CONTROL → READY → DELIVERED → CANCELLED
```

- `pending` — Creada, sin empezar
- `in_progress` — En diagnostico / despiece
- `in_bodywork` — En chapa (reparacion estructural)
- `waiting_parts` — Esperando piezas (puede volver a `in_bodywork`)
- `in_painting` — En cabina de pintura
- `quality_control` — Revision de calidad final
- `ready` — Listo para entrega
- `delivered` — Entregado al cliente
- `cancelled` — Cancelado (solo admin)

Cambio de estado SIEMPRE guarda historico (quien, cuando, notas).

---

## 4. Presupuestos (`estimates`)

Presupuesto vinculado a una OT.

**Responsabilidades:**
- Generar presupuesto desde una OT
- Items de mano de obra y piezas
- Enviar al cliente (email/SMS con link)
- Aprobacion / rechazo del cliente
- Si se aprueba, desbloquea el trabajo (puede pasar a `in_progress`)

**Flujo:**
1. `receptionist` o `admin` crea presupuesto
2. Sistema envia al cliente
3. Cliente aprueba desde link o presencial
4. OT pasa a `in_progress` (si estaba en `pending`)

---

## 5. Facturacion (`invoices`)

Factura final tras entrega del vehiculo.

**Responsabilidades:**
- Generar factura desde OT entregada
- Items: mano de obra, piezas, IVA
- Estado: `draft` → `sent` → `paid` / `overdue`
- Registro de pago (efectivo, tarjeta, transferencia)

---

## 6. Fotos (`photos`)

Evidencia fotografica del proceso.

**Responsabilidades:**
- Subir fotos desde movil (camara o galeria)
- Categorias: `damage` (daños iniciales), `progress` (durante reparacion), `final` (resultado), `invoice` (documentos)
- Vinculadas a una OT
- Visibles por cliente en su panel

---

## 7. Notificaciones (`notifications`)

Comunicacion automatica con el cliente.

**Responsabilidades:**
- Templates de mensajes por tipo de evento
- Canales: email, SMS (via Twilio o similar), push (PWA)
- Eventos que disparan notificacion:
  - Presupuesto creado → "Su presupuesto esta listo"
  - Estado cambia a `ready` → "Su vehiculo esta listo para recoger"
  - Factura enviada → "Factura disponible"
- Cola de envio con reintentos
