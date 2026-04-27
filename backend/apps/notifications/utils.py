# ─── notifications/utils.py ──────────────────
from django.conf import settings
from django.core.mail import send_mail


def send_email_to_customer(subject, body, recipient_email):
    """Send an email to a customer. In development, prints to console."""
    if not recipient_email:
        return
    send_mail(
        subject=subject,
        message=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[recipient_email],
        fail_silently=True,
    )


def notify_work_order_ready(work_order):
    """Notify customer that their vehicle is ready."""
    customer = work_order.customer
    if not customer or not customer.email:
        return
    subject = f"Tu vehiculo esta listo — {work_order.code}"
    body = (
        f"Hola {customer.first_name},\n\n"
        f"Te informamos que la reparacion de tu vehiculo ({work_order.vehicle.license_plate}) "
        f"ha finalizado y ya esta listo para recoger.\n\n"
        f"Orden de trabajo: {work_order.code}\n"
        f"Descripcion: {work_order.description}\n\n"
        f"Puedes pasar por el taller en horario de oficina.\n\n"
        f"Gracias por confiar en nosotros.\n"
        f"Taller Chapa y Pintura"
    )
    send_email_to_customer(subject, body, customer.email)


def notify_estimate_sent(estimate):
    """Notify customer that an estimate has been sent."""
    customer = estimate.work_order.customer
    if not customer or not customer.email:
        return
    subject = f"Nuevo presupuesto — {estimate.work_order.code}"
    body = (
        f"Hola {customer.first_name},\n\n"
        f"Te enviamos el presupuesto para la reparacion de tu vehiculo "
        f"({estimate.work_order.vehicle.license_plate}).\n\n"
        f"Importe total: {estimate.total}€\n"
        f"Valido hasta: {estimate.valid_until}\n\n"
        f"Puedes consultarlo y aprobarlo desde tu portal de cliente.\n\n"
        f"Gracias por confiar en nosotros.\n"
        f"Taller Chapa y Pintura"
    )
    send_email_to_customer(subject, body, customer.email)


def notify_invoice_sent(invoice):
    """Notify customer that an invoice has been sent."""
    customer = invoice.customer
    if not customer or not customer.email:
        return
    subject = f"Nueva factura — {invoice.code}"
    body = (
        f"Hola {customer.first_name},\n\n"
        f"Te enviamos la factura por la reparacion de tu vehiculo.\n\n"
        f"Factura: {invoice.code}\n"
        f"Importe total: {invoice.total}€\n"
        f"Vencimiento: {invoice.due_date}\n\n"
        f"Puedes consultarla desde tu portal de cliente.\n\n"
        f"Gracias por confiar en nosotros.\n"
        f"Taller Chapa y Pintura"
    )
    send_email_to_customer(subject, body, customer.email)


def notify_appointment_created(appointment):
    """Notify customer about a new appointment."""
    customer = appointment.customer
    if not customer or not customer.email:
        return
    time_str = appointment.time.strftime("%H:%M") if appointment.time else ""
    subject = f"Cita confirmada — {appointment.title}"
    body = (
        f"Hola {customer.first_name},\n\n"
        f"Tu cita ha sido confirmada:\n\n"
        f"{appointment.title}\n"
        f"Fecha: {appointment.date}\n"
        f"Hora: {time_str}\n"
        f"Vehiculo: {appointment.vehicle.license_plate if appointment.vehicle else 'No especificado'}\n\n"
        f"{appointment.description}\n\n"
        f"Gracias por confiar en nosotros.\n"
        f"Taller Chapa y Pintura"
    )
    send_email_to_customer(subject, body, customer.email)
