# 05 — Requisitos Funcionales

Formato: **Given / When / Then**  
Keywords: **MUST** (obligatorio), **SHOULD** (recomendado), **MAY** (opcional)

---

## AUTH

### REQ-A1: Login JWT

The system **MUST** autenticar usuarios con JWT y devolver access + refresh tokens.

- **GIVEN** un usuario registrado con credenciales validas
- **WHEN** envia username y password al endpoint de login
- **THEN** recibe un access token (15 min) y un refresh token (7 dias)
- **AND** el access token permite acceder a endpoints protegidos

### REQ-A2: Roles y Permisos

The system **MUST** restringir acceso a recursos segun el rol del usuario.

- **GIVEN** un usuario con rol `mechanic`
- **WHEN** intenta acceder al endpoint de crear facturas (solo admin/receptionist)
- **THEN** recibe un error 403 Forbidden

### REQ-A3: Registro de Clientes

The system **SHOULD** permitir que los clientes se registren con telefono + codigo SMS.

- **GIVEN** un cliente nuevo que no existe en el sistema
- **WHEN** introduce su numero de telefono y recibe un codigo por SMS
- **THEN** puede validar el codigo y crear su cuenta
- **AND** se vincula automaticamente a su ficha de cliente si existe

---

## CUSTOMERS

### REQ-C1: Busqueda Rapida de Cliente

The system **MUST** permitir buscar clientes por nombre, telefono, email o DNI.

- **GIVEN** que existe un cliente llamado "Ana Garcia" con telefono "555-0101"
- **WHEN** el recepcionista escribe "ana" o "555" en el campo de busqueda
- **THEN** aparece "Ana Garcia" en los resultados de autocomplete

### REQ-C2: Cliente con Multiples Vehiculos

The system **MUST** permitir que un cliente tenga varios vehiculos.

- **GIVEN** un cliente con un vehiculo registrado
- **WHEN** el recepcionista agrega un segundo vehiculo a su ficha
- **THEN** ambos vehiculos aparecen en la ficha del cliente
- **AND** al crear una OT se puede elegir cualquiera de sus vehiculos

### REQ-C3: Unicidad de Matricula

The system **MUST** garantizar que no haya dos vehiculos con la misma matricula.

- **GIVEN** que existe un vehiculo con matricula "1234ABC"
- **WHEN** se intenta crear otro vehiculo con la misma matricula
- **THEN** el sistema devuelve un error 400 indicando que la matricula ya existe
- **AND** sugiere buscar el vehiculo existente

---

## WORK ORDERS

### REQ-W1: Creacion de OT

The system **MUST** permitir crear una orden de trabajo vinculando cliente y vehiculo.

- **GIVEN** un cliente "Carlos Ruiz" con vehiculo "1234ABC" (Seat Leon)
- **WHEN** el recepcionista crea una OT con descripcion "Golpe en puerta"
- **THEN** se genera un codigo unico tipo "OT-2024-0001"
- **AND** el estado inicial es "Pendiente"
- **AND** aparece en el dashboard del taller

### REQ-W2: Maquina de Estados

The system **MUST** gestionar los estados de una OT con transiciones validas.

- **GIVEN** una OT en estado "Pendiente"
- **WHEN** el mecanico cambia el estado a "En progreso"
- **THEN** el estado se actualiza y se guarda en el historial
- **AND** se notifica al cliente (si hay presupuesto aprobado)

- **GIVEN** una OT en estado "Listo"
- **WHEN** se intenta cambiar a "En pintura"
- **THEN** el sistema rechaza la transicion (no es valida)
- **AND** mantiene el estado actual

### REQ-W3: Historial de Estados

The system **MUST** registrar quien cambio el estado, cuando y por que.

- **GIVEN** una OT que ha pasado por 3 estados
- **WHEN** el usuario abre la pestaña "Estados" en el detalle de la OT
- **THEN** ve una linea de tiempo con: estado anterior → nuevo estado, fecha, nombre del usuario, y notas

### REQ-W4: Asignacion de Tecnico

The system **MUST** permitir asignar un mecanico/pintor a una OT.

- **GIVEN** una OT sin tecnico asignado
- **WHEN** el admin selecciona "Juan Perez" (mecanico) como responsable
- **THEN** Juan ve esa OT en su dashboard "Mis trabajos"
- **AND** recibe una notificacion push (si tiene PWA activada)

### REQ-W5: Items de Trabajo

The system **MUST** permitir agregar items desglosados a una OT.

- **GIVEN** una OT en estado "En chapa"
- **WHEN** el mecanico agrega un item: "Reparacion puerta izquierda", tipo "Chapa", 3h estimadas
- **THEN** el item aparece en la lista de trabajos de la OT
- **AND** al completar, registra las horas reales

### REQ-W6: Calcular Costo Final

The system **SHOULD** calcular automaticamente el costo final sumando items.

- **GIVEN** una OT con 2 items: mano de obra 300€ + piezas 150€
- **WHEN** se completa el trabajo
- **THEN** el campo `final_cost` se actualiza a 450.00

---

## ESTIMATES

### REQ-E1: Generar Presupuesto desde OT

The system **MUST** permitir crear un presupuesto vinculado a una OT.

- **GIVEN** una OT con items de trabajo definidos
- **WHEN** el recepcionista pulsa "Generar presupuesto"
- **THEN** se crea un presupuesto en estado "Borrador" con los items de la OT
- **AND** se puede editar antes de enviar

### REQ-E2: Enviar Presupuesto al Cliente

The system **MUST** enviar el presupuesto al cliente por email y/o SMS.

- **GIVEN** un presupuesto en estado "Borrador"
- **WHEN** el recepcionista pulsa "Enviar al cliente"
- **THEN** el estado cambia a "Enviado"
- **AND** el cliente recibe un email con el desglose y un link de aprobacion
- **AND** se registra la fecha de envio

### REQ-E3: Aprobacion del Cliente

The system **MUST** permitir que el cliente apruebe o rechace un presupuesto.

- **GIVEN** un cliente que recibio un presupuesto por email
- **WHEN** pulsa "Aprobar" en el link
- **THEN** el presupuesto pasa a estado "Aprobado"
- **AND** la OT puede pasar a "En progreso"
- **AND** se notifica al taller

- **GIVEN** el mismo escenario
- **WHEN** el cliente pulsa "Rechazar"
- **THEN** el presupuesto pasa a "Rechazado"
- **AND** se solicita motivo (opcional)

---

## INVOICES

### REQ-I1: Generar Factura desde OT Entregada

The system **MUST** permitir generar una factura solo si la OT esta "Entregada".

- **GIVEN** una OT en estado "Entregado" con costo final 450.00
- **WHEN** el recepcionista pulsa "Generar factura"
- **THEN** se crea una factura en estado "Borrador" con codigo "FAC-2024-0001"
- **AND** calcula IVA (21%) = 544.50 total

- **GIVEN** una OT en estado "En progreso"
- **WHEN** se intenta generar factura
- **THEN** el sistema rechaza la operacion con error 400

### REQ-I2: Registrar Pago

The system **MUST** permitir registrar el pago de una factura.

- **GIVEN** una factura de 544.50 en estado "Enviada"
- **WHEN** el recepcionista registra pago completo en efectivo
- **THEN** el estado cambia a "Pagada"
- **AND** se registra fecha y metodo de pago

---

## PHOTOS

### REQ-P1: Subir Fotos desde Movil

The system **MUST** permitir subir fotos directamente desde la camara del movil.

- **GIVEN** un mecanico en el taller con el movil
- **WHEN** abre una OT y pulsa "Subir foto" → "Camara"
- **THEN** se abre la camara nativa
- **AND** al hacer la foto, se sube vinculada a esa OT con tipo "Progreso"

### REQ-P2: Galeria por Tipo

The system **SHOULD** organizar las fotos por tipo (danos, progreso, final).

- **GIVEN** una OT con 5 fotos de danos y 3 de progreso
- **WHEN** el usuario entra a la pestaña "Fotos"
- **THEN** puede filtrar por tipo
- **AND** las fotos de "Danos iniciales" aparecen primero

---

## NOTIFICATIONS

### REQ-N1: Notificar Estado "Listo"

The system **MUST** notificar al cliente cuando su vehiculo esta listo.

- **GIVEN** una OT que pasa a estado "Listo"
- **WHEN** el mecanico confirma el cambio de estado
- **THEN** el cliente recibe un SMS: "Su vehiculo 1234ABC esta listo para recoger. Pase por el taller."
- **AND** tambien recibe un email con los detalles

### REQ-N2: Notificar Presupuesto Enviado

The system **MUST** notificar al cliente cuando hay un presupuesto pendiente.

- **GIVEN** un presupuesto enviado
- **WHEN** pasan 24 horas sin respuesta
- **THEN** el sistema **MAY** enviar un recordatorio automatico

---

## CLIENT PORTAL

### REQ-CP1: Cliente Ve Solo sus Datos

The system **MUST** garantizar que un cliente solo ve sus propias OTs, presupuestos y facturas.

- **GIVEN** un cliente logueado con 2 vehiculos
- **WHEN** accede a "Mis reparaciones"
- **THEN** solo ve las OTs de sus vehiculos
- **AND** no ve datos de otros clientes

### REQ-CP2: Aprobar Presupuesto desde Movil

The system **MUST** permitir aprobar presupuestos desde el portal del cliente en movil.

- **GIVEN** un cliente que recibio un presupuesto
- **WHEN** abre el link en su movil y pulsa "Aprobar"
- **THEN** el presupuesto se aprueba sin necesidad de ir al taller
- **AND** recibe confirmacion visual inmediata
