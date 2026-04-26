# Especificacion: App Taller Chapa y Pintura

## Vision

App movil (PWA) para la gestion integral de un taller de chapa y pintura. Permite registrar clientes, crear ordenes de trabajo, hacer presupuestos, seguir estados de reparacion, subir fotos, notificar a clientes y facturar.

## Dominios

| # | Dominio | Descripcion | App Django |
|---|---------|-------------|------------|
| 1 | [Usuarios y Autenticacion](./01-domains.md#1-usuarios) | Login JWT, roles, perfiles | `users` |
| 2 | [Clientes y Vehiculos](./01-domains.md#2-clientes) | Ficha cliente, coches, seguros | `customers` |
| 3 | [Ordenes de Trabajo](./01-domains.md#3-ordenes-de-trabajo) | OT, estados, asignacion, historial | `workorders` |
| 4 | [Presupuestos](./01-domains.md#4-presupuestos) | Presupuestos, aprobacion, items | `estimates` |
| 5 | [Facturacion](./01-domains.md#5-facturacion) | Facturas finales, pagos | `invoices` |
| 6 | [Fotos](./01-domains.md#6-fotos) | Daños, progreso, resultado final | `photos` |
| 7 | [Notificaciones](./01-domains.md#7-notificaciones) | SMS/email al cliente por cambios | `notifications` |

## Documentos

| Archivo | Contenido |
|---------|-----------|
| [01-domains.md](./01-domains.md) | Descripcion de cada dominio y responsabilidades |
| [02-data-model.md](./02-data-model.md) | Modelos Django con campos y relaciones |
| [03-api.md](./03-api.md) | Endpoints REST (metodos, rutas, request/response) |
| [04-frontend.md](./04-frontend.md) | Pantallas, flujos de navegacion y estados de UI |
| [05-requirements.md](./05-requirements.md) | Requisitos funcionales con Given/When/Then |
