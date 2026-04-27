# ─── seed.py — Comando para poblar datos de demo ─
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.customers.models import Customer, Vehicle
from apps.estimates.models import Estimate, EstimateItem
from apps.invoices.models import Invoice, InvoiceItem
from apps.users.models import User
from apps.workorders.models import Appointment, WorkOrder, WorkOrderComment, WorkOrderItem, WorkOrderStatusHistory, WorkOrderSurvey


class Command(BaseCommand):
    help = "Puebla la base de datos con datos de demo para el taller"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("Creando datos de demo..."))

        # ─── USUARIOS ─────────────────────────
        admin, _ = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@tallerchapa.com",
                "first_name": "Juan",
                "last_name": "Garcia",
                "role": "admin",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        admin.set_password("admin123")
        admin.save()

        mecanico, _ = User.objects.get_or_create(
            username="mecanico1",
            defaults={
                "email": "mecanico@tallerchapa.com",
                "first_name": "Pedro",
                "last_name": "Lopez",
                "role": "mechanic",
            },
        )
        mecanico.set_password("pass123")
        mecanico.save()

        recepcion, _ = User.objects.get_or_create(
            username="recepcion",
            defaults={
                "email": "recepcion@tallerchapa.com",
                "first_name": "Maria",
                "last_name": "Sanchez",
                "role": "receptionist",
            },
        )
        recepcion.set_password("pass123")
        recepcion.save()

        self.stdout.write(self.style.SUCCESS("  [OK] 3 usuarios creados"))

        # ─── CLIENTES ─────────────────────────
        c1, _ = Customer.objects.get_or_create(
            phone="555-0101",
            defaults={
                "first_name": "Ana",
                "last_name": "Martinez",
                "email": "ana@email.com",
                "dni": "12345678A",
                "address": "Calle Mayor 10",
                "city": "Madrid",
            },
        )
        c2, _ = Customer.objects.get_or_create(
            phone="555-0102",
            defaults={
                "first_name": "Carlos",
                "last_name": "Ruiz",
                "email": "carlos@email.com",
                "dni": "87654321B",
                "address": "Avenida Libertad 45",
                "city": "Barcelona",
            },
        )
        c3, _ = Customer.objects.get_or_create(
            phone="555-0103",
            defaults={
                "first_name": "Laura",
                "last_name": "Fernandez",
                "email": "laura@email.com",
                "dni": "11111111C",
                "address": "Plaza Nueva 3",
                "city": "Valencia",
            },
        )

        self.stdout.write(self.style.SUCCESS("  [OK] 3 clientes creados"))

        cliente, _ = User.objects.get_or_create(
            username="cliente1",
            defaults={
                "email": "cliente@email.com",
                "first_name": "Ismael",
                "last_name": "Baena",
                "role": "client",
                "customer": c1,
            },
        )
        cliente.set_password("pass123")
        cliente.save()
        self.stdout.write(self.style.SUCCESS("  [OK] Usuario cliente creado"))

        # ─── VEHICULOS ────────────────────────
        v1, _ = Vehicle.objects.get_or_create(
            license_plate="1234ABC",
            defaults={
                "customer": c1,
                "brand": "Seat",
                "model": "Leon",
                "year": 2019,
                "color": "Rojo",
                "vin": "VIN12345678901234",
                "insurance_company": "Mapfre",
                "insurance_policy": "POL-12345",
            },
        )
        v2, _ = Vehicle.objects.get_or_create(
            license_plate="5678DEF",
            defaults={
                "customer": c2,
                "brand": "Volkswagen",
                "model": "Golf",
                "year": 2021,
                "color": "Gris",
                "vin": "VIN98765432109876",
            },
        )
        v3, _ = Vehicle.objects.get_or_create(
            license_plate="9012GHI",
            defaults={
                "customer": c3,
                "brand": "Renault",
                "model": "Clio",
                "year": 2018,
                "color": "Blanco",
                "vin": "VIN55555555555555",
            },
        )
        v4, _ = Vehicle.objects.get_or_create(
            license_plate="3456JKL",
            defaults={
                "customer": c1,
                "brand": "Ford",
                "model": "Focus",
                "year": 2020,
                "color": "Azul",
                "vin": "VIN44444444444444",
            },
        )

        self.stdout.write(self.style.SUCCESS("  [OK] 4 vehiculos creados"))

        # ─── ORDENES DE TRABAJO ───────────────
        wo_data = [
            {
                "code": "OT-2024-0001",
                "vehicle": v1,
                "customer": c1,
                "description": "Golpe en parachoques delantero y abolladura en capo",
                "status": "in_progress",
                "assigned_to": mecanico,
                "estimated_cost": 850.00,
                "final_cost": 0,
            },
            {
                "code": "OT-2024-0002",
                "vehicle": v2,
                "customer": c2,
                "description": "Raspado lateral derecho completo, necesita repintado",
                "status": "in_painting",
                "assigned_to": mecanico,
                "estimated_cost": 1200.00,
                "final_cost": 0,
            },
            {
                "code": "OT-2024-0003",
                "vehicle": v3,
                "customer": c3,
                "description": "Cambio de puerta trasera izquierda + ajuste",
                "status": "ready",
                "assigned_to": mecanico,
                "estimated_cost": 650.00,
                "final_cost": 650.00,
            },
            {
                "code": "OT-2024-0004",
                "vehicle": v4,
                "customer": c1,
                "description": "Revision de alineacion tras golpe en rueda trasera",
                "status": "pending",
                "assigned_to": None,
                "estimated_cost": 350.00,
                "final_cost": 0,
            },
            {
                "code": "OT-2024-0005",
                "vehicle": v2,
                "customer": c2,
                "description": "Reparacion de baca y techo por caida de objeto",
                "status": "waiting_parts",
                "assigned_to": mecanico,
                "estimated_cost": 2100.00,
                "final_cost": 0,
            },
        ]

        work_orders = []
        for data in wo_data:
            wo, created = WorkOrder.objects.get_or_create(
                code=data["code"],
                defaults={**data, "created_by": recepcion},
            )
            work_orders.append(wo)
            if created:
                WorkOrderStatusHistory.objects.create(
                    work_order=wo,
                    from_status="pending",
                    to_status=wo.status,
                    changed_by=recepcion,
                    notes="Creacion de OT",
                )

        # ─── COMENTARIOS ──────────────────────
        WorkOrderComment.objects.get_or_create(
            work_order=work_orders[0],
            author=recepcion,
            text="El cliente necesita el coche para el fin de semana, prioridad alta.",
            defaults={"is_internal": True},
        )
        WorkOrderComment.objects.get_or_create(
            work_order=work_orders[0],
            author=mecanico,
            text="Parachoques reparado, esperando pieza del capo.",
            defaults={"is_internal": False},
        )
        WorkOrderComment.objects.get_or_create(
            work_order=work_orders[1],
            author=recepcion,
            text="Presupuesto enviado al cliente, a la espera de aprobacion.",
            defaults={"is_internal": False},
        )
        WorkOrderComment.objects.get_or_create(
            work_order=work_orders[3],
            author=cliente,
            text="He notado que tambien chirria el freno trasero, podeis mirarlo?",
            defaults={"is_internal": False},
        )

        self.stdout.write(self.style.SUCCESS("  [OK] 4 comentarios creados"))

        # ─── ITEMS DE TRABAJO ─────────────────
        WorkOrderItem.objects.get_or_create(
            work_order=work_orders[0],
            description="Reparacion parachoques",
            defaults={"item_type": "bodywork", "estimated_hours": 4, "labor_cost": 200, "parts_cost": 150},
        )
        WorkOrderItem.objects.get_or_create(
            work_order=work_orders[0],
            description="Reparacion capo",
            defaults={"item_type": "bodywork", "estimated_hours": 3, "labor_cost": 150, "parts_cost": 100},
        )
        WorkOrderItem.objects.get_or_create(
            work_order=work_orders[0],
            description="Pintura parachoques + capo",
            defaults={"item_type": "painting", "estimated_hours": 5, "labor_cost": 250, "parts_cost": 0},
        )
        WorkOrderItem.objects.get_or_create(
            work_order=work_orders[1],
            description="Lijado y masilla lateral",
            defaults={"item_type": "bodywork", "estimated_hours": 6, "labor_cost": 300, "parts_cost": 50},
        )
        WorkOrderItem.objects.get_or_create(
            work_order=work_orders[1],
            description="Pintura lateral completa",
            defaults={"item_type": "painting", "estimated_hours": 8, "labor_cost": 400, "parts_cost": 100},
        )
        WorkOrderItem.objects.get_or_create(
            work_order=work_orders[2],
            description="Cambio puerta trasera",
            defaults={"item_type": "bodywork", "estimated_hours": 2, "labor_cost": 100, "parts_cost": 350},
        )
        WorkOrderItem.objects.get_or_create(
            work_order=work_orders[2],
            description="Pintura puerta",
            defaults={"item_type": "painting", "estimated_hours": 3, "labor_cost": 120, "parts_cost": 30},
        )

        self.stdout.write(self.style.SUCCESS("  [OK] 7 items de trabajo creados"))

        # ─── PRESUPUESTOS ─────────────────────
        est1, _ = Estimate.objects.get_or_create(
            work_order=work_orders[0],
            defaults={
                "status": "approved",
                "valid_until": timezone.now().date(),
                "approved_at": timezone.now(),
            },
        )
        est1.calculate_totals()

        est2, _ = Estimate.objects.get_or_create(
            work_order=work_orders[1],
            defaults={
                "status": "sent",
                "valid_until": timezone.now().date(),
                "sent_at": timezone.now(),
            },
        )
        est2.calculate_totals()

        self.stdout.write(self.style.SUCCESS("  [OK] 2 presupuestos creados"))

        # ─── FACTURAS ─────────────────────────
        inv1, _ = Invoice.objects.get_or_create(
            work_order=work_orders[2],
            defaults={
                "customer": c3,
                "status": "paid",
                "subtotal": 600.00,
                "due_date": timezone.now().date(),
                "paid_at": timezone.now(),
                "paid_amount": 726.00,
                "payment_method": "card",
            },
        )
        InvoiceItem.objects.get_or_create(
            invoice=inv1,
            description="Cambio puerta + pintura",
            defaults={"quantity": 1, "unit_price": 600.00},
        )

        # ─── ENCUESTA DE SATISFACCION ─────────
        WorkOrderSurvey.objects.get_or_create(
            work_order=work_orders[2],
            defaults={"rating": 5, "comment": "Excelente trabajo, el coche quedo como nuevo."},
        )
        # ─── CITAS ────────────────────────────
        from datetime import date, time
        Appointment.objects.get_or_create(
            title="Entrada coche Ana Martinez",
            defaults={
                "customer": c1,
                "vehicle": v1,
                "date": date.today(),
                "time": time(9, 0),
                "description": "Revision inicial del golpe en parachoques",
                "status": "completed",
                "work_order": work_orders[0],
            },
        )
        Appointment.objects.get_or_create(
            title="Entrega coche Laura Fernandez",
            defaults={
                "customer": c3,
                "vehicle": v3,
                "date": date.today(),
                "time": time(18, 0),
                "description": "Entrega del coche reparado",
                "status": "confirmed",
                "work_order": work_orders[2],
            },
        )
        Appointment.objects.get_or_create(
            title="Nueva cita Carlos Ruiz",
            defaults={
                "customer": c2,
                "vehicle": v2,
                "date": date.today(),
                "time": time(11, 30),
                "description": "Presupuesto para pintura lateral",
                "status": "pending",
            },
        )
        self.stdout.write(self.style.SUCCESS("  [OK] 3 citas creadas"))

        self.stdout.write(self.style.SUCCESS("\n[OK] Seed completado! Datos de demo listos."))
        self.stdout.write(self.style.NOTICE("\nCredenciales de prueba:"))
        self.stdout.write("  Admin:     admin / admin123")
        self.stdout.write("  Mecanico:  mecanico1 / pass123")
        self.stdout.write("  Recepcion: recepcion / pass123")
        self.stdout.write("  Cliente:   cliente1 / pass123")
